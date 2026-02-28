import json
import os
from datetime import datetime

TRAINING_DATA_PATH = "soulbot/data/training_raw.json"

def log_assessment_data(instruction, input_data, output_data, metadata=None):
    """
    Logs a single assessment interaction for future fine-tuning.
    
    Args:
        instruction (str): The system prompt or instruction used.
        input_data (dict/str): The structured assessment scores.
        output_data (str): The AI-generated interpretation.
        metadata (dict): Optional metadata (model version, latency, user_id).
    """
    # Ensure directory exists
    os.makedirs(os.path.dirname(TRAINING_DATA_PATH), exist_ok=True)
    
    new_entry = {
        "timestamp": datetime.now().isoformat(),
        "instruction": instruction,
        "input": input_data,
        "output": output_data,
        "metadata": metadata or {}
    }
    
    data = []
    if os.path.exists(TRAINING_DATA_PATH):
        try:
            with open(TRAINING_DATA_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
        except json.JSONDecodeError:
            data = []
            
    data.append(new_entry)
    
    with open(TRAINING_DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"Logged training entry. Total samples: {len(data)}")

if __name__ == "__main__":
    # Test logging
    log_assessment_data(
        "Interpret emotional assessment results.",
        {"emotional_regulation": "moderate", "attachment": "high"},
        "You show a balanced approach to regulation but high sensitivity in attachments.",
        {"source": "test_script"}
    )
