import os
import re

# List of directories to ignore
IGNORE_DIRS = [
    'node_modules',
    '.git',
    '.firebase',
    'functions',
    'tmp',
    '_BACKUPS',
    '.agent',
    '.claude',
    '.codebuddy',
    '.codex',
    '.continue',
    '.cursor',
    '.kiro',
    '.opencode',
    '.qoder',
    '.roo',
    '.trae',
    '.vscode',
    '.windsurf',
    'Git Tools Open Source',
    'Claude Result',
    'claude_handoff_profiles',
    'knowledge source',
    'claude give off'
]

def find_html_files(root_dir):
    html_files = []
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Filter out ignored directories
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        for f in filenames:
            if f.endswith('.html'):
                html_files.append(os.path.join(dirpath, f))
    return html_files

def audit_html_file(file_path, root_dir):
    relative_page_path = os.path.relpath(file_path, root_dir).replace('\\', '/')
    page_dir = os.path.dirname(relative_page_path)
    
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    errors = []
    warnings = []
    
    # 1. Check if components.js is referenced
    has_components = 'components.js' in content
    
    # Check script tags
    script_srcs = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', content, re.IGNORECASE)
    for src in script_srcs:
        if 'components.js' in src:
            # Check if relative path to components.js is correct
            # Resolve script path
            clean_src = src.split('?')[0]
            if clean_src.startswith('/'):
                script_rel_path = os.path.normpath(clean_src.lstrip('/')).replace('\\', '/')
            else:
                script_rel_path = os.path.normpath(os.path.join(page_dir, clean_src)).replace('\\', '/')
            
            expected_path = 'assets/js/components.js'
            if script_rel_path != expected_path:
                errors.append(f"Broken components.js reference: '{src}' resolves to '{script_rel_path}' instead of '{expected_path}'")

    # 2. Check stylesheet references
    css_hrefs = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']', content, re.IGNORECASE)
    css_hrefs += re.findall(r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']stylesheet["\']', content, re.IGNORECASE)
    for href in css_hrefs:
        if href.startswith(('http://', 'https://', '//')):
            continue
        # Strip query parameters
        clean_href = href.split('?')[0]
        if clean_href.startswith('/'):
            resolved_path = os.path.normpath(os.path.join(root_dir, clean_href.lstrip('/')))
        else:
            resolved_path = os.path.normpath(os.path.join(root_dir, page_dir, clean_href))
            
        if not os.path.exists(resolved_path):
            rel_resolved = os.path.relpath(resolved_path, root_dir).replace('\\', '/')
            errors.append(f"Broken stylesheet link: '{href}' resolves to non-existent '{rel_resolved}'")

    # 3. Check anchor tags (links)
    # Match hrefs inside <a ...> tags
    a_hrefs = re.findall(r'<a[^>]+href=["\']([^"\']+)["\']', content, re.IGNORECASE)
    for href in a_hrefs:
        # Ignore external links, mailto, tel, anchors
        if href.startswith(('http://', 'https://', '//', 'mailto:', 'tel:', '#', 'javascript:')):
            continue
        
        # Skip dynamic template placeholders (e.g. ${...} or {{...}})
        if '${' in href or '{{' in href:
            continue
            
        # Strip query parameters and hashes
        clean_href = href.split('?')[0].split('#')[0]
        if not clean_href:
            continue
            
        if clean_href.startswith('/'):
            resolved_path = os.path.normpath(os.path.join(root_dir, clean_href.lstrip('/')))
        else:
            resolved_path = os.path.normpath(os.path.join(root_dir, page_dir, clean_href))
        
        # Check if resolved path is a file or a directory
        if not os.path.exists(resolved_path):
            # Try appending index.html if it's a directory reference (e.g. 'journal/')
            if os.path.isdir(resolved_path) or clean_href.endswith('/'):
                resolved_index = os.path.join(resolved_path, 'index.html')
                if os.path.exists(resolved_index):
                    continue
            rel_resolved = os.path.relpath(resolved_path, root_dir).replace('\\', '/')
            errors.append(f"Broken anchor link: '{href}' resolves to non-existent '{rel_resolved}'")

    # 4. Check shell structure if components.js is present
    if has_components:
        # Check for header element with id 'main-header'
        if 'id="main-header"' not in content and "id='main-header'" not in content:
            warnings.append("Header placeholder <header id=\"main-header\"></header> not found (components.js is loaded).")
        # Check for footer element
        if '<footer' not in content and 'id="main-footer"' not in content:
            warnings.append("Footer element or placeholder <footer id=\"main-footer\"></footer> not found (components.js is loaded).")

    return errors, warnings

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    html_files = find_html_files(root_dir)
    print(f"Found {len(html_files)} HTML files to audit...")
    
    total_errors = 0
    total_warnings = 0
    
    report_lines = []
    
    for file_path in html_files:
        errors, warnings = audit_html_file(file_path, root_dir)
        rel_path = os.path.relpath(file_path, root_dir).replace('\\', '/')
        
        if errors or warnings:
            file_link = file_path.replace('\\', '/')
            report_lines.append(f"\n📄 File: [{rel_path}](file:///{file_link})")
            for err in errors:
                report_lines.append(f"  - Error: {err}")
                total_errors += 1
            for warn in warnings:
                report_lines.append(f"  - Warning: {warn}")
                total_warnings += 1
                
    print(f"Audit completed: {total_errors} errors and {total_warnings} warnings found.")
    
    # Save results to a report file
    report_file_path = os.path.join(root_dir, 'reports', 'ADITYA', 'ANTIGRAVITY', '063_2026-06-14_ANTIGRAVITY_Website_Links_Audit.md')
    os.makedirs(os.path.dirname(report_file_path), exist_ok=True)
    
    with open(report_file_path, 'w', encoding='utf-8') as f:
        f.write("# Web Workspace Links & Navigation Audit\n\n")
        f.write(f"Generated at: 2026-06-14\n")
        f.write(f"Total HTML Files Checked: {len(html_files)}\n")
        f.write(f"Total Errors (Broken Links): {total_errors}\n")
        f.write(f"Total Warnings: {total_warnings}\n\n")
        f.write("## Detailed Audit Log\n")
        if report_lines:
            f.write("\n".join(report_lines))
        else:
            f.write("\n🎉 No issues found! Clean workspace!")
            
    print(f"Report written to: {report_file_path}")

if __name__ == '__main__':
    main()
