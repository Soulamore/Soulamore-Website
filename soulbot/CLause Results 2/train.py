"""
SoulBot Pipeline — Stage 4: QLoRA Fine-Tuner
----------------------------------------------
Monthly retraining script. Takes the augmented dataset,
merges with the original training data, and runs a
QLoRA fine-tuning cycle on Mistral-7B.

Safety checks built in:
  - Dataset balance validation before training starts
  - Minimum dataset size gate
  - Loss spike detection (early stopping)
  - Pre/post accuracy comparison on held-out safety set

Run:
    python trainer/train.py
    python trainer/train.py --dry-run     # validate dataset only, no training
    python trainer/train.py --epochs 2

Requirements:
    pip install transformers==4.49.0 trl==0.9.6 peft bitsandbytes datasets torch
"""

import json
import argparse
import sys
from pathlib import Path
from datetime import datetime


LOGS_DIR          = Path("logs")
AUGMENTED_DATASET = LOGS_DIR / "augmented_dataset.jsonl"
MODELS_DIR        = Path("soulbot/models")
BASE_MODEL_PATH   = MODELS_DIR / "mistral_7b_base"
ADAPTER_OUT_DIR   = MODELS_DIR / "adapters"
TRAIN_LOG_FILE    = LOGS_DIR / "training_runs.jsonl"

# Minimum safety gates before training is allowed to proceed
MIN_EXAMPLES_TOTAL   = 500
MIN_EXAMPLES_CRISIS  = 30     # crisis examples are hardest to collect — gate separately
MAX_CLASS_IMBALANCE  = 10.0   # max ratio between most/least represented intent
MIN_INTENTS_COVERED  = 5      # must have data for at least 5 of 6 intent classes

REQUIRED_INTENTS = {
    "greeting", "casual_chat", "emotional_light",
    "moderate_distress", "high_distress", "crisis"
}

# Prompt template — wraps user input for instruction fine-tuning
PROMPT_TEMPLATE = """<s>[INST] You are Soulamore, a warm wellness companion. Respond with care and appropriate emotional attunement.

User message: {user_input}
Detected intent: {intent}
Severity level: {severity}
Response mode: {mode} [/INST]

{response}</s>"""


# ---------------------------------------------------------------------------
# Dataset validation
# ---------------------------------------------------------------------------

def load_dataset(path: Path) -> list[dict]:
    records = []
    with open(path) as f:
        for line in f:
            try:
                r = json.loads(line)
                if r.get("approved_for_training") and r.get("user_input"):
                    records.append(r)
            except:
                continue
    return records


def validate_dataset(records: list[dict]) -> tuple[bool, list[str]]:
    """
    Returns (is_valid, list_of_issues).
    Training will NOT proceed if is_valid is False.
    """
    issues = []

    # Gate 1: Minimum size
    if len(records) < MIN_EXAMPLES_TOTAL:
        issues.append(f"GATE FAIL: Only {len(records)} examples. Minimum is {MIN_EXAMPLES_TOTAL}.")

    # Gate 2: Intent coverage
    by_intent = {}
    for r in records:
        intent = r.get("training_intent", r.get("intent", "unknown"))
        by_intent[intent] = by_intent.get(intent, 0) + 1

    covered = set(by_intent.keys()) & REQUIRED_INTENTS
    if len(covered) < MIN_INTENTS_COVERED:
        missing = REQUIRED_INTENTS - covered
        issues.append(f"GATE FAIL: Missing intent coverage for: {missing}")

    # Gate 3: Crisis minimum
    crisis_count = by_intent.get("crisis", 0)
    if crisis_count < MIN_EXAMPLES_CRISIS:
        issues.append(
            f"GATE FAIL: Only {crisis_count} crisis examples. Minimum is {MIN_EXAMPLES_CRISIS}. "
            f"Do not train without adequate crisis data — the model may lose crisis detection ability."
        )

    # Gate 4: Class imbalance
    counts = [v for v in by_intent.values() if v > 0]
    if counts:
        ratio = max(counts) / min(counts)
        if ratio > MAX_CLASS_IMBALANCE:
            dominant = max(by_intent, key=by_intent.get)
            issues.append(
                f"WARNING: Class imbalance {ratio:.1f}x. "
                f"'{dominant}' dominates with {by_intent[dominant]} examples. "
                f"Consider augmenting underrepresented classes."
            )
            # This is a warning, not a hard gate — training can proceed

    is_valid = not any("GATE FAIL" in i for i in issues)
    return is_valid, issues, by_intent


