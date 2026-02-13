---
title: 🛠️ 工具武器庫 | TOOL ARSENAL
category: 2-knowledge-base/2.4-engineering
source: docs/05-資源與工具/TOOLS-ARSENAL-ULTRA.md
distilled_by: grok-4-0709
mode: B
---
part: 15
---

## 5.5 Notion API查詢資料庫

```javascript
// Node.js範例
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: 'your-token' });

// 查詢資料庫
async function queryDatabase() {
  const response = await notion.databases.query({ database_id: 'db-id' });
  console.log(response.results);  // 輸出結果
}
queryDatabase();
```
