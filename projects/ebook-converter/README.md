# Ebook Converter Pipeline

多格式電子書轉 Markdown 轉換器，支援 LLM 智能轉換與知識庫索引。

## 快速開始 (Quick Start)

```bash
# 1. 克隆倉庫
git clone https://github.com/web3-ai-game/ebook-converter.git
cd ebook-converter

# 2. 安裝依賴
pip install -r requirements.txt

# 3. 配置環境變量
cp .env.example .env
# 編輯 .env 填入你的 API keys

# 4. 運行轉換
python main.py /path/to/your/ebook.pdf
```

## 環境變量 (.env)

```bash
# LLM API (選擇一個)
XAI_API_KEY=your_xai_key          # X.AI Grok (推薦)
GEMINI_API_KEY=your_gemini_key    # Google Gemini

# MongoDB (可選，用於持久化)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/

# S3/GCS 存儲 (可選)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=your-bucket
S3_ENDPOINT_URL=https://storage.googleapis.com  # GCS 用這個
```

## 支援格式

| 格式 | 說明 |
|------|------|
| PDF | 文字提取 + OCR (中英文) |
| EPUB/MOBI | 完整章節提取 |
| TXT | 純文本處理 |
| DOCX | Word 文檔 |
| HTML | 網頁內容 |

## 項目結構

```
ebook-converter/
├── main.py                    # 主入口
├── config.py                  # 配置文件
├── llm_converter.py           # LLM 轉換核心 (X.AI/Gemini)
├── ebook_extractor.py         # 電子書文本提取
├── mongodb_handler.py         # MongoDB 持久化
├── s3_uploader.py             # S3/GCS 上傳
├── wittgenstein_indexer.py    # 知識索引生成
├── data/
│   ├── markdown-output/       # 轉換後的 MD 文件 (5,153 個)
│   └── wittgenstein-index/    # 知識庫索引
└── requirements.txt
```

## 核心模組

### 1. LLM 轉換 (`llm_converter.py`)
- 支援 X.AI Grok-3 和 Google Gemini
- 智能識別標題、段落、列表結構
- 自動分塊處理長文本

### 2. 批量處理 (`pipeline_processor.py`)
- 多源支援：百度網盤、Google Drive、本地
- 並行處理 (50 workers)
- 斷點續傳

### 3. 知識索引 (`wittgenstein_indexer.py`)
- 維根斯坦式命題結構
- 概念提取與關係映射
- JSON 格式輸出

## 使用示例

### 單文件轉換
```python
from main import EbookConverterPipeline

pipeline = EbookConverterPipeline()
result = pipeline.process_single_file('/path/to/book.pdf')
print(result['markdown_path'])
```

### 批量處理
```python
from pipeline_processor import PipelineProcessor

processor = PipelineProcessor()
processor.process_directory('/path/to/books', workers=10)
```

### 百度網盤處理
```bash
python run_pipeline.py
# 按提示登錄百度網盤並選擇目錄
```

## 當前狀態 (Dec 2025)

| 指標 | 數值 |
|------|------|
| 已轉換文檔 | 5,153 個 |
| Markdown 總大小 | 3.8 GB |
| 支援 LLM | X.AI Grok-3, Gemini 2.0 Flash |
| 存儲後端 | MongoDB + GCS |

## 依賴安裝

```bash
# 基礎依賴
pip install -r requirements.txt

# OCR 支援 (可選)
apt-get install tesseract-ocr tesseract-ocr-chi-sim tesseract-ocr-chi-tra

# PDF 處理
apt-get install poppler-utils
```

## Docker 部署

```bash
docker-compose up -d
docker exec -it ebook-converter bash
```

## 詳細文檔

- [中文使用指南](README_ZH.md)
- [快速入門](QUICKSTART_ZH.md)
- [詳細用法](USAGE_ZH.md)

## License

MIT
