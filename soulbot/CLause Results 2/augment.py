"""
SoulBot Pipeline — Stage 3: Data Augmentor
--------------------------------------------
Takes approved training candidates from the reviewer
and generates stylistic variants to:
  1. Expand dataset size without manual effort
  2. Prevent the model from memorizing exact phrasings
  3. Cover linguistic diversity (spelling variations,
     Hinglish patterns, code-switching, truncation)

Run:
    python augmentor/augment.py
    python augmentor/augment.py --input logs/training_candidates.jsonl --multiplier 4
    python augmentor/augment.py --stats

Output: logs/augmented_dataset.jsonl
"""

import json
import re
import random
import argparse
from pathlib import Path
from datetime import datetime
from copy import deepcopy


LOGS_DIR            = Path("logs")
TRAINING_CANDIDATES = LOGS_DIR / "training_candidates.jsonl"
AUGMENTED_DATASET   = LOGS_DIR / "augmented_dataset.jsonl"
AUGMENT_LOG         = LOGS_DIR / "augmentation_log.jsonl"

random.seed(42)


# ---------------------------------------------------------------------------
# Augmentation strategies
# ---------------------------------------------------------------------------

# 1. Typo / informal spelling variants
TYPO_MAP = {
    "i'm":      ["im", "i'm", "I'm"],
    "don't":    ["dont", "don't"],
    "can't":    ["cant", "can't"],
    "won't":    ["wont", "won't"],
    "i've":     ["ive", "i've"],
    "i'll":     ["ill", "i'll"],
    "it's":     ["its", "it's"],
    "what's":   ["whats", "what's"],
    "i":        ["I"],
    "okay":     ["ok", "okay", "okk"],
    "really":   ["rlly", "rly", "really"],
    "because":  ["coz", "cuz", "because", "bc"],
    "very":     ["v", "very"],
    "please":   ["pls", "plz", "please"],
    "thank you": ["thnks", "ty", "thank u"],
    "feeling":  ["feelin", "feeling"],
    "everything": ["evrything", "everything"],
    "nothing":  ["nothin", "nothing"],
    "something": ["smthing", "something"],
}

# 2. Hinglish / code-switching patterns (common in India)
HINGLISH_ADDITIONS = {
    "emotional_light": [
        "yaar",         # friend (casual)
        "nahi",         # no/not
        "bahut",        # very much
        "thoda",        # a little
        "zyada",        # too much
        "abhi",         # right now
        "aaj",          # today
    ],
    "moderate_distress": [
        "bilkul",       # completely
        "sach mein",    # truly / really
        "pata nahi",    # I don't know
        "kya karu",     # what should I do
        "samajh nahi",  # don't understand
    ],
    "high_distress": [
        "bahut bura",   # very bad
        "sach bol raha", # telling the truth
        "kuch nahi",    # nothing at all
    ],
}

# 3. Punctuation / formatting variations
PUNCT_VARIANTS = [
    lambda t: t.lower(),
    lambda t: t.upper() if len(t) < 30 else t,  # ALL CAPS for short distress
    lambda t: t.rstrip(".,!?") + "...",
    lambda t: t.rstrip(".,!?"),
    lambda t: t + ".",
    lambda t: t + "??",
    lambda t: t + "!!!",
]

# 4. Filler / hedge word additions
FILLERS = {
    "emotional_light": ["tbh", "honestly", "idk", "kinda", "sorta", "like"],
    "moderate_distress": ["honestly", "i don't know", "i guess", "idk how to say this"],
    "high_distress": ["i don't know how to say this", "i've been holding this in", "this is hard to say"],
    "crisis": [],  # Do NOT augment crisis examples with fillers — keep them clean
    "casual_chat": ["btw", "also", "hey", "hi"],
    "greeting": [],
}

# 5. Sentence reordering (for multi-clause inputs)
def _try_reorder(text: str) -> str:
    """Swap clause order if there's a clear conjunction."""
    for conj in [" and ", " but ", " because ", " so "]:
        if conj in text:
            parts = text.split(conj, 1)
            if len(parts) == 2 and len(parts[0]) > 5 and len(parts[1]) > 5:
                return parts[1].strip().capitalize() + conj.lower() + parts[0].lower()
    return text

