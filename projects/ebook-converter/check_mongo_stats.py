import logging
from mongodb_handler import MongoDBHandler

logging.basicConfig(level=logging.INFO, format='%(message)s')

def check_stats():
    mongo = MongoDBHandler()
    if not mongo.enabled:
        print("MongoDB disabled")
        return
        
    stats = mongo.db.command("collStats", "documents")
    size_mb = stats.get('size', 0) / 1024 / 1024
    count = stats.get('count', 0)
    
    print(f"MongoDB Documents: {count}")
    print(f"Collection Size: {size_mb:.2f} MB")
    
    if size_mb > 450:
        print("⚠️ WARNING: Approaching 512MB limit!")
    else:
        print("✅ Storage usage is healthy.")

if __name__ == "__main__":
    check_stats()
