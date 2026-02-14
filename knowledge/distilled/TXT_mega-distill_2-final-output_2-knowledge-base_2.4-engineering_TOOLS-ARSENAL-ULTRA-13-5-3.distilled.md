---
source: TXT_mega-distill_2-final-output_2-knowledge-base_2.4-engineering_TOOLS-ARSENAL-ULTRA-13-5-3.md
distilled_at: 2026-02-14T09:18:46.054Z
model: grok-4-1-fast-non-reasoning
---

# 🛠️ 工具武器庫 | TOOL ARSENAL

**分類路徑**：2-knowledge-base/2.4-engineering  
**來源文件**：docs/05-資源與工具/TOOLS-ARSENAL-ULTRA.md  
**蒸餾工具**：grok-4-0709  
**蒸餾模式**：B  
**部分**：13  
**章節**：5.3 Python腳本使用ChatGPT API  

---

## 介紹

本章節聚焦於使用 Python 腳本透過 OpenAI 的 ChatGPT API 生成文本內容。這是工具武器庫中工程類別的重要組成部分，適用於自動化內容生成、故事創作、程式碼輔助等應用。透過簡單的 Python 程式碼，您可以輕鬆呼叫 OpenAI 的強大語言模型，生成高品質輸出。

**核心目的**：使用 `openai` 庫與 ChatGPT API 互動，生成如賽博龐克（cyberpunk）故事等自訂文本。腳本基於 OpenAI 的 Completion API（舊版端點），適合快速原型開發。

**先決條件**：
- 安裝 Python 庫：`pip install openai`
- 取得 OpenAI API 金鑰（從 [OpenAI 平台](https://platform.openai.com/api-keys) 註冊並生成）
- 注意：本示例使用舊版 `Completion.create()` 端點（text-davinci-003 引擎）。OpenAI 已轉向新版 Chat Completions API（`chat.completions.create()`），但此腳本保留相容舊版設計。

---

## 完整 Python 腳本範例

以下是基於關鍵事實的完整、可執行腳本。將 `'your-api-key'` 替換為您的實際 API 金鑰。

```python
import openai

# API 設置
openai.api_key = 'your-api-key'  # 替換為您的 OpenAI API 金鑰

# API 呼叫
response = openai.Completion.create(
    engine="text-davinci-003",      # 引擎：text-davinci-003（高品質文本生成）
    prompt="Generate a cyberpunk story",  # 輸入提示：生成賽博龐克故事
    max_tokens=100                  # 最大輸出 token 數（控制長度）
)

# 響應處理
generated_text = response.choices[0].text.strip()
print("生成的賽博龐克故事：")
print(generated_text)
```

### 執行結果範例
```
生成的賽博龐克故事：
In the neon-drenched sprawl of Neo-Tokyo, Jax hacked the megacorp's mainframe...
（依 API 回應而定，輸出約 100 tokens 的故事片段）
```

---

## API 參數詳解

`openai.Completion.create()` 是核心端點，用於文本補全任務。以下是關鍵參數的表格與說明：

| 參數          | 值示例                      | 說明                                                                 |
|---------------|-----------------------------|----------------------------------------------------------------------|
| `engine`     | `"text-davinci-003"`       | 指定模型引擎。`text-davinci-003` 是舊版旗艦模型，支持長上下文與創意生成。替代：`gpt-3.5-turbo-instruct`。 |
| `prompt`     | `"Generate a cyberpunk story"` | 輸入提示詞。越詳細，輸出越精準（如添加風格、角色、長度要求）。          |
| `max_tokens` | `100`                      | 限制輸出長度（1 token ≈ 4 字元）。上限依模型而定，避免超支。             |
| `temperature`| `0.7` (未列但推薦)         | 控制隨機性（0=確定性，1=創意）。預設 1。                              |
| `n`          | `1` (未列但推薦)           | 生成選擇數量。                                                        |

**額外最佳化參數**（可選擴充腳本）：
- `temperature=0.8`：平衡創意與一致性。
- `top_p=1`：核取概率，控制輸出多樣性。
- `frequency_penalty=0` / `presence_penalty=0`：避免重複。

---

## 響應處理與錯誤處理

- **主要輸出**：`response.choices[0].text` – 提取第一個生成的文本（`.strip()` 去除多餘空白）。
- **完整響應結構**：
  ```python
  print(response)  # 包含 usage（token 消耗）、choices 等
  ```
- **錯誤處理範例**（增強版腳本）：
  ```python
  try:
      response = openai.Completion.create(...)
      print(response.choices[0].text.strip())
  except openai.error.AuthenticationError:
      print("API 金鑰無效，請檢查。")
  except openai.error.RateLimitError:
      print("速率限制，請稍後重試。")
  ```

**Token 消耗**：回應包含 `response.usage`（prompt_tokens + completion_tokens），有助追蹤成本。

---

## 進階應用與脈絡補充

### 1. **自訂提示工程**
   - 基本：`"Generate a cyberpunk story"`
   - 進階：`"Write a 200-word cyberpunk story about a hacker in rainy Night City, first-person perspective, ending with a twist."`

### 2. **遷移至新版 API（推薦）**
   OpenAI 推薦 `chat.completions.create()`：
   ```python
   from openai import OpenAI
   client = OpenAI(api_key='your-api-key')
   response = client.chat.completions.create(
       model="gpt-3.5-turbo",
       messages=[{"role": "user", "content": "Generate a cyberpunk story"}],
       max_tokens=100
   )
   print(response.choices[0].message.content)
   ```

### 3. **常見使用案例**
   - **內容生成**：故事、文章、詩歌。
   - **程式碼輔助**：`"Write a Python function to sort a list"`
   - **自動化**：整合 Flask/Django 建聊天機器人。
   - **批量處理**：迴圈多個提示，生成數據集。

### 4. **成本與限制**
   - `text-davinci-003`：約 $0.02/1K tokens（輸入）+ $0.06/1K（輸出）。查 [OpenAI 定價](https://openai.com/pricing)。
   - 速率限制：3,500 RPM（依帳戶等級）。
   - 安全：避免敏感提示，OpenAI 有內容過濾。

### 5. **疑難排解**
   - **無輸出**：檢查 `max_tokens` > 0。
   - **金鑰錯誤**：使用環境變數 `export OPENAI_API_KEY=sk-...`。
   - **模型停用**：若 `text-davinci-003` 不可用，切換 `gpt-3.5-turbo-instruct`。

此文檔提供完整、可操作指南，基於原始事實蒸餾而成。欲探索更多工具武器庫部分，請參考來源文件。