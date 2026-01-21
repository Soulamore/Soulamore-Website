
import re

def validate_css_structure(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract style blocks
    style_blocks = re.findall(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)
    
    print(f"Found {len(style_blocks)} style blocks.")

    for i, block in enumerate(style_blocks):
        print(f"\n--- Checking Style Block {i+1} ---")
        
        # Check comments
        open_comments = block.count('/*')
        close_comments = block.count('*/')
        print(f"Comments: Open={open_comments}, Close={close_comments}")
        if open_comments != close_comments:
            print("❌ ERROR: Unbalanced comments!")
            # Find the unclosed comment
            # (Simple check)
        
        # Check braces (ignoring content inside comments)
        # Remove comments for brace checking
        clean_block = re.sub(r'/\*.*?\*/', '', block, flags=re.DOTALL)
        
        open_braces = clean_block.count('{')
        close_braces = clean_block.count('}')
        print(f"Braces: Open={open_braces}, Close={close_braces}")
        
        if open_braces != close_braces:
            print("❌ ERROR: Unbalanced braces!")
            
        # Check for unclosed media queries check
        # This is harder, but brace count helps.

if __name__ == "__main__":
    validate_css_structure(r"g:\Other computers\My laptop\Get Rich Quick Plans\Aditya Harsh\Soulamore\01 - Website\02- Version 2\HTML Pages\New\Soulamore-Website\index.html")
