import os
import requests

# Clinical Resource URLs provided by user
RESOURCES = {
    # WHO & Global
    "WHO_mhGAP_v2": "https://apps.who.int/iris/bitstream/handle/10665/250239/9789241549790-eng.pdf",
    "WHO_Psych_First_Aid": "https://apps.who.int/iris/bitstream/handle/10665/44615/9789241548205_eng.pdf",
    "WHO_WHODAS_2_0": "https://apps.who.int/iris/bitstream/handle/10665/43974/9789241547598_eng.pdf",
    "WHO_Migration_Health": "https://apps.who.int/iris/bitstream/handle/10665/354719/9789240049338-eng.pdf",
    
    # SAMHSA & Trauma
    "SAMHSA_TIP_57_Trauma": "https://store.samhsa.gov/sites/default/files/d7/priv/tip57.pdf",
    "SAMHSA_SAFE_T_Suicide": "https://store.samhsa.gov/sites/default/files/d7/priv/sma09-4432.pdf",
    
    # NIMH Fact Sheets
    "NIMH_Depression": "https://www.nimh.nih.gov/health/publications/depression",
    "NIMH_Anxiety": "https://www.nimh.nih.gov/health/publications/anxiety-disorders",
    "NIMH_PTSD": "https://www.nimh.nih.gov/health/publications/post-traumatic-stress-disorder-ptsd",
    
    # Open Textbooks & Educational
    "OpenStax_Psychology": "https://openstax.org/details/books/psychology-2e",
    "C_SSRS_Safety_Scale": "https://cssrs.columbia.edu/wp-content/uploads/C-SSRS_Pediatric_SLC_11.2016.pdf",
    "Safety_Planning_Stanley_Brown": "https://suicidesafetyplan.com/wp-content/uploads/2018/12/SafetyPlanningForm-Final.pdf"
}

DEST_DIR = os.path.join("knowledge source", "downloads", "clinical_frameworks")

def download_resources():
    os.makedirs(DEST_DIR, exist_ok=True)
    print(f"--- STARTING CLINICAL RESOURCE DOWNLOAD ---")
    
    for name, url in RESOURCES.items():
        filename = f"{name}.pdf" if url.endswith(".pdf") else f"{name}.html"
        file_path = os.path.join(DEST_DIR, filename)
        
        if os.path.exists(file_path):
            print(f"Skipping {filename} (Already exists)")
            continue
            
        print(f"Downloading: {name} ...")
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        try:
            response = requests.get(url, stream=True, timeout=30, headers=headers)
            response.raise_for_status()
            
            with open(file_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(f"SUCCESS: Saved to {file_path}")
        except Exception as e:
            print(f"FAILED to download {name}: {e}")

if __name__ == "__main__":
    download_resources()
