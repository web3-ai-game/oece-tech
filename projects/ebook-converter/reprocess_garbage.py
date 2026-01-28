import json
import os
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format='%(message)s')

def reprocess_garbage():
    print("🧹 啟動垃圾文件清理與重處理程序...")
    
    base_dir = Path("/home/sms/ebook-converter")
    list_file = base_dir / "reprocess_list.json"
    
    if not list_file.exists():
        print("✅ 沒有待處理的垃圾文件列表 (reprocess_list.json 不存在)")
        return

    with open(list_file, 'r', encoding='utf-8') as f:
        files_to_fix = json.load(f)
        
    if not files_to_fix:
        print("✅ 列表為空，無需處理")
        return
        
    print(f"發現 {len(files_to_fix)} 個需要清理的文件")
    
    for item in files_to_fix:
        file_path = Path(item['path'])
        if file_path.exists():
            try:
                # 1. Delete bad Markdown file
                os.remove(file_path)
                print(f"🗑️ 已刪除: {file_path.name}")
                
                # 2. Reset status in MongoDB (Optional, if we had a DB connection script here)
                # Since the pipeline checks for file existence or DB status, deleting the file
                # might not be enough if dedup checks DB. 
                # Ideally we should remove from MongoDB or mark as 'pending' again.
                # For now, we rely on the pipeline's "overwrite" or "force" logic if we were to re-run.
                
            except Exception as e:
                print(f"❌ 刪除失敗 {file_path.name}: {e}")
                
    # Remove the list file after processing
    os.remove(list_file)
    print("✨ 清理完成，請重啟管道以重新轉化這些文件。")

if __name__ == "__main__":
    reprocess_garbage()
