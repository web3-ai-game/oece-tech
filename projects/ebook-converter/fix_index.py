import json
import re
from pathlib import Path

def fix_json_file(file_path):
    print(f"🔧 Attempting to fix {file_path}...")
    path = Path(file_path)
    
    if not path.exists():
        print("File not found.")
        return

    # Read raw content
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    original_len = len(content)
    print(f"Original size: {original_len} chars")

    # 1. Fix concatenated lists "[...][...]" -> "[..., ...]"
    # This happens if the script appended a new list without parsing existing
    if '][' in content:
        print("Found concatenated lists pattern '][', fixing...")
        content = content.replace('][', ',')
    
    # 2. Fix potential trailing comma before closing "...,]" -> "...]"
    # Regex is risky on huge files, let's just do simple check
    # if content.endswith(",]"): ...
    
    # 3. Try to load
    try:
        data = json.loads(content)
        print("✅ JSON parsed successfully after simple fixes.")
        
        # Save back cleaned version
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("Saved cleaned JSON.")
        return True
        
    except json.JSONDecodeError as e:
        print(f"Still invalid: {e}")
        # If simple fix didn't work, it might be more complex corruption.
        # Let's try to recover valid objects using regex finding all {...}
        # This is a fallback and might be slow but effective for recovering data.
        
        print("⚠️ Attempting deep recovery (extracting objects)...")
        # Pattern for minimal json object. This is hard with nested braces.
        # Instead, let's just try to sanitize common issues.
        
        # If the file was truncated, it might end abruptly. 
        # But we saw the tail was valid "]"
        
        # Maybe it has `}\n{` pattern (jsonl style but inside a list or not)?
        # If the file content is `[{...}\n{...}]` that implies missing comma.
        
        # Let's try to insert missing commas between objects
        # Look for `}\s*{` and replace with `}, {`
        new_content = re.sub(r'\}\s*\{', '}, {', content)
        
        if new_content != content:
            print("Found missing commas between objects, fixing...")
            try:
                data = json.loads(new_content)
                print("✅ JSON parsed successfully after deep recovery.")
                with open(path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                return True
            except json.JSONDecodeError as e2:
                print(f"Deep recovery failed: {e2}")
    
    return False

if __name__ == "__main__":
    fix_json_file("/home/sms/ebook-converter/data/wittgenstein-index/propositions.json")
