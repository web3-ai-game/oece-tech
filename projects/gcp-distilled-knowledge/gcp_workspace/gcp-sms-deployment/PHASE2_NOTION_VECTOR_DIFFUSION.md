# 🚀 Phase 2: Notion向量擴散計劃

**狀態**: 準備中 🔄  
**前置條件**: Phase 1資產重組完成 ✅  
**執行環境**: 新VPS (待遷移)

---

## 📊 當前資產狀態

### GitHub倉庫結構 (Phase 1完成)
```
總倉庫: 13個
├─ 私有倉庫: 5個
│  ├─ sms-complete-archive-final (207MB完整備份)
│  ├─ legacy-repos-archive (24個歷史項目, 143MB)
│  ├─ sms-vault-30repos-compressed (4.2MB)
│  ├─ notion-sms (0.2MB)
│  └─ sms-key (0.1MB)
│
└─ 公開倉庫: 8個
   ├─ deepweay-digital-gold-vault
   ├─ sms-digital-assets-ultra
   └─ 其他6個歷史倉庫 (保留參考)
```

### SMS知識庫狀態
```
蒸餾結果: 30個倉庫 → 1,305個金文件
向量總數: 908個向量
架構層級: 6層知識體系
存儲位置: /mnt/sms/ (207MB)
備份狀態: GitHub完整備份 ✅
```

---

## 🎯 Phase 2核心目標

### 1. Notion向量索引化
**目的**: 將908個向量全量索引到Notion Database

**技術方案**:
```python
# Notion向量索引器
class NotionVectorIndexer:
    def __init__(self):
        self.notion_token = os.getenv("NOTION_TOKEN")
        self.database_id = os.getenv("NOTION_DATABASE_ID")
        self.vector_dir = "/mnt/sms/vectors/"
        
    def index_vectors(self):
        # 1. 讀取908個向量文件
        vectors = self.load_vectors()
        
        # 2. 批量寫入Notion Database
        for vector in vectors:
            self.create_notion_page(
                title=vector.title,
                content=vector.content,
                metadata=vector.metadata,
                tags=vector.tags
            )
        
    def create_notion_page(self, **kwargs):
        # Notion API調用
        pass
```

**預期結果**:
- 908個向量 → 908個Notion頁面
- 自動標籤分類
- 智能關聯建立

---

### 2. DeepWeay智能路由系統
**目的**: 建立中心化邏輯引擎,所有請求圍繞Notion旋轉

**架構設計**:
```
用戶請求
    ↓
DeepWeay API Gateway
    ↓
┌─────────────┴─────────────┐
│                            │
Notion檢索          外部模型調度
    ↓                        ↓
908向量搜索      GPT/Claude/Local
    ↓                        ↓
知識圖譜增強    結果合併優化
    ↓                        ↓
└─────────────┬─────────────┘
              ↓
        統一響應返回
```

**核心模塊**:
```python
# DeepWeay路由器
class DeepWeayRouter:
    def __init__(self):
        self.notion_db = NotionDatabase()
        self.model_pool = {
            'gpt4': GPT4Client(),
            'claude': ClaudeClient(),
            'local': LocalModelClient()
        }
    
    def route_query(self, query):
        # 1. Notion向量檢索
        relevant_docs = self.notion_db.search(query)
        
        # 2. 智能模型選擇
        best_model = self.select_model(query, relevant_docs)
        
        # 3. 增強提示詞
        enhanced_prompt = self.enhance_with_context(
            query, relevant_docs
        )
        
        # 4. 調用模型
        response = best_model.generate(enhanced_prompt)
        
        # 5. 結果優化
        return self.optimize_response(response)
```

---

### 3. 知識圖譜構建
**目的**: 將1,305金文件建立關聯網絡

**6層架構映射**:
```
Layer 0: 核心配置層 (notion_config.py, deepweay_config.py)
    ↓
Layer 1: 數據訪問層 (notion_client.py, vector_store.py)
    ↓
Layer 2: 業務邏輯層 (query_router.py, model_selector.py)
    ↓
Layer 3: 服務層 (api_server.py, websocket_server.py)
    ↓
Layer 4: 工具層 (mcp_tools.py, telegram_bot.py)
    ↓
Layer 5: 應用層 (deepweay_web.py, admin_panel.py)
```

**關聯算法**:
```python
# 知識圖譜構建器
class KnowledgeGraphBuilder:
    def build_graph(self):
        # 1. 解析1,305金文件
        files = self.parse_golden_files()
        
        # 2. 提取實體和關係
        entities = self.extract_entities(files)
        relations = self.extract_relations(files)
        
        # 3. 構建圖結構
        graph = nx.DiGraph()
        graph.add_nodes_from(entities)
        graph.add_edges_from(relations)
        
        # 4. 同步到Notion
        self.sync_to_notion(graph)
        
        return graph
```

---

### 4. API層實現
**目的**: 統一入口,多端訪問

