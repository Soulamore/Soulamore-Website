# SoulBot: High-Resolution Nervous System (v1.0 + v2.0) Plan

SoulBot's current "Nervous System" is a blunt instrument. We are upgrading to Claude's "Reflex System" (v2.0), incorporating high-resolution intent detection *and* a safe "Human-in-the-Loop" evolution pipeline.

## 🧠 Proposed Changes

### 1. SoulBot Core & Language Extensions (`soulbot/`)
- **[NEW] [classifier.py](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/soulbot/classifier.py)**: Adopt Claude's full intent classification and severity scoring logic.
- **[NEW] [hindi_patterns.py](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/soulbot/CLause%20Results%202/hindi_patterns.py)**: Integrate Hinglish distress patterns (jee nahi karta, tension hai, etc.).
- **[NEW] [collector.py](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/soulbot/CLause%20Results%202/collector.py)**: Implement turn logging and flagging for human review.

### 2. Inference Loop Modernization (`inference.py`)
- **Multilingual Support**: Before English classification, run `detect_hindi_signals` to catch culturally nuanced distress.
- **Intent Calibration**: Replace legacy functions with the high-resolution `classify_intent` (IntentResult).
- **Data Harvesting**: Integrate `TurnCollector` to log every turn to `soulbot_history.jsonl` and flag uncertain cases.

### 3. Training & Validation Pipeline
- **[NEW] [review_cli.py](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/soulbot/CLause%20Results%202/review_cli.py)**: Deploy the weekly human-audit tool.
- **[NEW] [pipeline.py](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/soulbot/CLause%20Results%202/pipeline.py)**: Establish the monthly orchestrated tuning cadence (Augment -> Train -> Validate).

### 2. Personality & Response Logic
- **Hard Gate**: Retain the model bypass for `intent == "greeting"`.
- **Soft Validation**: Enhance with "Implicit Detection" awareness.
- **Safety Anchor**: Triggered by `r.safety_override` or `r.intent == "crisis"`.

---

### Manual Verification
1. **Hindi/Hinglish Test**: Type "jee nahi karta yaar" $\rightarrow$ Expect [High Distress] routing.
2. **Greeting Test**: Type "hello" $\rightarrow$ Expect instant, non-model greeting.
3. **Implicit Test**: Type "everyone would be fine without me" $\rightarrow$ Expect [Safety Anchor] activation.
4. **Idiom Test**: Type "this traffic is killing me lol" $\rightarrow$ Expect [Warm Companion] (Bypass).
5. **Collector Verification**: Verify that a turn is correctly written to `logs/soulbot_history.jsonl` with all metadata.
