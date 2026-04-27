import os
import re

def replace_images_with_webp():
    print("Starting HTML Image Replacement...")
    
    image_dir = 'assets/images'
    webp_files = set()
    for root, dirs, files in os.walk(image_dir):
        for file in files:
            if file.endswith('.webp'):
                rel_path = os.path.relpath(os.path.join(root, file), '.')
                normalized = rel_path.replace('\\', '/').lstrip('./')
                webp_files.add(normalized)
    
    print(f"Found {len(webp_files)} webp files.")

    # Match assets/images/path.png anywhere
    img_regex = re.compile(r'(assets/images/[^"\'\)\s\$\{]+\.(?:png|jpg|jpeg))')

    html_count = 0
    replacement_count = 0

    for root, dirs, files in os.walk('.'):
        if any(x in root for x in ['node_modules', '.git', '.agent', 'tmp']):
            continue
            
        for file in files:
            if file.endswith('.html') or file.endswith('.js') or file.endswith('.css'):
                file_path = os.path.join(root, file)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                except:
                    continue
                
                def sub_func(match):
                    nonlocal replacement_count
                    original_path = match.group(1)
                    
                    # Exclude meta tags
                    context = content[max(0, match.start()-200):match.start()]
                    if 'property="og:image"' in context or 'name="twitter:image"' in context:
                        return match.group(0)

                    webp_path = os.path.splitext(original_path)[0] + '.webp'
                    
                    if webp_path in webp_files:
                        replacement_count += 1
                        # print(f"  Replacing {original_path} -> {webp_path} in {file}")
                        return webp_path
                    return match.group(0)

                new_content = img_regex.sub(sub_func, content)
                
                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    html_count += 1

    print(f"Updated {html_count} files with {replacement_count} image replacements.")

if __name__ == "__main__":
    replace_images_with_webp()
