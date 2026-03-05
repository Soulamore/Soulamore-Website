import os
import re
import sys

# Theme map with lowercase, stripped spaces keys for easier matching
THEME_MAP = {
    # backgrounds
    '#0f172a': 'var(--bg-main)',
    'rgba(30,41,59,0.6)': 'var(--bg-card)',
    'rgba(30,41,59,0.8)': 'var(--bg-card-hover)',
    'rgba(15,23,42,0.6)': 'var(--bg-glass)',
    'rgba(15,23,42,0.8)': 'var(--bg-overlay)',
    'rgba(255,255,255,0.05)': 'var(--bg-subtle)',
    'rgba(255,255,255,0.1)': 'var(--border-subtle)',
    'rgba(255,255,255,0.02)': 'var(--bg-subtle)',  # close enough mapped
    'rgba(255,255,255,0.03)': 'var(--bg-subtle)',  # close enough mapped
    
    # Text
    '#f1f5f9': 'var(--text-primary)',
    '#94a3b8': 'var(--text-secondary)',
    'rgba(255,255,255,0.6)': 'var(--text-muted)',
    
    # Borders
    'rgba(255,255,255,0.2)': 'var(--border-strong)',
    
    # Accents
    '#4ecdc4': 'var(--accent-primary)',
    '#f49f75': 'var(--accent-secondary)',
    '#fbbf24': 'var(--accent-tertiary)',
    
    # Status
    '#ef4444': 'var(--alert-red)',
    'rgba(239,68,68,0.1)': 'var(--alert-red-bg)',
    'rgba(239,68,68,0.2)': 'var(--alert-red-bg)',
    '#22c55e': 'var(--success-green)',
    'rgba(34,197,94,0.1)': 'var(--success-green-bg)',
    '#38bdf8': 'var(--info-blue)',
    'rgba(56,189,248,0.1)': 'var(--info-blue-bg)',
    '#d97706': 'var(--warning-amber)',
    'rgba(217,119,6,0.1)': 'var(--warning-amber-bg)',
    
    # Semantic
    '#a78bfa': 'var(--accent-purple)',
    'rgba(167,139,250,0.1)': 'var(--accent-purple-bg)',
    '#2dd4bf': 'var(--accent-teal)',
    'rgba(45,212,191,0.1)': 'var(--accent-teal-bg)',
    '#f472b6': 'var(--accent-pink)',
    'rgba(244,114,182,0.1)': 'var(--accent-pink-bg)',
}

def normalize_color(val):
    return val.replace(' ', '').lower()

def replacement_logic(match):
    prop = match.group(1)
    val = match.group(2)
    
    # We only care about color, background, border, etc.
    if prop.strip().lower() in ['color', 'background', 'background-color', 'border', 'border-color', 'border-left', 'border-right', 'border-top', 'border-bottom', 'border-bottom-color']:
        norm = normalize_color(val)
        if norm in THEME_MAP:
            return f"{prop}:{THEME_MAP[norm]}"
            
        new_val = val
        for k in sorted(THEME_MAP.keys(), key=len, reverse=True):
            if k.startswith('#'):
                pattern = re.compile(re.escape(k), re.IGNORECASE)
                new_val = pattern.sub(THEME_MAP[k], new_val)
            elif k.startswith('rgba') or k.startswith('rgb'):
                nums = re.findall(r'[\d\.]+', k)
                if len(nums) == 4:
                    pattern_str = r'rgba\(\s*' + r'\s*,\s*'.join(nums[:3]) + r'\s*,\s*' + nums[3] + r'\s*\)'
                else:
                    pattern_str = r'rgb\(\s*' + r'\s*,\s*'.join(nums) + r'\s*\)'
                pattern = re.compile(pattern_str, re.IGNORECASE)
                new_val = pattern.sub(THEME_MAP[k], new_val)
                
        return f"{prop}:{new_val}"
    else:
        return match.group(0)

def process_style_attr(match):
    quote = match.group(1)
    style_content = match.group(2)
    new_style = re.sub(r'([a-zA-Z\-]+)\s*:([^;]+)', replacement_logic, style_content)
    return f'style={quote}{new_style}{quote}'

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
            # Safe check against paths
            if any(f"/{ex}/" in path.replace('\\', '/') for ex in exclude_dirs) or "Login Pages" in path:
                continue
                
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            new_content = re.sub(r'style=(["\'])(.*?)\1', process_style_attr, content, flags=re.IGNORECASE)
            
            if new_content != content:
                changed_files.append(path)
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                    
    print(f"Refactored color styling in {len(changed_files)} files.")
    for f in changed_files:
        print(f" - {f}")

if __name__ == "__main__":
    main()
