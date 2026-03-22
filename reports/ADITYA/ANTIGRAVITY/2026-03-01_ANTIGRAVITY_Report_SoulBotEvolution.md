# SoulBot: Engineering Crisis & Evolution Report (v2.0)

## 🚨 1. The Core Problems (What Went Wrong)

### A. Technical Environment Collapse
- **Issue**: Attempting to use experimental `transformers v5.2.0` caused a total failure in the `trl` library, resulting in `AttributeError` and corrupted model adapters.
- **Result**: SoulBot could not load, train, or perform inference.

### B. The "Clinical Over-Bias" Phenomenon (Over-Tuning)
- **Problem**: SoulBot was fine-tuned on 1,500 clinical reports but **0% casual conversation data**. 
- **Behavior**: The model "hallucinated" distress. For a simple "Hello", it would force a "Clinical Insight" about boundary issues or suggest emergency 5-4-3-2-1 grounding techniques.
- **Cause**: Loss ~0.015 indicates heavy convergence; the model learned the *clinical format* so well it lost the ability to speak naturally.

### C. Latency Failure
- **Issue**: Initial inference was taking 32-40 seconds per response.
- **Cause**: Lack of KV-caching and unoptimized generation parameters on the local RTX 3060.

---

## 🛠️ 2. The Solution: "The Nervous System" Architecture

Instead of brute-force retraining, we built a **software-level nervous system** around the clinical brain.

### Layer 1: The Hard Intent Gate (Pre-Processing)
- **Model Bypass**: Simple greetings ("hi", "hello") no longer touch the AI model. They are served instantly by a warm, branded Soulamore template.
- **Intent Router**: A 6-class classifier (Greeting, Casual, Emotional Light/Moderate/High, Crisis) directs the turn before the model fires.

### Layer 2: Mode Switching & Template Isolation
- **Personality Modes**: 
  - *Warm Companion*: Human-only, no clinical headers.
  - *Reflective Guide*: Balanced empathy + insight.
  - *Structured Support*: High-precision clinical engine.
  - *Safety Anchor*: Grounding-only crisis response.
- **Hard Guards**: Clinical headers are physically removed from the prompt in "Light" modes to prevent the weights from "leaking" clinical talk.

### Layer 3: Severity-Locked Grounding
- **Guardrail**: Grounding techniques (5-4-3-2-1) are strictly locked behind a **Severity Score >= 6**. If the model tries to suggest them for small talk, a post-processor scrubs them out.

### Layer 4: Controlled Learning Loop (Feedback)
- **Logging**: Every turn is saved to `soulbot_history.jsonl` with Intent, Severity, and Latency metadata.
- **Feedback**: A +/- system allows for "Human-in-the-Loop" data harvesting for future batch-refinement.

---

## 🚀 3. What We Need to Do Next (Revised Roadmap)

1. **Strategic Data Augmentation**: Prepare ~200 samples of "Branded Greetings" and "Neutral Questions." 
   - *CRITICAL*: Ensure **stylistic diversity** (varied length, tone, and punctuation) to prevent new narrow clusters.
2. **Rebalancing Fine-Tune**: Perform a light re-training (1 epoch) with the augmented dataset to rebalance the weights.
3. **Weekly Batch Refinement**: Manually review logs/feedback to correct routing misses.
4. **LoRA Merge (Final Step)**: Only *after* the weights are balanced, perform `merge_and_unload()` to shave off latency. Merging too early would permanently bake in the current clinical bias.

---

**Status**: SoulBot is currently **Safe**, **Fast**, and **Socially Calibrated**. 🚀🤖🩺🏠✨
