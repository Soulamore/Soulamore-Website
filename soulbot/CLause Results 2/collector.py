"""
SoulBot Pipeline — Stage 1: Data Collector
--------------------------------------------
Sits between inference.py and the response layer.
Every turn is logged. Low-confidence and flagged turns
are automatically queued for human review.

Usage in inference.py:
    from data_collector.collector import TurnCollector
    collector = TurnCollector()

    # After classify_intent():
    collector.log_turn(
        session_id=session_id,
        user_input=user_text,
        intent_result=result,
        bot_response=response_text,
        latency_ms=latency,
        language=detected_lang,
    )
"""

import json
import uuid
import hashlib
from datetime import datetime, timezone
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import Optional


# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

LOGS_DIR        = Path("logs")
HISTORY_FILE    = LOGS_DIR / "soulbot_history.jsonl"
REVIEW_QUEUE    = LOGS_DIR / "review_queue.jsonl"
CRISIS_LOG      = LOGS_DIR / "crisis_turns.jsonl"   # separate, higher-retention log
STATS_FILE      = LOGS_DIR / "daily_stats.jsonl"

LOGS_DIR.mkdir(exist_ok=True)

# Thresholds that trigger review queue
REVIEW_TRIGGERS = {
    "low_confidence":       lambda r: r.get("confidence", 1.0) < 0.75,
    "minimizing_language":  lambda r: "minimizing_language:REVIEW" in r.get("flags", []),
    "dark_humor":           lambda r: "dark_humor:REVIEW" in r.get("flags", []),
    "safety_override":      lambda r: r.get("safety_override", False),
    "crisis":               lambda r: r.get("intent") == "crisis",
    "high_distress":        lambda r: r.get("intent") == "high_distress" and r.get("confidence", 1) < 0.85,
    "abrupt_end":           lambda r: r.get("session_ended_abruptly", False),
}

# Turns that ALWAYS go to crisis log regardless of other triggers
CRISIS_TRIGGERS = {"crisis", "safety_override"}


# ---------------------------------------------------------------------------
# Turn record
# ---------------------------------------------------------------------------

@dataclass
class TurnRecord:
    turn_id:               str
    session_id:            str
    timestamp:             str
    user_input:            str
    user_input_hash:       str     # sha256 — for dedup, privacy-safe
    intent:                str
    severity:              float
    confidence:            float
    mode:                  str
    flags:                 list
    safety_override:       bool
    bot_response_preview:  str     # first 120 chars only — not full response
    latency_ms:            Optional[float]
    language:              str
    word_count:            int
    session_ended_abruptly: bool
    needs_review:          bool
    review_reasons:        list
    review_status:         str     # "pending" | "approved" | "corrected" | "skipped"
    corrected_intent:      Optional[str]
    reviewer_notes:        Optional[str]
    approved_for_training: bool


