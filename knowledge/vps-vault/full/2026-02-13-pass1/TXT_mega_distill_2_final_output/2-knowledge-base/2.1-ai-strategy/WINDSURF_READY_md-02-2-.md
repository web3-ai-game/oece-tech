---
title: Windsurf 開發環境就緒指南：從部署到 AI 實驗頁面開發
category: 2-knowledge-base/2.1-ai-strategy
source: gcp-distilled/WINDSURF_READY.md.distilled
distilled_by: grok-4-0709
mode: B
---
part: 2
---

## 2. 核心開發任務：後端 API 與 AI 整合

Windsurf 的核心任務聚焦於後端 API 的開發，包括 Supabase 資料庫集成、用戶認證系統以及 Gemini AI API 的整合。這是項目從靜態網站轉向動態應用的關鍵轉折點。

### 2.1 後端技術棧詳解

後端採用 Node.js/Express 框架，結合 Supabase 作為後端即服務 (BaaS) 和 Gemini AI 作為生成式 AI 引擎。背景是，Node.js 的非阻塞 I/O 模型適合高併發應用，而 Express 提供簡潔的路由管理。

原理上，Supabase 基於 PostgreSQL，提供即時資料庫 (Realtime Database) 和認證功能，原理是透過 WebSocket 實現資料同步。實例：用戶註冊時，Express 路由處理請求，Supabase 儲存用戶資料，並透過 JWT (JSON Web Tokens) 進行認證。

### 2.11 Supabase 集成原理與實例

Supabase 的集成涉及設定環境變量和 API 端點。背景上，Supabase 源自 Firebase 的開源替代，強調資料隱私和 SQL 支持。

原理是使用 Supabase JavaScript SDK 來操作資料庫，如插入、查詢和訂閱變化。實例：在用戶登入時，SDK 驗證憑證並返回 access token。

代碼範例1：Supabase 初始化（JavaScript）

```javascript
// 初始化 Supabase 客戶端
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 註釋：這段代碼使用環境變量來安全連接 Supabase，避免硬編碼敏感資訊。
```

代碼範例2：用戶註冊功能

```javascript
// 用戶註冊端點 (Express 路由)
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 註釋：此路由處理註冊請求，Supabase 自動處理密碼哈希和驗證。
```

### 2.12 Gemini AI API 整合

Gemini AI 是 Google 的多模態 AI 模型，用於 Windsurf 的 AI 實驗。背景是，Gemini 繼承自 PaLM 模型，專注於文字生成和圖像理解。

原理上，透過 REST API 調用 Gemini，傳遞提示 (prompt) 並接收回應。實例：用於「真話謊言鑑定器」實驗，Gemini 分析用戶輸入的陳述以判斷真偽。

代碼範例3：Gemini API 調用

```javascript
// Gemini API 調用函數
async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// 註釋：這段代碼發送提示到 Gemini API，並解析回應文字。注意 API 版本和金鑰管理。
```
