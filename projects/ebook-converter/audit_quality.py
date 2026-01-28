import os
from pathlib import Path
import json
import logging
import re

logging.basicConfig(level=logging.INFO, format='%(message)s')

def is_mojibake(text):
    # Simple heuristic: high density of replacement characters or unknown unicode
    if not text:
        return False
    replacement_chars = text.count('\ufffd')
    if len(text) > 0 and (replacement_chars / len(text)) > 0.05:
        return True
    return False

def audit_quality():
    print("🕵️‍♀️ 啟動質量審計程序 (Quality Audit)...")
    
    output_dir = Path("/home/sms/ebook-converter/data/markdown-output")
    bug_list_file = Path("/home/sms/ebook-converter/bug_list.json")
    
    bad_files = []
    
    # Error patterns
    error_patterns = [
        "Error code: 429",
        "Too Many Requests",
        "Internal Server Error",
        "Model overloaded",
        "I'm sorry, but I cannot",
        "I cannot fulfill this request",
        "failed to convert",
        "An error occurred"
    ]
    
    count = 0
    scanned = 0
    
    for root, dirs, files in os.walk(output_dir):
        for file in files:
            if not file.endswith(".md"):
                continue
                
            file_path = Path(root) / file
            scanned += 1
            
            try:
                # Check 1: File Size
                size = file_path.stat().st_size
                if size < 500: # Less than 500 bytes is suspicious for a book
                    bad_files.append({
                        "path": str(file_path),
                        "reason": "Too small (< 500 bytes)",
                        "size": size
                    })
                    continue
                
                # Check 2: Content Analysis (Read first 1KB)
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    
                    # Check for error messages
                    found_error = False
                    for pattern in error_patterns:
                        if pattern in content:
                            bad_files.append({
                                "path": str(file_path),
                                "reason": f"Contains error message: {pattern}",
                                "size": size
                            })
                            found_error = True
                            break
                    if found_error:
                        continue
                        
                    # Check for mojibake
                    if is_mojibake(content[:2000]):
                        bad_files.append({
                            "path": str(file_path),
                            "reason": "High Mojibake/Garbled text detected",
                            "size": size
                        })
                        continue
                        
            except Exception as e:
                print(f"Error reading {file}: {e}")
            
            if scanned % 1000 == 0:
                print(f"已掃描 {scanned} 個文件...", end='\r')

    print(f"\n✅ 審計完成。掃描了 {scanned} 個文件。")
    print(f"🐞 發現 {len(bad_files)} 個有問題的文件。")
    
    with open(bug_list_file, 'w', encoding='utf-8') as f:
        json.dump(bad_files, f, ensure_ascii=False, indent=2)
        
    if bad_files:
        print("\n🔍 問題文件示例:")
        for bad in bad_files[:5]:
            print(f"  - [{bad['reason']}] {Path(bad['path']).name}")
            
    return len(bad_files)

if __name__ == "__main__":
    audit_quality()
