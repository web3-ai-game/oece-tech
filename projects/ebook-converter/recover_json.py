import json
import os
from pathlib import Path

def recover_json_list(file_path):
    print(f"🚑 Starting robust recovery for {file_path}...")
    input_path = Path(file_path)
    output_path = input_path.parent / "propositions_recovered.json"
    
    if not input_path.exists():
        print("File not found.")
        return

    # Backup original
    backup_path = input_path.parent / "propositions.json.bak"
    if not backup_path.exists():
        print("Creating backup...")
        os.rename(input_path, backup_path)
        source_path = backup_path
    else:
        source_path = backup_path
        print("Using existing backup as source.")

    recovered_items = []
    
    with open(source_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    # Naive cleanup first
    # Replace concatenated lists `][` with `,`
    # This was likely the main issue
    content = content.replace('][', ',')
    
    # Remove leading [ and trailing ] for stream processing if needed, 
    # but let's try to just find all {...} objects using a simple state machine or regex
    # Regex for JSON objects is hard due to nesting. 
    # However, since this is a flat list of simple objects (mostly), we might get away with it?
    # No, propositions have "content" which might contain anything.
    
    # Better approach: Use json.JSONDecoder.raw_decode
    decoder = json.JSONDecoder()
    idx = 0
    length = len(content)
    
    # Skip potential leading '['
    while idx < length and content[idx] in ('[', ' ', '\n', '\r', '\t', ','):
        idx += 1
        
    count = 0
    errors = 0
    
    print("Parsing objects...")
    while idx < length:
        # Skip whitespace and commas
        while idx < length and content[idx] in (' ', '\n', '\r', '\t', ','):
            idx += 1
            
        if idx >= length:
            break
            
        if content[idx] == ']':
            # End of list
            break
            
        try:
            obj, next_idx = decoder.raw_decode(content, idx)
            recovered_items.append(obj)
            idx = next_idx
            count += 1
            if count % 10000 == 0:
                print(f"Recovered {count} items...", end='\r')
        except json.JSONDecodeError:
            # Try to skip one char and continue? Or find next '{'
            # print(f"Error at {idx}, skipping...")
            errors += 1
            idx += 1
            # fast forward to next '{'
            while idx < length and content[idx] != '{':
                idx += 1
                
    print(f"\n✅ Recovery complete.")
    print(f"Recovered: {len(recovered_items)}")
    print(f"Skipped/Errors: {errors}")
    
    with open(input_path, 'w', encoding='utf-8') as f:
        json.dump(recovered_items, f, ensure_ascii=False, indent=2)
        
    print(f"Saved to {input_path}")

if __name__ == "__main__":
    recover_json_list("/home/sms/ebook-converter/data/wittgenstein-index/propositions.json")
