# 使用指南

## 快速開始（3 步驟）

### 步驟 1: 啟動系統

```bash
cd /home/sms/ebook-converter
./start.sh
```

### 步驟 2: 進入容器

```bash
sudo docker exec -it ebook-converter bash
```

### 步驟 3: 運行測試

```bash
python3 test_converter.py
```

如果測試通過，繼續下一步。

## 完整工作流程

### 方案 A: 從百度網盤處理（推薦）

```bash
# 1. 進入容器
sudo docker exec -it ebook-converter bash

# 2. 運行完整管道
python3 run_pipeline.py

# 按提示操作：
# - 首次運行會要求登錄百度網盤（需要在瀏覽器中授權）
# - 輸入百度網盤路徑，例如: /apps/bypy
# - 選擇要處理的文件數量
# - 等待處理完成
```

### 方案 B: 處理本地文件

```bash
# 1. 複製文件到數據目錄
cp your-book.pdf /home/sms/ebook-converter/data/baidu-cache/

# 2. 處理文件
sudo docker exec -it ebook-converter python3 main.py /data/baidu-cache/your-book.pdf

# 3. 查看結果
ls /home/sms/ebook-converter/data/markdown-output/
```

### 方案 C: 批量處理目錄

```bash
# 1. 複製所有文件到目錄
cp -r /path/to/books/* /home/sms/ebook-converter/data/baidu-cache/

# 2. 批量處理
sudo docker exec -it ebook-converter python3 main.py /data/baidu-cache/

# 3. 查看進度
sudo docker logs -f ebook-converter
```

## 查看結果

### Markdown 文件

```bash
# 在宿主機查看
ls -lh /home/sms/ebook-converter/data/markdown-output/
cat /home/sms/ebook-converter/data/markdown-output/your-book.md
```

### 索引文件

```bash
# 查看主索引
cat /home/sms/ebook-converter/data/wittgenstein-index/master_index.json | jq

# 查看命題
cat /home/sms/ebook-converter/data/wittgenstein-index/propositions.json | jq

# 查看概念
cat /home/sms/ebook-converter/data/wittgenstein-index/concepts.json | jq
```

### S3 存儲

```bash
# 查看 GCS 掛載點
ls -lh /home/sms/ebook-pipeline/gcs-mount/markdown/
ls -lh /home/sms/ebook-pipeline/gcs-mount/index/
```

## 常見任務

### 1. 只轉換不上傳

編輯 `main.py`，註釋掉 S3 上傳部分：

```python
# self.s3.upload_markdown(md_path, doc_id)
# self.s3.upload_structure(doc_id, structure)
```

### 2. 調整 Gemini 模型

編輯 `config.py`:

```python
GEMINI_MODELS = {
    'fast': 'gemini-2.0-flash-exp',  # 最快
    'lite': 'gemini-1.5-flash',      # 較快
    'default': 'gemini-2.0-flash-exp'
}
```

### 3. 增加文本塊大小

編輯 `config.py`:

```python
CHUNK_SIZE = 8192  # 預設 4096
```

### 4. 處理特定格式

```python
from main import EbookConverterPipeline

pipeline = EbookConverterPipeline()

# 只處理 PDF
import glob
pdf_files = glob.glob('/data/baidu-cache/*.pdf')
for pdf in pdf_files:
    pipeline.process_single_file(pdf)
```

## 監控和調試

### 查看實時日誌

```bash
sudo docker logs -f ebook-converter
```

### 進入容器調試

```bash
sudo docker exec -it ebook-converter bash

# 查看 Python 環境
python3 --version
pip3 list | grep -E "google|gemini"

# 測試 Gemini API
python3 -c "import google.generativeai as genai; genai.configure(api_key='AIzaSyCG459HOLhXkbDQgw8rSYAvuqyM3RdMQHQ'); print('OK')"
```

### 檢查磁盤空間

```bash
df -h /home/sms/ebook-converter/data
```

### 清理緩存

```bash
rm -rf /home/sms/ebook-converter/data/baidu-cache/*
```

## 性能優化

### 1. 並行處理（高級）

修改 `main.py` 使用多線程：

```python
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=3) as executor:
    futures = [executor.submit(self.process_single_file, f) for f in files]
    for future in futures:
        result = future.result()
```

### 2. 減少 API 調用

增加 `CHUNK_SIZE` 並減少文本分塊：

```python
CHUNK_SIZE = 16384  # 更大的塊
```

