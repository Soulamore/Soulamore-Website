# Soulamore SoulBot: QLoRA Fine-Tuning Script
# Optimized for NVIDIA RTX 3060 (12GB VRAM) - BFloat16 Native Mode

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import LoraConfig, prepare_model_for_kbit_training
from datasets import load_dataset
from trl import SFTTrainer, SFTConfig # Using SFTConfig for TRL 0.29.0
import os

# Paths
LOCAL_MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "mistral_7b_base")
MODEL_NAME = LOCAL_MODEL_PATH if os.path.exists(LOCAL_MODEL_PATH) else "mistralai/Mistral-7B-v0.1"

DATASET_PATH = os.path.join(os.path.dirname(__file__), "data", "training_dataset.json")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "models", "soulamore.ai")

def train():
    if not os.path.exists(DATASET_PATH):
        print(f"Dataset not found at {DATASET_PATH}. Run dataset_generator.py first.")
        return

    print(f"--- SOULBOT TRAINING: BF16 NATIVE MODE ---")
    print(f"Loading model: {MODEL_NAME}...")
    
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right" # Recommended for Mistral

    # Mistral is native BF16. Ampere (3060) handles BF16 natively.
    # We use BF16 compute to avoid GradScaler mismatch errors.
    quantization_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_compute_dtype=torch.bfloat16, 
        bnb_4bit_quant_type="nf4",
        bnb_4bit_use_double_quant=True,
    )

    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        quantization_config=quantization_config,
        device_map="auto",
        trust_remote_code=True,
        dtype=torch.bfloat16, # Use 'dtype' instead of 'torch_dtype'
    )

    model.config.torch_dtype = torch.bfloat16 # Ensure config matches
    
    # Gradient Checkpointing is crucial for 12GB VRAM
    model.gradient_checkpointing_enable()
    model = prepare_model_for_kbit_training(model, use_gradient_checkpointing=True)

    # QLoRA Config
    peft_config = LoraConfig(
        r=16,
        lora_alpha=32,
        target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM"
    )

    # Load local dataset
    dataset = load_dataset("json", data_files=DATASET_PATH, split="train")

    def format_prompts(example):
        return f"### Instruction:\n{example['instruction']}\n\n### Input:\n{example['input']}\n\n### Response:\n{example['output']}"

    # SFTConfig replaces TrainingArguments in modern TRL
    training_args = SFTConfig(
        output_dir=OUTPUT_DIR,
        per_device_train_batch_size=1,
        gradient_accumulation_steps=4,
        num_train_epochs=3,
        learning_rate=2e-4,
        bf16=True, # NO more GradScaler errors
        fp16=False,
        gradient_checkpointing=True,
        gradient_checkpointing_kwargs={"use_reentrant": False}, # Fixes warning
        logging_steps=10,
        save_strategy="epoch",
        optim="paged_adamw_32bit", # Better stability on Windows
        report_to="none",
        max_length=1024, # In 0.29.0 it is 'max_length' inside SFTConfig
    )

    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset,
        peft_config=peft_config,
        formatting_func=format_prompts,
        args=training_args,
    )

    print("Starting training journey...")
    trainer.train()

    print(f"Training complete. Merging and Saving model to {OUTPUT_DIR}")
    # Merge LoRA weights into base model for standalone inference
    merged_model = trainer.model.merge_and_unload()
    merged_model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)

if __name__ == "__main__":
    train()
