import os
import shutil

source_dir = r"C:\Users\adity\Desktop\Projects\Soulamore-Website\knowledge source"

categories = {
    "Level 1 Cross-Cutting Symptom Measures": ["Level 1"],
    "Level 2 Cross-Cutting Symptom Measures": ["Level 2"],
    "Disorder-Specific Severity Measures": ["Severity Measure", "Severity of"],
    "Disability Measures (WHODAS 2.0)": ["WHODAS 20"],
    "Personality Inventories": ["Personality Inventory", "PID5"],
    "Early Development and Home Background": ["Early Development"],
    "Cultural Formulation Interviews": ["Cultural Formulation CFI", "Cultural Formulation Interview"],
    "Clinician-Rated Dimensions": ["ClinicianRated"]
}

for item in os.listdir(source_dir):
    if not item.lower().endswith(".pdf"):
        continue

    matched_category = "Uncategorized"
    for cat, keywords in categories.items():
        if any(keyword.lower() in item.lower() for keyword in keywords):
            matched_category = cat
            break

    target_dir = os.path.join(source_dir, matched_category)
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)

    source_path = os.path.join(source_dir, item)
    target_path = os.path.join(target_dir, item)
    
    # Move the file
    shutil.move(source_path, target_path)

print("Files categorized successfully.")
