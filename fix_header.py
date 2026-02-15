
import os
import re

ROOT_DIR = r"g:\Other computers\My laptop\Get Rich Quick Plans\Aditya Harsh\Soulamore\01 - Website\02- Version 2\HTML Pages\New\Soulamore-Website"

# Standard Nav Structure (Label, Path relative to ROOT, Submenu Items)
NAV_STRUCTURE = [
    {"label": "Home", "path": "index.html", "sub": [
         {"label": "Get Help Now", "path": "get-help-now.html"},
         {"label": "The Vent Box", "path": "vent-box.html"}
    ]},
    {"label": "Campus", "path": "soulamore-campus.html", "sub": [
        {"label": "What is Campus?", "path": "campus/what-is-campus.html"},
        {"label": "Institutions", "path": "campus/institutions.html"},
        {"label": "Student Resources", "path": "student-resources.html"},
        {"label": "Campus Ambassadors", "path": "campus/campus-ambassadors.html"}
    ]},
    {"label": "Away", "path": "soulamore-away.html", "sub": [
        {"label": "Who It's For", "path": "soulamore-away/who-its-for.html"},
        {"label": "Resources", "path": "soulamore-away/resources.html"}
    ]},
    {"label": "Confession Box", "path": "confession-box.html", "sub": [
        {"label": "Guidelines", "path": "confession-box/guidelines.html"}
    ]},
    {"label": "Support Groups", "path": "support-groups.html", "sub": [
        {"label": "Community Calendar", "path": "community-calendar.html"}
    ]}, 
    {"label": "Peers", "path": "our-peers/index.html", "sub": None},
    {"label": "Join Us", "path": "join-us/index.html", "sub": [
        {"label": "Join as Peer", "path": "join-us/peer.html"},
        {"label": "Join as Psychologist", "path": "join-us/psychologist.html"}
    ]},
    {"label": "Community", "path": "#", "sub": [
        {"label": "Blogs", "path": "blogs.html"},
        {"label": "Forum", "path": "forum.html"}
    ]},
    {"label": "About", "path": "about.html", "sub": None},
    {"label": "Contact", "path": "contact.html", "sub": None}
]

def get_rel_path(from_file, to_path):
    if to_path == "#": return "#"
    
    from_dir = os.path.dirname(from_file)
    to_abs = os.path.join(ROOT_DIR, to_path)
    rel = os.path.relpath(to_abs, from_dir)
    return rel.replace("\\", "/")

def generate_nav_html(current_file_path):
    html = '<nav class="nav-links">\n'
    for item in NAV_STRUCTURE:
        href = get_rel_path(current_file_path, item["path"])
        active_class = ""
        curr_name = os.path.basename(current_file_path)
        target_name = os.path.basename(item["path"])
        
        if curr_name == target_name and item["path"] != "#":
             active_class = ' class="active"'
             
        if item["sub"]:
             for sub in item["sub"]:
                 sub_name = os.path.basename(sub["path"])
                 if curr_name == sub_name:
                     active_class = ' class="active"'
        
        if item["sub"]:
            html += '                        <div class="dropdown">\n'
            html += f'                            <a href="{href}"{active_class}>{item["label"]} <i class="fas fa-chevron-down" style="font-size:0.7rem; margin-left:5px;"></i></a>\n'
            html += '                            <div class="dropdown-content">\n'
            for sub in item["sub"]:
                sub_href = get_rel_path(current_file_path, sub["path"])
                html += f'                                <a href="{sub_href}">{sub["label"]}</a>\n'
            html += '                            </div>\n'
            html += '                        </div>\n'
        else:
            html += f'                        <a href="{href}"{active_class}>{item["label"]}</a>\n'
    html += '                    </nav>'
    return html

def process_files():
    count = 0
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                if "Login Pages" in filepath or "Soulbot.html" in filepath or "404.html" in filepath: continue
                if "profile.html" in filepath or ("psychologist.html" in filepath and "join-us" not in filepath): continue
                
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                
                pattern = re.compile(r'<nav class="nav-links">.*?</nav>', re.DOTALL)
                if pattern.search(content):
                    new_nav = generate_nav_html(filepath)
                    new_content = pattern.sub(new_nav, content)
                    if new_content != content:
                        with open(filepath, "w", encoding="utf-8") as f:
                            f.write(new_content)
                        print(f"Updated: {file}")
                        count += 1
                else:
                    print(f"Skipped (No Header Found): {file}")
    print(f"\n[SUCCESS] Standardized header in {count} files.")

if __name__ == "__main__":
    process_files()
