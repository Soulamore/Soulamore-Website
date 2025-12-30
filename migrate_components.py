import os
import re

# Configuration
ROOT_DIR = r"g:\Other computers\My laptop\Get Rich Quick Plans\Aditya Harsh\Soulamore\01 - Website\02- Version 2\HTML Pages\New\Soulamore-Website"

# Files to skip or handle specially
SKIP_FILES = ["prototype-dynamic.html", "Soulbot.html"]
SPECIAL_FILES = {
    "vent-box.html": {
        "header_color": "rgba(20, 20, 30, 0.8)", # visual match for Midnight theme
        "remove_selector": r'<div class="top-bar">[\s\S]*?</div>' # Remove custom top bar
    }
}

def get_depth(file_path):
    rel_path = os.path.relpath(file_path, ROOT_DIR)
    return rel_path.count(os.sep)

def process_file(file_path):
    filename = os.path.basename(file_path)
    if filename in SKIP_FILES:
        print(f"Skipping {filename}")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    depth = get_depth(file_path)
    # Determine correct path prefix
    # Logic from components.js: 
    # If in subfolder like campus/, join-us/, our-peers/, soulamore-away/, confession-box/ -> "../"
    # But wait, depth calculation is more reliable.
    # Root = 0, Sub = 1
    
    prefix = "../" * depth
    script_src = f"{prefix}assets/js/components.js"
    
    # 1. HEADER REPLACEMENT
    if filename in SPECIAL_FILES:
        # Special handling (e.g. vent-box)
        # Remove custom top bar
        content = re.sub(SPECIAL_FILES[filename]["remove_selector"], '', content)
        # Ensure <header> exists for injection
        if "<header" not in content:
            # Inject empty header at start of body
             content = re.sub(r'(<body.*?>)', r'\1\n    <header></header>', content, count=1, flags=re.IGNORECASE)
        
        # Add color attribute later
        header_attr = f' data-header-color="{SPECIAL_FILES[filename]["header_color"]}"'
    else:
        # Standard Handling
        # Replace content of <header> with empty
        header_attr = ""
        if re.search(r'<header.*?>', content):
             content = re.sub(r'<header.*?>[\s\S]*?</header>', '<header></header>', content)
        else:
             # If no header found (maybe login.html?), inject one?
             # Only if it's a "standard" page. 
             # Let's inspect login.html manually later.
             pass

    # 2. FOOTER REPLACEMENT
    if re.search(r'<footer.*?>', content):
        content = re.sub(r'<footer.*?>[\s\S]*?</footer>', '<footer></footer>', content)
    
    # 3. SCRIPT INJECTION
    if "assets/js/components.js" not in content:
        # Inject before main.js if exists, else before body end
        script_tag = f'<script src="{script_src}"{header_attr}></script>'
        
        # Regex to find main.js with optional ./ or ../
        # We look for src="[prefix]assets/js/main.js" OR src="./[prefix]assets/js/main.js"
        # Actually simpler: just find any script tag pointing to main.js
        main_js_match = re.search(r'<script src=".*?assets/js/main\.js"></script>', content)
        
        if main_js_match:
            # Insert Before it
            content = content.replace(main_js_match.group(0), f'{script_tag}\n    {main_js_match.group(0)}')
        else:
            # Fallback: Before </body>
            content = content.replace('</body>', f'{script_tag}\n</body>')

    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filename}")
    else:
        print(f"No changes for {filename}")

# Run
for root, dirs, files in os.walk(ROOT_DIR):
    for file in files:
        if file.endswith(".html"):
            process_file(os.path.join(root, file))