**RESTful API**:
```python
# FastAPI服務器
from fastapi import FastAPI

app = FastAPI(title="DeepWeay API")

@app.post("/query")
async def query(text: str):
    """智能查詢接口"""
    router = DeepWeayRouter()
    result = router.route_query(text)
    return {"response": result}

@app.get("/vectors")
async def list_vectors():
    """列出所有向量"""
    return {"total": 908, "vectors": [...]}

@app.post("/notion/sync")
async def sync_notion():
    """同步Notion數據"""
    indexer = NotionVectorIndexer()
    indexer.index_vectors()
    return {"status": "synced"}
```

**WebSocket實時推送**:
```python
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        response = router.route_query(data)
        await websocket.send_json(response)
```

---

## 🛠️ 技術棧

### 後端框架
- **FastAPI**: API服務器
- **WebSocket**: 實時通訊
- **Celery**: 異步任務隊列

### 向量存儲
- **Notion API**: 主存儲
- **ChromaDB**: 本地向量緩存
- **Redis**: 查詢結果緩存

### 模型調度
- **LangChain**: 模型統一接口
- **OpenAI API**: GPT-4
- **Anthropic API**: Claude
- **Ollama**: 本地模型

### 知識圖譜
- **NetworkX**: 圖構建
- **Neo4j**: 圖數據庫 (可選)
- **Notion Relations**: 原生關聯

---

## 📋 實施步驟

### Step 1: 環境準備 (第1週)
```bash
# 新VPS部署
ssh root@new-vps

# 克隆完整備份
git clone https://github.com/web3-ai-game/sms-complete-archive-final
cd sms-complete-archive-final

# 安裝依賴
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 配置環境變量
cat > .env << EOF
NOTION_TOKEN=secret_xxx
NOTION_DATABASE_ID=xxx
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
REDIS_URL=redis://localhost:6379
EOF
```

### Step 2: Notion向量索引 (第2週)
```bash
# 執行向量索引
python scripts/notion_vector_indexer.py

# 驗證索引結果
python scripts/verify_notion_index.py

# 預期輸出:
# ✅ 908個向量已索引
# ✅ 1,305個頁面已創建
# ✅ 關聯關係已建立
```

### Step 3: DeepWeay路由系統 (第3週)
```bash
# 啟動API服務器
uvicorn deepweay.api:app --host 0.0.0.0 --port 8000

# 測試路由
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"text": "如何使用Notion API?"}'

# 預期響應:
# {
#   "response": "基於908個向量檢索結果...",
#   "sources": ["notion-api-guide.md", ...],
#   "model": "gpt-4"
# }
```

### Step 4: 知識圖譜構建 (第4週)
```bash
# 構建知識圖譜
python scripts/build_knowledge_graph.py

# 可視化圖譜
python scripts/visualize_graph.py

# 同步到Notion
python scripts/sync_graph_to_notion.py
```

### Step 5: 整合測試 (第5週)
```bash
# 運行完整測試套件
pytest tests/ -v

# 壓力測試
locust -f tests/load_test.py --host=http://localhost:8000

# 端到端測試
python tests/e2e_test.py
```

---

## 📊 成功指標

### 性能指標
- 查詢響應時間: < 2秒
- 向量檢索準確率: > 90%
- API可用性: > 99.9%
- 併發處理能力: > 100 req/s

### 功能指標
- Notion頁面數: 908+
- 知識圖譜節點: 1,305+
- API端點數: 10+
- 支持模型數: 3+

### 業務指標
- 查詢成功率: > 95%
- 用戶滿意度: > 4.5/5
- 知識覆蓋率: > 90%

---

## 🚧 風險與應對

### 風險1: Notion API限流
**影響**: 向量索引速度受限  
**應對**: 
- 實施指數退避重試
- 批量操作降低請求頻率
- 使用Redis緩存減少重複請求

### 風險2: 向量檢索精度不足
**影響**: 查詢結果不準確  
**應對**:
- 使用Embedding模型優化
- 實施混合檢索 (關鍵詞+向量)
- 人工標註提升質量

### 風險3: 系統複雜度過高
**影響**: 維護困難  
**應對**:
- 模塊化設計
- 完善文檔和註釋
- 自動化測試覆蓋

---

## 💡 創新點

### 1. Notion為唯一真相源
所有知識以Notion為中心,確保單一數據源

### 2. DeepWeay智能路由
根據查詢類型自動選擇最佳模型

### 3. 知識圖譜增強
利用1,305金文件的關聯關係提升檢索

### 4. 多模型協同
GPT-4精準度 + Claude創造力 + Local低成本

---

## 📅 時間線

```
Week 1: 環境搭建 + 依賴安裝
Week 2: Notion向量索引
Week 3: DeepWeay路由實現
Week 4: 知識圖譜構建
Week 5: 整合測試 + 優化
Week 6: 生產部署 + 監控
```

**預計完成**: 6週後 (2026-01-07)

---

## 🎯 Phase 2完成標準

- [x] Phase 1資產重組完成
- [ ] 新VPS環境準備就緒
- [ ] 908向量全部索引到Notion
- [ ] DeepWeay API服務正常運行
- [ ] 知識圖譜構建完成
- [ ] 性能指標達標
- [ ] 文檔和測試完善
- [ ] 生產環境部署成功

---

**🚀 準備就緒! 等待新VPS部署後立即啟動Phase 2!**

**文檔版本**: v1.0  
**創建時間**: 2025-11-26  
**負責人**: GitHub Copilot + User
