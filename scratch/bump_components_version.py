import os
import re

def bump_version_in_html_files(root_dir):
    pattern = re.compile(r'components\.js\?v=3\.5')
    replacement = 'components.js?v=3.6'
    
    count = 0
    for root, dirs, files in os.walk(root_dir):
        # Skip node_modules and .git
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.git' in dirs:
            dirs.remove('.git')
            
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    if pattern.search(content):
                        new_content = pattern.sub(replacement, content)
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated: {file_path}")
                        count += 1
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
                    
    print(f"Total files updated: {count}")

if __name__ == '__main__':
    bump_version_in_html_files('.')
