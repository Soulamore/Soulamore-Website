"""
SoulBot — Hindi / Hinglish Distress Pattern Extension
-------------------------------------------------------
Extends classifier.py with patterns for Hindi and code-switched
(Hinglish) expressions of distress commonly used in India.

These are the patterns that score 0 in an English-only system
but carry high clinical significance for Indian users.

Usage in classifier.py:
    from hindi_patterns import HINDI_IMPLICIT_HIGH_RISK, HINDI_CRISIS_PHRASES, HINDI_LIGHT_SIGNALS
    # Then merge with existing pattern lists before classify_intent() runs.

Clinical validation status: UNVALIDATED
    These patterns were compiled from linguistic research and
    common expressions. They MUST be reviewed by a mental health
    professional fluent in Hindi before production use.
    Mark each pattern as VALIDATED before enabling in production.
"""

# ---------------------------------------------------------------------------
# Explicit crisis phrases (Hindi / Hinglish)
# These map directly to crisis intent — treat like English crisis keywords
# ---------------------------------------------------------------------------

HINDI_CRISIS_PHRASES = [
    # Direct ideation
    r"marna chahta",            # I want to die (masc)
    r"marna chahti",            # I want to die (fem)
    r"mujhe nahi jeena",        # I don't want to live
    r"jeena nahi chahta",       # Don't want to live (masc)
    r"jeena nahi chahti",       # Don't want to live (fem)
    r"zindagi khatam karna",    # Want to end life
    r"khud ko khatam",          # End myself
    r"suicide karna chahta",    # Want to commit suicide
    r"suicide karna chahti",
    r"khatam kar lun",          # Let me finish it / end it
    r"jaan de dun",             # Give up my life
    r"jaan de deti",
    r"mar jana chahta",         # Want to die
    r"mar jana chahti",
]

# ---------------------------------------------------------------------------
# Implicit high-risk patterns (Hindi / Hinglish)
# No explicit ideation word but high clinical significance
# ---------------------------------------------------------------------------

HINDI_IMPLICIT_HIGH_RISK = [
    # Passive ideation / existence fatigue
    r"jee nahi karta",          # Don't feel like living — VERY COMMON passive ideation
    r"jee nahi karti",
    r"jine ka mann nahi",       # No desire to live
    r"kya fayda",               # What's the point / What's the use
    r"kya matlab hai",          # What's the meaning (of anything)
    r"kuch nahi bachha",        # Nothing is left
    r"sab khatam",              # Everything is over / finished
    r"thak gaya hun",           # I'm exhausted (deeply — implies beyond physical)
    r"thak gayi hun",
    r"haar gaya",               # I've lost / I've been defeated
    r"haar gayi",
    r"uthne ka mann nahi",      # Don't want to get up (profound withdrawal)
    r"kuch achha nahi lagta",   # Nothing feels good / nothing brings joy
    r"andhera lagta hai",       # It feels dark (metaphorical)
    r"sab bekaar hai",          # Everything is useless / worthless
    r"mera koi nahi",           # I have no one / no one is mine
    r"koi nahi samjhega",       # No one will understand
    r"koi nahi samjha",         # No one understood
    r"sab mujhse naraaz",       # Everyone is angry at me
    r"main burden hun",         # I am a burden (code-switched)
    r"main sirf bojh hun",      # I am only a burden

    # Hopelessness
    r"kuch nahi badlega",       # Nothing will change
    r"hamesha aisa hi rahega",  # It will always be like this
    r"kabhi theek nahi hoga",   # Will never be okay
    r"umeed nahi",              # No hope
    r"koi rasta nahi",          # No way out

    # Self-worth collapse
    r"main kisi kaam ka nahi",  # I'm not good for anything (masc)
    r"main kisi kaam ki nahi",  # I'm not good for anything (fem)
    r"meri wajah se sab",       # Because of me, everyone (negative framing)
    r"mere bina sab theek",     # Everyone will be fine without me
    r"mere bina behtar",        # Better off without me

    # Closure behavior signals
    r"sab se maafi",            # Asking forgiveness from everyone
    r"alvida bolna",            # Saying goodbye
    r"sab se milna chahta",     # Wanting to meet everyone (farewell visits)
]

# ---------------------------------------------------------------------------
# Moderate distress signals (Hindi / Hinglish)
# ---------------------------------------------------------------------------

HINDI_MODERATE_SIGNALS = [
    r"tension hai",               # There is worry/tension
    r"bahut dard",              # A lot of pain
    r"dil nahi lagta",          # Heart isn't in it / can't engage
    r"rona aata hai",           # Feel like crying
    r"akela feel",              # Feeling alone (Hinglish)
    r"akela hun",               # I am alone
    r"koi nahi sunta",          # No one listens
    r"samajh nahi aata",        # Can't understand / make sense of things
    r"bura lag raha",           # Feeling bad
    r"anxiety ho rahi",         # Having anxiety (Hinglish)
    r"depression ho raha",      # Having depression (Hinglish)
    r"panic ho raha",           # Having panic (Hinglish)
    r"ghabrana",                # Nervousness / panic
    r"dar lag raha",            # Feeling scared
    r"sar chakkar",             # Dizzy / overwhelmed
    r"saans nahi aati",         # Can't breathe (panic symptom)
    r"neend nahi",              # Can't sleep
    r"bhookh nahi",             # No appetite
    r"kuch khane ka mann nahi", # Don't feel like eating
]

