import os
import subprocess
import sys

# Ensure PyPDF2 is installed
try:
    import PyPDF2
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyPDF2", "--quiet"])
    import PyPDF2

folder = r"C:\Users\adity\Desktop\Projects\Soulamore-Website\knowledge source"
files = [f for f in os.listdir(folder) if f.endswith(".pdf")]

print("Scanning PDF titles...")
for file in files:
    try:
        path = os.path.join(folder, file)
        with open(path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            if len(reader.pages) > 0:
                page = reader.pages[0]
                text = page.extract_text()
                preview = text[:250].replace('\n', ' ').strip()
                print(f"\n[{file}]")
                print(preview)
    except Exception as e:
        print(f"\n[{file}] Error: {e}")
