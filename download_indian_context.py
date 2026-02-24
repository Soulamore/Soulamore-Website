import os
import requests

base_dir = r"C:\Users\adity\Desktop\Projects\Soulamore-Website\knowledge source"

indian_context_docs = {
    "Indian Legal and Compliance": [
        {
            "name": "Information_Technology_Rules_2021_India.pdf", 
            "url": "https://mib.gov.in/sites/default/files/IT%28Intermediary%20Guidelines%20and%20Digital%20Media%20Ethics%20Code%29%20Rules%2C%202021%20English.pdf"
        },
        {
            "name": "Mental_Healthcare_Act_2017_India.pdf", 
            "url": "https://prsindia.org/files/bills_acts/acts_parliament/2017/The%20Mental%20Healthcare%20Act,%202017.pdf"
        },
        {
            "name": "Telemedicine_Practice_Guidelines_India.pdf", 
            "url": "https://www.mohfw.gov.in/pdf/TelemedicineINdiaAppendix.pdf"
        },
        {
            "name": "National_Suicide_Prevention_Strategy_India.pdf",
            "url": "https://main.mohfw.gov.in/sites/default/files/National%20Suicide%20Prevention%20Strategy.pdf"
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
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/pdf,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        # Indian govt sites often have expired SSL certs, so we use verify=False.
        # Suppress the insecure request warning for cleaner terminal output.
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

print("Fetching Indian Context Legal & Healthcare PDFs...")
for category, files in indian_context_docs.items():
    cat_dir = os.path.join(base_dir, category)
    for file_info in files:
        download_file(file_info["url"], cat_dir, file_info["name"])

print("Indian context fetch complete.")
