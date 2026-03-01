"""
SoulBot Intent Classifier v2.0
--------------------------------
Drop-in replacement for the keyword/heuristic classifier in inference.py.

Key improvements over v1.0:
  - Replaces word-count heuristic with structural signal analysis
  - Adds implicit distress detection (passive ideation, hopelessness)
  - Widens keyword clusters with indirect/minimizing language variants
  - Adds confidence gating at the Moderate->High boundary
  - Adds post-classification safety override for high-risk implicit signals

Usage:
    from classifier import classify_intent, calculate_severity, IntentResult

    result = classify_intent(user_text)
    print(result.intent)       # "crisis" | "high_distress" | "moderate_distress"
                               # | "emotional_light" | "casual_chat" | "greeting"
    print(result.severity)     # 0-10+
    print(result.confidence)   # 0.0-1.0
    print(result.flags)        # list of triggered signal names (for logging)
"""

import re
from dataclasses import dataclass, field
from typing import Optional


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class IntentResult:
    intent: str
    severity: float
    confidence: float
    mode: str                        # SoulBot personality mode to activate
    flags: list = field(default_factory=list)
    safety_override: bool = False    # True = bypass mode logic, go straight to Safety Anchor


# ---------------------------------------------------------------------------
# Signal dictionaries
# ---------------------------------------------------------------------------

# v1.0 explicit clusters (retained, expanded)
CRISIS_KEYWORDS = {
    "suicide", "suicidal", "kill myself", "end my life",
    "take my life", "don't want to be here", "don't want to exist",
    "not worth living", "better off dead", "ready to die",
    "planning to die", "goodbye forever", "final goodbye",
    # "end it all" and "want to die" removed from CRISIS — too often used idiomatically.
    # They are captured in HIGH_DISTRESS_KEYWORDS and scored via severity instead.
}

# Phrases that look like crisis keywords but are commonly idiomatic.
# Matched only when NOT accompanied by other distress signals.
IDIOMATIC_EXCEPTIONS = {
    "want to die",     # "I want to die of laughter" / "I literally want to die"
    "end it all",      # "haha I should just end it all jk"
    "killing me",      # "this traffic is killing me"
    "die from",        # "I'll die from embarrassment"
    "want to disappear", # sometimes idiomatic
}

# Context modifiers that suggest idiomatic use (lowercase)
IDIOMATIC_CONTEXT_SIGNALS = [
    r"\b(lmao|lol|haha|hehe|lmfao)\b",
    r"\b(literally|figuratively|basically)\b",
    r"\b(from (embarrassment|boredom|cringe|secondhand|laughing|laughter))\b",
    r"\b(this (meeting|traffic|job|class|game|day) is)\b",
    r"\b(so (bored|embarrassed|cringe))\b",
]

HIGH_DISTRESS_KEYWORDS = {
    "self-harm", "self harm", "cutting", "hurting myself", "hurt myself",
    "overdose", "can't go on", "cannot go on", "falling apart",
    "breaking down", "losing my mind", "can't take it anymore",
    "cannot take it", "losing the will", "no way out", "trapped",
    "suffocating", "drowning", "helpless", "hopeless", "worthless",
    "pathetic", "disgusting", "hate myself", "i hate myself",
    # Moved from CRISIS (too often idiomatic when alone)
    "want to die", "end it all",
}

MODERATE_DISTRESS_KEYWORDS = {
    "anxious", "anxiety", "depressed", "depression", "overwhelmed",
    "stressed", "panic", "crying", "can't sleep", "cannot sleep",
    "insomnia", "numb", "empty", "lonely", "alone", "isolated",
    "exhausted", "burnt out", "burned out", "scared", "afraid", "terrified",
    "worried", "miserable", "devastated", "heartbroken", "grieving",
    "lost", "confused", "frustrated", "angry", "furious",
    "rough time", "hard time", "going through a lot", "really struggling",
}

