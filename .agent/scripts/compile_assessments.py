import os
import json
import re

JS_FILE = r"C:\Users\adity\Desktop\Projects\Soulamore-Website\assets\js\assessment-data.js"
GENERATED_FILE = r"C:\Users\adity\Desktop\Projects\Soulamore-Website\assets\data\assessments\generated_batch.json"

def main():
    if not os.path.exists(GENERATED_FILE):
        print("No generated batch found.")
        return

    with open(GENERATED_FILE, 'r', encoding='utf-8') as f:
        new_assessments = json.load(f)

    with open(JS_FILE, 'r', encoding='utf-8') as f:
        js_content = f.read()

    # Step 1: Inject target_audience and tags to the original 4 if missing
    def inject_auth_tags(match):
        full_str = match.group(0)
        test_id = match.group(1)
        
        # Determine tags based on standard 4 IDs
        if test_id == 'anxiety_overthinking':
            audience = '["Students", "Workplaces"]'
            tags = '["Anxiety", "Career Anxiety", "Academic Stress"]'
        elif test_id == 'burnout_career':
            audience = '["Workplaces", "Students"]'
            tags = '["Burnout", "Career Anxiety", "Academic Stress"]'
        elif test_id == 'emotional_regulation':
            audience = '["Everyone"]'
            tags = '["Anxiety", "Depression"]'
        elif test_id == 'relationship_patterns':
            audience = '["Everyone"]'
            tags = '["Relationship Issues", "Loneliness"]'
        else:
            return full_str

        if '"target_audience"' not in full_str:
            # Inject right after description
            full_str = re.sub(r'("description":\s*".*?",)', r'\1 "target_audience": ' + audience + r', "tags": ' + tags + r',', full_str, 1)
        
        return full_str

    js_content = re.sub(r'window\.SoulamoreAssessments\["(.*?)"\]\s*=\s*(\{.*?\});', inject_auth_tags, js_content, flags=re.DOTALL)

    # Step 2: Append the 6 new assessments
    # Ensure we don't duplicate them if script runs twice
    lines_to_append = []
    
    for assessment in new_assessments:
        test_id = assessment.get("id")
        
        # Generate the citation stub
        citation = {
            "title": assessment.get("title"),
            "citations": [
                {
                    "name": "Generated Citation Structure",
                    "category": "Cross-Cutting Measure",
                    "description": "Generated via LLM trained on the Soulamore strict JSON schema."
                }
            ],
            "disclaimer": "This is an AI-generated assessment strictly built on validated psychosocial frameworks. Not a diagnostic tool."
        }
        
        # Only append if not currently in file
        if f'window.SoulamoreAssessments["{test_id}"]' not in js_content:
            lines_to_append.append(f'\nwindow.SoulamoreAssessments["{test_id}"] = {json.dumps(assessment)};')
            lines_to_append.append(f'\nwindow.SoulamoreCitations["{test_id}"] = {json.dumps(citation)};\n')
            
    if lines_to_append:
        js_content += "\n".join(lines_to_append)
        
    with open(JS_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"Appended {len(lines_to_append) // 2} new assessments to {JS_FILE} and updated original 4 with tags/audience.")

if __name__ == "__main__":
    main()
