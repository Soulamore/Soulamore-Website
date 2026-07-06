import os
import shutil

inbox_dir = r"c:\Users\adity\Desktop\Projects\Soulamore-Website\reports\testing\01-inbox"

# 1. Rename lowercase Aryan to uppercase ARYAN
old_aryan = os.path.join(inbox_dir, "Aryan")
new_aryan = os.path.join(inbox_dir, "ARYAN")

if os.path.exists(old_aryan):
    temp_path = old_aryan + "_temp"
    # Rename to temp first
    os.rename(old_aryan, temp_path)
    # Rename to uppercase ARYAN
    os.rename(temp_path, new_aryan)
    print(f"Renamed case on Windows: {old_aryan} -> {new_aryan}")

# 2. Create folders for all 4 team members
members = ["ADITYA", "ABHISHEK", "ARYAN", "YASHMEET"]
for member in members:
    path = os.path.join(inbox_dir, member)
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, ".gitkeep"), "w") as f:
        f.write("# Keep folder tracked\n")
    print(f"Initialized inbox folder for: {member}")
