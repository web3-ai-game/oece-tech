import json
import os
from pathlib import Path
import math

def split_large_json(file_path, chunk_size_mb=45):
    """Splits a large JSON array file into smaller chunks for Git."""
    file_path = Path(file_path)
    if not file_path.exists():
        print(f"Skipping {file_path.name}, not found.")
        return

    file_size_mb = file_path.stat().st_size / (1024 * 1024)
    if file_size_mb < chunk_size_mb:
        print(f"No need to split {file_path.name} ({file_size_mb:.2f} MB)")
        return

    print(f"Splitting {file_path.name} ({file_size_mb:.2f} MB) into chunks...")
    
    # Load the big json
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not isinstance(data, list):
            print(f"Warning: {file_path.name} is not a JSON list, cannot split safely by item.")
            return

        total_items = len(data)
        # Estimate items per chunk
        # This is rough, assuming uniform item size
        chunks_count = math.ceil(file_size_mb / chunk_size_mb)
        items_per_chunk = math.ceil(total_items / chunks_count)
        
        print(f"Total items: {total_items}, splitting into ~{chunks_count} chunks of ~{items_per_chunk} items.")

        for i in range(chunks_count):
            start = i * items_per_chunk
            end = start + items_per_chunk
            chunk_data = data[start:end]
            
            chunk_filename = file_path.parent / f"{file_path.stem}_part_{i+1:03d}.json"
            with open(chunk_filename, 'w', encoding='utf-8') as f:
                json.dump(chunk_data, f, ensure_ascii=False, indent=2)
            print(f"  Created {chunk_filename.name}")
            
        print(f"✅ Split complete.")
        
    except Exception as e:
        print(f"Error splitting {file_path.name}: {e}")

def prepare_backup():
    base_dir = Path("/home/sms/ebook-converter")
    data_dir = base_dir / "data"
    index_dir = data_dir / "wittgenstein-index"
    
    # 1. Split propositions.json
    split_large_json(index_dir / "propositions.json")
    
    # 2. Update .gitignore
    gitignore_path = base_dir / ".gitignore"
    if gitignore_path.exists():
        with open(gitignore_path, 'a', encoding='utf-8') as f:
            f.write("\n# Large file splits\ndata/wittgenstein-index/propositions.json\n")
    
    print("Backup preparation complete.")

if __name__ == "__main__":
    prepare_backup()
