"""
SoulBot Pipeline — Stage 2: Human Reviewer CLI
------------------------------------------------
Weekly tool for the clinical reviewer.
Loads pending turns from review_queue.jsonl,
presents them one by one, and captures corrections.

Run:  python reviewer/review_cli.py
      python reviewer/review_cli.py --crisis-only
      python reviewer/review_cli.py --limit 50
      python reviewer/review_cli.py --stats

Outputs:
  - Updates review_queue.jsonl with reviewer decisions
  - Appends approved examples to training_candidates.jsonl
  - Writes session summary to review_sessions.jsonl
"""

import json
import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path


LOGS_DIR            = Path("logs")
REVIEW_QUEUE        = LOGS_DIR / "review_queue.jsonl"
TRAINING_CANDIDATES = LOGS_DIR / "training_candidates.jsonl"
REVIEW_SESSIONS     = LOGS_DIR / "review_sessions.jsonl"

INTENTS = [
    "greeting", "casual_chat", "emotional_light",
    "moderate_distress", "high_distress", "crisis"
]

INTENT_COLORS = {
    "greeting":          "\033[96m",    # cyan
    "casual_chat":       "\033[95m",    # magenta
    "emotional_light":   "\033[92m",    # green
    "moderate_distress": "\033[93m",    # yellow
    "high_distress":     "\033[91m",    # red
    "crisis":            "\033[91;1m",  # bold red
}
RESET  = "\033[0m"
BOLD   = "\033[1m"
DIM    = "\033[2m"
RED    = "\033[91m"
GREEN  = "\033[92m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"


def color_intent(intent: str) -> str:
    c = INTENT_COLORS.get(intent, "")
    return f"{c}{intent}{RESET}"


def load_pending(crisis_only: bool = False) -> list[dict]:
    if not REVIEW_QUEUE.exists():
        return []
    records = []
    seen_ids = set()
    with open(REVIEW_QUEUE) as f:
        for line in f:
            try:
                r = json.loads(line)
                if r.get("review_status") == "pending" and r.get("turn_id") not in seen_ids:
                    if crisis_only and r.get("intent") not in ("crisis", "high_distress"):
                        continue
                    records.append(r)
                    seen_ids.add(r["turn_id"])
            except json.JSONDecodeError:
                continue
    # Crisis and safety_override first
    records.sort(key=lambda r: (
        0 if r.get("intent") == "crisis" else
        1 if r.get("safety_override") else
        2 if r.get("intent") == "high_distress" else 3
    ))
    return records


def update_record_in_queue(turn_id: str, updates: dict):
    if not REVIEW_QUEUE.exists():
        return
    lines = []
    with open(REVIEW_QUEUE) as f:
        for line in f:
            try:
                r = json.loads(line)
                if r.get("turn_id") == turn_id:
                    r.update(updates)
                lines.append(json.dumps(r, ensure_ascii=False) + "\n")
            except json.JSONDecodeError:
                lines.append(line)
    with open(REVIEW_QUEUE, "w") as f:
        f.writelines(lines)


def append_training_candidate(record: dict):
    LOGS_DIR.mkdir(exist_ok=True)
    with open(TRAINING_CANDIDATES, "a") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")


def print_header():
    print(f"\n{BOLD}{'═'*65}{RESET}")
    print(f"{BOLD}  SOULBOT — Human Review Queue{RESET}")
    print(f"{DIM}  Weekly clinical review session{RESET}")
    print(f"{BOLD}{'═'*65}{RESET}\n")


