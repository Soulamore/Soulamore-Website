import os
import re
import shutil

# --- 1. Move Backup Files ---
backup_dir = "_BACKUPS/Cleanup_Mar_2026"
os.makedirs(backup_dir, exist_ok=True)

backup_patterns = [".bak", ".backup", "backup", "_backup", "copy", "wip", "old"]

def is_backup_file(filename):
    lower_name = filename.lower()
    if lower_name.endswith(".html"):
        for pattern in backup_patterns:
            if pattern in lower_name and not lower_name.startswith("back"):
                return True
    return False

moved_backups = 0
for root, dirs, files in os.walk("."):
    if ".git" in root or "node_modules" in root or "_BACKUPS" in root:
        continue
    for file in files:
        if is_backup_file(file):
            src = os.path.join(root, file)
            # Flatten path for backup folder to avoid deep nesting issues
            safe_name = root.replace(".\\", "").replace("\\", "_") + "_" + file
            if safe_name.startswith("_"): safe_name = safe_name[1:]
            dst = os.path.join(backup_dir, safe_name)
            try:
                shutil.move(src, dst)
                moved_backups += 1
                print(f"Moved to backup: {src} -> {dst}")
            except Exception as e:
                print(f"Could not move {src}: {e}")

print(f"\nMoved {moved_backups} backup files to {backup_dir}")

# --- 2. Update Links for transparency.html and community-calendar.html ---

moves = {
    "community/transparency.html": "company/transparency.html"
}

moved_files_abs = set([os.path.abspath(path) for path in moves.values()])
updated_links = 0

for root, dirs, files in os.walk("."):
    if ".git" in root or "node_modules" in root or "_BACKUPS" in root:
        continue
        
    for file in files:
        if not file.endswith(".html"):
            continue
            
        file_path = os.path.join(root, file)
        abs_path = os.path.abspath(file_path)
        
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            new_content = content
            
            # Since transparency moved from community (depth 1) to company (depth 1), depth doesn't change
            # We just need to replace the external links across the whole site
            
            for old_path, new_path in moves.items():
                # E.g. replace "community/transparency.html" with "company/transparency.html"
                new_content = new_content.replace(old_path, new_path)
                # E.g. replace "../community/transparency.html" with "../company/transparency.html"
                new_content = new_content.replace(f"../{old_path}", f"../{new_path}")

            if content != new_content:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                updated_links += 1
                print(f"Updated links in {file_path}")
        except Exception as e:
            print(f"Could not process {file_path}: {e}")

print(f"\nUpdated links in {updated_links} files.")
