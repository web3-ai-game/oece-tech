---
title: 🛠️ 工具武器庫 | TOOL ARSENAL
category: 2-knowledge-base/2.4-engineering
source: docs/05-資源與工具/TOOLS-ARSENAL-ULTRA.md
distilled_by: grok-4-0709
mode: B
---
part: 13
---

## 5.3 Python腳本使用ChatGPT API

```python
import openai

# 設置API密鑰
openai.api_key = 'your-api-key'

# 生成文本
response = openai.Completion.create(
    engine="text-davinci-003",
    prompt="Generate a cyberpunk story",
    max_tokens=100
)
print(response.choices[0].text)  # 輸出生成內容
```
