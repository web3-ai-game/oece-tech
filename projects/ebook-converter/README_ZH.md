# 電子書轉 Markdown 轉換器

使用 Gemini 2.0 Flash 將各種格式的電子書轉換為結構化 Markdown，並創建維根斯坦式索引。

## 功能特性

### 1. 多格式支援
- **PDF**: 文字提取 + OCR (支援中英文)
- **EPUB/MOBI**: 完整章節提取
- **DOCX/DOC**: Word 文檔處理
- **TXT/HTML**: 純文本和網頁

### 2. Gemini AI 轉換
- 使用 Gemini 2.0 Flash 進行智能轉換
- 自動識別標題、段落、列表結構
- 保留語義和格式信息
- 支援長文本分塊處理

### 3. 維根斯坦索引
- **命題式結構**: 按邏輯層級組織內容
- **概念提取**: 自動識別關鍵概念
- **關係映射**: 建立概念間的關聯
- **層級結構**: 構建知識樹

### 4. S3 存儲
- 自動上傳 Markdown 文件
- 結構化索引存儲
- 元數據管理

## 快速開始

### 1. 構建 Docker 容器

```bash
cd /home/sms/ebook-converter
sudo docker-compose build
sudo docker-compose up -d
```

### 2. 進入容器

```bash
sudo docker exec -it ebook-converter bash
```

### 3. 配置 AWS 憑證（用於 S3 或 Google Cloud Storage）

本系統支援 AWS S3 和 Google Cloud Storage (GCS)。

#### Google Cloud Storage (GCS) 配置

1. 在 Google Cloud Console 中進入 Cloud Storage 設置。
2. 點擊 "Interoperability" (互操作性) 選項卡。
3. 創建一個新的 Access Key (HMAC 密鑰)。
4. 設置環境變量：

```bash
export AWS_ACCESS_KEY_ID=你的_HMAC_Access_Key
export AWS_SECRET_ACCESS_KEY=你的_HMAC_Secret
```

系統已預配置使用 `vps-bomb` bucket 和 `asia-southeast1` 區域。

#### AWS S3 配置

```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
```

### 4. 運行完整管道

```bash
python3 run_pipeline.py
```

按提示操作：
1. 登錄百度網盤
2. 輸入遠程路徑（如 `/apps/bypy`）
3. 選擇要處理的文件數量
4. 等待處理完成

## 使用方法

### 方法一：處理百度網盤文件（推薦）

```bash
python3 run_pipeline.py
```

### 方法二：處理本地文件

```python
from main import EbookConverterPipeline

pipeline = EbookConverterPipeline()

# 處理單個文件
result = pipeline.process_single_file('/path/to/book.pdf')

# 處理整個目錄
pipeline.process_directory('/path/to/books')
```

### 方法三：手動控制流程

```python
from gemini_converter import GeminiConverter
from ebook_extractor import EbookExtractor
from wittgenstein_indexer import WittgensteinIndexer
from s3_uploader import S3Uploader

# 1. 提取文本
extractor = EbookExtractor()
extracted = extractor.extract('book.pdf')

# 2. 轉換為 Markdown
converter = GeminiConverter('fast')
markdown = converter.convert_text_to_markdown(
    extracted['text'],
    {'filename': 'book.pdf', 'type': 'pdf'}
)

# 3. 提取結構
structure = converter.extract_structure(markdown, 'book.pdf')

# 4. 創建索引
indexer = WittgensteinIndexer()
doc_id = indexer.add_document('book.pdf', 'book.md', structure)
indexer.save_index()

# 5. 上傳到 S3
uploader = S3Uploader()
uploader.upload_markdown('book.md', doc_id)
uploader.upload_structure(doc_id, structure)
```

## 配置說明

編輯 `config.py`:

```python
# Gemini API
GEMINI_API_KEY = "your_api_key"
GEMINI_MODELS = {
    'fast': 'gemini-2.0-flash-exp',
    'lite': 'gemini-1.5-flash'
}

# 目錄配置
BAIDU_CACHE_DIR = "/data/baidu-cache"
MD_OUTPUT_DIR = "/data/markdown-output"
INDEX_DIR = "/data/wittgenstein-index"

# S3 配置
S3_BUCKET = "vps-bomb"

# 處理參數
MAX_DISK_USAGE_GB = 200
CHUNK_SIZE = 4096
BATCH_SIZE = 5
```

## 輸出結構

### Markdown 文件

```
/data/markdown-output/
├── book1.md
├── book2.md
└── ...
```

每個 MD 文件包含：
- 文件元數據
- 結構化內容
- 標題層級
- 格式化段落

### 索引文件

```
/data/wittgenstein-index/
├── master_index.json      # 主索引
├── propositions.json      # 命題列表
├── concepts.json          # 概念列表
└── relations.json         # 關係映射
```

### S3 結構

```
s3://vps-bomb/
├── markdown/
│   ├── {doc_id}/
│   │   └── book.md
├── structures/
│   ├── {doc_id}/
│   │   └── structure.json
└── index/
    ├── master.json
    ├── propositions.json
    ├── concepts.json
    └── relations.json
```

## 維根斯坦索引示例

```json
{
  "propositions": [
    {
      "id": "1",
      "text": "世界是所有發生的事情",
      "level": 1
    },
    {
      "id": "1.1",
      "text": "世界是事實的總和，而非事物的總和",
      "level": 2
    }
  ],
  "concepts": [
    {
      "name": "世界",
      "frequency": 15,
      "context": "形而上學基礎"
    }
  ],
  "relations": [
    {
      "source": "世界",
      "target": "事實",
      "type": "包含"
    }
  ]
}
```

## 性能優化

### 1. 調整批次大小

```python
# config.py
BATCH_SIZE = 10  # 增加批次大小
```

### 2. 使用更快的模型

```python
converter = GeminiConverter('fast')  # 使用 2.0-flash
```

### 3. 調整文本塊大小

```python
CHUNK_SIZE = 8192  # 增加塊大小（減少 API 調用）
```

## 故障排除

### 問題：Gemini API 超時

```python
# 在 gemini_converter.py 中增加重試邏輯
import time
for retry in range(3):
    try:
        response = self.model.generate_content(prompt)
        break
    except Exception as e:
        if retry < 2:
            time.sleep(5)
        else:
            raise
```

### 問題：OCR 失敗

確保安裝了 Tesseract：
```bash
apt-get install tesseract-ocr tesseract-ocr-chi-sim
```

### 問題：S3 上傳失敗

檢查憑證：
```bash
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY
```

或使用 GCS 挂載點：
```bash
ls /gcs-mount
```

## API 限制

Gemini API 限制：
- 每分鐘請求數: 60
- 每天請求數: 1500
- 文本長度: 32K tokens

建議：
- 使用文本分塊
- 添加延遲（1-2秒）
- 監控配額

## 進階功能

### 自定義結構提取

編輯 `gemini_converter.py` 中的提示詞：

```python
prompt = f"""自定義提示詞...
要求：
1. 提取特定領域概念
2. 識別論證結構
3. 標記引用來源
...
"""
```

### 添加新格式支援

在 `ebook_extractor.py` 中添加：

```python
def extract_new_format(self, file_path: str) -> Dict:
    # 實現新格式提取
    pass

self.supported_formats['.new'] = self.extract_new_format
```

## 授權

MIT License

## 支援

遇到問題請查看日誌：
```bash
docker logs ebook-converter
```
