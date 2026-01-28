# 🚀 SVSKILO TG Bot 快速配置指南

> **僅保留 svskilo 帳戶的 Telegram Bot**  
> 所有舊配置 (sms-key, Doppler) 已清理完畢

---

## 📋 配置步驟

### 1. 創建 .env 檔案

```bash
cd /home/svs-main-key/GCP/tg-trash-bot
cp .env.example .env
```

### 2. 編輯 .env 填入你的新 Token

```bash
nano .env
# 或
vim .env
```

填入以下內容:

```bash
# SVSKILO Bot Token (替換成你的新 token)
TELEGRAM_BOT_SVSKILO_TOKEN="你的新token"

# Gemini 免費 Key
GEMINI_FREE_KEY="你的Gemini免費key"

# (可選) Gemini 付費 Keys
GEMINI_PRO_30_KEY="你的3-Pro key"
GEMINI_PRO_25_KEY="你的2.5-Flash key"

NODE_ENV="production"
```

### 3. 啟動 Bot

```bash
# 方式 1: PM2 啟動 (推薦)
pm2 start ecosystem.config.js

# 方式 2: 直接啟動
npm start

# 方式 3: 開發模式
npm run dev
```

### 4. 檢查運行狀態

```bash
# 查看 PM2 狀態
pm2 status

# 查看日誌
pm2 logs tg-trash-bot

# 查看最近 50 行
pm2 logs tg-trash-bot --lines 50
```

---

## 🔑 獲取新 Token 的方法

### Telegram Bot Token (SVSKILO)

1. 打開 Telegram 搜索 `@BotFather`
2. 發送 `/newbot` 創建新 bot
3. 設置 bot 名稱和用戶名
4. 複製返回的 Token (格式: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. 填入 `.env` 檔案

### Gemini API Key

1. 前往 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 登入 Google 帳戶
3. 點擊 "Get API Key" → "Create API Key"
4. 複製生成的 Key (格式: `AIzaSy...`)
5. 填入 `.env` 檔案

---

## 🧪 測試 API

### 測試 Gemini API

```bash
cd /home/svs-main-key/GCP/tg-trash-bot

# 測試免費層 2.5 Flash-Lite
node -e "
const axios = require('axios');
const key = process.env.GEMINI_FREE_KEY;
axios.post(
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=' + key,
  { contents: [{ parts: [{ text: '測試' }] }] }
).then(r => console.log('✅ Gemini API 正常:', r.data.candidates[0].content.parts[0].text))
 .catch(e => console.error('❌ API 錯誤:', e.response?.data || e.message));
"
```

### 測試 TG Bot

1. 在 Telegram 搜索你的 bot 用戶名
2. 發送 `/start` 查看歡迎信息
3. 發送任意文字測試垃圾話生成

---

## 🔧 重啟 Bot

```bash
# 重啟 PM2 服務
pm2 restart tg-trash-bot

# 完全重新加載 (重載配置)
pm2 reload tg-trash-bot

# 停止 Bot
pm2 stop tg-trash-bot

# 刪除 Bot (需重新啟動)
pm2 delete tg-trash-bot
```

---

## 📊 當前配置狀態

- ✅ **已刪除**: `sms-key/.env.doppler` (舊 Doppler 配置)
- ✅ **已刪除**: `.env.local` (根目錄舊配置)
- ✅ **已創建**: `tg-trash-bot/.env.example` (新配置模板)
- ✅ **待填入**: `tg-trash-bot/.env` (你的新 token)

---

## 🎯 Bot 功能列表

| 功能 | 描述 |
|------|------|
| 多人格噴射 | 8 種 AI 人格隨機回覆 |
| 免費模型 | Gemini 2.5 Flash-Lite (15 RPM) |
| 速率保護 | 自動限流,防止 API 超限 |
| 命令支持 | `/start`, `/personas`, `/stats` |

---

## ⚠️ 安全提醒

1. **不要提交 .env 到 Git**
   ```bash
   echo ".env" >> .gitignore
   ```

2. **定期輪換 Token**
   - Telegram: 3-6 個月
   - Gemini: 根據使用情況

3. **限制 Bot 權限**
   - 只給必要的群組權限
   - 不要公開 Bot Token

---

## 🚀 快速命令

```bash
# 一鍵啟動
cd /home/svs-main-key/GCP/tg-trash-bot && pm2 start ecosystem.config.js

# 一鍵重啟
pm2 restart tg-trash-bot

# 一鍵查看日誌
pm2 logs tg-trash-bot --lines 50

# 一鍵停止
pm2 stop tg-trash-bot
```

---

**更新時間**: 2025-11-26  
**維護者**: SMS-Key Team (SVSKILO only)  
**狀態**: ✅ 已清理完畢,等待填入新 token
