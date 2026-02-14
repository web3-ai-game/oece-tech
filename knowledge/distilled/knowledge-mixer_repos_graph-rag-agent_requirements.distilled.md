---
source: knowledge-mixer_repos_graph-rag-agent_requirements.txt
distilled_at: 2026-02-14T09:35:25.176Z
model: grok-4-1-fast-non-reasoning
---

# 知識混合器 (Knowledge-Mixer) + 程式碼庫圖 RAG 代理 技術文檔

## 1. 專案概述

**Knowledge-Mixer + Repos_Graph-RAG-Agent** 是一個先進的知識管理與檢索系統，結合了**知識混合**、**向量檢索**、**圖資料庫**與**AI代理工作流**的核心技術。該系統專為處理多格式文件（PDF、Word、程式碼庫等）設計，提供中文NLP支援、語義檢索與知識圖譜導航功能。

### 核心功能
- 📄 **多格式文件處理**：PDF、Word、純文字、程式碼文件
- 🔍 **混合檢索**：向量搜尋 + 圖資料庫查詢 + 關鍵字匹配
- 🗺️ **知識圖譜**：Neo4j 圖資料庫建模實體關係
- 🤖 **AI代理工作流**：LangGraph 狀態機驅動的多步推理
- 🌐 **中文NLP**：HanLP + Jieba 分詞與命名實體識別
- 🎨 **Web介面**：Streamlit 前端 + FastAPI 後端 API

## 2. 核心技術棧

```
知識混合器架構圖：
文件處理 → 嵌入生成 → [向量DB + Neo4j圖DB] → LangGraph代理 → Streamlit UI
                 ↓
            Sentence Transformers
```

## 3. Python 依賴套件版本

### 3.1 核心依賴套件

| 類別 | 套件 | 版本 | 功能 |
|------|------|------|------|
| **Web框架** | fastapi | 0.115.11 | RESTful API 服務 |
| | uvicorn | 0.29.0 | ASGI 伺服器 |
| | streamlit | 1.42.2 | 互動式 Web UI |
| **LangChain生態** | langchain | 0.3.21 | 核心框架 |
| | langchain_core | 0.3.46 | 核心組件 |
| | langchain_community | 0.3.20 | 社群整合 |
| | langchain_openai | 0.3.9 | OpenAI 模型整合 |
| | langchain_neo4j | 0.4.0 | Neo4j 向量儲存 |
| | langgraph | 0.3.18 | 工作流狀態機 |
| | langsmith | 0.3.18 | 追蹤與監控 |
| **中文NLP** | hanlp | 2.1.1 | 全面中文NLP |
| | jieba | 0.42.1 | 中文分詞 |
| **向量/圖資料庫** | faiss-cpu | 1.11.0 | 向量相似度搜尋 |
| | graphdatascience | 1.12 | Neo4j 圖演算法 |
| **文件處理** | PyPDF2 | ≥3.0.0 | PDF 解析 |
| | python-docx | ≥0.8.11 | Word 文件處理 |
| | textract | 1.6.3 | 多格式文本提取 |
| **嵌入模型** | sentence_transformers | 4.1.0 | 多語言嵌入生成 |
| **資料處理** | numpy | 1.26.2 | 數值計算 |
| | pandas | 2.2.3 | 資料處理 |
| | scikit-learn | 1.6.1 | 機器學習工具 |
| **可視化** | matplotlib | 3.10.1 | 資料視覺化 |
| | pyvis | 0.3.2 | 互動式圖可視化 |
| **其他** | pydantic | 2.10.6 | 資料驗證 |
| | rich | 13.9.4 | 美化終端輸出 |

### 3.2 GRPO 訓練額外依賴 (僅Windows，vllm不可用)

| 套件 | 版本 | 功能 |
|------|------|------|
| unsloth | 2025.3.19 | 高效微調工具 |
| trl | 0.14.0 | 強化學習訓練 |
| peft | 0.15.1 | 參數高效微調 |
| transformers | 4.49.0 | HuggingFace模型 |
| torch | 2.5.1 | PyTorch核心 |
| vllm | 0.6.5 | 高性能推理引擎 |

## 4. 系統環境依賴

### 4.1 Linux 系統依賴
```bash
sudo apt-get update
sudo apt-get install python-dev-is-python3 \
                     libxml2-dev libxslt1-dev \
                     antiword unrtf poppler-utils
```

**用途說明**：
- `libxml2-dev libxslt1-dev`：lxml依賴（XML/HTML解析）
- `antiword`：MS Word文件轉換
- `unrtf`：RTF文件處理
- `poppler-utils`：PDF轉換工具

### 4.2 Windows 系統依賴
```bash
pip install pywin32>=302
```

## 5. 安裝指南

### 5.1 基礎環境安裝
```bash
# 1. 創建虛擬環境
python -m venv knowledge-mixer-env
source knowledge-mixer-env/bin/activate  # Linux/Mac
# knowledge-mixer-env\Scripts\activate  # Windows

# 2. 安裝核心依賴
pip install -r requirements-core.txt

# 3. 安裝系統依賴 (Linux)
sudo apt-get install python-dev-is-python3 libxml2-dev libxslt1-dev antiword unrtf poppler-utils
```

### 5.2 完整開發環境 (含GRPO訓練)
```bash
pip install -r requirements-full.txt
```

## 6. 部署方式

### 6.1 開發模式 (Streamlit)
```bash
streamlit run app.py --server.port 8501
```

### 6.2 生產模式 (FastAPI + Uvicorn)
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 6.3 Docker部署 (推薦)
```dockerfile
FROM python:3.11-slim
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . /app
WORKDIR /app
EXPOSE 8000 8501
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 7. 架構流程

```
1. 文件上傳 → textract/PyPDF2/python-docx
   ↓
2. 文本分割 → jieba/HanLP 分詞
   ↓
3. 嵌入生成 → sentence_transformers
   ↓
4. 雙儲存 → FAISS(向量) + Neo4j(圖譜)
   ↓
5. 混合檢索 → LangGraph 代理協調
   ↓
6. 生成回應 → OpenAI/LangChain
```

## 8. 注意事項

1. **Neo4j資料庫**：需預先部署Neo4j 5.x版本
2. **OpenAI API Key**：透過 `.env` 檔案配置
3. **記憶體需求**：FAISS索引建議8GB+ RAM
4. **中文支援**：HanLP模型自動下載（首次運行）
5. **GRPO訓練**：僅Windows環境，需NVIDIA GPU

## 9. 效能指標

| 功能 | 預期延遲 | 吞吐量 |
|------|----------|--------|
| 文件處理 | 1-5秒/頁 | 100頁/分 |
| 向量檢索 | <100ms | 1000 QPS |
| 圖譜查詢 | <200ms | 500 QPS |
| 完整RAG | 1-3秒 | 50 QPS |

此文檔提供完整的技術棧配置與部署指南，確保系統穩定運行於生產環境。