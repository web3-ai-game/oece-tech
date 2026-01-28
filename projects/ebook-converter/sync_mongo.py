import os
from pathlib import Path
import logging
from mongodb_handler import MongoDBHandler

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

def sync_mongo_with_disk():
    print("🔄 啟動 MongoDB 與磁盤同步程序 (Sync Protocol)...")
    
    mongo = MongoDBHandler()
    if not mongo.enabled:
        print("❌ MongoDB 未啟用，跳過同步。")
        return

    output_dir = Path("/home/sms/ebook-converter/data/markdown-output")
    
    # 1. Get all documents from Mongo
    print("📊 正在讀取 MongoDB 索引...")
    cursor = mongo.db.documents.find({}, {"filename": 1, "content": 1}) # Fetch content length check too?
    
    mongo_files = []
    ids_to_delete = []
    
    count = 0
    missing_on_disk = 0
    small_content = 0
    
    for doc in cursor:
        count += 1
        filename = doc.get('filename')
        if not filename:
            continue
            
        file_path = output_dir / f"{filename}.md"
        
        # Check 1: File missing on disk
        if not file_path.exists():
            print(f"❌ 磁盤缺失: {filename} (準備從 DB 移除)")
            ids_to_delete.append(doc['_id'])
            missing_on_disk += 1
            continue
            
        # Check 2: Content too small in DB (Double check)
        content = doc.get('content', '')
        if len(content) < 500:
             print(f"⚠️ DB內容過短: {filename} ({len(content)} chars) (準備從 DB 移除)")
             ids_to_delete.append(doc['_id'])
             small_content += 1
             # Also delete from disk if exists to be safe?
             try:
                 if file_path.exists():
                     os.remove(file_path)
             except:
                 pass
    
    print(f"\n審計結果:")
    print(f"總文檔數 (DB): {count}")
    print(f"磁盤缺失: {missing_on_disk}")
    print(f"內容過短: {small_content}")
    print(f"待清理總數: {len(ids_to_delete)}")
    
    if ids_to_delete:
        print("🗑️ 正在執行清理...")
        result = mongo.db.documents.delete_many({"_id": {"$in": ids_to_delete}})
        print(f"✅ 已刪除 {result.deleted_count} 條 MongoDB 記錄。")
        print("🚀 請重啟管道程序以重新抓取這些文件。")
    else:
        print("✨ MongoDB 與磁盤狀態一致，無需清理。")

if __name__ == "__main__":
    sync_mongo_with_disk()