LIGHT_EMOTIONAL_KEYWORDS = {
    "sad", "upset", "down", "low", "not great", "not good", "off",
    "meh", "blah", "tired", "drained", "a bit", "kind of", "sort of",
    "slightly", "a little", "rough day", "bad day", "hard day",
    "not doing great", "not doing well", "rough time", "hard time",
    "struggling a bit", "not okay", "not great",
}

GREETING_KEYWORDS = {
    "hello", "hi", "hey", "howdy", "hiya", "good morning", "good afternoon",
    "good evening", "sup", "what's up", "whats up", "yo", "greetings",
    "hello there", "hi there", "hey there",
}

# Phrases used at the START of a message that are greetings but followed by content
GREETING_PREFIXES = {
    "hello,", "hi,", "hey,", "hello!", "hi!", "hey!",
    "hello there,", "hi there,", "hey there,",
}

# *** NEW in v2.0 ***
# Implicit distress signals - phrases that don't contain clinical keywords
# but carry high clinical significance. These are what the v1.0 scorer missed.
IMPLICIT_HIGH_RISK_PATTERNS = [
    # Passive suicidal ideation
    r"don'?t see the point",
    r"what'?s the point",
    r"no point (anymore|in anything|in trying)",
    r"everyone (would be|is|are) (fine|better|ok|okay) without me",
    r"(nobody|no one) (would|will) (care|notice|miss me|notice if)",
    r"(nobody|no one) would (even )?notice",
    r"(they|everyone)'?d be better off",
    r"i'?m a burden",
    r"just a burden",
    r"tired of (being|existing|everything|fighting|trying)",
    r"i can'?t do this anymore",
    r"i'?m done (trying|fighting|caring)",
    r"nothing matters",
    r"it doesn'?t matter (anymore|anyway)",
    r"i don'?t matter",
    r"i (won'?t|will not) be (here|around) (much longer|for long|anymore)",
    r"(saying|said) my goodbyes",
    r"making peace with",
    r"tying up loose ends",
    r"giving (away|things away|stuff away)",
    # Profound hopelessness
    r"never going to (get better|be okay|be fine|change)",
    r"always going to be (like this|this way|broken)",
    r"i'?m broken",
    r"i'?m not going to make it",
    r"there'?s no (hope|future|way forward)",
    # Self-erasure language
    r"disappear",
    r"might as well (not exist|be dead|disappear|be gone)",
    r"(just|might as well) cease to exist",
    r"not wake up",
    r"go to sleep (and not|forever)",
    r"i relapsed",
    r"relapsed (again|today|last night)",
]

# Minimizing language - user is downplaying distress, needs gentle escalation
MINIMIZING_PATTERNS = [
    r"(it'?s fine|i'?m fine|i'?ll be fine),? (i guess|i think|maybe|probably|whatever)",
    r"(whatever|nevermind|never mind|forget it|forget i said)",
    r"not (a big deal|that bad|really|that serious)",
    r"(just|only) (a bit|a little|slightly|kind of|kinda)",
    r"don'?t (worry|mind me)",
    r"sorry for (bothering|complaining|venting|dumping)",
]

# Dark humor / deflection - can mask genuine distress
DARK_HUMOR_PATTERNS = [
    r"haha (kill|die|dead|end it|end it all)",
    r"lol (kill|die|dead|end it|end it all|suicide)",
    r"joking (about|when i say)",
    r"(jk|just kidding) (but|though|kinda|sort of)",
    r"might as well (be dead|not exist|disappear)",
    r"(end it all|end it).{0,30}(lol|lmao|haha|jk|just kidding)",
    r"(lol|lmao|haha).{0,30}(end it all|end it)",
]

# Single high-significance short utterances the word-count heuristic would miss
HIGH_SIGNIFICANCE_SHORT = {
    "help me", "help", "i relapsed", "i hurt myself", "i did it",
    "i can't", "i give up", "make it stop", "i'm done", "goodbye",
    "it's over", "i'm scared", "please help", "i'm not okay",
    "not okay", "i lied", "i'm broken", "i can't do this",
    "i need help", "i'm not fine", "i'm done trying",
}

