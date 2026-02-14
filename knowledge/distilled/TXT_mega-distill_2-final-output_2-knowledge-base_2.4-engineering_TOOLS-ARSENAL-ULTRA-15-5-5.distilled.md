---
source: TXT_mega-distill_2-final-output_2-knowledge-base_2.4-engineering_TOOLS-ARSENAL-ULTRA-15-5-5.md
distilled_at: 2026-02-14T09:19:38.543Z
model: grok-4-1-fast-non-reasoning
---

# 🛠️ 工具武器庫 | TOOL ARSENAL

**類別**: 2-knowledge-base/2.4-engineering  
**來源**: docs/05-資源與工具/TOOLS-ARSENAL-ULTRA.md  
**蒸餾者**: grok-4-0709  
**模式**: B  
**部分**: 15  

---

## 📋 概述

本文件詳細介紹如何使用 **Notion API** 在 **Node.js** 環境中查詢資料庫。這是 Notion 開發中常見的操作，用於從 Notion 資料庫中擷取結構化資料，如任務清單、專案追蹤或知識庫項目。Notion API 提供強大的資料庫查詢功能，支援篩選、排序和分頁。

**核心主題**: 5.5 Notion API 查詢資料庫  
**語言/環境**: Node.js  
**主要套件**: [`@notionhq/client`](https://www.npmjs.com/package/@notionhq/client)  

---

## 🔑 前置條件

在使用 Notion API 前，需準備以下項目：

1. **Notion API Token**:
   - 在 [Notion 整合頁面](https://www.notion.so/my-integrations) 建立整合 (Integration)。
   - 複製生成的 **Internal Integration Token**（格式：`secret_xxx`）。

2. **Database ID**:
   - 開啟目標 Notion 資料庫頁面。
   - URL 中的 `database_id` 為 32 位字串，例如：`https://www.notion.so/your-workspace/abc123def456...?v=...`，其中 `abc123def456` 即為 ID。

3. **權限設定**:
   - 在 Notion 資料庫頁面，點擊「分享」>「新增人員」> 選擇你的整合，並授予「讀取內容」權限。

4. **Node.js 環境**:
   ```bash
   npm init -y
   npm install @notionhq/client
   ```

---

## 🏗️ 程式碼範例

以下是完整、可執行的 Node.js 範例，用於查詢 Notion 資料庫。

```javascript
const { Client } = require('@notionhq/client');

// 初始化 Notion 客戶端
const notion = new Client({ auth: 'secret_your-notion-token-here' });

// 查詢資料庫的主函數（非同步）
async function queryNotionDatabase() {
  try {
    const databaseId = 'your-database-id-here'; // 替換為實際 ID

    const response = await notion.databases.query({
      database_id: databaseId,
    });

    console.log('查詢結果:', response.results);
    return response.results; // 陣列格式，每個元素為一個 Page 物件
  } catch (error) {
    console.error('錯誤:', error.body);
  }
}

// 執行查詢
queryNotionDatabase();
```

### 輸出範例
```
查詢結果: [
  {
    object: 'page',
    id: 'page-id',
    created_time: '2024-01-01T00:00:00.000Z',
    last_edited_time: '2024-01-01T00:00:00.000Z',
    created_by: { ... },
    parent: { ... },
    archivable: true,
    properties: {
      Name: { title: [{ text: { content: '任務一' } }] },
      Status: { select: { name: '進行中' } },
      Date: { date: { start: '2024-01-15' } }
    }
  },
  // ... 更多頁面
]
```

---

## ⚙️ 核心 API 細節

### 1. **初始化客戶端**
```javascript
const notion = new Client({ auth: 'your-token' });
```
- `auth`: Notion API Token（必填）。
- 支援環境變數：`process.env.NOTION_TOKEN`。

### 2. **主要函數：`queryDatabase()`**
```javascript
await notion.databases.query({
  database_id: 'db-id', // 必填，32 位字串
  // 選用參數：
  filter: { /* 篩選條件 */ },
  sorts: [ /* 排序規則 */ ],
  page_size: 100, // 預設 30，最大 100
  start_cursor: 'cursor', // 分頁用
});
```
- **輸出**: `{ results: [...], next_cursor: '...', has_more: true }`
- **非同步**: 總是返回 Promise。

### 3. **常見擴展參數**
- **篩選 (Filter)**:
  ```javascript
  filter: {
    property: 'Status',
    select: { equals: '已完成' }
  }
  ```
- **排序 (Sort)**:
  ```javascript
  sorts: [{ property: 'Date', direction: 'descending' }]
  ```

---

## 🚀 進階用法

### 分頁查詢（處理大量資料）
```javascript
async function fetchAllPages(databaseId) {
  let allPages = [];
  let startCursor = undefined;
  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: startCursor,
      page_size: 100,
    });
    allPages = allPages.concat(response.results);
    startCursor = response.next_cursor;
  } while (startCursor);
  return allPages;
}
```

### 錯誤處理最佳實踐
```javascript
try {
  const response = await notion.databases.query({ database_id });
  // 處理 response
} catch (error) {
  if (error.code === 'validation_error') {
    console.error('參數錯誤:', error.message);
  } else if (error.code === 'unauthorized') {
    console.error('Token 無效或權限不足');
  }
}
```

---

## 🛡️ 常見問題排除

| 問題 | 原因 | 解決方案 |
|------|------|----------|
| `401 Unauthorized` | Token 無效 | 檢查 Token 是否正確，重新產生 |
| `404 Not Found` | Database ID 錯誤 | 確認 URL 中的 32 位 ID |
| `403 Forbidden` | 權限不足 | 在資料庫「分享」中新增整合 |
| 空結果 | 篩選過嚴 | 移除 `filter` 測試基本查詢 |
| `Rate limited` | 請求過頻 | 新增延遲：`await new Promise(r => setTimeout(r, 100));` |

---

## 📚 參考資源

- [官方文件：Query a database](https://developers.notion.com/reference/post-database-query)
- [Node.js SDK](https://github.com/makenotion/notion-sdk-js)
- [API 限制](https://developers.notion.com/page/rate-limits)：每秒 3 請求，每分鐘 60 單位。

**最後更新**: 基於 grok-4-0709 蒸餾 | 準備好部署到生產環境！ 🚀