import os
import requests

base_dir = r"C:\Users\adity\Desktop\Projects\Soulamore-Website\knowledge source"

indian_context_docs = {
    "Indian Legal and Compliance": [
        {
            "name": "Information_Technology_Rules_2021_India.pdf", 
            "url": "https://www.meity.gov.in/writereaddata/files/Intermediary_Guidelines_and_Digital_Media_Ethics_Code_Rules-2021.pdf"
        },
        {
            "name": "Mental_Healthcare_Act_2017_India.pdf", 
            "url": "https://www.indiacode.nic.in/bitstream/123456789/2249/1/A2017-10.pdf"
        }
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
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        
        # Disable warnings for gov.in expired SSLs
        import urllib3
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        
        response = requests.get(url, headers=headers, stream=True, timeout=30, verify=False)
        
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

print("Fetching Verified Indian Legal PDFs...")
for category, files in indian_context_docs.items():
    cat_dir = os.path.join(base_dir, category)
    for file_info in files:
        download_file(file_info["url"], cat_dir, file_info["name"])

print("Fetch complete.")
