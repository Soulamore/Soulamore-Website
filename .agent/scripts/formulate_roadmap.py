import os
import glob
import json
import google.generativeai as genai

# Configure Google Gemini API
api_key = os.environ.get("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# The model to use
model = genai.GenerativeModel('gemini-2.0-flash', generation_config={"response_mime_type": "application/json"})

# Paths
KNOWLEDGE_BASE_DIR = r"C:\Users\adity\Desktop\Projects\Soulamore-Website\knowledge source\parsed_jsons"
ROADMAP_FILE = r"C:\Users\adity\Desktop\Projects\Soulamore-Website\assets\data\assessments\roadmap_100.json"

CATEGORIES = [
    "Academic Stress", "Loneliness", "Relationship Issues", 
    "Grief / Loss", "Body Image", "Career Anxiety", 
    "Anxiety", "Depression", "Trauma / PTSD", 
    "Adolescents", "Burnout"
]

PROMPT = """
You are a psychiatric data architect. I have a directory of clinical PDFs (parsed as JSON). 
Your task is to review this list of files and formulate a list of exactly 100 clinical assessment titles and categories.

For each item, provide:
1. id: A unique string id.
2. title: A cinematic, empathetic title (e.g., 'Echoes of Isolation' instead of 'Loneliness Scale').
3. category: Exactly ONE of these: Academic Stress, Loneliness, Relationship Issues, Grief / Loss, Body Image, Career Anxiety, Anxiety, Depression, Trauma / PTSD, Adolescents, Burnout.
4. source_file: The name of the PDF/JSON file it is derived from.
5. description: A 1-sentence evocative description.

FILE LIST:
{file_list}

OUTPUT FORMAT MUST BE A JSON ARRAY OF OBJECTS.
"""

def main():
    all_files = glob.glob(os.path.join(KNOWLEDGE_BASE_DIR, "**/*.json"), recursive=True)
    file_names = [os.path.basename(f) for f in all_files]
    
    # We might have more than 100 files, so we pass the list and ask for 100.
    # If we have fewer, we repeat or create variations.
    
    file_list_str = "\n".join(file_names)
    
    print(f"Formulating roadmap for {len(file_names)} files...")
    
    response = model.generate_content(PROMPT.format(file_list=file_list_str))
    
    try:
        data = json.loads(response.text)
        os.makedirs(os.path.dirname(ROADMAP_FILE), exist_ok=True)
        with open(ROADMAP_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
        print(f"Successfully formulated {len(data)} assessment materials in {ROADMAP_FILE}")
    except Exception as e:
        print(f"Error parsing response: {e}")
        print("Raw response:", response.text)

if __name__ == "__main__":
    main()
