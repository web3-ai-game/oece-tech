# 📘 Slack Bot Token 獲取完整手冊

> **目標**: 手把手教學如何創建 Slack App 並獲取 Bot Token
> 
> **適用場景**: 需要在 Slack 工作區發送消息、接收事件、創建互動應用
> 
> **預計時間**: 10-15 分鐘

---

## 🎯 第一步：創建 Slack App

### 1.1 訪問 Slack API 控制台

1. 打開瀏覽器，訪問：https://api.slack.com/apps
2. 使用你的 Slack 賬號登錄
3. 點擊 **"Create New App"** 按鈕

### 1.2 選擇創建方式

你會看到兩個選項：

```
┌─────────────────────────────────────┐
│  Create an app                      │
│                                     │
│  ○ From scratch                    │  <- 選這個
│    Start from scratch               │
│                                     │
│  ○ From an app manifest             │
│    Use YAML/JSON manifest           │
└─────────────────────────────────────┘
```

**選擇**: **"From scratch"**

### 1.3 填寫基本信息

```yaml
App Name: deepweay-sms-bot
  # 給你的 bot 起個名字

Pick a workspace to develop your app in: 選擇你的工作區
  # 選擇要安裝 bot 的 Slack 工作區
```

點擊 **"Create App"**

---

## 🔧 第二步：配置 Bot 權限

### 2.1 進入 OAuth & Permissions

在左側導航欄中：

```
📱 Basic Information
🔐 OAuth & Permissions        <- 點擊這裡
📨 Event Subscriptions
🤖 Bot Users
⚡ Slash Commands
...
```

### 2.2 添加 Bot Token Scopes

滾動到 **"Scopes"** 區域，在 **"Bot Token Scopes"** 下點擊 **"Add an OAuth Scope"**

**推薦的基礎權限：**

```yaml
# 頻道相關
channels:read          # 查看公開頻道信息
channels:history       # 查看公開頻道消息歷史

# 聊天相關
chat:write            # 發送消息（最重要！）
chat:write.public     # 在未加入的頻道發送消息

# 用戶相關
users:read            # 查看用戶信息
users:read.email      # 查看用戶郵箱（可選）

# 文件相關（可選）
files:read            # 讀取文件
files:write           # 上傳文件

# 應用相關
app_mentions:read     # 接收 @ 提及
```

**為開發項目推薦的完整權限列表：**

```
必需權限 (Minimum):
  ✓ chat:write
  ✓ channels:read
  
基礎開發 (Basic Development):
  ✓ chat:write
  ✓ chat:write.public
  ✓ channels:read
  ✓ channels:history
  ✓ users:read
  
互動 Bot (Interactive Bot):
  + app_mentions:read
  + reactions:read
  + reactions:write
  
文件處理 (File Handling):
  + files:read
  + files:write
  
私密頻道支持 (Private Channels):
  + groups:read
  + groups:history
```

### 2.3 設置 Redirect URLs（可選）

如果需要 OAuth 流程（用戶授權），添加：

```
Redirect URLs:
  https://your-domain.com/slack/oauth/callback
```

**本項目不需要此步驟**（我們使用 Bot Token）

---

## 🚀 第三步：安裝 App 到工作區

### 3.1 安裝應用

在 **"OAuth & Permissions"** 頁面頂部：

```
┌─────────────────────────────────────┐
│  Install to Workspace               │
│                                     │
│  [Install to Workspace] 按鈕        │  <- 點擊這裡
└─────────────────────────────────────┘
```

### 3.2 授權確認

會彈出授權頁面，顯示你請求的所有權限：

```
deepweay-sms-bot is requesting permission to access
the your-workspace Slack workspace

This app would like to:
  ✓ View basic information about public channels
  ✓ View messages and other content in public channels  
  ✓ Send messages as @deepweay-sms-bot
  ...

[Allow] [Cancel]
```

點擊 **"Allow"**

### 3.3 獲取 Bot Token

授權成功後，頁面會刷新，你會在頂部看到：

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OAuth Tokens for Your Workspace
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bot User OAuth Token
  xoxb-1234567890123-1234567890123-xxxxxxxxxxxxxxxxxxxx
  [Show] [Copy]                          👈 點擊複製
```

**Token 格式：**

```bash
# Bot User OAuth Token (我們需要的)
xoxb-1234567890123-1234567890123-xxxxxxxxxxxxxxxxxxxx

# User OAuth Token (通常不需要)
xoxp-1234567890123-1234567890123-xxxxxxxxxxxxxxxxxxxx
```

**⚠️ 重要**: 
- 我們需要的是 **`xoxb-`** 開頭的 Bot Token
- 不是 `xoxp-` 開頭的 User Token

---

## 🧪 第四步：測試 Bot Token

### 4.1 使用 curl 測試

```bash
# 設置 Token
export SLACK_BOT_TOKEN="xoxb-你的token"

