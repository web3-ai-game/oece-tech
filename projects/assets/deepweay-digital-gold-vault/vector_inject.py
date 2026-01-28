#!/usr/bin/env python3
"""
諸葛亮·賽博蒸餾塔 - 向量注入引擎
將數字黃金庫的 7 篇文檔向量化，注入 Supabase 構建第二大腦
"""

import os
import json
from typing import List, Dict
import google.generativeai as genai
from supabase import create_client, Client

# ===== 配置 =====
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSy...")  # 從環境變量獲取
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://xxxxx.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "eyJhbGci...")

# 文檔列表
DOCUMENTS = [
    "00-README-認知系統源代碼.md",
    "02-ai-distillation-strategy.md",
    "18-deepweay-sms-battle-pack-v2.md",
    "19-deepweay-gemini-strategy-enhanced.md",
    "20-earth-online-vector-universe.md",
    "21-index-workspace-overview.md",
    # 14-info-resource-library.md 排除（機密）
]

# 分類標籤
CATEGORIES = {
    "00-README-認知系統源代碼.md": "導航",
    "02-ai-distillation-strategy.md": "方法論",
    "18-deepweay-sms-battle-pack-v2.md": "戰略",
    "19-deepweay-gemini-strategy-enhanced.md": "戰術",
    "20-earth-online-vector-universe.md": "哲學",
    "21-index-workspace-overview.md": "工程",
}

# ===== 初始化客戶端 =====
def init_clients():
    """初始化 Gemini 和 Supabase 客戶端"""
    genai.configure(api_key=GEMINI_API_KEY)
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return supabase

# ===== 讀取文檔 =====
def read_document(filepath: str) -> Dict[str, str]:
    """讀取 Markdown 文檔並提取元數據"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取標題（第一行 # 標題）
    lines = content.split('\n')
    title = lines[0].replace('#', '').strip() if lines else filepath
    
    return {
        "filename": filepath,
        "title": title,
        "content": content,
        "category": CATEGORIES.get(filepath, "其他"),
        "word_count": len(content),
    }

# ===== 生成向量 =====
def generate_embedding(text: str) -> List[float]:
    """使用 Gemini Embeddings API 生成 768 維向量"""
    try:
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document",
        )
        return result['embedding']
    except Exception as e:
        print(f"❌ 向量生成失敗: {e}")
        return None

# ===== 注入 Supabase =====
def inject_to_supabase(supabase: Client, doc: Dict, embedding: List[float]):
    """將文檔和向量注入 Supabase"""
    try:
        data = {
            "filename": doc["filename"],
            "title": doc["title"],
            "content": doc["content"],
            "category": doc["category"],
            "word_count": doc["word_count"],
            "embedding": embedding,
        }
        
        result = supabase.table("knowledge_base").insert(data).execute()
        print(f"✅ {doc['filename']} 注入成功")
        return result
    except Exception as e:
        print(f"❌ {doc['filename']} 注入失敗: {e}")
        return None

# ===== 主程序 =====
def main():
    print("🏯 諸葛亮·賽博蒸餾塔 - 向量注入引擎")
    print("=" * 60)
    
    # 初始化
    print("\n📡 正在連接 Gemini & Supabase...")
    supabase = init_clients()
    print("✅ 連接成功")
    
    # 處理每個文檔
    print(f"\n📚 開始處理 {len(DOCUMENTS)} 篇文檔...\n")
    
    success_count = 0
    failed_count = 0
    
    for doc_file in DOCUMENTS:
        print(f"🔄 處理: {doc_file}")
        
        # 1. 讀取文檔
        doc = read_document(doc_file)
        print(f"   📄 標題: {doc['title']}")
        print(f"   📊 字數: {doc['word_count']:,}")
        print(f"   🏷️  分類: {doc['category']}")
        
        # 2. 生成向量
        print(f"   🧬 生成向量...")
        embedding = generate_embedding(doc['content'])
        
        if not embedding:
            failed_count += 1
            print(f"   ❌ 跳過\n")
            continue
        
        print(f"   ✅ 向量維度: {len(embedding)}")
        
        # 3. 注入 Supabase
        print(f"   💉 注入數據庫...")
        result = inject_to_supabase(supabase, doc, embedding)
        
        if result:
            success_count += 1
        else:
            failed_count += 1
        
        print()
    
    # 總結
    print("=" * 60)
    print(f"🎯 注入完成!")
    print(f"   ✅ 成功: {success_count}")
    print(f"   ❌ 失敗: {failed_count}")
    print(f"   📊 總計: {len(DOCUMENTS)}")
    
    if success_count > 0:
        print("\n🧠 第二大腦已構建！現在可以:")
        print("   1. 語義搜索你的知識庫")
        print("   2. AI 對話時自動引用文檔")
        print("   3. 構建個人版 ChatGPT")
        print("\n💡 測試命令:")
        print('   await searchKnowledge("如何優化 Gemini API?")')

# ===== SQL 腳本 =====
SQL_SETUP = """
-- 創建知識庫表（在 Supabase SQL Editor 中執行）

-- 啟用 pgvector 擴展
CREATE EXTENSION IF NOT EXISTS vector;

-- 創建表
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  word_count INTEGER,
  embedding VECTOR(768),  -- 768 維向量
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 創建向量索引（加速相似度搜索）
CREATE INDEX ON knowledge_base USING ivfflat (embedding vector_cosine_ops);

-- 創建全文搜索索引
CREATE INDEX ON knowledge_base USING GIN (to_tsvector('english', content));

-- 語義搜索函數
CREATE OR REPLACE FUNCTION search_knowledge(
  query_embedding VECTOR(768),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  category TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.title,
    kb.content,
    kb.category,
    1 - (kb.embedding <=> query_embedding) AS similarity
  FROM knowledge_base kb
  WHERE 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
"""

if __name__ == "__main__":
    print("\n📋 首次使用？請先在 Supabase 執行以下 SQL:")
    print("-" * 60)
    print(SQL_SETUP)
    print("-" * 60)
    print("\n按 Enter 繼續...")
    input()
    
    main()