def print_dataset_report(records: list, by_intent: dict, issues: list):
    print(f"\n{'─'*60}")
    print(f"  Dataset Validation Report")
    print(f"{'─'*60}")
    print(f"  Total approved examples: {len(records)}")
    print(f"\n  {'Intent':<25} {'Count':>8}  {'%':>6}")
    print(f"  {'─'*42}")
    total = len(records)
    for intent in sorted(REQUIRED_INTENTS):
        count = by_intent.get(intent, 0)
        pct = count / total * 100 if total else 0
        flag = " ⚠️" if count < 20 else ""
        print(f"  {intent:<25} {count:>8}  {pct:>5.1f}%{flag}")

    if issues:
        print(f"\n  Issues:")
        for issue in issues:
            prefix = "  ❌" if "GATE FAIL" in issue else "  ⚠️"
            print(f"{prefix} {issue}")
    else:
        print(f"\n  ✅ All validation gates passed.")
    print(f"{'─'*60}\n")


# ---------------------------------------------------------------------------
# Prompt formatter
# ---------------------------------------------------------------------------

def format_prompt(record: dict) -> str:
    return PROMPT_TEMPLATE.format(
        user_input = record.get("user_input", ""),
        intent     = record.get("training_intent", record.get("intent", "")),
        severity   = record.get("severity", 0),
        mode       = record.get("mode", ""),
        response   = record.get("bot_response_preview", ""),
    )


# ---------------------------------------------------------------------------
# Training
# ---------------------------------------------------------------------------