### 3. 使用本地緩存

在 `gemini_converter.py` 中添加緩存：

```python
import hashlib
import json

def convert_with_cache(self, text, metadata):
    cache_key = hashlib.md5(text.encode()).hexdigest()
    cache_file = f"/tmp/cache_{cache_key}.json"
    
    if os.path.exists(cache_file):
        with open(cache_file) as f:
            return json.load(f)['result']
    
    result = self.convert_text_to_markdown(text, metadata)
    
    with open(cache_file, 'w') as f:
        json.dump({'result': result}, f)
    
    return result
```

## 故障排除

### 問題 1: Gemini API 錯誤

```
錯誤: 403 Forbidden
解決: 檢查 API Key 是否正確
```

```bash
# 在容器內測試
python3 -c "from config import GEMINI_API_KEY; print(GEMINI_API_KEY)"
```

### 問題 2: 百度網盤登錄失敗

```
錯誤: bypy: command not found
解決: 重新構建容器
```

```bash
sudo docker-compose build --no-cache
sudo docker-compose up -d
```

### 問題 3: S3 上傳失敗

```
錯誤: NoCredentialsError
解決: 配置 AWS 憑證 (適用於 AWS S3 或 Google Cloud Storage)
```

**Google Cloud Storage (GCS) 用戶:**
1. 進入 Google Cloud Console > Cloud Storage > Settings > Interoperability
2. 創建 HMAC key
3. 設置環境變量:

```bash
export AWS_ACCESS_KEY_ID=你的_HMAC_Access_Key
export AWS_SECRET_ACCESS_KEY=你的_HMAC_Secret
```

**AWS S3 用戶:**
```bash
# 方法 1: 環境變量
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
```

### 問題 4: OCR 失敗

```
錯誤: TesseractNotFoundError
解決: 確保 Tesseract 已安裝
```

```bash
sudo docker exec -it ebook-converter bash
tesseract --version
```

### 問題 5: 內存不足

```
錯誤: MemoryError
解決: 減小批次大小或增加 Docker 內存限制
```

```yaml
# docker-compose.yml
services:
  ebook-converter:
    mem_limit: 4g
```

## 進階配置

### 自定義提示詞

編輯 `gemini_converter.py` 中的 `convert_text_to_markdown` 方法：

```python
prompt = f"""你是專業的學術文本編輯器。

任務: 將以下文本轉換為結構化 Markdown

要求:
1. 識別學術論文結構（摘要、引言、方法、結果、討論）
2. 標記引用格式 [作者, 年份]
3. 提取關鍵術語並加粗
4. 保留數學公式（使用 LaTeX）
5. 創建目錄結構

文本:
{text}

輸出 Markdown:"""
```

### 添加後處理

在 `main.py` 的 `process_single_file` 中添加：

```python
# 在保存 Markdown 之前
markdown_text = self.post_process(markdown_text)

def post_process(self, text):
    # 清理多餘空行
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # 統一標題格式
    text = re.sub(r'^#{1,6}\s*', lambda m: m.group(0).strip() + ' ', text, flags=re.MULTILINE)
    
    # 添加目錄
    toc = self.generate_toc(text)
    text = f"{toc}\n\n{text}"
    
    return text
```

## 最佳實踐

1. **小批量測試**: 先處理 5-10 個文件測試效果
2. **監控 API 配額**: Gemini 有每日限制
3. **定期備份索引**: 複製 `wittgenstein-index/` 目錄
4. **使用描述性文件名**: 便於後續查找
5. **保留原始文件**: 不要刪除源文件

## 擴展功能

### 添加新的輸出格式

```python
# 在 main.py 中添加
def export_to_html(self, markdown_text, doc_id):
    import markdown
    html = markdown.markdown(markdown_text)
    html_path = f"/data/html-output/{doc_id}.html"
    with open(html_path, 'w') as f:
        f.write(html)
```

### 集成其他 AI 模型

```python
# 添加 OpenAI 支持
from openai import OpenAI

class OpenAIConverter:
    def __init__(self):
        self.client = OpenAI(api_key="your_key")
    
    def convert(self, text):
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": f"Convert to markdown: {text}"}]
        )
        return response.choices[0].message.content
```

## 獲取幫助

- 查看日誌: `sudo docker logs ebook-converter`
- 測試組件: `python3 test_converter.py`
- 閱讀文檔: `README_ZH.md`
