---
distilled_by: grok-4-0709
mode: B
---
part: 2
---

## 2. API Token 清單與管理

### 2.1 清單概述
Windsurf MCP 支持多個服務的 API Token，包括 Notion、Gemini、GitHub 等。背景：這些 Token 用於整合外部 API，提升 AI 功能如知識檢索或代碼生成。原理：集中管理 Token 可減少配置錯誤，並透過環境變量注入確保安全性。實例：在一個 AI 項目中，使用 Notion Token 來讀取知識庫，若無清單，開發者易遺漏配置。

| 服務名稱 | Token 類型 | 用途 | 安全等級 |
|----------|------------|------|----------|
| Notion | API Key | 知識庫讀寫 | 高（加密儲存） |
| Gemini | API Token | AI 模型調用 | 高（Doppler 管理） |
| GitHub | Personal Access Token | 代碼倉庫存取 | 中（權限受限） |
| MongoDB | Connection String | 資料庫連接 | 高（環境變量） |
| Supabase | API Key | 後端服務 | 中（定期輪換） |
| Doppler | Workspace Token | 密鑰管理 | 最高（不顯示） |
| OpenRouter | API Token | 路由服務 | 中（監控使用） |

### 2.2 Token 安全規則
規則強調優先使用 Doppler，避免明文顯示。背景：Token 洩漏事件頻發，如 2023 年 GitHub Token 外洩案。原理：Doppler 提供加密注入，確保 Token 只在運行時可用。實例：開發者若直接在程式碼中硬編碼 Token，易被攻擊；使用 Doppler 可自動注入變量。

#### 2.21 代碼範例：Doppler Token 注入
```bash
# 範例1: 使用 Doppler 運行服務並注入 Token
doppler run --command="node server.js"  # 自動注入環境變量如 NOTION_API_KEY
# 註釋: 此命令確保 Token 不暴露在終端，僅在運行時可用。
```

```javascript
// 範例2: Node.js 中讀取 Doppler 注入的 Token
const notionKey = process.env.NOTION_API_KEY;  // 從環境變量讀取
if (!notionKey) throw new Error('Missing Notion API Key');
// 註釋: 避免硬編碼，依賴 Doppler 提供安全注入。
```

### 2.3 Token 輪換與監控
定期輪換 Token 是最佳實踐。背景：Token 有效期管理可防範長期洩漏。原理：自動化腳本監控使用率，超過閾值時輪換。實例：在企業環境中，每季度輪換 GitHub Token 可降低風險。
