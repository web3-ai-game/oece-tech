# 📘 Notion Integration Token 獲取完整手冊

> **目標**: 手把手教學如何創建 Notion Integration 並獲取 API Token
> 
> **適用場景**: 需要通過 API 訪問 Notion 工作區的所有開發項目
> 
> **預計時間**: 5-10 分鐘

---

## 🎯 第一步：創建 Notion Integration

### 1.1 訪問 Notion Developers

1. 打開瀏覽器，訪問：https://www.notion.so/my-integrations
2. 使用你的 Notion 賬號登錄
3. 點擊 **"+ New integration"** 按鈕

### 1.2 配置 Integration 基本信息

填寫以下信息：

```yaml
Name: deepweay-sms-api
  # 給你的集成起個名字，建議使用項目名稱

Associated workspace: 選擇你的工作區
  # 下拉選擇你要訪問的 Notion 工作區

Type: Internal integration
  # 選擇 "Internal" - 僅供自己使用

Logo: (可選)
  # 可以上傳項目 logo
```

### 1.3 設置權限 (Capabilities)

**必須勾選的權限：**

- ✅ **Read content** - 讀取頁面內容
- ✅ **Update content** - 更新頁面（如果需要寫入）
- ✅ **Insert content** - 插入新內容（如果需要創建頁面）
- ✅ **Read comments** - 讀取評論（可選）
- ✅ **Read user information** - 讀取用戶信息

**內容能力配置：**

```
Content Capabilities:
  ☑ Read content              <- 必須
  ☑ Update content            <- 建議
  ☑ Insert content            <- 建議
  
Comment Capabilities:
  ☐ Read comments             <- 可選
  ☐ Create comments           <- 可選
  
User Capabilities:
  ☑ Read user information including email addresses  <- 必須
```

### 1.4 提交並獲取 Token

1. 點擊底部的 **"Submit"** 按鈕
2. 在新頁面中，你會看到：

```
Internal Integration Token
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

⚠️ Keep this token secret. Don't share it publicly.
```

3. 點擊 **"Show"** 查看完整 token
4. 點擊 **"Copy"** 複製 token

**Token 格式示例：**

```bash
# 舊版格式 (legacy)
secret_1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T

# 新版格式 (recommended)
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
```

---

## 🔗 第二步：授權 Integration 訪問頁面

**重要**: 創建 Integration 後，還需要將它連接到具體的 Notion 頁面！

### 2.1 在 Notion 中打開目標頁面

1. 打開你想要 API 訪問的 Notion 頁面（通常是頂層頁面）
2. 點擊右上角的 **"···"** (更多選項)
3. 滾動到底部，找到 **"Connections"** 或 **"連接"** 區域

### 2.2 添加 Integration 連接

1. 點擊 **"Add connections"** 或 **"添加連接"**
2. 在彈出的搜索框中輸入你的 integration 名稱（如：`deepweay-sms-api`）
3. 點擊你的 integration 名稱
4. 確認授權

**截圖參考位置：**

```
┌─────────────────────────────────────┐
│  📄 頁面標題                          │
│                                     │
│  [···] 更多選項                      │
│    ├─ Add to Favorites             │
│    ├─ Copy link                    │
│    ├─ Move to                      │
│    ├─ ...                          │
│    └─ 🔗 Connections               │  <- 在這裡
│         ├─ Add connections         │
│         └─ [你的 integration]      │
└─────────────────────────────────────┘
```

### 2.3 驗證連接狀態

連接成功後，在 **"Connections"** 區域會顯示：

```
🔗 Connections
  ✓ deepweay-sms-api  [已連接]
```

---

## 🧪 第三步：測試 Token 有效性

### 3.1 使用 curl 測試

```bash
# 設置 Token
export NOTION_TOKEN="ntn_你的token"

# 測試連接 - 列出所有可訪問的頁面
curl -X POST https://api.notion.com/v1/search \
  -H "Authorization: Bearer ${NOTION_TOKEN}" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {
      "property": "object",
      "value": "page"
    },
    "page_size": 10
  }'
```

**預期輸出：**

```json
{
  "object": "list",
  "results": [
    {
      "object": "page",
      "id": "2b791acc-4dd5-8123-abaf-e562b226df7c",
      "created_time": "2025-11-26T10:09:00.000Z",
      "last_edited_time": "2025-11-26T10:09:00.000Z",
      "properties": {
        "title": {
          "id": "title",
          "type": "title",
          "title": [...]
        }
      }
    }
  ],
  "has_more": false
}
```

### 3.2 使用項目驗證腳本

```bash
# 在 VPS 上運行
cd ~/deepweay-sms
bash scripts/test_notion_connection.sh
```

---

## 🔐 第四步：保存 Token 到環境變量

### 4.1 更新 Doppler

