# 🤖 Onion-Mcp Telegram Bot - 諸葛亮

**人格**: 謀士諸葛（Strategist Zhuge Liang）  
**用途**: 群組解謎、戰略分析  
**部署**: Google Cloud Run  
**負載均衡**: 雙 Key 輪換 + 智能降級

---

## 🎯 功能特點

### 1. 諸葛亮人格
- **身份**: 人心博弈架構師
- **風格**: 冷靜、分析、權威
- **專長**: 戰略分析、局勢評估、戰術建議

### 2. 雙 Key 負載均衡
- **Key 1**: Gemini API Key 1（收費）
- **Key 2**: Gemini API Key 2（收費）
- **輪換策略**: 每次請求切換 Key
- **容錯**: Key 失敗自動切換

### 3. 智能降級
```
Gemini 2.5 Pro（優先）
  ↓ 滿載/失敗
Gemini 2.5 Flash（降級）
  ↓ 仍失敗
切換 Key 重試
```

---

## 🚀 部署到 Google Cloud Run

### 前置條件
```bash
# 安裝 gcloud CLI
brew install google-cloud-sdk

# 登錄
gcloud auth login

# 設置項目
gcloud config set project oece-tech-9aa8d
```

### 一鍵部署
```bash
cd /Users/deepweay/Documents/github/oece-tech/telegram-bot
chmod +x deploy.sh
./deploy.sh
```

### 手動部署
```bash
# 1. 構建鏡像
gcloud builds submit --tag gcr.io/oece-tech-9aa8d/onion-mcp-bot

# 2. 部署到 Cloud Run
gcloud run deploy onion-mcp-bot \
  --image gcr.io/oece-tech-9aa8d/onion-mcp-bot \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars TELEGRAM_BOT_TOKEN=***REDACTED*** \
  --set-env-vars GEMINI_KEY_1=$GEMINI_API_KEY_1 \
  --set-env-vars GEMINI_KEY_2=$GEMINI_API_KEY_2

# 3. 獲取 URL
gcloud run services describe onion-mcp-bot --region asia-southeast1 --format 'value(status.url)'

# 4. 設置 Webhook
curl -X POST "https://api.telegram.org/bot8364183144:AAEIK0LENbquiX_KT_U1pGPU06t1bvn0z2w/setWebhook" \
  -d "url=YOUR_CLOUD_RUN_URL/webhook/***REDACTED***"
```

---

## 💬 Bot 命令

| 命令 | 功能 |
|------|------|
| `/start` | 開始對話 |
| `/help` | 查看幫助 |
| `/status` | 查看 Bot 狀態 |

---

## 🧪 本地測試

```bash
# 安裝依賴
npm install

# 設置環境變量
export TELEGRAM_BOT_TOKEN=***REDACTED***
export GEMINI_KEY_1=你的_KEY_1
export GEMINI_KEY_2=你的_KEY_2

# 啟動（Polling 模式）
npm run dev
```

---

## 📊 成本估算

### Google Cloud Run
- **免費額度**: 每月 200 萬請求
- **計費**: $0.40/百萬請求
- **預估**: 免費（低流量）

### Gemini API
- **2.5 Pro**: ฿0.28/1K tokens
- **2.5 Flash**: ฿0.14/1K tokens
- **雙 Key**: 分散負載，降低單 Key 壓力

### 總成本
- **預估**: ฿10-50/月（取決於使用量）

---

## 🔧 環境變量

| 變量 | 說明 |
|------|------|
| `TELEGRAM_BOT_TOKEN` | Bot Token |
| `GEMINI_KEY_1` | Gemini API Key 1 |
| `GEMINI_KEY_2` | Gemini API Key 2 |
| `PORT` | 端口（Cloud Run 自動設置）|
| `WEBHOOK_URL` | Cloud Run URL（自動獲取）|

---

## 📱 測試 Bot

1. 在 Telegram 搜索 `@qitiandashengqianqian_bot`
2. 發送 `/start`
3. 發送問題，例如：
   ```
   如何在感情中佔據主動？
   分析一下我的處境...
   ```

---

**創建時間**: 2025-11-29  
**狀態**: Ready to Deploy  
**部署平台**: Google Cloud Run
