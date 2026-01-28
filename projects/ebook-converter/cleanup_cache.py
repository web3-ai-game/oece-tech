#!/usr/bin/env python3
import os
from pathlib import Path

cache_dir = Path("/home/sms/ebook-converter/data/pipeline-cache")
output_dir = Path("/home/sms/ebook-converter/data/markdown-output")

def clean_processed_files():
    if not cache_dir.exists():
        print("Cache directory does not exist.")
        return

    deleted_count = 0
    freed_space = 0

    print(f"Scanning {cache_dir} for processed files...")

    for file_path in cache_dir.glob("*"):
        if not file_path.is_file():
            continue
            
        # Check if corresponding MD exists
        # Handle cases where extension might be different or double extension
        # Simple assumption: stem matches
        md_name = file_path.stem + ".md"
        md_path = output_dir / md_name
        
        if md_path.exists():
            try:
                size = file_path.stat().st_size
                file_path.unlink()
                deleted_count += 1
                freed_space += size
                print(f"Deleted processed file: {file_path.name}")
            except Exception as e:
                print(f"Error deleting {file_path.name}: {e}")
    
    print(f"\nCleanup complete.")
    print(f"Files deleted: {deleted_count}")
    print(f"Space freed: {freed_space / 1024 / 1024:.2f} MB")

if __name__ == "__main__":
    clean_processed_files()
