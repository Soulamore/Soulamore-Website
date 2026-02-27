import os
import requests

base_dir = r"C:\Users\adity\Desktop\Projects\Soulamore-Website\knowledge source"

# Highly reliable government/institutional PDFs related to mental health platforms
knowledge_map = {
    "Compliance and Ethics": [
        {"name": "SAMHSA_Crisis_Care_Guidelines.pdf", "url": "https://www.samhsa.gov/sites/default/files/national-guidelines-for-behavioral-health-crisis-care-02242020.pdf"},
        {"name": "APA_Ethical_Principles.pdf", "url": "https://www.apa.org/ethics/code/ethics-code-2017.pdf"}
    ],
    "Peer Support Frameworks": [
        {"name": "SAMHSA_Core_Competencies_Peer_Workers.pdf", "url": "https://www.samhsa.gov/sites/default/files/programs_campaigns/brss_tacs/core-competencies.pdf"},
        {"name": "SAMHSA_Value_of_Peers.pdf", "url": "https://www.samhsa.gov/sites/default/files/programs_campaigns/brss_tacs/value-of-peers-2017.pdf"}
    ],
    "Crisis and Trauma Intervention": [
        {"name": "NCTSN_Psychological_First_Aid.pdf", "url": "https://www.nctsn.org/sites/default/files/resources/pfa_field_operations_guide.pdf"},
        {"name": "WHO_Psychological_First_Aid.pdf", "url": "https://iris.who.int/bitstream/handle/10665/44615/9789241548205_eng.pdf"}
    ]
}

def download_file(url, folder, filename):
    try:
        os.makedirs(folder, exist_ok=True)
        filepath = os.path.join(folder, filename)
        
        # Skip if already exists
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

print("Starting knowledge expansion for Soulamore architecture...")
for category, files in knowledge_map.items():
    cat_dir = os.path.join(base_dir, category)
    for file_info in files:
        download_file(file_info["url"], cat_dir, file_info["name"])

print("Knowledge expansion complete.")
