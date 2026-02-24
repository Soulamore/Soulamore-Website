import os
import requests
import urllib.parse
from bs4 import BeautifulSoup

base_dir = r"C:\Users\adity\Desktop\Projects\Soulamore-Website\knowledge source"

# Define Categories and Sources
knowledge_map = {
    "Conversational Compassion Datasets": [
        {"name": "counsel_chat_dataset.csv", "url": "https://raw.githubusercontent.com/nbertagnolli/counsel-chat/master/data/20200325_counsel_chat.csv"}
    ],
    "Philosophical & Grounding Texts": [
        {"name": "Meditations_Marcus_Aurelius.txt", "url": "https://www.gutenberg.org/files/2680/2680-0.txt"},
        {"name": "The_Enchiridion_Epictetus.txt", "url": "https://www.gutenberg.org/cache/epub/45109/pg45109.txt"},
        {"name": "Seneca_Moral_Letters.txt", "url": "https://www.gutenberg.org/cache/epub/3174/pg3174.txt"}
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
        response = requests.get(url, headers=headers, stream=True, timeout=15)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Saved: {filepath}")
        return True
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
        return False

# 1. Download Direct Links
for category, files in knowledge_map.items():
    cat_dir = os.path.join(base_dir, category)
    for file_info in files:
        download_file(file_info["url"], cat_dir, file_info["name"])

# 2. Scrape Open Source CBT/DBT Worksheets (Centre for Clinical Interventions - CCI)
# CCI has great free resources. We'll grab some info sheets.
cci_cbt_url = "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Anxiety"

try:
    print("\nScraping CCI Anxiety resources...")
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(cci_cbt_url, headers=headers, timeout=15)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        
        cbt_dir = os.path.join(base_dir, "Therapeutic Modalities (CBT, ACT, DBT)", "Anxiety Modules")
        os.makedirs(cbt_dir, exist_ok=True)
        
        # Find pdf links
        count = 0
        for link in soup.find_all('a', href=True):
            href = link['href']
            if href.lower().endswith('.pdf'):
                full_url = urllib.parse.urljoin(cci_cbt_url, href)
                name = link.get_text(strip=True)
                if not name:
                    name = href.split('/')[-1]
                safe_name = "".join([c for c in name if c.isalpha() or c.isdigit() or c==' ']).rstrip()
                if not safe_name.lower().endswith('.pdf'):
                    safe_name += '.pdf'
                
                download_file(full_url, cbt_dir, safe_name)
                count += 1
                if count > 10: # limit to avoid over-downloading in one run
                    break
except Exception as e:
    print(f"Error scraping CCI: {e}")

print("\nDone expanding knowledge source!")