def _hash_text(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()[:16]


def _build_record(
    session_id: str,
    user_input: str,
    intent_result: dict,
    bot_response: str,
    latency_ms: Optional[float],
    language: str,
    session_ended_abruptly: bool = False,
) -> TurnRecord:

    review_reasons = [
        name for name, trigger in REVIEW_TRIGGERS.items()
        if trigger({**intent_result, "session_ended_abruptly": session_ended_abruptly})
    ]
    needs_review = len(review_reasons) > 0

    return TurnRecord(
        turn_id               = str(uuid.uuid4())[:12],
        session_id            = session_id,
        timestamp             = datetime.now(timezone.utc).isoformat(),
        user_input            = user_input,
        user_input_hash       = _hash_text(user_input),
        intent                = intent_result.get("intent", "unknown"),
        severity              = intent_result.get("severity", 0),
        confidence            = intent_result.get("confidence", 1.0),
        mode                  = intent_result.get("mode", "unknown"),
        flags                 = intent_result.get("flags", []),
        safety_override       = intent_result.get("safety_override", False),
        bot_response_preview  = bot_response[:120],
        latency_ms            = latency_ms,
        language              = language,
        word_count            = len(user_input.split()),
        session_ended_abruptly = session_ended_abruptly,
        needs_review          = needs_review,
        review_reasons        = review_reasons,
        review_status         = "pending" if needs_review else "auto_approved",
        corrected_intent      = None,
        reviewer_notes        = None,
        approved_for_training = not needs_review,  # auto-approve clean turns
    )


# ---------------------------------------------------------------------------
# Collector class
# ---------------------------------------------------------------------------

class TurnCollector:

    def __init__(self):
        self._session_turn_counts = {}
        self._daily_stats = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "total_turns": 0,
            "by_intent": {},
            "flagged_for_review": 0,
            "crisis_turns": 0,
            "safety_overrides": 0,
            "avg_latency_ms": [],
            "languages": {},
        }

    def log_turn(
        self,
        session_id: str,
        user_input: str,
        intent_result: dict,
        bot_response: str,
        latency_ms: Optional[float] = None,
        language: str = "en",
        session_ended_abruptly: bool = False,
    ) -> TurnRecord:

        record = _build_record(
            session_id, user_input, intent_result,
            bot_response, latency_ms, language, session_ended_abruptly
        )

        # Write to main history
        self._append(HISTORY_FILE, record)

        # Write to review queue if flagged
        if record.needs_review:
            self._append(REVIEW_QUEUE, record)
            self._daily_stats["flagged_for_review"] += 1

        # Write to crisis log if crisis-tier
        if record.intent == "crisis" or record.safety_override:
            self._append(CRISIS_LOG, record)
            self._daily_stats["crisis_turns"] += 1

        # Update stats
        self._update_stats(record)

        return record

    def mark_session_ended(self, session_id: str, turn_count: int, abrupt: bool = False):
        """
        Call when a session ends. If abrupt=True, the last turn of that
        session gets flagged retroactively. Used when user drops off suddenly.
        """
        if abrupt:
            self._flag_last_turn_of_session(session_id)

    def _append(self, path: Path, record: TurnRecord):
        with open(path, "a", encoding="utf-8") as f:
            f.write(json.dumps(asdict(record), ensure_ascii=False) + "\n")

    def _update_stats(self, record: TurnRecord):
        s = self._daily_stats
        s["total_turns"] += 1
        s["by_intent"][record.intent] = s["by_intent"].get(record.intent, 0) + 1
        s["languages"][record.language] = s["languages"].get(record.language, 0) + 1
        if record.safety_override:
            s["safety_overrides"] += 1
        if record.latency_ms:
            s["avg_latency_ms"].append(record.latency_ms)

    def _flag_last_turn_of_session(self, session_id: str):
        """Retroactively add session_ended_abruptly flag to last turn."""
        # Read history, find last turn with this session_id, update it
        lines = []
        updated = False
        try:
            with open(HISTORY_FILE, "r") as f:
                lines = f.readlines()
            for i in range(len(lines) - 1, -1, -1):
                record = json.loads(lines[i])
                if record.get("session_id") == session_id:
                    record["session_ended_abruptly"] = True
                    record["needs_review"] = True
                    if "abrupt_end" not in record.get("review_reasons", []):
                        record.setdefault("review_reasons", []).append("abrupt_end")
                    record["review_status"] = "pending"
                    lines[i] = json.dumps(record, ensure_ascii=False) + "\n"
                    updated = True
                    break
            if updated:
                with open(HISTORY_FILE, "w") as f:
                    f.writelines(lines)
                # Also append to review queue
                with open(REVIEW_QUEUE, "a") as f:
                    f.write(lines[i])
        except FileNotFoundError:
            pass

    def flush_daily_stats(self):
        """Call at midnight to persist daily stats."""
        stats = self._daily_stats.copy()
        if stats["avg_latency_ms"]:
            total = stats["avg_latency_ms"]
            stats["avg_latency_ms"] = round(sum(total) / len(total), 1)
        else:
            stats["avg_latency_ms"] = None
        with open(STATS_FILE, "a") as f:
            f.write(json.dumps(stats) + "\n")
        # Reset for next day
        self._daily_stats = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "total_turns": 0, "by_intent": {}, "flagged_for_review": 0,
            "crisis_turns": 0, "safety_overrides": 0,
            "avg_latency_ms": [], "languages": {},
        }
