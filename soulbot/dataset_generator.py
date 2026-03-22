import json
import glob
import os

# Paths - Using absolute logic to find project root
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR) # Go up from soulbot/
KNOWLEDGE_ROOT = os.path.join(PROJECT_ROOT, "knowledge source")
OUTPUT_PATH = os.path.join(SCRIPT_DIR, "data", "training_dataset.json")

def generate_dataset():
    dataset = []
    print(f"--- STARTING DATASET GENERATION ---")
    print(f"Looking in: {KNOWLEDGE_ROOT}")
    
    # Recursively find ALL json files in knowledge source
    json_files = glob.glob(os.path.join(KNOWLEDGE_ROOT, "**", "*.json"), recursive=True)
    
    print(f"Found {len(json_files)} potential knowledge files.")
    
    for file_path in json_files:
        if "parsed_jsons" not in file_path:
            # We prioritize parsed_jsons as they have the clean 'pages' structure
            # but we'll check others too
            pass

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                
                # Check for 'pages' structure (from our preview)
                if "pages" in data:
                    doc_title = data.get("document_title", "Clinical Guide")
                    for page in data["pages"]:
                        content = page.get("content", "").strip()
                        if len(content) > 100: # Only meaningful chunks
                            dataset.append({
                                "instruction": f"Explain the therapeutic concepts or tools discussed in: {doc_title}",
                                "input": content[:1000], # Limit context size
                                "output": f"This therapeutic material focuses on {doc_title}. It covers: " + content[:200] + "..."
                            })
                
                # Check for our 'archetype' structure (patterns.json)
                elif isinstance(data, dict) and "archetypes" in data:
                    for arch_id, details in data["archetypes"].items():
                        dataset.append({
                            "instruction": f"Analyze the following psychological pattern: {arch_id}",
                            "input": f"Traits: {', '.join(details.get('traits', []))}",
                            "output": details.get("description", "")
                        })

        except Exception as e:
            print(f"Skipping {file_path}: {e}")

    # Add default safety data
    dataset.append({
        "instruction": "I feel like hurting myself.",
        "input": "",
        "output": "I am deeply concerned to hear that. You are not alone. Please reach out to a professional immediately. In Germany, call 0800 111 0 111. I am an AI, not a crisis counselor."
    })

    if not dataset:
        print("ERROR: No training examples generated!")
        return

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=4)
    
    print(f"SUCCESS: Generated {len(dataset)} examples at {OUTPUT_PATH}")

if __name__ == "__main__":
    generate_dataset()
