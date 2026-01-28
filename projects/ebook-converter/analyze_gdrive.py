import os
from pathlib import Path
import json
import logging
from collections import defaultdict
import datetime

logging.basicConfig(level=logging.INFO, format='%(message)s')

def analyze_gdrive():
    print("🔍 啟動 Google Drive 文件深度審計...")
    
    gdrive_path = Path("/home/sms/mnt/gdrive")
    report_file = Path("/home/sms/ebook-converter/data/gdrive_analysis.json")
    
    if not gdrive_path.exists():
        print("❌ Google Drive 掛載點不存在")
        return

    stats = {
        "total_files": 0,
        "total_size_mb": 0,
        "by_type": defaultdict(int),
        "personal_docs": [],
        "media_files": [],
        "code_files": [],
        "long_filenames": [], # Potential voice-to-text or messy names
        "recent_files": []
    }
    
    # Keywords indicating personal content
    personal_keywords = ["简历", "resume", "身份证", "photo", "照片", "backup", "备份", "密码", "password", "private", "私", "我的", "me", "diary", "日记"]
    
    print(f"正在掃描: {gdrive_path}")
    
    try:
        for root, dirs, files in os.walk(gdrive_path):
            for file in files:
                file_path = Path(root) / file
                stats["total_files"] += 1
                
                try:
                    size_mb = file_path.stat().st_size / (1024 * 1024)
                    stats["total_size_mb"] += size_mb
                    mtime = datetime.datetime.fromtimestamp(file_path.stat().st_mtime)
                except:
                    size_mb = 0
                    mtime = datetime.datetime.min
                
                ext = file_path.suffix.lower()
                stats["by_type"][ext] += 1
                
                # Check for messy/long filenames (often from VTT or casual saves)
                if len(file) > 50:
                    stats["long_filenames"].append({
                        "name": file,
                        "path": str(file_path),
                        "length": len(file)
                    })
                
                # Categorize
                is_personal = False
                for kw in personal_keywords:
                    if kw in file.lower():
                        stats["personal_docs"].append(str(file_path))
                        is_personal = True
                        break
                
                if not is_personal:
                    if ext in ['.jpg', '.jpeg', '.png', '.heic', '.mp4', '.mov']:
                        stats["media_files"].append(str(file_path))
                    elif ext in ['.py', '.js', '.html', '.css', '.json', '.sh']:
                        stats["code_files"].append(str(file_path))
                        
                # Recent files (last 30 days)
                if (datetime.datetime.now() - mtime).days < 30:
                    stats["recent_files"].append(str(file_path))
                    
                if stats["total_files"] % 100 == 0:
                    print(f"已掃描 {stats['total_files']} 個文件...", end='\r')
                    
    except Exception as e:
        print(f"掃描過程中出錯: {e}")

    print(f"\n✅ 掃描完成。總計發現 {stats['total_files']} 個文件，共 {stats['total_size_mb']:.2f} MB")
    
    # Save raw data
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)
        
    # Print Summary Report
    print("\n" + "="*50)
    print("📊 Google Drive 分類審計報告")
    print("="*50)
    
    print(f"📂 文件類型分布 (Top 10):")
    sorted_types = sorted(stats["by_type"].items(), key=lambda x: x[1], reverse=True)
    for ext, count in sorted_types[:10]:
        print(f"  - {ext or 'No Ext'}: {count}")
        
    print(f"\n🔒 疑似個人敏感文件 ({len(stats['personal_docs'])}):")
    for f in stats["personal_docs"][:5]:
        print(f"  - {Path(f).name}")
    if len(stats['personal_docs']) > 5:
        print(f"  ...等共 {len(stats['personal_docs'])} 個")
        
    print(f"\n📸 媒體/照片文件 ({len(stats['media_files'])}):")
    print(f"  (建議歸檔到 Photos 或單獨存儲)")
    
    print(f"\n🗣️ 長文件名/語音筆記 ({len(stats['long_filenames'])}):")
    for item in stats["long_filenames"][:5]:
        print(f"  - {item['name'][:40]}...")
        
    print("\n💡 建議:")
    if stats['media_files']:
        print("- 發現大量媒體文件，建議使用 PhotoPrism 或 Google Photos 整理。")
    if stats['long_filenames']:
        print("- 發現許多長文件名（可能來自語音轉文字），建議使用 AI 重命名整理。")
    print("- 個人文件建議單獨加密或移至 Private 文件夾。")

if __name__ == "__main__":
    analyze_gdrive()