# 測試連接 - 獲取 bot 信息
curl -X POST https://slack.com/api/auth.test \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
  -H "Content-Type: application/x-www-form-urlencoded"
```

**預期輸出：**

```json
{
  "ok": true,
  "url": "https://your-workspace.slack.com/",
  "team": "Your Workspace",
  "user": "deepweay-sms-bot",
  "team_id": "T1234567890",
  "user_id": "U1234567890",
  "bot_id": "B1234567890"
}
```

### 4.2 發送測試消息

```bash
# 發送消息到 #general 頻道
curl -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "general",
    "text": "🚀 DeepWeay SMS Bot is online!"
  }'
```

**預期輸出：**

```json
{
  "ok": true,
  "channel": "C1234567890",
  "ts": "1234567890.123456",
  "message": {
    "text": "🚀 DeepWeay SMS Bot is online!",
    "username": "deepweay-sms-bot",
    "bot_id": "B1234567890",
    "type": "message",
    "subtype": "bot_message"
  }
}
```

---

## 🔗 第五步：邀請 Bot 到頻道

### 5.1 為什麼需要邀請？

即使 bot 有權限，也需要被**明確邀請**到私密頻道或某些公開頻道才能：
- 讀取消息
- 查看頻道歷史

### 5.2 邀請方法

**方法 1: 使用 Slack 命令**

在目標頻道中輸入：

```
/invite @deepweay-sms-bot
```

**方法 2: 通過頻道設置**

1. 打開目標頻道
2. 點擊頻道名稱 → **"Settings"** → **"Integrations"**
3. 點擊 **"Add apps"**
4. 搜索並添加 `deepweay-sms-bot`

### 5.3 驗證 Bot 是否在頻道中

```bash
# 列出 bot 加入的所有頻道
curl -X POST https://slack.com/api/conversations.list \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "types": "public_channel,private_channel"
  }'
```

---

## 🔐 第六步：保存 Token 到環境變量

### 6.1 更新 Doppler

```bash
cd ~/sms-key
doppler secrets set SLACK_BOT_TOKEN="xoxb-你的token" --project sms --config prod
doppler secrets set SLACK_WEBHOOK_URL="https://hooks.slack.com/services/xxx/yyy/zzz" --project sms --config prod
```

### 6.2 更新本地環境

```bash
# 更新 VPS 全局環境
cat >> ~/.env.vps << 'EOF'
export SLACK_BOT_TOKEN="xoxb-你的token"
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/xxx/yyy/zzz"
EOF

source ~/.env.vps
```

### 6.3 獲取 Webhook URL（可選但推薦）

Webhook 更簡單，適合單向發送消息：

1. 訪問：https://api.slack.com/apps/YOUR_APP_ID/incoming-webhooks
2. 點擊 **"Activate Incoming Webhooks"** 開關
3. 點擊 **"Add New Webhook to Workspace"**
4. 選擇目標頻道（如 `#notifications`）
5. 複製生成的 Webhook URL：

```
https://hooks.slack.com/services/T1234567890/B1234567890/xxxxxxxxxxxxxxxxxxxx
```

**測試 Webhook：**

```bash
curl -X POST "https://hooks.slack.com/services/xxx/yyy/zzz" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "✅ Webhook 測試成功！"
  }'
```

---

## ⚙️ 第七步：配置事件訂閱（進階）

### 7.1 何時需要事件訂閱？

如果你的 bot 需要：
- ✅ 接收用戶消息
- ✅ 響應 @mention
- ✅ 監聽頻道事件（新成員、文件上傳等）

### 7.2 設置事件訂閱

1. 在 Slack App 設置中，點擊 **"Event Subscriptions"**
2. 開啟 **"Enable Events"** 開關
3. 設置 **"Request URL"**：

```
https://your-domain.com/slack/events
```

**⚠️ 注意**: Slack 會立即驗證此 URL，你需要：
1. 部署一個能接收 POST 請求的服務
2. 響應 Slack 的驗證請求

**驗證請求處理（Node.js 示例）：**

```javascript
app.post('/slack/events', (req, res) => {
  // Slack 驗證請求
  if (req.body.type === 'url_verification') {
    return res.json({ challenge: req.body.challenge });
  }
  
  // 處理實際事件
  // ...
});
```

### 7.3 訂閱 Bot Events

在 **"Subscribe to bot events"** 區域添加：

```
message.channels     # 公開頻道消息
message.groups       # 私密頻道消息  
app_mention          # 有人 @bot
file_shared          # 文件分享
...
```

---

## ⚠️ 常見問題排查

