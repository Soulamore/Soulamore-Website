import os
import re

ROOT_DIR = r"g:\Other computers\My laptop\Get Rich Quick Plans\Aditya Harsh\Soulamore\01 - Website\02- Version 2\HTML Pages\New\Soulamore-Website"

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Clean Header if not empty
    # Regex: <header ...> NOT followed immediately by </header>
    # Logic: Sub <header.*?>...</header> with <header></header>
    # Note: Regex is non-greedy inside tags, but greedy for content? [\s\S]*? is non-greedy.
    # We want to replace valid headers.
    
    # Only clean if components.js is present (safeguard)
    if "components.js" in content:
        # Header
        if re.search(r'<header.*?>\s*<div', content): # If header contains a div (content)
             print(f"Cleaning Header in {os.path.basename(file_path)}")
             content = re.sub(r'<header.*?>[\s\S]*?</header>', '<header></header>', content)
        
        # Footer
        if re.search(r'<footer.*?>\s*<div', content): # If footer contains a div
             print(f"Cleaning Footer in {os.path.basename(file_path)}")
             content = re.sub(r'<footer.*?>[\s\S]*?</footer>', '<footer></footer>', content)
    
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

for root, dirs, files in os.walk(ROOT_DIR):
    for file in files:
        if file.endswith(".html"):
             process_file(os.path.join(root, file))
