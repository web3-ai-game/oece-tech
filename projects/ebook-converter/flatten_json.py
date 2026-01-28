import json
from pathlib import Path

def flatten_propositions():
    path = Path("/home/sms/ebook-converter/data/wittgenstein-index/propositions.json")
    print(f"Reading {path}...")
    
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print(f"Loaded data type: {type(data)}")
    print(f"Length: {len(data)}")
    
    if isinstance(data, list) and len(data) == 1 and isinstance(data[0], list):
        print("Detected nested list [[...]]. Flattening...")
        flat_data = data[0]
        print(f"New length: {len(flat_data)}")
        
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(flat_data, f, ensure_ascii=False, indent=2)
        print("✅ Flattened and saved.")
        return True
    
    print("Data structure seems correct or unexpected (not a single nested list).")
    return False

if __name__ == "__main__":
    flatten_propositions()
