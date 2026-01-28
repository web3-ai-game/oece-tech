# 🔐 密鑰安全管理指南

## ⚠️ 重要安全提醒

**永遠不要在代碼中硬編碼 API 密鑰！**

已經發生的安全問題：
- ✅ 已刪除 `.cli-env` 文件（包含暴露的密鑰）
- ✅ 已刪除 `.env.vector-jet` 文件
- ✅ 已更新 `.gitignore` 防止意外提交
- ✅ 已從 Git 歷史中移除敏感文件

## 🚀 快速開始

### 方案 A: 使用 Doppler（推薦）

1. **設置 Doppler**：
   ```bash
   bash setup-doppler.sh
   ```

2. **遷移現有密鑰**：
   ```bash
   bash migrate-to-doppler.sh
   ```

3. **運行應用程序**：
   ```bash
   # 自動注入所有環境變量
   doppler run -- node server.js
   doppler run -- npm start
   doppler run -- pm2 start ecosystem.config.json
   ```

### 方案 B: 使用本地 .env 文件

1. **創建 .env 文件**：
   ```bash
   cp .env.example .env
   ```

2. **編輯 .env 填入實際密鑰**：
   ```bash
   nano .env
   ```

3. **確保 .env 在 .gitignore 中**（已配置）

## 📋 需要替換的密鑰

### 必需密鑰：
- **GEMINI_FREE_KEY**: 從 [Google AI Studio](https://aistudio.google.com/apikey) 獲取
- **JWT_SECRET**: 使用 `openssl rand -hex 32` 生成

### 可選密鑰（根據功能需要）：
- **TELEGRAM_BOT_TOKEN**: 從 Telegram @BotFather 獲取
- **OPENROUTER_API_KEY**: 從 OpenRouter 儀表板獲取
- **SUPABASE_***: 從 Supabase 項目設置獲取
- **GEMINI_PRO_KEY_***: 付費 Gemini API 密鑰

## 🔒 安全最佳實踐

### DO ✅
- 使用 Doppler 或其他密鑰管理服務
- 使用環境變量注入密鑰
- 定期輪換 API 密鑰
- 為不同環境使用不同密鑰（dev/staging/production）
- 在 CI/CD 中使用 Service Tokens

### DON'T ❌
- 永遠不要提交 `.env` 文件到 Git
- 不要在代碼中硬編碼密鑰
- 不要在日誌中打印完整密鑰
- 不要通過不安全的渠道分享密鑰
- 不要使用相同的密鑰跨環境

## 🔄 密鑰輪換

如果懷疑密鑰已洩露：

1. **立即撤銷舊密鑰**：
   - Gemini: 在 Google AI Studio 重新生成
   - Telegram: 使用 @BotFather 的 `/revoke` 命令
   - OpenRouter: 在儀表板撤銷

2. **生成新密鑰**

3. **更新 Doppler**：
   ```bash
   doppler secrets set KEY_NAME "new_value"
   ```

4. **重新部署應用程序**

## 🧪 測試配置

驗證密鑰是否正確加載：

```bash
# 測試 Doppler
doppler run -- node -e "console.log('Gemini Key:', process.env.GEMINI_FREE_KEY?.slice(0,10) + '...')"

# 測試本地 .env
node -e "require('dotenv').config(); console.log('Port:', process.env.PORT)"
```

## 📞 需要幫助？

- Doppler 文檔: https://docs.doppler.com
- Google AI Studio: https://aistudio.google.com
- Telegram Bot API: https://core.telegram.org/bots

---

**最後更新**: 2025-11-26  
**安全級別**: 🟢 已修復
