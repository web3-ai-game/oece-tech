import logging
from mongodb_handler import MongoDBHandler

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

def optimize_db():
    print("🧹 啟動 MongoDB 空間優化程序 (Space Optimization)...")
    
    mongo = MongoDBHandler()
    if not mongo.enabled:
        print("❌ MongoDB 未啟用")
        return

    try:
        # 1. Check Stats
        stats = mongo.db.command("collStats", "documents")
        print(f"當前集合大小: {stats.get('size') / 1024 / 1024:.2f} MB")
        print(f"當前文檔數: {stats.get('count')}")
        
        print("🔥 正在移除所有文檔的 'content' 字段以釋放空間...")
        
        # Use update_many to unset the content field
        result = mongo.db.documents.update_many(
            {"content": {"$exists": True}},
            {"$unset": {"content": ""}}
        )
        
        print(f"✅ 已更新 {result.modified_count} 個文檔。")
        
        # 2. Re-check Stats
        stats = mongo.db.command("collStats", "documents")
        print(f"優化後集合大小: {stats.get('size') / 1024 / 1024:.2f} MB")
        print("🚀 數據庫已瘦身，可以繼續存儲更多元數據了。")
        
    except Exception as e:
        print(f"優化失敗: {e}")

if __name__ == "__main__":
    optimize_db()