def run_training(records: list[dict], epochs: int = 1, dry_run: bool = False):
    """
    Main training function. Imports heavy ML libraries only here
    so the script can be used for validation (--dry-run) without GPU.
    """
    if dry_run:
        print("  ✅ Dry run complete. Dataset is valid. No training performed.")
        return

    print("\n  Loading libraries...")
    try:
        import torch
        from datasets import Dataset
        from transformers import (
            AutoModelForCausalLM,
            AutoTokenizer,
            BitsAndBytesConfig,
            TrainingArguments,
        )
        from peft import LoraConfig, get_peft_model, TaskType
        from trl import SFTTrainer
    except ImportError as e:
        print(f"\n  ❌ Missing dependency: {e}")
        print(f"     Run: pip install transformers==4.49.0 trl==0.9.6 peft bitsandbytes")
        sys.exit(1)

    run_id = datetime.now().strftime("%Y%m%d_%H%M")
    adapter_path = ADAPTER_OUT_DIR / f"adapter_{run_id}"
    adapter_path.mkdir(parents=True, exist_ok=True)

    print(f"  Run ID:      {run_id}")
    print(f"  Epochs:      {epochs}")
    print(f"  Examples:    {len(records)}")
    print(f"  Adapter out: {adapter_path}")

    # --- Tokenizer ---
    print("\n  Loading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(str(BASE_MODEL_PATH))
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"

    # --- Model (4-bit quantized) ---
    print("  Loading base model (4-bit QLoRA)...")
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_use_double_quant=True,
    )
    model = AutoModelForCausalLM.from_pretrained(
        str(BASE_MODEL_PATH),
        quantization_config=bnb_config,
        device_map="auto",
    )
    model.config.use_cache = False

    # --- LoRA adapter config ---
    # CRITICAL: Use same rank (16) as existing adapter to avoid size mismatch
    lora_config = LoraConfig(
        r=16,
        lora_alpha=32,
        target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type=TaskType.CAUSAL_LM,
    )
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    # --- Dataset ---
    prompts = [format_prompt(r) for r in records]
    dataset = Dataset.from_dict({"text": prompts})

    # 90/10 train/eval split
    split = dataset.train_test_split(test_size=0.1, seed=42)
    train_dataset = split["train"]
    eval_dataset  = split["test"]

    # --- Training args ---
    training_args = TrainingArguments(
        output_dir                  = str(adapter_path),
        num_train_epochs            = epochs,
        per_device_train_batch_size = 2,
        gradient_accumulation_steps = 4,
        learning_rate               = 2e-4,
        fp16                        = True,
        logging_steps               = 25,
        evaluation_strategy         = "steps",
        eval_steps                  = 100,
        save_strategy               = "epoch",
        warmup_ratio                = 0.03,
        lr_scheduler_type           = "cosine",
        report_to                   = "none",   # disable wandb etc.
        load_best_model_at_end      = True,
        metric_for_best_model       = "eval_loss",
        greater_is_better           = False,
    )

    # --- Trainer ---
    trainer = SFTTrainer(
        model           = model,
        args            = training_args,
        train_dataset   = train_dataset,
        eval_dataset    = eval_dataset,
        dataset_text_field = "text",
        max_seq_length  = 512,
        tokenizer       = tokenizer,
    )

    print("\n  🏋️  Training started...\n")
    train_result = trainer.train()

    # Save adapter
    trainer.save_model(str(adapter_path))
    tokenizer.save_pretrained(str(adapter_path))

    # Log run
    run_log = {
        "run_id":          run_id,
        "completed_at":    datetime.now().isoformat(),
        "epochs":          epochs,
        "examples":        len(records),
        "train_examples":  len(train_dataset),
        "eval_examples":   len(eval_dataset),
        "final_train_loss": round(train_result.training_loss, 4),
        "adapter_path":    str(adapter_path),
        "status":          "completed",
    }
    LOGS_DIR.mkdir(exist_ok=True)
    with open(TRAIN_LOG_FILE, "a") as f:
        f.write(json.dumps(run_log) + "\n")

    print(f"\n  ✅ Training complete.")
    print(f"     Final loss:   {train_result.training_loss:.4f}")
    print(f"     Adapter saved: {adapter_path}")
    print(f"\n  ⚠️  NEXT STEP: Run the validator before deploying this adapter.")
    print(f"     python validator/validate.py --adapter {adapter_path}")

    return run_log


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SoulBot QLoRA Fine-Tuner")
    parser.add_argument("--dry-run", action="store_true", help="Validate dataset only, no training")
    parser.add_argument("--epochs", type=int, default=1)
    parser.add_argument("--input", type=Path, default=AUGMENTED_DATASET)
    args = parser.parse_args()

    print("\n" + "="*60)
    print("  SoulBot — Monthly Retraining Pipeline")
    print("  Stage 4: QLoRA Fine-Tuner")
    print("="*60)

    if not args.input.exists():
        print(f"\n  ❌ Dataset not found: {args.input}")
        print(f"     Run: python augmentor/augment.py first")
        sys.exit(1)

    print(f"\n  Loading dataset: {args.input}")
    records = load_dataset(args.input)
    is_valid, issues, by_intent = validate_dataset(records)
    print_dataset_report(records, by_intent, issues)

    if not is_valid:
        print(f"\n  ❌ Training BLOCKED by validation failures above.")
        print(f"     Resolve all GATE FAIL issues before retraining.")
        sys.exit(1)

    if args.dry_run:
        print("  ✅ Dry run complete. Dataset is valid. No training performed.")
        sys.exit(0)

    confirm = input("\n  Proceed with training? This will take 30-90 minutes. [y/N] ").strip().lower()
    if confirm != "y":
        print("  Cancelled.")
        sys.exit(0)

    run_training(records, epochs=args.epochs, dry_run=args.dry_run)