```bash
# 使用 Doppler CLI 更新
cd ~/sms-key
doppler secrets set NOTION_TOKEN="ntn_你的新token" --project sms --config prod
```

### 4.2 更新本地環境

```bash
# 更新 VPS 全局環境
echo 'export NOTION_TOKEN="ntn_你的新token"' >> ~/.env.vps
source ~/.env.vps
```

### 4.3 更新 MCP 配置

```bash
# 編輯 GitHub Copilot MCP 配置
nano ~/.vscode-server/data/User/globalStorage/github.copilot/mcp.json
```

找到 Notion 配置部分：

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": [
        "-y",
        "@notionhq/notion-mcp-server@1.9.0"
      ],
      "env": {
        "NOTION_API_KEY": "ntn_你的新token"  // <- 更新這裡
      }
    }
  }
}
```

---

## ⚠️ 常見問題排查

### Q1: Token 無法訪問任何頁面

**原因**: 沒有授權 Integration 到具體頁面

**解決方案**:
1. 回到 Notion 頁面
2. 檢查 **Connections** 是否添加了你的 integration
3. 確保授權的是**頂層父頁面**（子頁面會自動繼承權限）

### Q2: API 返回 401 Unauthorized

**可能原因**:
- Token 複製錯誤（有空格或換行）
- Token 已過期或被重置
- Token 格式錯誤

**解決方案**:
```bash
# 檢查 Token 格式
echo $NOTION_TOKEN | wc -c  # 應該是 50+ 字符

# 去除可能的空格
export NOTION_TOKEN=$(echo $NOTION_TOKEN | tr -d ' \n')
```

### Q3: 可以訪問某些頁面，但訪問不了其他頁面

**原因**: Integration 僅被授權到部分頁面

**解決方案**:
1. 為每個需要訪問的頂層頁面添加 Connection
2. 或者將所有內容移動到一個被授權的父頁面下

### Q4: 如何撤銷或重置 Token？

1. 訪問 https://www.notion.so/my-integrations
2. 點擊你的 integration 名稱
3. 滾動到 **"Integration Token"** 區域
4. 點擊 **"Regenerate token"**
5. 更新所有使用該 token 的配置

---

## 📊 權限等級說明

### Read Content 權限

可以執行的操作：
- ✅ 讀取頁面內容
- ✅ 獲取頁面屬性
- ✅ 查詢數據庫
- ✅ 列出頁面子項

**不能**執行的操作：
- ❌ 修改頁面內容
- ❌ 創建新頁面
- ❌ 刪除頁面

### Update Content 權限

額外可以執行：
- ✅ 修改頁面內容
- ✅ 更新數據庫條目
- ✅ 修改頁面屬性

### Insert Content 權限

額外可以執行：
- ✅ 創建新頁面
- ✅ 在數據庫中添加條目
- ✅ 添加子頁面

---

## 🎓 最佳實踐

### 1. 為不同項目創建不同的 Integration

```
✅ 好的做法:
  - deepweay-sms-api (用於 SMS 項目)
  - oece-tech-api (用於 OECE 項目)
  - personal-backup-api (用於備份)

❌ 不好的做法:
  - my-api (太通用，難以管理)
```

### 2. 最小權限原則

```
只讀項目:
  ✓ Read content
  
常規開發項目:
  ✓ Read content
  ✓ Update content
  ✓ Insert content
  
自動化備份:
  ✓ Read content
  ✓ Read comments
```

### 3. Token 安全存儲

```bash
# ✅ 好的做法
export NOTION_TOKEN="xxx"  # 環境變量
doppler secrets set NOTION_TOKEN="xxx"  # Doppler

# ❌ 不好的做法
const token = "secret_xxx"  // 寫死在代碼中
config.json: { "token": "xxx" }  // 明文配置文件
```

### 4. 定期審計 Integration

每月檢查：
1. 哪些 Integration 還在使用
2. 權限是否過大
3. Token 是否需要輪換

---

## 🚀 快速命令參考

```bash
# 測試 Token
curl -X POST https://api.notion.com/v1/search \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28"

# 獲取特定頁面
curl -X GET https://api.notion.com/v1/pages/PAGE_ID \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28"

# 查詢數據庫
curl -X POST https://api.notion.com/v1/databases/DATABASE_ID/query \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{}'

# 讀取頁面內容（blocks）
curl -X GET "https://api.notion.com/v1/blocks/PAGE_ID/children" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28"
```

---

## 📚 相關資源

- [Notion API 官方文檔](https://developers.notion.com/)
- [Notion API Reference](https://developers.notion.com/reference/intro)
- [Notion MCP Server](https://github.com/notionhq/notion-mcp-server)
- [我們的驗證腳本](../scripts/test_notion_connection.sh)

---

**更新日期**: 2025-11-26  
**維護者**: DeepWeay SMS Team  
**版本**: v1.0