# ---------------------------------------------------------------------------
# Light emotional signals (Hindi / Hinglish)
# ---------------------------------------------------------------------------

HINDI_LIGHT_SIGNALS = [
    r"thoda sad",               # A little sad (Hinglish)
    r"thoda down",              # A little down (Hinglish)
    r"meh feel",                # Meh feeling (Hinglish)
    r"theek nahi hun",          # I'm not okay / not well
    r"theek nahi hoon",
    r"acha nahi lag raha",      # Not feeling good
    r"kal se thoda",            # Since yesterday, a little
    r"stress ho raha",          # Feeling stress (Hinglish)
    r"tension hai",              # There is tension/worry (add to moderate)
    r"pareshan hun",            # I am troubled / worried
    r"udas hun",                # I am sad
    r"mood nahi hai",           # Not in the mood (Hinglish)
    r"mood kharab hai",         # Mood is bad (Hinglish)
]

# ---------------------------------------------------------------------------
# Minimizing language (Hindi / Hinglish)
# ---------------------------------------------------------------------------

HINDI_MINIMIZING = [
    r"kuch nahi yaar",          # Nothing yaar (dismissal)
    r"chodo",                   # Leave it / forget it
    r"rehne do",                # Let it be / forget it
    r"main theek hun",          # I'm fine (when they're not)
    r"koi baat nahi",           # It's okay / it's nothing
    r"baat mat karo",           # Don't talk about it
    r"bura mat mano",           # Don't take it badly (pre-emptive)
    r"zyada nahi",              # Not much / not a lot
    r"chhoti si baat",          # It's a small thing
]

# ---------------------------------------------------------------------------
# Integration helper
# ---------------------------------------------------------------------------

ALL_HINDI_PATTERNS = {
    "crisis":          HINDI_CRISIS_PHRASES,
    "high_distress":   HINDI_IMPLICIT_HIGH_RISK,
    "moderate":        HINDI_MODERATE_SIGNALS,
    "light":           HINDI_LIGHT_SIGNALS,
    "minimizing":      HINDI_MINIMIZING,
}


def detect_hindi_signals(text: str) -> dict:
    """
    Returns dict of detected signal levels for Hindi/Hinglish text.
    Drop-in companion to calculate_severity() in classifier.py.

    Returns:
        {
            "crisis_match": bool,
            "implicit_high_risk": bool,
            "moderate": bool,
            "light": bool,
            "minimizing": bool,
            "matched_patterns": list[str],
        }
    """
    import re
    results = {
        "crisis_match": False,
        "implicit_high_risk": False,
        "moderate": False,
        "light": False,
        "minimizing": False,
        "matched_patterns": [],
    }

    text_lower = text.lower()

    for level, patterns in ALL_HINDI_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower, re.IGNORECASE):
                results["matched_patterns"].append(f"{level}:{pattern}")
                if level == "crisis":
                    results["crisis_match"] = True
                elif level == "high_distress":
                    results["implicit_high_risk"] = True
                elif level == "moderate":
                    results["moderate"] = True
                elif level == "light":
                    results["light"] = True
                elif level == "minimizing":
                    results["minimizing"] = True

    return results


# ---------------------------------------------------------------------------
# Self-test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    test_cases = [
        ("jee nahi karta yaar", "high_distress"),
        ("main kisi kaam ka nahi hun", "high_distress"),
        ("mere bina sab theek ho jayenge", "high_distress"),
        ("mujhe nahi jeena", "crisis"),
        ("thoda sad hun aaj", "light"),
        ("bahut tension hai exam ki", "moderate"),
        ("chodo yaar kuch nahi", "minimizing"),
        ("main theek hun", "minimizing"),
        ("hello how are you", "none"),
    ]

    print("\nHindi/Hinglish Pattern Self-Test")
    print("─" * 60)
    print(f"  {'Input':<45} {'Expected':<15} {'Got'}")
    print("─" * 60)

    for text, expected in test_cases:
        result = detect_hindi_signals(text)
        if result["crisis_match"]:
            got = "crisis"
        elif result["implicit_high_risk"]:
            got = "high_distress"
        elif result["moderate"]:
            got = "moderate"
        elif result["light"]:
            got = "light"
        elif result["minimizing"]:
            got = "minimizing"
        else:
            got = "none"

        ok = "✅" if got == expected else "❌"
        print(f"  {ok} {text!r:<43} {expected:<15} {got}")
        if result["matched_patterns"]:
            for p in result["matched_patterns"]:
                print(f"     → {p}")
