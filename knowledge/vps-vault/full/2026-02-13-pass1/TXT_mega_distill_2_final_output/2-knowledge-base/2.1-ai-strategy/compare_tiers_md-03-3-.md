---
distilled_by: grok-4-0709
mode: B
---
part: 3
---

## 3. 代碼範例與實作

### 3.1 基本 API 調用範例

以下提供 5-8 個代碼範例，使用 Python 和 Google Generative AI SDK，展示如何在不同層級下處理速率限制。所有範例假設已設定 API 金鑰。

範例1：免費層基本請求（註釋：展示 RPM 限制下的簡單查詢，可能因 quota 延遲）。

```python
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")  # 配置 API 金鑰
model = genai.GenerativeModel('gemini-2.5-pro')  # 選擇模型
response = model.generate_content("Hello, world!")  # 生成內容
print(response.text)  # 輸出回應
# 註釋：在免費層，連續調用可能觸發 RPM 限制，導致 429 錯誤。
```

範例2：收費層高吞吐調用（註釋：利用高 TPM 處理大量 token）。

```python
import google.generativeai as genai
import time

genai.configure(api_key="YOUR_PAID_API_KEY")  # 使用收費層金鑰
model = genai.GenerativeModel('gemini-2.0-flash-lite')  # 選擇高速模型
for i in range(10):  # 模擬高頻請求
    response = model.generate_content(f"Generate story {i}")
    print(response.text)
    time.sleep(0.1)  # 避免過快觸發，但收費層允許更高頻率
# 註釋：收費層支持 4K RPM，適合循環處理而不延遲。
```

範例3：錯誤處理速率限制（註釋：捕捉 quota 錯誤）。

```python
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted

genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel('gemini-2.5-pro')
try:
    response = model.generate_content("Test query")
    print(response.text)
except ResourceExhausted as e:
    print(f"Quota exceeded: {e}")  # 處理免費層常見的 quota 錯誤
# 註釋：免費層易觸發此錯誤，建議升級收費層。
```

範例4：批次處理以優化 TPM（註釋：在收費層最大化 token 處理）。

```python
import google.generativeai as genai

genai.configure(api_key="YOUR_PAID_API_KEY")
model = genai.GenerativeModel('gemini-3-pro-preview')
contents = ["Query 1", "Query 2", "Query 3"]  # 批次內容
responses = model.generate_content(contents)  # 批次生成
for resp in responses:
    print(resp.text)
# 註釋：收費層的 3M TPM 允許大規模批次而不阻塞。
```

範例5：監控 RPD 使用（註釋：追蹤每日請求）。

```python
import google.generativeai as genai
import logging

logging.basicConfig(level=logging.INFO)
genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel('gemini-2.0-flash-lite')
daily_count = 0
while daily_count < 100:  # 模擬每日限制
    response = model.generate_content("Daily test")
    logging.info(response.text)
    daily_count += 1
# 註釋：免費層 RPD 為 5K，超出將拒絕；收費層無限。
```

範例6：整合到 Web 應用（註釋：使用 Flask 展示生產環境）。

```python
from flask import Flask, request
import google.generativeai as genai

app = Flask(__name__)
genai.configure(api_key="YOUR_PAID_API_KEY")
model = genai.GenerativeModel('gemini-2.5-pro')

@app.route('/generate', methods=['POST'])
def generate():
    query = request.json['query']
    response = model.generate_content(query)
    return {'text': response.text}
# 註釋：收費層支持高併發 Web 請求，而免費層易因 RPM 瓶頸崩潰。
```

範例7：自適應速率控制（註釋：動態調整以避免限制）。

```python
import google.generativeai as genai
import time

genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel('gemini-2.5-pro')
def adaptive_generate(query, delay=1):
    response = model.generate_content(query)
    time.sleep(delay)  # 自適應延遲
    return response.text
print(adaptive_generate("Test with delay"))
# 註釋：在免費層，使用延遲避免 RPM 錯誤；收費層可設 delay=0。
```

範例8：多模態請求（註釋：處理圖像與文本，測試 TPM）。

```python
import google.generativeai as genai

genai.configure(api_key="YOUR_PAID_API_KEY")
model = genai.GenerativeModel('gemini-2.0-flash-lite')
image = genai.upload_file("path/to/image.jpg")  # 上傳圖像
response = model.generate_content(["Describe this image", image])
print(response.text)
# 註釋：收費層的高 TPM 支持多模態大輸入，而免費層易超限。
```
