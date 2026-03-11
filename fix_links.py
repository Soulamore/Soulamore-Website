import os
import re

moves = {
    "blogs.html": "blogs/blogs.html",
    "blog-detail.html": "blogs/blog-detail.html",
    "author.html": "blogs/author.html",
    "forum.html": "forum/forum.html",
    "support-groups.html": "support-groups/support-groups.html",
    "expats-germany.html": "support-groups/expats-germany.html",
    "habits-compulsions.html": "support-groups/habits-compulsions.html",
    "neurodivergence.html": "support-groups/neurodivergence.html",
    "relationships.html": "support-groups/relationships.html",
    "students-india.html": "support-groups/students-india.html",
    "women-circles.html": "support-groups/women-circles.html"
}

moved_files_abs = set([os.path.abspath(os.path.join("community", path)) for path in moves.values()])

for root, dirs, files in os.walk("."):
    if ".git" in root or "node_modules" in root or "_BACKUPS" in root:
        continue
        
    for file in files:
        if not file.endswith(".html"):
            continue
            
        file_path = os.path.join(root, file)
        abs_path = os.path.abspath(file_path)
        
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        new_content = content
        
        is_moved_file = abs_path in moved_files_abs
        
        if is_moved_file:
            # 1. Depth increased by 1: `../` -> `../../`
            new_content = re.sub(r'(href|src|action)=([\'"])\.\./', r'\1=\2../../', new_content)
            
            # 2. Sibling links that did not have `./` or `../`
            # e.g., href="blogs.html" or href="transparency.html"
            new_content = re.sub(r'(href|src)=([\'"])(?!http|mailto|tel|#|\.|/)([^#\?\'"]+\.html)(.*?)\2', 
                     lambda m: f'{m.group(1)}={m.group(2)}../{moves.get(m.group(3), m.group(3))}{m.group(4)}{m.group(2)}', 
                     new_content)
        
        # 3. Global fixes for external files that referenced `community/something.html`
        for old_name, new_path in moves.items():
            new_content = new_content.replace(f"community/{old_name}", f"community/{new_path}")

        if content != new_content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {file_path}")

print("Done updating links!")
