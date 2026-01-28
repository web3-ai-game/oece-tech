import logging
from mongodb_handler import MongoDBHandler

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

def emergency_reset_db():
    print("🚨 啟動 MongoDB 緊急重置程序 (Emergency Reset)...")
    
    mongo = MongoDBHandler()
    if not mongo.enabled:
        print("❌ MongoDB 未啟用")
        return

    try:
        # 1. Drop Collection
        print("🔥 正在刪除 'documents' 集合以釋放配額...")
        mongo.db.documents.drop()
        print("✅ 集合已刪除。")
        
        # 2. Re-create Indexes
        print("🛠️ 重建索引...")
        mongo._create_indexes()
        
        # 3. Check Stats
        stats = mongo.db.command("collStats", "documents")
        print(f"當前集合大小: {stats.get('size', 0) / 1024 / 1024:.2f} MB")
        print("✨ 空間已釋放。請立即運行 restore_mongo.py 重建輕量級索引。")
        
    except Exception as e:
        print(f"重置失敗: {e}")

if __name__ == "__main__":
    emergency_reset_db()
