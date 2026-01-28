# 🔐 Windsurf MCP 工具配置與 Token 清單

> **最後更新**: 2025-11-26
> **用途**: Windsurf UI 配置參考 + MCP 工具優化

---

## 📋 所有 Token 明文清單

### 1. Notion API（用於 Notion MCP）
```
NOTION_TOKEN=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
NOTION_API_KEY=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
NOTION_INTEGRATION_NAME=sms-sms
```

### 2. Gemini API
```
GEMINI_API_KEY=AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ
GEMINI_API_KEY_BACKUP=AIzaSyBDXNZ-n19FGXWwwAQxtYB2H-Cs20bjkeU
GEMINI_FREE_KEY=AIzaSyD_cNll0AKAmKZgO6pOJzMRosKiBJxuUNM
```

### 3. GitHub Token（用於 CI/CD）
```
GITHUB_TOKEN=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
GITHUB_ORG=web3-ai-game
```

### 4. MongoDB Atlas
```
MONGODB_URI=mongodb+srv://svs-mcp:<db_password>@svs-mcp.6nddk.mongodb.net/?appName=svs-mcp
```
> ⚠️ 注意: 需要將 `<db_password>` 替換為實際密碼

### 5. Supabase
```
SUPABASE_URL=https://qhgdymgxcbyhtxezvoqt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoZ2R5bWd4Y2J5aHR4ZXp2b3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA3MDQ1MjAsImV4cCI6MjAzNjI4MDUyMH0.WQrD5SINohTvNhgKOCdT0PVSjw5KzLp_PbV6p1vAzf0
```

### 6. Doppler（密鑰管理）
```
DOPPLER_TOKEN=AQ.Ab8RN6LioS7k0Ipycl6oKXFuhww6VTXuosXwgeS8VMpTyZUFcw
DOPPLER_PROJECT=deepway-mcp
DOPPLER_CONFIG=prd
```

### 7. OpenRouter（備用 AI）
```
OPENROUTER_API_KEY=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
```

---

## 🎯 MCP 工具優化建議

### Notion MCP（19 個工具）

#### ✅ 建議保留（常用）- 7 個
| 工具 | 功能 | 使用場景 |
|------|------|----------|
| `API-post-search` | 搜索標題 | 快速查找頁面 |
| `API-post-database-query` | 查詢數據庫 | 獲取結構化數據 |
| `API-get-block-children` | 獲取區塊內容 | 讀取頁面內容 |
| `API-patch-block-children` | 追加區塊 | 添加新內容 |
| `API-retrieve-a-page` | 獲取頁面 | 讀取頁面信息 |
| `API-patch-page` | 更新頁面 | 修改頁面屬性 |
| `API-post-page` | 創建頁面 | 新建頁面 |

#### ⚠️ 建議關閉（不常用）- 12 個
| 工具 | 原因 |
|------|------|
| `API-get-user` | 很少需要獲取用戶信息 |
| `API-get-users` | 很少需要列出所有用戶 |
| `API-get-self` | 很少需要獲取 bot 信息 |
| `API-retrieve-a-block` | 用 `get-block-children` 替代 |
| `API-update-a-block` | 較少單獨更新區塊 |
| `API-delete-a-block` | 危險操作，建議手動 |
| `API-create-a-database` | 很少通過 AI 創建數據庫 |
| `API-update-a-database` | 較少更新數據庫結構 |
| `API-retrieve-a-database` | 用 query 替代 |
| `API-retrieve-a-page-property` | 過於細粒度 |
| `API-retrieve-a-comment` | 評論功能較少用 |
| `API-create-a-comment` | 評論功能較少用 |

---

### Memory MCP（9 個工具）

#### ✅ 建議保留（常用）- 5 個
| 工具 | 功能 | 使用場景 |
|------|------|----------|
| `create_entities` | 創建實體 | 保存新知識 |
| `add_observations` | 添加觀察 | 更新已有知識 |
| `search_nodes` | 搜索節點 | 查找記憶 |
| `read_graph` | 讀取知識圖 | 查看所有記憶 |
| `open_nodes` | 打開節點 | 獲取特定記憶 |