def print_turn(record: dict, index: int, total: int):
    print(f"\n{BOLD}{'─'*65}{RESET}")
    print(f"  {DIM}Turn {index}/{total}  ·  {record.get('timestamp','')[:19]}  ·  lang: {record.get('language','?')}{RESET}")
    print(f"{'─'*65}{RESET}")

    # User input
    print(f"\n  {BOLD}User said:{RESET}")
    print(f"  {CYAN}» {record.get('user_input', '[no input]')}{RESET}\n")

    # Bot response preview
    preview = record.get("bot_response_preview", "")
    print(f"  {BOLD}Bot responded:{RESET}")
    print(f"  {DIM}{preview}...{RESET}\n")

    # Classification
    intent = record.get("intent", "unknown")
    severity = record.get("severity", 0)
    confidence = record.get("confidence", 1.0)
    mode = record.get("mode", "unknown")
    override = record.get("safety_override", False)

    conf_color = GREEN if confidence >= 0.8 else (YELLOW if confidence >= 0.65 else RED)

    print(f"  {BOLD}Classification:{RESET}")
    print(f"    Intent:     {color_intent(intent)}")
    print(f"    Severity:   {severity:.1f}")
    print(f"    Confidence: {conf_color}{confidence:.2f}{RESET}  {'⚠️  FLAG' if confidence < 0.75 else ''}")
    print(f"    Mode:       {mode}")
    if override:
        print(f"    {RED}{BOLD}⚡ SAFETY OVERRIDE ACTIVE{RESET}")

    # Flags
    flags = record.get("flags", [])
    review_reasons = record.get("review_reasons", [])
    if flags:
        print(f"\n  {BOLD}Flags:{RESET}")
        for f in flags:
            print(f"    {DIM}· {f}{RESET}")

    if review_reasons:
        print(f"\n  {BOLD}Queued because:{RESET}")
        for r in review_reasons:
            print(f"    {YELLOW}⚠ {r}{RESET}")


def get_reviewer_decision(record: dict) -> dict:
    """Interactive prompt for reviewer decision."""
    intent = record.get("intent", "unknown")

    print(f"\n  {BOLD}Your decision:{RESET}")
    print(f"  {DIM}[A] Approve as-is   [C] Correct intent   [S] Skip   [X] Exclude (do not train){RESET}")
    print(f"  {DIM}[Q] Save & quit session{RESET}\n")

    while True:
        choice = input("  → ").strip().upper()

        if choice == "Q":
            return {"action": "quit"}

        elif choice == "A":
            notes = input(f"  {DIM}Notes (optional, Enter to skip): {RESET}").strip()
            return {
                "action": "approved",
                "review_status": "approved",
                "corrected_intent": None,
                "reviewer_notes": notes or None,
                "approved_for_training": True,
            }

        elif choice == "C":
            print(f"\n  {BOLD}Current intent: {color_intent(intent)}{RESET}")
            print(f"  {DIM}Available: {', '.join(INTENTS)}{RESET}")
            print(f"  {DIM}Enter number or name:{RESET}")
            for i, name in enumerate(INTENTS, 1):
                print(f"    {i}. {color_intent(name)}")
            raw = input("  → ").strip()
            # Accept number or name
            corrected = None
            if raw.isdigit() and 1 <= int(raw) <= len(INTENTS):
                corrected = INTENTS[int(raw) - 1]
            elif raw.lower() in INTENTS:
                corrected = raw.lower()
            if not corrected:
                print(f"  {RED}Invalid choice. Try again.{RESET}")
                continue
            notes = input(f"  {DIM}Why? (helps future training): {RESET}").strip()
            print(f"  {GREEN}✓ Corrected: {intent} → {corrected}{RESET}")
            return {
                "action": "corrected",
                "review_status": "corrected",
                "corrected_intent": corrected,
                "reviewer_notes": notes or None,
                "approved_for_training": True,
            }

        elif choice == "S":
            return {
                "action": "skipped",
                "review_status": "skipped",
                "corrected_intent": None,
                "reviewer_notes": None,
                "approved_for_training": False,
            }

        elif choice == "X":
            reason = input(f"  {DIM}Reason for exclusion: {RESET}").strip()
            return {
                "action": "excluded",
                "review_status": "excluded",
                "corrected_intent": None,
                "reviewer_notes": reason or "excluded by reviewer",
                "approved_for_training": False,
            }

        else:
            print(f"  {RED}Unknown option. Use A / C / S / X / Q{RESET}")


