import os
import torch
import sys

# Paths
CACHE_DIR = "C:/Users/adity/.cache/huggingface/hub/models--mistralai--Mistral-7B-v0.1"
ADAPTER_PATH = "soulbot/models/soulamore_mistral_adapter"

def check_system():
    print("--- SYSTEM CHECK ---")
    print(f"Python Version: {sys.version}")
    print(f"PyTorch Version: {torch.__version__}")
    cuda_avail = torch.cuda.is_available()
    print(f"CUDA Available (GPU): {cuda_avail}")
    if cuda_avail:
        print(f"GPU Name: {torch.cuda.get_device_name(0)}")
        print(f"VRAM Total: {torch.cuda.get_device_properties(0).total_memory / (1024**3):.2f} GB")
    else:
        print("[WARNING] GPU not detected. Training will be extremely slow or fail.")

def check_model_download():
    print("\n--- MODEL DOWNLOAD CHECK ---")
    if not os.path.exists(CACHE_DIR):
        print(f"[MISSING] Directory not found: {CACHE_DIR}")
        return
        
    # On Windows, HF uses 'snapshots' or 'blobs'
    # We'll just check the whole directory size recursively
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(CACHE_DIR):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            total_size += os.path.getsize(fp)
            
    print(f"Mistral Cache Found: {total_size / (1024**3):.2f} GB")
    if total_size > 4: # 4GB+ is a good sign for quantized/sharded
        print("[SUCCESS] Base model weights appear to be downloaded.")
    else:
        print("[INCOMPLETE] Model folder exists but seems too small (might be just pointers).")

def check_adapter():
    print("\n--- TRAINING STATUS ---")
    if os.path.exists(ADAPTER_PATH):
        files = os.listdir(ADAPTER_PATH)
        if "adapter_model.bin" in files or "adapter_model.safetensors" in files:
            print("[SUCCESS] Your custom 'Soulamore' adapter was found!")
        else:
            print("[PARTIAL] Adapter folder exists but weights are missing.")
    else:
        print("[NOT STARTED] Your custom fine-tuning hasn't finished yet.")

if __name__ == "__main__":
    check_system()
    check_model_download()
    check_adapter()
    print("\nIf 'Base model weights' is SUCCESS but 'Training Status' is NOT STARTED,")
    print("you just need to run 'python soulbot/train.py' again.")