### Q1: 發送消息時返回 "channel_not_found"

**原因**: Bot 沒有被邀請到該頻道

**解決方案**:
```bash
# 方法 1: 在 Slack 中運行
/invite @deepweay-sms-bot

# 方法 2: 使用 API 邀請
curl -X POST https://slack.com/api/conversations.invite \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "C1234567890",
    "users": "U_BOT_ID"
  }'
```

### Q2: 返回 "invalid_auth" 或 "not_authed"

**可能原因**:
- Token 複製錯誤
- Token 已被重新生成
- 使用了錯誤類型的 token（User Token 而非 Bot Token）

**檢查方法**:
```bash
# 1. 確認 token 格式
echo $SLACK_BOT_TOKEN | grep '^xoxb-'

# 2. 測試 token
curl -X POST https://slack.com/api/auth.test \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}"
```

### Q3: Bot 無法讀取消息

**原因**: 缺少必要的權限 scope

**解決方案**:
1. 回到 **"OAuth & Permissions"**
2. 在 **"Bot Token Scopes"** 添加：
   - `channels:history`
   - `groups:history`（如果需要私密頻道）
3. 重新安裝 app（會提示用戶重新授權）

### Q4: 如何重置或輪換 Token？

**⚠️ 警告**: 重新生成 token 會使舊 token 立即失效！

1. 進入 **"OAuth & Permissions"**
2. 點擊 **"Revoke"** 撤銷當前 token
3. 重新點擊 **"Install to Workspace"**
4. 獲取新的 Bot Token
5. 更新所有配置

---

## 📊 權限等級說明

### 最小權限 Bot（只發消息）

```yaml
Scopes:
  - chat:write
  
Use Case:
  - 發送通知
  - 日誌輸出
  - 監控告警
```

### 互動式 Bot（接收和回復）

```yaml
Scopes:
  - chat:write
  - channels:history
  - app_mentions:read
  
Use Case:
  - 聊天機器人
  - 命令處理
  - 問答系統
```

### 完整功能 Bot（管理和自動化）

```yaml
Scopes:
  - chat:write
  - chat:write.public
  - channels:read
  - channels:history
  - users:read
  - files:read
  - files:write
  - app_mentions:read
  
Use Case:
  - 自動化工作流
  - 數據分析
  - 文件處理
```

---

## 🎓 最佳實踐

### 1. Token 安全存儲

```bash
# ✅ 推薦
export SLACK_BOT_TOKEN="xoxb-xxx"  # 環境變量
doppler secrets set SLACK_BOT_TOKEN="xoxb-xxx"  # Doppler

# ❌ 不推薦
const token = "xoxb-xxx"  // 硬編碼
config.json: {"token": "xoxb-xxx"}  // 明文配置
```

### 2. 使用 Webhook 進行簡單通知

```javascript
// Webhook 更簡單、更安全（單向發送）
await fetch(process.env.SLACK_WEBHOOK_URL, {
  method: 'POST',
  body: JSON.stringify({ text: '部署成功！' })
});

// Bot Token 適合需要雙向通信的場景
```

### 3. 為不同環境創建不同的 Bot

```
✅ 推薦:
  - deepweay-sms-bot-prod    (生產環境)
  - deepweay-sms-bot-dev     (開發環境)
  - deepweay-sms-bot-test    (測試環境)

❌ 不推薦:
  - 共用一個 bot（無法區分環境）
```

### 4. 消息格式化

使用 Block Kit 創建更豐富的消息：

```json
{
  "channel": "general",
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🚀 部署通知"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*項目*: deepweay-sms\n*狀態*: ✅ 成功\n*時間*: 2025-11-26 18:30"
      }
    }
  ]
}
```

---

## 🚀 快速命令參考

```bash
# 測試認證
curl -X POST https://slack.com/api/auth.test \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN"

# 發送消息
curl -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "general",
    "text": "Hello from bot!"
  }'

# 列出頻道
curl -X POST https://slack.com/api/conversations.list \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN"

# 獲取頻道歷史
curl -X POST https://slack.com/api/conversations.history \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -d "channel=C1234567890"

# 上傳文件
curl -X POST https://slack.com/api/files.upload \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -F "file=@report.txt" \
  -F "channels=general"
```

---

## 📚 相關資源

- [Slack API 官方文檔](https://api.slack.com/)
- [Slack Block Kit Builder](https://app.slack.com/block-kit-builder)
- [Slack API Methods](https://api.slack.com/methods)
- [Node.js SDK: @slack/bolt](https://slack.dev/bolt-js)
- [Python SDK: slack-sdk](https://slack.dev/python-slack-sdk/)

---

**更新日期**: 2025-11-26  
**維護者**: DeepWeay SMS Team  
**版本**: v1.0