# Informational query patterns — user is asking ABOUT a topic, not experiencing it.
# These should prevent clinical keywords from triggering distress routing.
INFORMATIONAL_PATTERNS = [
    r"(help me |can you |could you |please )?(understand|explain|tell me about|what is|what are|how (does|do)|define)\b",
    r"\b(information|resources|tips|advice) (on|about|for)\b",
    r"\b(i('?m| am) (researching|studying|learning|reading) about)\b",
    r"\b(asking for (a friend|someone))\b",
    r"\b(my (friend|sister|brother|mom|dad|partner|colleague|client))\b.*\b(struggling|going through|dealing with)\b",
]


# ---------------------------------------------------------------------------
# Severity weights (v1.0 base, expanded)
# ---------------------------------------------------------------------------

SEVERITY_WEIGHTS = {
    # Tier 1: Crisis (10) — explicit, unambiguous
    "suicide": 10, "suicidal": 10, "kill myself": 10, "end my life": 10,
    "take my life": 10, "better off dead": 10, "planning to die": 10,
    # Moved out of CRISIS (idiomatic risk) but still high-weight
    "want to die": 8, "end it all": 7,
    # Tier 2: High (6-9)
    "worthless": 7, "hopeless": 7, "self-harm": 8, "cutting": 7,
    "overdose": 9, "helpless": 6, "hurting myself": 8, "i hate myself": 7,
    "i'm broken": 6, "i relapsed": 7,
    # Tier 3: Moderate (3-6)
    "depressed": 5, "depression": 5, "anxious": 4, "anxiety": 4,
    "overwhelmed": 4, "panic": 5, "numb": 4, "empty": 4,
    "lonely": 3, "isolated": 4, "exhausted": 3, "trapped": 6,
    "suffocating": 5, "drowning": 5, "breaking down": 6,
    "rough time": 4, "hard time": 4, "going through a lot": 4, "really struggling": 5,
    # Tier 4: Light (1-2)
    "sad": 2, "upset": 2, "down": 1, "tired": 1, "stressed": 3,
    "worried": 2, "scared": 3, "frustrated": 2,
    # Implicit risk bonus (added when pattern matches)
    "__implicit_high_risk__": 7,
    "__minimizing__": 1,       # adds 1 but also flags for human review
    "__dark_humor__": 3,       # uncertain - flag for human review
}

# Severity ceiling: without an explicit crisis keyword, combined score is capped at 9.
# Prevents two moderate keywords from jumping straight to Crisis mode.
# Explicit crisis keywords (suicide, kill myself, etc.) bypass this ceiling.
EXPLICIT_CRISIS_KEYWORDS = {
    "suicide", "suicidal", "kill myself", "end my life", "take my life",
    "better off dead", "planning to die",
}


# ---------------------------------------------------------------------------
# Mode mapping
# ---------------------------------------------------------------------------

INTENT_TO_MODE = {
    "greeting":          "warm_companion",
    "casual_chat":       "warm_companion",
    "emotional_light":   "reflective_guide",
    "moderate_distress": "reflective_guide",
    "high_distress":     "structured_support",
    "crisis":            "safety_anchor",
}


# ---------------------------------------------------------------------------
# Core functions
# ---------------------------------------------------------------------------

