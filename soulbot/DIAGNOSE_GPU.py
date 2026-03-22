import torch
import os
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

# Paths
LOCAL_MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "mistral_7b_base")
MODEL_NAME = LOCAL_MODEL_PATH if os.path.exists(LOCAL_MODEL_PATH) else "mistralai/Mistral-7B-v0.1"

def diagnose():
    print(f"--- SOULBOT DIAGNOSTICS ---")
    print(f"Device: {torch.cuda.get_device_name(0)}")
    
    quantization_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_compute_dtype=torch.float16, # Current setting
        bnb_4bit_quant_type="nf4",
    )

    print(f"Loading model diagnostic for: {MODEL_NAME}")
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        quantization_config=quantization_config,
        device_map="auto",
        trust_remote_code=True
    )

    print("\n[DTYPE ANALYSIS]")
    dtypes = {}
    for name, param in model.named_parameters():
        dt = str(param.dtype)
        dtypes[dt] = dtypes.get(dt, 0) + 1
        if "bfloat16" in dt:
            print(f"Found BFloat16: {name}")

    print("\nSummary of parameter dtypes:")
    for dt, count in dtypes.items():
        print(f"  {dt}: {count} parameters")

    print("\n[CONCLUSION]")
    if "torch.bfloat16" in dtypes:
        print("ALERT: Model contains BFloat16 tensors. FP16 GradScaler WILL CRASH.")
    else:
        print("Model is clean of BFloat16 (as currently loaded).")

if __name__ == "__main__":
    diagnose()
