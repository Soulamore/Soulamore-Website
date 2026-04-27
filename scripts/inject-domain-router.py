import os
import re

# Configuration
TARGET_DOMAIN = 'soulamore.com'
SCRIPT_TAG = f"""<!-- DOMAIN ROUTER & CANONICAL -->
    <script>
        (function() {{
            var host = window.location.hostname;
            var path = window.location.pathname;
            var search = window.location.search;
            var targetDomain = '{TARGET_DOMAIN}';
            
            // 1. Redirect Firebase Traffic
            if (host.includes('firebaseapp.com') || host.includes('web.app')) {{
                window.location.replace('https://' + targetDomain + path + search);
            }}
            
            // 2. Canonical Injection
            var canonicalUrl = 'https://' + targetDomain + path;
            var link = document.querySelector('link[rel="canonical"]') || document.createElement('link');
            link.rel = 'canonical';
            link.href = canonicalUrl;
            if (!link.parentNode) document.head.appendChild(link);
        }})();
    </script>"""

# Folders to explicitly skip
SKIP_DIRS = [
    'node_modules', '.git', '.firebase', '_BACKUPS', 'reports', 'docs', 
    'Git Tools Open Source', 'knowledge source', 'Claude Result'
]

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False

    # Check if already injected
    if 'DOMAIN ROUTER & CANONICAL' in content:
        return False

    # Find <head> tag or <meta charset> to inject after
    head_match = re.search(r'<head.*?>', content, re.IGNORECASE)
    if not head_match:
        return False

    # Also find and remove any existing hardcoded canonical to avoid duplicates
    content = re.sub(r'<link rel="canonical".*?>', '', content, flags=re.IGNORECASE)
    
    # Also find and remove the old index.html redirect script if it exists
    content = re.sub(r'<script>\s*if \(location\.hostname\.endsWith\("\.web\.app"\).*?location\.replace\(.*?\);\s*}\s*</script>', '', content, flags=re.DOTALL | re.IGNORECASE)

    # Insert after <head>
    insertion_point = head_match.end()
    
    # If there's a meta charset, insert after that instead for best practice
    meta_charset = re.search(r'<meta charset=.*?>', content, re.IGNORECASE)
    if meta_charset:
        insertion_point = meta_charset.end()

    new_content = content[:insertion_point] + "\n    " + SCRIPT_TAG + content[insertion_point:]
    
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
    except Exception as e:
        print(f"Error writing {filepath}: {e}")
        return False
    
    return True

def main():
    root_dir = '.'
    count = 0
    for root, dirs, files in os.walk(root_dir):
        # Skip directories
        if any(skip in root for skip in SKIP_DIRS):
            continue
            
        for file in files:
            if file.endswith('.html'):
                path = os.path.join(root, file)
                if process_file(path):
                    print(f"Updated: {path}")
                    count += 1
    
    print(f"\nTotal files updated: {count}")

if __name__ == "__main__":
    main()
