import os
import json
import pdfplumber

def parse_pdfs_to_json(source_dir, dest_dir):
    print(f"Starting PDF to JSON parsing from {source_dir}...")
    
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
        
    for root, dirs, files in os.walk(source_dir):
        # Skip the destination directory to avoid recursion issues if it's nested
        if dest_dir in root:
            continue
            
        for file in files:
            if file.lower().endswith('.pdf'):
                pdf_path = os.path.join(root, file)
                # Determine relative path to maintain folder structure
                rel_path = os.path.relpath(root, source_dir)
                target_folder = os.path.join(dest_dir, rel_path)
                
                if not os.path.exists(target_folder):
                    os.makedirs(target_folder)
                    
                json_filename = file.replace('.pdf', '.json')
                json_path = os.path.join(target_folder, json_filename)
                
                print(f"Parsing: {file}")
                
                doc_data = {
                    "document_title": file,
                    "source_path": pdf_path,
                    "pages": []
                }
                
                try:
                    with pdfplumber.open(pdf_path) as pdf:
                        for i, page in enumerate(pdf.pages):
                            text = page.extract_text()
                            if text:
                                doc_data["pages"].append({
                                    "page_number": i + 1,
                                    "content": text.strip()
                                })
                                
                    with open(json_path, 'w', encoding='utf-8') as f:
                        json.dump(doc_data, f, indent=4, ensure_ascii=False)
                        
                    print(f"  -> Saved {json_filename}")
                except Exception as e:
                    print(f"  -> Error parsing {file}: {e}")

if __name__ == "__main__":
    SOURCE_DIR = os.path.join(os.getcwd(), "knowledge source")
    DEST_DIR = os.path.join(os.getcwd(), "knowledge source", "parsed_jsons")
    parse_pdfs_to_json(SOURCE_DIR, DEST_DIR)
    print("Done generating 1-to-1 JSON datasets for AI Fine-Tuning!")
