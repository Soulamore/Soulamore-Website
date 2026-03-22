# SoulBot — Human-in-the-Loop Training Pipeline

## What This Is

The continuous learning infrastructure for SoulBot. It turns every user
conversation into a feedback signal, routes uncertain cases to a human reviewer,
and runs a monthly retraining cycle that improves the model without autonomous
self-learning (which is unsafe for a mental health adjacent product).

---

## File Structure

```
soulbot_pipeline/
│
├── data_collector/
│   ├── collector.py          # Logs every turn, flags uncertain ones for review
│   └── hindi_patterns.py    # Hindi/Hinglish distress detection extension
│
├── reviewer/
│   └── review_cli.py         # Weekly human review tool (CLI)
│
├── augmentor/
│   └── augment.py            # Generates stylistic variants of approved examples
│
├── trainer/
│   └── train.py              # QLoRA fine-tuning script with safety gates
│
├── validator/
│   └── validate.py           # Pre-deployment adversarial test suite
│
├── scheduler/
│   └── pipeline.py           # Monthly pipeline orchestrator
│
└── logs/                     # Auto-created at runtime
    ├── soulbot_history.jsonl       # Every turn logged
    ├── review_queue.jsonl          # Flagged turns awaiting human review
    ├── crisis_turns.jsonl          # Crisis turns (separate, high-retention)
    ├── training_candidates.jsonl   # Reviewer-approved examples
    ├── augmented_dataset.jsonl     # Augmented training set
    ├── validation_runs.jsonl       # Validation history
    ├── training_runs.jsonl         # Training run history
    ├── pipeline_runs.jsonl         # Pipeline orchestration log
    └── daily_stats.jsonl           # Daily usage statistics
```

---

## Weekly Cadence (Human Reviewer)

Run every week, ideally same day each week:

```bash
# See what's in the queue
python reviewer/review_cli.py --stats

# Review crisis/high-distress turns first (always do this)
python reviewer/review_cli.py --crisis-only

# Review remaining flagged turns
python reviewer/review_cli.py --limit 50
```

### Reviewer Decision Guide

| Key | Action | When to use |
|-----|--------|-------------|
| A   | Approve | Classifier routed correctly |
| C   | Correct | Classifier made the wrong call — pick the right intent |
| S   | Skip | Not enough context to judge |
| X   | Exclude | Noise, test traffic, or example you don't want in training |
| Q   | Quit + Save | End session and save progress |

### When to correct:

- User said "I don't see the point" → routed to `casual_chat` → **Correct to `high_distress`**
- User said "I literally want to die laughing" → routed to `crisis` → **Correct to `casual_chat`**
- User said "please help" → routed to `emotional_light` → **Correct to `high_distress`**

---

## Monthly Cadence (Pipeline)

```bash
# 1. Check pipeline readiness
python scheduler/pipeline.py --status

# 2. Run full monthly pipeline
python scheduler/pipeline.py --run-monthly

# Or run individual stages if needed:
python scheduler/pipeline.py --stage augment
python scheduler/pipeline.py --stage train
python scheduler/pipeline.py --stage validate
```

### Monthly Pipeline Stages

```
review_check → augment → train → validate → (manual) deploy
```

**Stage 1: Review Check**
Verifies the human review queue is manageable (<200 pending).
Blocks if too many unreviewed turns exist.

**Stage 2: Augmentation**
Takes approved training candidates and generates 4× variants
(typos, Hinglish insertions, punctuation changes, length variations).
Checks for class imbalance before proceeding.

**Stage 3: Training**
QLoRA fine-tuning on Mistral-7B. Requires:
- ≥500 augmented examples
- ≥30 crisis examples
- All 5+ intent classes represented
- <10× class imbalance ratio

**Stage 4: Validation**
Runs 26 adversarial test cases against the new adapter.
BLOCKS deployment if any safety-critical test fails.
See `validator/validate.py` for the full test list.

**Stage 5: Deployment (Manual)**
After validation approval, staged rollout:
1. Route 5% of traffic to new adapter
2. Monitor crisis escalation rate for 48h
3. If stable → 25% → 50% → 100%
4. Keep previous adapter for instant rollback

---

## Integrating the Collector into inference.py

```python
# At the top of inference.py
from data_collector.collector import TurnCollector

collector = TurnCollector()

# After classify_intent() and generating a response:
collector.log_turn(
    session_id       = session_id,
    user_input       = user_text,
    intent_result    = result.__dict__,   # IntentResult from classifier
    bot_response     = response_text,
    latency_ms       = latency,
    language         = "en",              # or detected language
)

# When a session ends abruptly (user drops off):
collector.mark_session_ended(session_id, turn_count=n, abrupt=True)

# At midnight (cron job):
collector.flush_daily_stats()
```

---

## Integrating Hindi Pattern Detection

```python
# In inference.py, before classify_intent():
from data_collector.hindi_patterns import detect_hindi_signals

hindi_result = detect_hindi_signals(user_text)

if hindi_result["crisis_match"]:
    # Override: route to crisis regardless of English classifier
    intent = "crisis"
elif hindi_result["implicit_high_risk"]:
    intent = "high_distress"
else:
    # Fall through to English classifier
    result = classify_intent(user_text)
```

⚠️ **Important**: The Hindi patterns in `hindi_patterns.py` are marked
`UNVALIDATED`. Have a Hindi-fluent mental health professional review
them before enabling in production. Each pattern should be individually
confirmed before going live.

---

## Safety Rules — Never Break These

1. **Never deploy without validation passing** (`validate.py` exit code 0)
2. **Never train without human review** of crisis and high_distress turns
3. **Never use raw user thumbs-up/down** as direct training signal
4. **Never augment crisis examples** with fillers or casual modifications
5. **Never remove a safety-critical test** from `validate.py` without adding a replacement
6. **Always keep the previous adapter** as a rollback option for 30 days
7. **Always log crisis turns** to `crisis_turns.jsonl` separately with full retention

---

## Minimum Dataset Requirements Before Each Training Run

| Metric | Minimum | Current Status |
|--------|---------|----------------|
| Total examples | 500 | Check: `wc -l logs/augmented_dataset.jsonl` |
| Crisis examples | 30 | Check: `grep '"intent": "crisis"' logs/augmented_dataset.jsonl | wc -l` |
| Intents covered | 5 of 6 | Run: `python trainer/train.py --dry-run` |
| Class imbalance | <10× | Shown in dry-run output |

---

## What Gets Better Over Time

**Month 1-2:** Minimizing language detection improves.
Users who deflect and then disclose become training data.

**Month 3-4:** Hinglish patterns get validated and activated.
Hindi-first users stop being routed to casual_chat.

**Month 5-6:** Multi-turn context signals become visible.
Patterns like "fine → fine → I'm not fine" appear in logs.
This is when you start thinking about session-level routing.

**Month 6+:** Class-balanced dataset enables LoRA merge into base.
Latency drops. The routing system becomes permanently embedded.
