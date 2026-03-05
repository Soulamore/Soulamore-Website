import os
import re
import sys

def spacing_class(margin_val):
    if margin_val in ['20px', '25px', '30px']: return 'section-gap-sm'
    if margin_val in ['40px', '50px', '60px']: return 'section-gap-md'
    if margin_val in ['80px', '90px']: return 'section-gap-lg'
    if margin_val in ['100px', '120px']: return 'section-gap-xl'
    return None

def process_section(match):
    tag = match.group(0)
    
    style_match = re.search(r'style=(["\'])(.*?)\1', tag)
    if not style_match: return tag
    
    quote = style_match.group(1)
    style_content = style_match.group(2)
    
    # 1. Clean margin-top or simple margin: XXpx 0
    mt_match = re.search(r'margin-top:\s*(\d+px);?', style_content)
    margin_shorthand = re.search(r'margin:\s*(\d+px)\s+0;?', style_content)
    # Phase 6: Clean bottom margin hacks
    mb_match = re.search(r'margin-bottom:\s*\d+px;?', style_content)
    
    val = None
    new_style = style_content
    
    if mt_match:
        val = mt_match.group(1)
        new_style = re.sub(r'margin-top:\s*\d+px;?', '', new_style).strip()
    elif margin_shorthand:
        val = margin_shorthand.group(1)
        new_style = re.sub(r'margin:\s*\d+px\s+0;?', '', new_style).strip()
        
    if mb_match:
        new_style = re.sub(r'margin-bottom:\s*\d+px;?', '', new_style).strip()
        
    if new_style == style_content:
        # no spacing was stripped, return original
        return tag
        
    s_class = spacing_class(val) if val else None
    
    # Rebuild style string
    if new_style:
        new_tag = tag.replace(f'style={quote}{style_content}{quote}', f'style={quote}{new_style}{quote}')
    else:
        new_tag = re.sub(r'\s*style=(["\']).*?\1', '', tag)
        
    # Inject class if applicable
    if s_class:
        if 'class=' in new_tag:
            new_tag = re.sub(r'class=(["\'])(.*?)\1', f'class=\\1\\2 {s_class}\\1', new_tag)
        else:
            new_tag = new_tag.replace('<section', f'<section class="{s_class}"')
        
    return new_tag

def main():
    exclude_dirs = ['node_modules', '.git', '_BACKUPS', 'tmp', 'backup', 'tools', 'admin-dashboard', 'login', 'vent-box', 'problem-wall', '.vscode', '.agent']
    exclude_files = ['login.html', 'login_v1_backup.html', 'login_backup_std.html', 'admin-dashboard.html', 'peer-dashboard.bak.html']
    
    target_dir = sys.argv[1] if len(sys.argv) > 1 else '.'
    changed_files = []
    
    for root, dirs, files in os.walk(target_dir):
        dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
        
        for file in files:
            if not file.endswith('.html'):
                continue
            if file in exclude_files:
                continue
                
            path = os.path.join(root, file)
            if any(f"/{ex}/" in path.replace('\\', '/') for ex in exclude_dirs) or "Login Pages" in path:
                continue
                
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            new_content = re.sub(r'<section\s+[^>]*>', process_section, content, flags=re.IGNORECASE)
            
            if new_content != content:
                changed_files.append(path)
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                    
    print(f"Refactored spacing in {len(changed_files)} files.")
    for f in changed_files:
        print(f" - {f}")

if __name__ == "__main__":
    main()
