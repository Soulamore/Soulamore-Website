import json
import os
import random

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "data")
ARCHETYPES_PATH = os.path.join(DATA_DIR, "case_archetypes.json")
CONSTRUCTS_PATH = os.path.join(DATA_DIR, "clinical_constructs.json")
TONES_PATH = os.path.join(DATA_DIR, "empathy_tuner.json")
INTERVENTIONS_PATH = os.path.join(DATA_DIR, "interventions.json")
OUTPUT_PATH = os.path.join(DATA_DIR, "training_dataset.json")

def load_knowledge():
    with open(ARCHETYPES_PATH, "r") as f: archetypes = json.load(f)["scenarios"]
    with open(CONSTRUCTS_PATH, "r") as f: constructs = json.load(f)
    with open(TONES_PATH, "r") as f: tones = json.load(f)
    with open(INTERVENTIONS_PATH, "r") as f: interventions = json.load(f)["interventions"]
    return archetypes, constructs, tones, interventions

def assemble_dataset():
    archetypes, constructs, tones, interventions = load_knowledge()
    dataset = []
    
    print(f"--- STARTING KNOWLEDGE ENGINE SYNTHESIS ---")
    
    # We want 2000 high-quality examples
    while len(dataset) < 2000:
        # 1. Select a Scenario (Archetype)
        arc = random.choice(archetypes)
        
        # 2. Select a Tone Profile
        tone = random.choice(tones["profiles"])
        
        # 3. Select a Relevant Construct (if applicable)
        rel_con = None
        for con in constructs["constructs"]:
            if con["name"] in arc["core_constructs"] or random.random() < 0.2:
                rel_con = con
                break
        
        # 4. Select an Intervention
        inv = random.choice(interventions)
        
        # 5. Build Training Pair
        instruction = f"Roleplay as a SoulBot Clinical Engine. Scenario: {arc['title']}. Tone: {tone['tone_id']}. Target Domain: {arc['primary_domain']}."
        
        input_text = f"User situation: '{arc['title']}'. Feeling: {random.choice(arc.get('emotional_themes', ['distress']))}. Severity: {arc['severity_band']}."
        
        # Assembler Logic: Synthesize Response
        phrases = [p["phrase"] for p in tones["empathy_phrases"] if p["mode"] == tone["tone_id"]]
        empathy = random.choice(phrases) if phrases else "I hear how difficult this is."
        
        construct_insight = f"Insight: {rel_con['description']} ({rel_con['name']})" if rel_con else ""
        
        output_text = f"{empathy}\n\nClinical Insight: Based on the pattern of {arc['primary_domain']}, we see {construct_insight}. {rel_con['internal_dialogue'][0] if rel_con else ''}\n\nSuggested Step: {inv['name']}\n{chr(10).join(inv['steps'])}"
        
        dataset.append({
            "instruction": instruction,
            "input": input_text,
            "output": output_text
        })

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=4)
    
    print(f"SUCCESS: Synthesized {len(dataset)} examples at {OUTPUT_PATH}")

if __name__ == "__main__":
    assemble_dataset()