def _normalize(text: str) -> str:
    """Lowercase, collapse whitespace, strip punctuation for matching."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s\-']", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text


def _match_patterns(text: str, patterns: list) -> list[str]:
    matched = []
    for p in patterns:
        if re.search(p, text, re.IGNORECASE):
            matched.append(p)
    return matched


def calculate_severity(text: str) -> tuple[float, list[str], bool]:
    """
    Returns (severity_score, triggered_flags, has_explicit_crisis).

    Key changes from v1.0:
    - Detects idiomatic use of crisis phrases and reduces their weight
    - Applies severity ceiling (max 9) unless an explicit crisis keyword is present
    - Detects informational queries and reduces clinical keyword weights
    """
    norm = _normalize(text)
    score = 0.0
    flags = []
    has_explicit_crisis = False

    # Check for informational query framing — user is asking ABOUT a topic
    is_informational = bool(_match_patterns(text, INFORMATIONAL_PATTERNS))
    if is_informational:
        flags.append("informational_query:weight_reduced")

    # Explicit crisis keyword scoring
    for kw in EXPLICIT_CRISIS_KEYWORDS:
        if kw in norm:
            score += 10
            has_explicit_crisis = True
            flags.append(f"explicit_crisis:{kw}")

    # All other keyword scoring
    for keyword, weight in SEVERITY_WEIGHTS.items():
        if keyword.startswith("__"):
            continue
        if keyword in EXPLICIT_CRISIS_KEYWORDS:
            continue  # Already handled above
        if keyword in norm:
            # Check for idiomatic context on known-idiomatic phrases
            if keyword in IDIOMATIC_EXCEPTIONS:
                idiomatic_signals = _match_patterns(text, IDIOMATIC_CONTEXT_SIGNALS)
                if idiomatic_signals:
                    # Heavily reduce weight — likely hyperbolic
                    reduced = max(1, weight // 4)
                    score += reduced
                    flags.append(f"keyword:{keyword}:idiomatic_reduced({reduced})")
                    continue
            # Informational queries: halve the clinical keyword weight
            effective_weight = weight // 2 if is_informational else weight
            score += effective_weight
            flags.append(f"keyword:{keyword}")

    # Implicit high-risk pattern scoring
    # Exception: if minimizing language is strongly present, reduce implicit confidence
    minimizing_pre = _match_patterns(text, MINIMIZING_PATTERNS)
    implicit_matches = _match_patterns(text, IMPLICIT_HIGH_RISK_PATTERNS)
    if implicit_matches:
        # "nothing matters" alone with "empty" is borderline — check for other signals
        # If the ONLY implicit match is "nothing matters" and we have a minimizing signal, 
        # treat as moderate rather than triggering safety_override
        nothing_matters_only = all("nothing" in p or "matter" in p or "doesn.t matter" in p 
                                   for p in implicit_matches)
        if nothing_matters_only and minimizing_pre:
            score += 3  # Moderate bump, not full implicit score
            flags.append("implicit_moderate:nothing_matters_minimized")
        else:
            score += SEVERITY_WEIGHTS["__implicit_high_risk__"]
            flags.append(f"implicit_high_risk:{len(implicit_matches)}_patterns")

    # Minimizing language (small score boost + flag)
    minimizing_matches = _match_patterns(text, MINIMIZING_PATTERNS)
    if minimizing_matches:
        score += SEVERITY_WEIGHTS["__minimizing__"]
        flags.append("minimizing_language:REVIEW")

    # Light emotional keywords (score 2 each)
    for kw in LIGHT_EMOTIONAL_KEYWORDS:
        if kw in norm and kw not in SEVERITY_WEIGHTS:  # Don't double-count
            score += 2
            flags.append(f"light_keyword:{kw}")

    # Dark humor (uncertain signal, flag for human review)
    dark_matches = _match_patterns(text, DARK_HUMOR_PATTERNS)
    if dark_matches:
        score += SEVERITY_WEIGHTS["__dark_humor__"]
        flags.append("dark_humor:REVIEW")
        # If a crisis-adjacent keyword was idiomatic-reduced but dark_humor also fires,
        # restore partial weight — "haha end it all jk" is not pure hyperbole
        idiomatic_reduced = [f for f in flags if "idiomatic_reduced" in f]
        if idiomatic_reduced:
            score += 2  # Partial restoration
            flags.append("dark_humor_crisis_partial_restore")

    # Apply ceiling: without explicit crisis keyword, cap at 9 (High, not Crisis)
    if not has_explicit_crisis and score >= 10:
        score = 9.0
        flags.append("severity_ceiling_applied:no_explicit_crisis")

    return score, flags, has_explicit_crisis


def classify_intent(text: str) -> IntentResult:
    """
    Primary classifier. Returns IntentResult.

    Classification priority (highest wins):
      1. Explicit crisis keywords → crisis (safety override)
      2. Implicit high-risk patterns → high_distress (safety override)
      3. High-significance short phrases → score-based routing (not length-based)
      4. Greeting detection (only if NO distress signal present)
      5. Severity score thresholds with confidence gating
      6. Informational query detection
      7. Default: casual_chat
    """
    norm = _normalize(text)
    severity, flags, has_explicit_crisis = calculate_severity(text)
    confidence = 1.0

    # --- Priority 1: Explicit crisis ---
    if has_explicit_crisis:
        return IntentResult(
            intent="crisis",
            severity=severity,
            confidence=1.0,
            mode="safety_anchor",
            flags=flags,
            safety_override=True,
        )

    # --- Priority 2: Implicit high-risk patterns ---
    # Only full implicit_high_risk triggers safety_override, not the moderated version
    if "implicit_high_risk:1_patterns" in flags or any(f.startswith("implicit_high_risk:") for f in flags):
        # Safety override: bypass all mode logic
        return IntentResult(
            intent="high_distress",
            severity=max(severity, 7),
            confidence=0.85,
            mode="structured_support",
            flags=flags,
            safety_override=True,
        )

    # --- Priority 3: High-significance short utterances ---
    norm_stripped = norm.strip()
    phrase_floors = {
        "help me": 7, "please help": 7, "i need help": 6, "help": 5,
        "i relapsed": 7, "i hurt myself": 8, "i did it": 5,
        "i give up": 3, "i'm done": 3, "i'm done trying": 4,
        "i can't": 3, "i can't do this": 4, "make it stop": 5,
        "goodbye": 4, "it's over": 4, "i'm not okay": 3,
        "not okay": 2, "i'm not fine": 3, "i'm broken": 6,
        "i'm scared": 2, "i lied": 3, "i don't matter": 6,
    }
    for phrase in sorted(HIGH_SIGNIFICANCE_SHORT, key=len, reverse=True):  # longer phrases first
        if norm_stripped == phrase or norm_stripped.startswith(phrase + " "):
            floor = phrase_floors.get(phrase, 2)
            effective_severity = max(severity, floor)

            if effective_severity >= 7:
                return IntentResult(intent="high_distress", severity=effective_severity, confidence=0.8,
                                    mode="structured_support", flags=flags + ["high_sig_short"])
            elif effective_severity >= 3:
                return IntentResult(intent="moderate_distress", severity=effective_severity, confidence=0.75,
                                    mode="reflective_guide", flags=flags + ["high_sig_short"])
            else:
                return IntentResult(intent="emotional_light", severity=max(effective_severity, 1), confidence=0.7,
                                    mode="reflective_guide", flags=flags + ["high_sig_short"])

    # --- Priority 4: Greeting detection ---
    # Pure greeting: the ENTIRE stripped message is a greeting phrase
    text_lower = text.strip().lower()
    text_no_punct = re.sub(r"[!.,?]+$", "", text_lower).strip()

    for kw in GREETING_KEYWORDS:
        if text_no_punct == kw:
            return IntentResult(
                intent="greeting",
                severity=0,
                confidence=1.0,
                mode="warm_companion",
                flags=["greeting_bypass"],
            )

    # Greeting PREFIX: greeting word followed by content — do NOT bypass,
    # but strip the greeting word and score the remainder
    # e.g., "hi, I'm not doing great" → score "I'm not doing great"
    remainder_text = text
    for prefix in GREETING_PREFIXES:
        if text_lower.startswith(prefix):
            remainder_text = text[len(prefix):].strip()
            # Re-score on the remainder only (already have full score above, but
            # greeting prefix messages should use remainder for routing)
            severity, flags, has_explicit_crisis = calculate_severity(remainder_text)
            break

    # Minimizing dampening: if minimizing language is strong and there are no
    # explicit high-distress keywords, cap effective severity at light tier (< 4)
    if "minimizing_language:REVIEW" in flags:
        high_kw = [f for f in flags if f.startswith("keyword:") and 
                   any(kw in f for kw in ["hopeless","worthless","trapped","depressed","helpless","hate myself"])]
        if not high_kw and severity < 6:
            severity = min(severity, 3)
            flags.append("minimizing_dampened")

    # --- Priority 5: Informational query override ---
    if "informational_query:weight_reduced" in flags and severity < 5:
        return IntentResult(
            intent="casual_chat",
            severity=severity,
            confidence=0.9,
            mode="warm_companion",
            flags=flags + ["informational_override"],
        )

    # --- Priority 6: Severity score routing ---
    if severity >= 10:
        intent = "crisis"
        mode = "safety_anchor"
    elif severity >= 7:
        intent = "high_distress"
        mode = "structured_support"
    elif severity >= 4:
        # Confidence gate: single high-weight keyword alone needs verification
        keyword_flags = [f for f in flags if f.startswith("keyword:")]
        if severity >= 6 and len(keyword_flags) >= 2:
            intent = "high_distress"
            mode = "structured_support"
            confidence = 0.75
        else:
            intent = "moderate_distress"
            mode = "reflective_guide"
    elif severity >= 2:
        intent = "emotional_light"
        mode = "reflective_guide"
    elif severity >= 1:
        intent = "emotional_light"
        mode = "warm_companion"
    else:
        intent = "casual_chat"
        mode = "warm_companion"

    # --- Minimizing / dark humor: flag confidence for review ---
    if "minimizing_language:REVIEW" in flags or "dark_humor:REVIEW" in flags:
        confidence = min(confidence, 0.65)
        if intent == "casual_chat":
            intent = "emotional_light"
            mode = "reflective_guide"
        elif intent == "emotional_light" and "dark_humor_crisis_partial_restore" in flags:
            # Dark humor wrapping self-erasure language — escalate to moderate minimum
            intent = "moderate_distress"
            mode = "reflective_guide"

    return IntentResult(
        intent=intent,
        severity=severity,
        confidence=confidence,
        mode=mode,
        flags=flags,
    )


# ---------------------------------------------------------------------------
# Logging helper
# ---------------------------------------------------------------------------

def build_log_entry(text: str, result: IntentResult, latency_ms: Optional[float] = None) -> dict:
    """Returns a dict ready to append to soulbot_history.jsonl"""
    return {
        "input": text,
        "intent": result.intent,
        "severity": result.severity,
        "confidence": result.confidence,
        "mode": result.mode,
        "safety_override": result.safety_override,
        "flags": result.flags,
        "latency_ms": latency_ms,
        "needs_review": result.confidence < 0.75 or "REVIEW" in " ".join(result.flags),
    }


# ---------------------------------------------------------------------------
# Quick self-test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    test_cases = [
        ("hello", "greeting"),
        ("hi there!", "greeting"),
        ("I'm sad", "emotional_light"),
        ("I don't see the point anymore", "high_distress"),
        ("everyone would be fine without me", "high_distress"),
        ("I relapsed", "high_distress"),
        ("help me", "high_distress"),  # Was casual_chat in v1.0!
        ("I want to kill myself", "crisis"),
        ("it's fine I guess, whatever", "emotional_light"),
        ("haha maybe I should just end it lol jk", "moderate_distress"),
        ("I'm so overwhelmed lately", "moderate_distress"),
        ("just a bit tired", "emotional_light"),
        ("what's the weather like", "casual_chat"),
        ("I'm not okay", "high_distress"),
    ]

    print(f"{'Input':<45} {'Expected':<20} {'Got':<20} {'Severity':>8} {'OK'}")
    print("-" * 105)
    all_pass = True
    for text, expected in test_cases:
        r = classify_intent(text)
        ok = "✅" if r.intent == expected else "❌"
        if r.intent != expected:
            all_pass = False
        print(f"{text!r:<45} {expected:<20} {r.intent:<20} {r.severity:>8.1f} {ok}")
        if r.flags:
            print(f"  flags: {r.flags}")

    print()
    print("All tests passed ✅" if all_pass else "Some tests FAILED ❌ — review above")
