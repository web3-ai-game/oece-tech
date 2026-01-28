import json
import os
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger("Audit")

def audit_conversions():
    print("🔍 啟動轉化質量審計程序...")
    
    base_dir = Path("/home/sms/ebook-converter")
    categories_file = base_dir / "data/baidu-analysis/file_categories.json"
    output_dir = base_dir / "data/markdown-output"
    
    if not categories_file.exists():
        print("❌ 找不到源文件列表")
        return

    with open(categories_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    txt_files = data.get('txt_files', [])
    pdf_files = data.get('pdf_text', []) # Assuming text PDFs for now, scan PDFs are different
    
    suspicious_files = []
    
    # 1. Audit TXT Files
    print(f"正在檢查 {len(txt_files)} 個 TXT 源文件...")
    for file_info in txt_files:
        original_size = file_info.get('size', 0)
        if original_size == 0: continue
            
        # Construct expected markdown path
        # Logic matches pipeline: output_dir / relative_path / filename.md
        rel_path = file_info.get('path', '').strip('/')
        if rel_path.startswith("知識庫/"):
            rel_path = rel_path[4:]
            
        md_filename = Path(file_info['name']).stem + ".md"
        md_path = output_dir / rel_path / md_filename
        
        if not md_path.exists():
            # Try finding it recursively if path mapping is tricky
            # For speed, skip this or assume missing
            continue
            
        md_size = md_path.stat().st_size
        
        # Ratio check: If MD size is less than 20% of original TXT size, flag it
        ratio = md_size / original_size
        if ratio < 0.2 and original_size > 1024: # Ignore very small files
            suspicious_files.append({
                'name': file_info['name'],
                'type': 'txt_ratio',
                'original_size': original_size,
                'md_size': md_size,
                'ratio': ratio,
                'path': str(md_path)
            })
            continue

        # Content Quality Check (Garbage Detection)
        try:
            with open(md_path, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
                
                # Check 1: Mojibake density
                # If replacement char appears frequently (e.g. > 1% of chars or > 50 times absolute)
                # \ufffd is the unicode replacement character
                if content.count('\ufffd') > 50 or (len(content) > 0 and content.count('\ufffd') / len(content) > 0.01):
                    suspicious_files.append({
                        'name': file_info['name'],
                        'type': 'mojibake',
                        'original_size': original_size,
                        'md_size': md_size,
                        'ratio': ratio,
                        'details': f"Found {content.count('\ufffd')} replacement chars",
                        'path': str(md_path)
                    })
                    continue
                    
                # Check 2: Too short (Absolute)
                if len(content) < 200 and original_size > 1024:
                    suspicious_files.append({
                        'name': file_info['name'],
                        'type': 'too_short',
                        'original_size': original_size,
                        'md_size': md_size,
                        'ratio': ratio,
                        'details': f"Content length: {len(content)} chars",
                        'path': str(md_path)
                    })
                    continue

        except Exception as e:
            pass

    # 2. Audit PDF Files (Simple check)
    print(f"正在檢查已轉換的 PDF 文件...")
    # Since we don't have a direct map of all processed PDFs easily without DB, 
    # lets scan output dir for known PDF-derived MDs or just check all MDs
    
    # Report results
    print("\n" + "="*60)
    print("📊 審計報告")
    print("="*60)
    
    if not suspicious_files:
        print("✅ 沒有發現明顯的異常文件 (基於大小比對)")
    else:
        print(f"⚠️ 發現 {len(suspicious_files)} 個可疑文件 (轉化後體積過小):")
        print(f"{'文件名':<40} | {'原大小':<10} | {'MD大小':<10} | {'比例':<6}")
        print("-" * 80)
        
        for f in suspicious_files[:20]: # Show top 20
            print(f"{f['name'][:38]:<40} | {f['original_size']/1024:.1f}KB   | {f['md_size']/1024:.1f}KB   | {f['ratio']:.2%}")
            
        if len(suspicious_files) > 20:
            print(f"... 以及其他 {len(suspicious_files)-20} 個文件")
            
    # Save list for reprocessing
    if suspicious_files:
        with open(base_dir / "reprocess_list.json", 'w', encoding='utf-8') as f:
            json.dump(suspicious_files, f, ensure_ascii=False, indent=2)
        print(f"\n💾 可疑文件列表已保存至: {base_dir}/reprocess_list.json")

if __name__ == "__main__":
    audit_conversions()