#### ⚠️ 建議關閉（不常用）- 4 個
| 工具 | 原因 |
|------|------|
| `create_relations` | 較少需要創建關係 |
| `delete_entities` | 危險操作，建議手動 |
| `delete_observations` | 危險操作，建議手動 |
| `delete_relations` | 危險操作，建議手動 |

---

### Sequential Thinking MCP

#### ✅ 保留全部
| 工具 | 功能 |
|------|------|
| `sequentialthinking` | 分步思考和推理 |

這是最重要的 MCP，用於複雜問題分析，**必須保留**。

---

## 📝 Windsurf 默認規則配置

### 推薦的 `.windsurf/rules.md` 內容

```markdown
# Windsurf AI 助手規則

## 工具優先級（重要）

### 第一優先級：MCP 工具
1. **Memory MCP** - 優先使用記憶系統保存和檢索上下文
   - 每次對話開始時先 `read_graph` 查看已有記憶
   - 重要信息用 `create_entities` 保存
   - 用 `search_nodes` 查找相關記憶

2. **Sequential Thinking** - 複雜問題必須使用分步思考
   - 多步驟任務用 `sequentialthinking` 分析
   - 代碼重構前先用分步思考規劃

3. **Notion MCP** - 知識庫操作
   - 用 `API-post-search` 搜索已有文檔
   - 用 `API-post-database-query` 查詢數據

### 第二優先級：Doppler 密鑰管理
- 所有 API 密鑰從 Doppler 獲取
- 不在代碼中硬編碼密鑰
- 使用 `doppler run` 運行服務

### 第三優先級：本地工具
- 文件系統操作
- 終端命令
- 代碼編輯

## 密鑰安全規則
1. **絕對不要**在回覆中顯示完整 API 密鑰
2. **優先使用** Doppler 管理密鑰
3. **環境變量**優先於硬編碼

## 代碼風格
- 使用 TypeScript/JavaScript
- 遵循 ESLint 規則
- 使用 async/await
- 添加適當的錯誤處理

## 項目特定規則
- 向量噴射引擎使用 4 種溫度模式
- MongoDB 保存關鍵數據
- Supabase 用於向量搜索
- 部署目標：Google Cloud Run
```

---

## 🔧 Windsurf MCP 配置快速設置

### 在 Windsurf UI 中配置

1. **打開設置** → Extensions → MCP Servers

2. **Notion MCP 配置**
```json
{
  "notion-mcp-server": {
    "command": "npx",
    "args": ["-y", "@notionhq/notion-mcp-server"],
    "env": {
      "NOTION_TOKEN": "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"
    }
  }
}
```

3. **Memory MCP 配置**
```json
{
  "memory": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-memory"]
  }
}
```

4. **Sequential Thinking 配置**
```json
{
  "sequential-thinking": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
  }
}
```

---

## 📊 工具數量優化對比

| MCP 服務器 | 原始數量 | 優化後 | 減少 |
|-----------|---------|--------|------|
| Notion | 19 | 7 | -12 (63%) |
| Memory | 9 | 5 | -4 (44%) |
| Sequential Thinking | 1 | 1 | 0 |
| **總計** | **29** | **13** | **-16 (55%)** |

**優化效果**: 減少 55% 的工具數量，減少 AI 選擇困難，提高響應速度。

---

## 🚀 快速配置命令

```bash
# 1. 導出所有環境變量到 Doppler
doppler secrets set NOTION_TOKEN="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"
doppler secrets set GEMINI_API_KEY="AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ"
doppler secrets set GITHUB_TOKEN="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"
doppler secrets set SUPABASE_URL="https://qhgdymgxcbyhtxezvoqt.supabase.co"
doppler secrets set SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
doppler secrets set OPENROUTER_API_KEY="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"

# 2. 使用 Doppler 運行服務
doppler run -- node server-enhanced.js
```

---

## ✅ 配置清單

- [ ] Notion MCP Token 已填入
- [ ] 已關閉 12 個不常用的 Notion 工具
- [ ] Memory MCP 已配置
- [ ] 已關閉 4 個刪除類工具
- [ ] Sequential Thinking 已啟用
- [ ] Windsurf rules.md 已更新
- [ ] Doppler 密鑰已同步

---

**提示**: 將此文件保存到根目錄後，可以直接從這裡複製 Token 到 Windsurf UI 設置中。
