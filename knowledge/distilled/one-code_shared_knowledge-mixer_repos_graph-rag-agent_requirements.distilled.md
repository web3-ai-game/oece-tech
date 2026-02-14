---
source: one-code_shared_knowledge-mixer_repos_graph-rag-agent_requirements.txt
distilled_at: 2026-02-14T09:33:46.791Z
model: grok-4-1-fast-non-reasoning
---

# 基於LangChain與知識圖譜的AI系統依賴文檔

本文檔詳細記錄一個基於**LangChain生態**、**知識圖譜**與**中文NLP**的AI系統完整依賴配置。該系統支援文件處理、向量檢索、RAG（Retrieval-Augmented Generation）、GRPO模型訓練與Web服務部署。

## 📋 系統架構概述

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web API層     │    │   核心AI引擎     │    │   知識圖譜層    │
│  (FastAPI)      │◄──►│ (LangChain+LLM)  │◄──►│ (Neo4j+FAISS)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   UI介面        │    │   文件處理       │    │   模型訓練      │
│  (Streamlit)    │    │ (PDF/DOC/文本)    │    │   (GRPO/Unsloth)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🛠️ 核心依賴套件（精確版本）

### 1. **Web與API服務** (FastAPI後端)
```
aiohttp==3.8.5          # 非同步HTTP客戶端/伺服器
fastapi==0.115.11       # 高性能API框架
httplib2==0.22.0        # HTTP請求庫
requests==2.32.3        # 標準HTTP客戶端
uvicorn==0.29.0         # ASGI伺服器
sseclient-py==1.7.2     # Server-Sent Events客戶端
```

### 2. **資料處理與視覺化**
```
numpy==1.26.2           # 數值計算基礎
pandas==2.2.3           # 資料分析
matplotlib==3.10.1      # 資料視覺化
```

### 3. **機器學習與向量檢索**
```
faiss-cpu==1.11.0       # Facebook AI向量相似度搜尋
scikit-learn==1.6.1     # 機器學習算法
sentence_transformers==4.1.0  # 句子嵌入模型
```

### 4. **中文NLP處理**
```
hanlp==2.1.1            # 漢語自然語言處理套件
jieba==0.42.1           # 中文分詞
```

### 5. **LangChain生態系** (核心AI框架)
```
langchain==0.3.21           # LangChain主框架
langchain_community==0.3.20 # 社區組件
langchain_core==0.3.46      # 核心抽象層
langchain_neo4j==0.4.0      # Neo4j知識圖譜整合
langchain_openai==0.3.9     # OpenAI模型整合
langgraph==0.3.18           # 圖形工作流引擎
langsmith==0.3.18           # 開發與監控平台
```

### 6. **知識圖譜與圖形處理**
```
graphdatascience==1.12  # Neo4j圖算法
pyvis==0.3.2            # 互動式圖視覺化
networkx==3.4.2         # 圖論算法（GRPO專用）
```

### 7. **文件處理**
```
PyPDF2>=3.0.0           # PDF讀取
python-docx>=0.8.11     # Word文件處理
textract==1.6.3         # 多格式文本提取
lxml==5.3.1             # XML/HTML解析
```

### 8. **配置與開發工具**
```
pydantic==2.10.6        # 資料驗證與設定管理
pyyaml>=6.0             # YAML配置
python-dotenv==1.0.1    # 環境變數管理
markdown>=3.4.1         # Markdown處理
```

### 9. **UI與使用者體驗**
```
streamlit==1.42.2       # Web UI框架
rich==13.9.4            # 美化終端輸出
tqdm==4.66.3            # 進度條
```

### 10. **系統與排程**
```
psutil==5.9.7           # 系統監控
schedule==1.2.2         # 任務排程
```

### 11. **基礎與相容性**
```
chardet==3.0.4          # 字符編碼檢測
setuptools==75.8.0      # Python套件管理
shutup==0.2.0           # 日誌抑制
pywin32>=302            # Windows專用（僅Windows）
google-auth==2.38.0     # Google認證
```

## 🐧 系統環境依賴（Linux）

```bash
# Ubuntu/Debian系統必要套件
sudo apt-get update
sudo apt-get install -y \
    python-dev-is-python3 \
    libxml2-dev \
    libxslt1-dev \
    antiword \
    unrtf \
    poppler-utils
```

**用途說明**：
- `python-dev-is-python3`：Python開發頭文件
- `libxml2-dev libxslt1-dev`：XML/XSLT解析（lxml依賴）
- `antiword unrtf`：Word/RTF文件轉換（textract依賴）
- `poppler-utils`：PDF轉換工具

## 🚀 GRPO訓練額外依賴（**僅非Windows**）

GRPO（Group Relative Policy Optimization）模型微調專用依賴：

### 核心訓練框架
```
unsloth==2025.3.19          # 高效LLM微調（記憶體優化）
unsloth_zoo==2025.3.17      # Unsloth模型動物園
trl==0.14.0                 # 強化學習訓練
peft==0.15.1                # 參數高效微調
```

### 模型與推理
```
transformers==4.49.0        # HuggingFace Transformers
torch==2.5.1                # PyTorch（CPU/GPU）
tiktoken==0.9.0             # OpenAI分詞器
vllm==0.6.5                 # **Windows不可用** - 高吞吐推理引擎
```

### 輔助工具
```
triton==3.1.0               # GPU編譯器
regex==2024.11.6            # 進階正規表達式
tenacity==9.0.0             # 重試裝飾器
```

**安裝命令**（Linux/macOS）：
```bash
pip install torch==2.5.1 torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
pip install unsloth==2025.3.19 unsloth_zoo==2025.3.17
pip install vllm==0.6.5 triton==3.1.0  # 需要CUDA 12.1+
```

## 💻 平台專用配置

### Windows專用
```bash
pip install pywin32>=302
```
**注意**：`vllm`在Windows上不可用，請使用CPU推理或WSL2。

### 完整requirements.txt生成
```bash
pip freeze > requirements-$(uname -s)-$(python --version | cut -d' ' -f2).txt
```

## 🔧 安裝建議順序

```bash
# 1. 系統依賴（Linux）
sudo apt-get install ...

# 2. 基礎套件
pip install numpy==1.26.2 pandas==2.2.3

# 3. LangChain生態
pip install langchain==0.3.21 langchain_core==0.3.46

# 4. 向量與NLP
pip install faiss-cpu==1.11.0 sentence_transformers==4.1.0

# 5. 文件處理
pip install PyPDF2>=3.0.0 python-docx>=0.8.11 textract==1.6.3

# 6. Web服務
pip install fastapi==0.115.11 uvicorn==0.29.0

# 7. GRPO訓練（可選，非Windows）
pip install unsloth==2025.3.19 trl==0.14.0 vllm==0.6.5
```

## ⚠️ 相容性注意事項

1. **Python版本**：建議 **Python 3.10-3.12**
2. **CUDA需求**：GRPO訓練需要CUDA 12.1+（vllm/triton）
3. **記憶體需求**：FAISS+LangChain建議16GB+ RAM
4. **Neo4j相容**：`graphdatascience==1.12` 需要Neo4j 5.18+

## 📊 效能預期

| 組件 | CPU (16核) | GPU (A100) |
|------|------------|------------|
| 文件處理 | 50頁/分 | 200頁/分 |
| 向量檢索 | 10ms/查詢 | 2ms/查詢 |
| GRPO訓練 | ❌不可用 | 1.2倍加速 |

**此配置支援完整的RAG管道、知識圖譜QA與中文LLM微調工作流。**