# 6. Length variation
def _shorten(text: str) -> str:
    """Take first sentence or clause."""
    for sep in [".", "!", "?", ",", " and "]:
        idx = text.find(sep)
        if idx > 10:
            return text[:idx].strip()
    return text

def _lengthen(text: str, intent: str) -> str:
    """Add a common follow-up phrase appropriate to intent."""
    additions = {
        "emotional_light": [" just wanted to share", " idk", " i think"],
        "moderate_distress": [" and i don't know what to do", " i've been feeling this for a while"],
        "high_distress": [" i really need to talk to someone", " i don't know how much longer i can do this"],
        "crisis": [],  # Never lengthen crisis examples
        "casual_chat": [" just curious", " was wondering"],
        "greeting": [],
    }
    suffix_list = additions.get(intent, [])
    if suffix_list:
        return text.rstrip(".,!?") + random.choice(suffix_list)
    return text


# ---------------------------------------------------------------------------
# Core augmentation function
# ---------------------------------------------------------------------------

def augment_example(record: dict, multiplier: int = 4) -> list[dict]:
    """
    Generate `multiplier` variants of a single training record.
    Returns list of new records with aug_type metadata.
    """
    original_text = record.get("user_input", "")
    intent = record.get("training_intent", record.get("intent", ""))

    # Safety check: never augment examples with safety_override in unsafe ways
    is_sensitive = intent in ("crisis",) or record.get("safety_override", False)

    variants = []
    strategies_used = []

    # Always include original
    variants.append({
        **deepcopy(record),
        "aug_type": "original",
        "augmented_at": datetime.now().isoformat(),
    })

    if multiplier <= 1:
        return variants

    candidate_strategies = []

    # Strategy 1: Typo variants (safe for all)
    candidate_strategies.append(("typo", _apply_typos))

    # Strategy 2: Punctuation variants (safe for all)
    candidate_strategies.append(("punctuation", _apply_punct_variant))

    # Strategy 3: Filler additions (not for crisis)
    if not is_sensitive:
        candidate_strategies.append(("filler", lambda t, i: _apply_filler(t, i)))

    # Strategy 4: Hinglish (only for emotional/distress intents)
    if intent in HINGLISH_ADDITIONS:
        candidate_strategies.append(("hinglish", _apply_hinglish))

    # Strategy 5: Reorder (multi-clause inputs only)
    if any(c in original_text for c in [" and ", " but ", " because "]):
        candidate_strategies.append(("reorder", lambda t, i: (_try_reorder(t), "reorder")))

    # Strategy 6: Shorten (if input > 8 words)
    if len(original_text.split()) > 8 and not is_sensitive:
        candidate_strategies.append(("shorten", lambda t, i: (_shorten(t), "shorten")))

    # Strategy 7: Lengthen (if input < 10 words)
    if len(original_text.split()) < 10 and not is_sensitive:
        candidate_strategies.append(("lengthen", lambda t, i: (_lengthen(t, i), "lengthen")))

    # Pick strategies to fill multiplier slots
    random.shuffle(candidate_strategies)
    used = set()
    for strategy_name, strategy_fn in candidate_strategies:
        if len(variants) >= multiplier:
            break
        if strategy_name in used:
            continue
        try:
            result = strategy_fn(original_text, intent)
            if isinstance(result, tuple):
                new_text, aug_type = result
            else:
                new_text, aug_type = result, strategy_name

            if new_text and new_text != original_text and len(new_text) >= 3:
                new_record = deepcopy(record)
                new_record["user_input"] = new_text
                new_record["aug_type"] = aug_type
                new_record["augmented_from"] = record.get("turn_id", "unknown")
                new_record["augmented_at"] = datetime.now().isoformat()
                new_record["turn_id"] = record.get("turn_id", "")[:8] + f"_aug{len(variants)}"
                variants.append(new_record)
                used.add(strategy_name)
        except Exception:
            continue

    return variants


def _apply_typos(text: str, intent: str) -> tuple[str, str]:
    words = text.split()
    changed = False
    result = []
    for word in words:
        lower = word.lower()
        if lower in TYPO_MAP and random.random() < 0.4:
            replacement = random.choice(TYPO_MAP[lower])
            result.append(replacement)
            changed = True
        else:
            result.append(word)
    new_text = " ".join(result)
    return (new_text, "typo") if changed else (text, "typo")


