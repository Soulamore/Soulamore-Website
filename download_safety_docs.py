import os
import requests

base_dir = r"C:\Users\adity\Desktop\Projects\Soulamore-Website\knowledge source"

# Option B (Crisis) & Legal Protections
knowledge_map = {
    "Trust and Safety Playbooks": [
        {"name": "Discord_Community_Guidelines.pdf", "url": "https://discord.com/assets/2a6ab85e83c27e8d.pdf"}, # Placeholder for general guidelines
        {"name": "OASAS_Crisis_Intervention_Manual.pdf", "url": "https://oasas.ny.gov/system/files/documents/2019/10/Crisis_Intervention_Manual.pdf"}
    ],
    "Mental Health First Aid (MHFA)": [
        {"name": "MHFA_Action_Plan_ALGEE.pdf", "url": "https://www.mentalhealthfirstaid.org/wp-content/uploads/2021/05/ALGEE-Action-Plan.pdf"}
    ],
    "Advanced Emotional Interventions (Option C)": [
        {"name": "Brief_Solution_Focused_Therapy_Manual.pdf", "url": "https://www.mentalhealth.va.gov/docs/brief_solution_focused_therapy_manual.pdf"},
        {"name": "ACT_Core_Processes.pdf", "url": "https://contextualscience.org/system/files/ACT_Core_Processes_Summary.pdf"}
    ],
    "Legal and Liability Protections": [
        {"name": "Digital_Health_Liability_Whitepaper.pdf", "url": "https://www.ama-assn.org/system/files/2019-12/digital-health-liability-whitepaper.pdf"},
        {"name": "Good_Samaritan_Laws_Overview.pdf", "url": "https://www.ncbi.nlm.nih.gov/books/NBK542176/pdf/Bookshelf_NBK542176.pdf"}
    ]
}

def download_file(url, folder, filename):
    try:
        os.makedirs(folder, exist_ok=True)
        filepath = os.path.join(folder, filename)
        
        if os.path.exists(filepath):
            print(f"Already exists: {filename}")
            return True

        print(f"Downloading {filename}...")
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, stream=True, timeout=20)
        
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(f"Saved: {filepath}")
            return True
        else:
             print(f"Failed to download {filename} (Status: {response.status_code})")
             return False
    except Exception as e:
        print(f"Error downloading {filename}: {e}")
        return False

print("Fetching Trust & Safety, MHFA, and Legal Protections...")
for category, files in knowledge_map.items():
    cat_dir = os.path.join(base_dir, category)
    for file_info in files:
        # Avoid relying heavily on direct PDF links that might 404, we will wrap in try/except 
        download_file(file_info["url"], cat_dir, file_info["name"])

print("Safety knowledge expansion complete.")
