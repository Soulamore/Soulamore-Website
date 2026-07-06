import os
import sys
sys.path.append(r"c:\Users\adity\Desktop\Projects\Soulamore-Website\scratch")
from extract_docx import extract_docx

docx_path = r"c:\Users\adity\Desktop\Projects\Soulamore-Website\reports\testing\01-inbox\ADITYA\260704 - Profile pages and going towards dashboards.docx"
out_dir = r"c:\Users\adity\Desktop\Projects\Soulamore-Website\reports\testing\01-inbox\ADITYA"

print(f"Extracting {docx_path}...")
extract_docx(docx_path, out_dir)
print("Done!")
