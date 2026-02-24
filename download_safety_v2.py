import os
import requests

base_dir = r"C:\Users\adity\Desktop\Projects\Soulamore-Website\knowledge source"

# Direct links that do not have Cloudflare/bot protections
knowledge_map = {
    "Trust and Safety Playbooks": [
        {"name": "Crisis_Intervention_Manual.pdf", "url": "https://nrchcb.com/wp-content/uploads/2019/04/Crisis-Intervention-Handbook.pdf"},
        {"name": "Online_Community_Moderation_Guide.pdf", "url": "https://www.isoc.org/wp-content/uploads/2021/01/Community-Moderation-Guide-EN.pdf"}
    ],
    "Mental Health First Aid (MHFA)": [
        {"name": "MHFA_Action_Plan.pdf", "url": "https://www.mentalhealthfirstaid.org/wp-content/uploads/2022/08/ALGEE-Action-Plan.pdf"}
    ],
    "Advanced Emotional Interventions (Option C)": [
        {"name": "ACT_Brief_Case_Conceptualization.pdf", "url": "https://www.actmindfully.com.au/wp-content/uploads/2019/07/ACT_Brief_Case_Conceptualization_Worksheet_-_Russ_Harris.pdf"}
    ],
    "Legal and Liability Protections": [
        {"name": "Good_Samaritan_Laws_Overview.pdf", "url": "https://leg.wa.gov/Senate/Committees/LAW/Documents/GoodSamaritanLaws.pdf"}
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
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/pdf'
        }
        
        # Use verify=False if some older sites have SSL issues, though generally not recommended
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

print("Fetching Alternative Safety & Legal PDFs...")
for category, files in knowledge_map.items():
    cat_dir = os.path.join(base_dir, category)
    for file_info in files:
        download_file(file_info["url"], cat_dir, file_info["name"])

print("PDF recovery complete.")
