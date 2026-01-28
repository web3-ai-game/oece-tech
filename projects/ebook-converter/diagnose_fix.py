import re

def patch_json():
    file_path = "/home/sms/ebook-converter/data/wittgenstein-index/propositions.json"
    print(f"Reading {file_path}...")
    
    with open(file_path, 'rb') as f:
        content = f.read()
    
    print(f"Read {len(content)} bytes.")
    
    # Check for concatenated lists
    # The pattern is ] followed by optional whitespace then [
    # We want to replace it with ,
    
    pattern = b']\s*\['
    match = re.search(pattern, content)
    
    if match:
        print(f"Found concatenated lists at byte {match.start()}. Fixing...")
        # Replace ]\n[ or ][ with , 
        # Actually we want to merge the lists. 
        # ...item}][{item... -> ...item}, {item...
        # So replace match with b', '
        
        # We need to be careful about matching bytes.
        # simpler: replace b']\n[' with b',\n' or b'][' with b','
        
        new_content = re.sub(pattern, b',', content)
        
        # Also check for trailing commas before the final ]
        # pattern: ,\s*] -> ]
        # new_content = re.sub(b',\s*]', b']', new_content) 
        # Regex on 300MB might be slow but let's try.
        
        with open(file_path, 'wb') as f:
            f.write(new_content)
        print("File patched and saved.")
        return True
    else:
        print("No concatenated lists found.")
        
    # Check for trailing comma at the very end
    # Looking for , followed by whitespace and ] at the end of file
    # We can check the last few bytes
    end_window = content[-100:]
    print(f"Tail: {end_window}")
    
    # If we see ...}, ] or ...},]
    if b',]' in content or b', ]' in content or b',\n]' in content:
         print("Found trailing comma? Attempting global regex fix (risky but necessary)")
         # This regex is too broad, it might match inside strings if we are unlucky (unlikely for json structure)
         # b',\s*]' -> b']'
         new_content = re.sub(b',\s*\]', b']', content)
         if len(new_content) != len(content):
             print("Fixed trailing commas.")
             with open(file_path, 'wb') as f:
                f.write(new_content)
             return True

    print("No obvious simple structural errors found via byte regex.")
    return False

if __name__ == "__main__":
    patch_json()
