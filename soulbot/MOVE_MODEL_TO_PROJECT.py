import os
import shutil
import glob

# Source (HF Cache)
SOURCE_BASE = "C:/Users/adity/.cache/huggingface/hub/models--mistralai--Mistral-7B-v0.1"
# Destination (Project Folder)
DEST_BASE = "soulbot/models/mistral_7b_base"

def move_model():
    print(f"--- MOVING MODEL TO PROJECT FOLDER ---")
    
    if not os.path.exists(SOURCE_BASE):
        print(f"[ERROR] Could not find the model in cache: {SOURCE_BASE}")
        return

    # Create destination
    os.makedirs(DEST_BASE, exist_ok=True)
    
    print(f"Moving files from cache to {DEST_BASE}...")
    print("This might take a minute as it's 13GB...")

    # We want to find the latest 'snapshot' (the actual files)
    snapshot_dir = os.path.join(SOURCE_BASE, "snapshots")
    if os.path.exists(snapshot_dir):
        # Get the first folder in snapshots (usually the only one)
        snapshots = os.listdir(snapshot_dir)
        if snapshots:
            actual_source = os.path.join(snapshot_dir, snapshots[0])
            
            # Copy all files
            files = os.listdir(actual_source)
            for f in files:
                src_file = os.path.join(actual_source, f)
                dest_file = os.path.join(DEST_BASE, f)
                
                if not os.path.exists(dest_file):
                    print(f"Copying {f}...")
                    shutil.copy2(src_file, dest_file)
                else:
                    print(f"Skipping {f} (already exists).")
            
            print(f"\n[SUCCESS] Model is now portable in: {DEST_BASE}")
            print("I will now update your training script to use this folder.")
        else:
            print("[ERROR] No snapshots found inside the cache folder.")
    else:
        print("[ERROR] Snapshot directory not found. Please run Step 2 first to download.")

if __name__ == "__main__":
    move_model()
