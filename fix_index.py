import re
import os

FILE = "index.html"

with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Reading {FILE}...")

if "components.js" in content:
    print("components.js FOUND in content.")
else:
    print("components.js NOT found. Injecting...")
    # Inject before main.js
    if 'src="./assets/js/main.js"' in content:
        content = content.replace('src="./assets/js/main.js"', 'src="assets/js/components.js"></script>\n    <script src="./assets/js/main.js"')
    elif 'src="assets/js/main.js"' in content:
        content = content.replace('src="assets/js/main.js"', 'src="assets/js/components.js"></script>\n    <script src="assets/js/main.js"')
    else:
        content = content.replace('</body>', '<script src="assets/js/components.js"></script>\n</body>')

# Header Clean
if re.search(r'<header.*?>[\s\S]*?</header>', content):
    print("Cleaning Header...")
    content = re.sub(r'<header.*?>[\s\S]*?</header>', '<header></header>', content)

# Footer Clean
if re.search(r'<footer.*?>[\s\S]*?</footer>', content):
    print("Cleaning Footer...")
    content = re.sub(r'<footer.*?>[\s\S]*?</footer>', '<footer></footer>', content)

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done.")
