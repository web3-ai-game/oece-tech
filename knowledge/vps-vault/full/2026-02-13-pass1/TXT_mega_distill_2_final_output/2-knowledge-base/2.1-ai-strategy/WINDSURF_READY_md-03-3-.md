---
title: Windsurf 開發環境就緒指南：從部署到 AI 實驗頁面開發
category: 2-knowledge-base/2.1-ai-strategy
source: gcp-distilled/WINDSURF_READY.md.distilled
distilled_by: grok-4-0709
mode: B
---
part: 3
---

## 3. AI 實驗頁面開發階段

項目分三階段開發五大 AI 實驗頁面，包括真話謊言鑑定器、朋友測試等。前端使用 Vanilla JS/HTML/CSS，確保輕量級實現。

### 3.1 開發階段劃分

階段一：後端 API 基礎；階段二：實驗頁面原型；階段三：優化和部署。背景是，採用敏捷方法 (Agile Methodology) 以迭代方式推進。

原理上，每階段結束進行測試，確保功能完整。實例：階段一完成後，測試用戶認證流程。

| 階段 | 任務 | 持續時間估計 | 依賴 |
|------|------|--------------|------|
| 一 | 後端 API 集成 | 2-4 周 | Supabase & Gemini |
| 二 | 五大實驗頁面 | 4-6 周 | 後端 API |
| 三 | 優化與部署 | 2 周 | 前兩個階段 |

### 3.11 前端實現細節

前端為 Vanilla JS，無框架依賴。背景是，為了最小化載入時間和依賴。

原理上，使用 DOM 操作處理用戶互動。實例：動態載入 AI 回應。

代碼範例4：前端 AI 查詢表單

```html
<!-- HTML 結構 -->
<form id="ai-form">
  <input type="text" id="prompt" placeholder="Enter your query">
  <button type="submit">Submit</button>
</form>
<div id="response"></div>

<script>
// JavaScript 事件監聽
document.getElementById('ai-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const prompt = document.getElementById('prompt').value;
  const response = await fetch('/api/gemini', { method: 'POST', body: JSON.stringify({ prompt }) });
  const data = await response.json();
  document.getElementById('response').innerText = data.text;
});
// 註釋：此腳本處理表單提交，調用後端 API 並顯示回應。
</script>
```

代碼範例5：錯誤處理在前端

```javascript
// 前端錯誤處理
async function fetchAI(prompt) {
  try {
    const response = await fetch('/api/gemini', { method: 'POST', body: JSON.stringify({ prompt }) });
    if (!response.ok) throw new Error('API Error');
    return await response.json();
  } catch (error) {
    console.error('Fetch Error:', error);
    alert('An error occurred. Please try again.');
  }
}

// 註釋：添加 try-catch 塊來處理網路錯誤，提升用戶體驗。
```
