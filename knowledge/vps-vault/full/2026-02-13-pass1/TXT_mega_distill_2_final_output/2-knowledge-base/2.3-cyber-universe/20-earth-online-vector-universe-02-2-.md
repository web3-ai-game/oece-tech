---
distilled_by: grok-4-0709
mode: B
---
part: 2
---

## 2. 記憶向量：數字靈魂的核心

### 2.1 定義與原理
記憶向量（memory vector）是用戶在人性實驗中的選擇與反應數據，經Gemini AI編碼成高維向量，代表賽博社會中的「靈魂坐标」。背景源自自然語言處理（NLP）的word embedding，如Word2Vec，將詞彙映射到向量空間。這裡擴展到行為數據。原理是使用transformer-based模型生成固定維度的浮點數陣列，捕捉語義相似性。實例：用戶猶豫回答問題，向量會捕捉時間延遲作為特徵。

### 2.2 技術實現細節
實現涉及Python腳本收集回應、Gemini embedding並存入資料庫。背景：Supabase作為PostgreSQL資料庫，支持向量查詢（vector search）。原理：embedding維度如768允許精細表示。

代碼範例1（Python - 生成向量）：
```python
# 收集用戶回應
user_responses = ["選擇A", "猶豫3秒", "跳過問題5"]

# 使用Gemini生成embedding
import google.generativeai as gemini
vector = gemini.embed_content(
    model="models/text-embedding-004",  # 高維模型
    content=json.dumps(user_responses)  # 序列化回應
)

# 存入Supabase資料庫
from supabase import create_client
supabase = create_client('your-url', 'your-key')
supabase.table('soul_vectors').insert({
    'user_id': user_id,  # 用戶ID
    'vector': vector.embedding.values,  # 向量數據
    'dimension': 768,  # 維度
    'experiments_completed': 5  # 完成實驗數
})
```

### 2.3 應用實例與擴展
在平台中，向量用於匹配用戶或預測行為。實例：兩個用戶向量餘弦相似度（cosine similarity）高達0.9，表示相似人格。