def print_stats():
    """Print summary of queue and training candidates."""
    print_header()

    if REVIEW_QUEUE.exists():
        pending = 0
        by_intent = {}
        by_reason = {}
        with open(REVIEW_QUEUE) as f:
            for line in f:
                try:
                    r = json.loads(line)
                    if r.get("review_status") == "pending":
                        pending += 1
                        intent = r.get("intent", "?")
                        by_intent[intent] = by_intent.get(intent, 0) + 1
                        for reason in r.get("review_reasons", []):
                            by_reason[reason] = by_reason.get(reason, 0) + 1
                except:
                    pass
        print(f"  {BOLD}Review Queue:{RESET}  {YELLOW}{pending} pending turns{RESET}\n")
        print(f"  {BOLD}By intent:{RESET}")
        for intent, count in sorted(by_intent.items(), key=lambda x: -x[1]):
            print(f"    {color_intent(intent):<30} {count}")
        print(f"\n  {BOLD}By review reason:{RESET}")
        for reason, count in sorted(by_reason.items(), key=lambda x: -x[1]):
            print(f"    {YELLOW}{reason:<30}{RESET} {count}")
    else:
        print(f"  {GREEN}Review queue is empty.{RESET}")

    if TRAINING_CANDIDATES.exists():
        count = sum(1 for _ in open(TRAINING_CANDIDATES))
        print(f"\n  {BOLD}Training candidates ready:{RESET}  {GREEN}{count} approved examples{RESET}")

    print()


def run_review_session(crisis_only: bool = False, limit: int = None):
    print_header()
    records = load_pending(crisis_only)

    if not records:
        print(f"  {GREEN}✓ No pending turns in review queue.{RESET}\n")
        return

    if limit:
        records = records[:limit]

    total = len(records)
    print(f"  {YELLOW}{total} turns pending review{RESET}")
    if crisis_only:
        print(f"  {RED}Crisis/High-distress only mode{RESET}")
    print(f"  {DIM}Press Q at any time to save progress and quit.{RESET}\n")

    session_stats = {
        "session_id": datetime.now().strftime("%Y%m%d_%H%M"),
        "started_at": datetime.now(timezone.utc).isoformat(),
        "total_reviewed": 0,
        "approved": 0,
        "corrected": 0,
        "skipped": 0,
        "excluded": 0,
        "training_candidates_added": 0,
    }

    for i, record in enumerate(records, 1):
        print_turn(record, i, total)
        decision = get_reviewer_decision(record)

        if decision["action"] == "quit":
            print(f"\n  {YELLOW}Session saved. Exiting.{RESET}")
            break

        # Update queue
        updates = {k: v for k, v in decision.items() if k != "action"}
        updates["reviewed_at"] = datetime.now(timezone.utc).isoformat()
        update_record_in_queue(record["turn_id"], updates)

        # Add to training candidates if approved
        if decision.get("approved_for_training"):
            training_record = {**record, **updates}
            # Use corrected intent as ground truth if provided
            if decision.get("corrected_intent"):
                training_record["training_intent"] = decision["corrected_intent"]
            else:
                training_record["training_intent"] = record["intent"]
            append_training_candidate(training_record)
            session_stats["training_candidates_added"] += 1

        # Update session stats
        action = decision["action"]
        session_stats["total_reviewed"] += 1
        session_stats[action] = session_stats.get(action, 0) + 1

        status_symbol = {"approved": GREEN+"✓", "corrected": YELLOW+"✎", "skipped": DIM+"—", "excluded": RED+"✗"}.get(action, "?")
        print(f"\n  {status_symbol} {action.capitalize()}{RESET}")

    # Save session record
    session_stats["ended_at"] = datetime.now(timezone.utc).isoformat()
    LOGS_DIR.mkdir(exist_ok=True)
    with open(REVIEW_SESSIONS, "a") as f:
        f.write(json.dumps(session_stats) + "\n")

    # Print summary
    print(f"\n{'═'*65}")
    print(f"  {BOLD}Session Summary{RESET}")
    print(f"{'═'*65}")
    print(f"  Reviewed:   {session_stats['total_reviewed']}")
    print(f"  {GREEN}Approved:   {session_stats.get('approved', 0)}{RESET}")
    print(f"  {YELLOW}Corrected:  {session_stats.get('corrected', 0)}{RESET}")
    print(f"  {DIM}Skipped:    {session_stats.get('skipped', 0)}{RESET}")
    print(f"  {RED}Excluded:   {session_stats.get('excluded', 0)}{RESET}")
    print(f"  {GREEN}Training candidates added: {session_stats['training_candidates_added']}{RESET}")
    print()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SoulBot Human Review CLI")
    parser.add_argument("--crisis-only", action="store_true", help="Review only crisis/high-distress turns")
    parser.add_argument("--limit", type=int, default=None, help="Max turns to review this session")
    parser.add_argument("--stats", action="store_true", help="Show queue stats without reviewing")
    args = parser.parse_args()

    if args.stats:
        print_stats()
    else:
        run_review_session(crisis_only=args.crisis_only, limit=args.limit)