def _apply_punct_variant(text: str, intent: str) -> tuple[str, str]:
    fn = random.choice(PUNCT_VARIANTS)
    return fn(text), "punctuation"


def _apply_filler(text: str, intent: str) -> tuple[str, str]:
    fillers = FILLERS.get(intent, [])
    if not fillers:
        return text, "filler"
    filler = random.choice(fillers)
    if random.random() < 0.5:
        new_text = filler + ", " + text[0].lower() + text[1:]
    else:
        new_text = text.rstrip(".,!?") + ", " + filler
    return new_text, "filler"


def _apply_hinglish(text: str, intent: str) -> tuple[str, str]:
    words = HINGLISH_ADDITIONS.get(intent, [])
    if not words:
        return text, "hinglish"
    word = random.choice(words)
    if random.random() < 0.5:
        new_text = word + " " + text[0].lower() + text[1:]
    else:
        new_text = text.rstrip(".,!?") + " " + word
    return new_text, "hinglish"


# ---------------------------------------------------------------------------
# Main runner
# ---------------------------------------------------------------------------

def run_augmentation(input_path: Path, multiplier: int = 4):
    if not input_path.exists():
        print(f"❌ Input file not found: {input_path}")
        return

    records = []
    with open(input_path) as f:
        for line in f:
            try:
                records.append(json.loads(line))
            except json.JSONDecodeError:
                continue

    print(f"\n🔁 Augmenting {len(records)} approved examples (×{multiplier})...")

    all_variants = []
    intent_counts = {}

    for record in records:
        variants = augment_example(record, multiplier)
        all_variants.extend(variants)
        intent = record.get("training_intent", record.get("intent", "unknown"))
        intent_counts[intent] = intent_counts.get(intent, 0) + len(variants)

    # Write augmented dataset
    LOGS_DIR.mkdir(exist_ok=True)
    with open(AUGMENTED_DATASET, "w") as f:
        for v in all_variants:
            f.write(json.dumps(v, ensure_ascii=False) + "\n")

    # Write log
    log = {
        "run_at": datetime.now().isoformat(),
        "input_examples": len(records),
        "output_examples": len(all_variants),
        "multiplier": multiplier,
        "by_intent": intent_counts,
    }
    with open(AUGMENT_LOG, "a") as f:
        f.write(json.dumps(log) + "\n")

    print(f"✅ Generated {len(all_variants)} examples")
    print(f"\n  {'Intent':<25} {'Count':>8}")
    print(f"  {'─'*35}")
    for intent, count in sorted(intent_counts.items(), key=lambda x: -x[1]):
        print(f"  {intent:<25} {count:>8}")
    print(f"\n  Saved → {AUGMENTED_DATASET}")

    # Check for class imbalance
    counts = list(intent_counts.values())
    if counts:
        max_c, min_c = max(counts), min(counts)
        if max_c > min_c * 5:
            print(f"\n  ⚠️  WARNING: Class imbalance detected. Max/min ratio: {max_c/min_c:.1f}x")
            print(f"     Consider adding more examples of underrepresented intents before training.")


def print_stats():
    print("\n📊 Augmentation Stats\n")
    if TRAINING_CANDIDATES.exists():
        count = sum(1 for _ in open(TRAINING_CANDIDATES))
        print(f"  Training candidates:  {count}")
    if AUGMENTED_DATASET.exists():
        count = sum(1 for _ in open(AUGMENTED_DATASET))
        print(f"  Augmented examples:   {count}")
    if AUGMENT_LOG.exists():
        with open(AUGMENT_LOG) as f:
            lines = f.readlines()
        if lines:
            last = json.loads(lines[-1])
            print(f"  Last run: {last.get('run_at','?')[:19]}")
            print(f"  Last multiplier: {last.get('multiplier','?')}x")
    print()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SoulBot Data Augmentor")
    parser.add_argument("--input", type=Path, default=TRAINING_CANDIDATES)
    parser.add_argument("--multiplier", type=int, default=4)
    parser.add_argument("--stats", action="store_true")
    args = parser.parse_args()

    if args.stats:
        print_stats()
    else:
        run_augmentation(args.input, args.multiplier)
