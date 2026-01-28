import json
from pathlib import Path

def inspect_structure():
    path = Path("/home/sms/ebook-converter/data/wittgenstein-index/propositions.json")
    print(f"Reading {path}...")
    
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print(f"Type: {type(data)}")
    print(f"Length: {len(data)}")
    
    if isinstance(data, list) and len(data) > 0:
        first = data[0]
        print(f"Item 0 type: {type(first)}")
        if isinstance(first, dict):
            print(f"Item 0 keys count: {len(first)}")
            print(f"Item 0 keys sample: {list(first.keys())[:5]}")
            
            # Check if it's the structure [ { "doc_id": [props], "doc_id2": [props] } ]
            # If so, we should convert it to [ {"id": "doc_id", "props": [props]}, ... ]
            
            # Or if it is [ {"ba...": [...]}, {"ab...": [...]} ] (list of single-key dicts)
            # We need to know if len(data) is 1 or many.
            # We know len(data) is 1 from previous tool output.
            
            if len(data) == 1:
                print("Structure appears to be [ { doc_id: [props], ... } ] (Single dict inside list)")
                # We want to flatten this to [ { "doc_id": key, "propositions": value }, ... ]
                
                big_dict = first
                new_list = []
                for k, v in big_dict.items():
                    new_list.append({"doc_id": k, "propositions": v})
                
                print(f"Converted to list of {len(new_list)} documents.")
                
                # Save this better structure
                with open(path, 'w', encoding='utf-8') as f:
                    json.dump(new_list, f, ensure_ascii=False, indent=2)
                print("Saved transformed structure.")

if __name__ == "__main__":
    inspect_structure()
