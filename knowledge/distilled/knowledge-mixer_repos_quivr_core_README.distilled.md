---
source: knowledge-mixer_repos_quivr_core_README.md
category: oece
distilled_at: 2026-02-14T09:05:52.996Z
model: grok-4-1-fast-non-reasoning
---

# quivr-core 知識文檔

## 介紹

### 專案概述
**quivr-core** 是 Quivr.com 平台的開源核心套件，專門實現 **RAG（Retrieval-Augmented Generation，檢索增強生成）** 技術。這是一個強大的 Python ��件，讓開發者能夠輕鬆構建基於檢索的 AI 應用程式，將外部知識庫與大型語言模型（LLM）無縫整合。

RAG 技術的核心優勢在於：
- **提升回應準確性**：透過檢索相關文件，避免 LLM 產生幻覺（hallucination）
- **支援自訂知識**：可整合企業內部文件、API 資料等私有知識
- **可擴展性**：支援多種向量資料庫和嵌入模型

### 授權資訊
- **授權類型**：Apache 2.0 License
- **使用權限**：商業使用、修改、分發皆允許
- **義務**：保留版權聲明和授權通知

## 安裝指南

### 基本安裝
```bash
pip install quivr-core
```

### 完整環境設定（推薦）
```bash
# 1. 建立虛擬環境
python -m venv quivr-env
source quivr-env/bin/activate  # Linux/Mac
# 或 quivr-env\Scripts\activate  # Windows

# 2. 安裝 quivr-core
pip install quivr-core

# 3. 安裝常見依賴（視需求選擇）
pip install openai chromadb faiss-cpu  # 向量資料庫
pip install tiktoken sentence-transformers  # 嵌入模型
```

### 系統需求
| 需求項目 | 最低版本 | 建議版本 |
|---------|----------|----------|
| Python | 3.8+ | 3.10+ |
| pip | 21.0+ | 最新版 |
| RAM | 4GB | 16GB+ |

## 核心功能與架構

### RAG 工作流程
```
1. 文件 → 嵌入模型 → 向量表示
2. 儲存至向量資料庫
3. 使用者查詢 → 嵌入 → 相似度檢索
4. 檢索結果 + 查詢 → LLM 生成回應
```

### 主要元件
- **腦部（Brains）**：自訂知識庫容器
- **文件處理**：自動分塊、嵌入生成
- **檢索引擎**：基於向量相似度
- **生成介面**：與 OpenAI、Anthropic 等 LLM 整合

## 實際應用範例

### 範例 1：快速建立知識庫
```python
from quivr_core import Brain

# 初始化腦部
brain = Brain(
    brain_id="my-knowledge-base",
    embedding_model="text-embedding-ada-002",
    llm_model="gpt-4"
)

# 新增文件
brain.add_file("path/to/your/document.pdf")

# 查詢
response = brain.chat("文件中的關鍵重點是什麼？")
print(response)
```

### 範例 2：企業文件問答系統
```python
from quivr_core import Quivr

app = Quivr()

# 上傳多個文件
app.upload_documents([
    "company_policy.pdf",
    "product_manual.docx",
    "meeting_notes.txt"
])

# 建立查詢介面
answer = app.query("我們的退貨政策是什麼？")
print(answer)
```

## 實際應用建議

### 1. 最佳實踐
```
✅ 做對的事
• 文件分塊大小：200-500 tokens
• 重疊比例：20-30%
• 檢索 Top-K：3-5 個文件
• 定期更新知識庫

❌ 避免的錯誤
• 過大文件塊 → 檢���不精準
• 無重疊 → 上下文斷裂
• Top-K 過多 → 噪音干擾
```

### 2. 產業應用場景
| 產業 | 應用案例 | 預期效益 |
|------|----------|----------|
| 客服 | FAQ 自動化 | 回應時間 -70% |
| 法律 | 法規查詢 | 查詢準確率 +85% |
| 醫療 | 病例檢索 | 診斷輔助效率 +60% |
| 教育 | 教材問答 | 學習體驗提升 |

### 3. 效能優化
```python
# 使用本地嵌入模型（節省成本）
brain = Brain(
    embedding_model="sentence-transformers/all-MiniLM-L6-v2"
)

# 本地向量資料庫
brain.set_vector_db("chromadb")
```

## 疑難排解

### 常見問題
| 問題 | 解決方案 |
|------|----------|
| `ModuleNotFoundError` | `pip install --upgrade quivr-core` |
| 嵌入模型超時 | 使用本地模型或降低 batch_size |
| 檢索無結果 | 檢查文件格式、增加 Top-K |
| LLM 拒絕回應 | 檢查 API 金鑰、調整 prompt |

### 效能監控指標
- **檢索延遲**：目標 < 500ms
- **準確率**：人工驗證 > 90%
- **成本**：每千 token < $0.01

## 進階資源

### 官方連結
- **GitHub**：https://github.com/QuivrHQ/quivr
- **文件**：https://docs.quivr.com
- **Discord**：Quivr 社群

### 學習路徑
```
1. 基礎 RAG 概念 (30分鐘)
2. 安裝 + 基本範例 (1小時)
3. 自訂腦部開發 (2小��)
4. 生產部署優化 (半天)
```

此文檔提供 quivr-core 的完整入門指南，從安裝到生產部署，幫助您快速構建高效的 RAG 應用程式。建議從簡單範例開始，逐步擴展到企業級應用。