# 🤖 Telegram Bot V2 - 諸葛亮（Doppler 集成）

**完整部署方案**：Google Cloud Run + Doppler + 多 Key 負載均衡

---

## 🎯 特點

### 1. Doppler 集成
- ✅ 從 Doppler 讀取所有密鑰
- ✅ 統一管理環境變量
- ✅ 網站和 Bot 共享配置

### 2. 多 Key 負載均衡
- ✅ 3 個 Gemini Keys 輪換
- ✅ 智能降級（Pro → Flash）
- ✅ 自動重試機制

### 3. 諸葛亮人格
- ✅ 戰略分析專家
- ✅ 博弈論指導
- ✅ 冷靜理性風格

---

## 🚀 快速部署

### 方法 1: 一鍵部署（推薦）

```bash
cd /Users/deepweay/Documents/github/oece-tech/telegram-bot
chmod +x deploy-with-doppler.sh
source /Users/deepweay/Documents/github/sms-key/FINAL-KEYS-CONFIG.env
./deploy-with-doppler.sh
```

### 方法 2: 手動部署

```bash
# 1. 設置項目
gcloud config set project oece-tech-9aa8d

# 2. 構建鏡像
gcloud builds submit --tag gcr.io/oece-tech-9aa8d/telegram-bot-zhuge

# 3. 部署
gcloud run deploy telegram-bot-zhuge \
  --image gcr.io/oece-tech-9aa8d/telegram-bot-zhuge \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars TELEGRAM_BOT_TOKEN=8364183144:AAEIK0LENbquiX_KT_U1pGPU06t1bvn0z2w \
  --set-env-vars DOPPLER_TOKEN=$DOPPLER_TOKEN \
  --set-env-vars GEMINI_KEY_1=$OECE_GEMINI_KEY_1 \
  --set-env-vars GEMINI_KEY_2=$OECE_GEMINI_KEY_2 \
  --set-env-vars GEMINI_KEY_3=$OECE_GEMINI_KEY_3

# 4. 設置 Webhook
SERVICE_URL=$(gcloud run services describe telegram-bot-zhuge --region asia-southeast1 --format 'value(status.url)')
curl -X POST "https://api.telegram.org/bot8364183144:AAEIK0LENbquiX_KT_U1pGPU06t1bvn0z2w/setWebhook" \
  -d "url=$SERVICE_URL/webhook/8364183144:AAEIK0LENbquiX_KT_U1pGPU06t1bvn0z2w"
```

---

## 🔑 環境變量配置

### Bot 需要的變量

| 變量名 | 來源 | 說明 |
|--------|------|------|
| `TELEGRAM_BOT_TOKEN` | 硬編碼 | Bot Token |
| `GEMINI_KEY_1` | Doppler/sms-key | OECE_GEMINI_KEY_1 |
| `GEMINI_KEY_2` | Doppler/sms-key | OECE_GEMINI_KEY_2 |
| `GEMINI_KEY_3` | Doppler/sms-key | OECE_GEMINI_KEY_3 |
| `DOPPLER_TOKEN` | sms-key | Doppler 訪問令牌 |
| `DOPPLER_PROJECT` | 固定 | oece-tech |
| `DOPPLER_CONFIG` | 固定 | dev |

### 網站讀取 Doppler

在 `next.config.ts` 或 `.env.local` 添加：

```bash
# Doppler 配置
DOPPLER_TOKEN=dp.pt.xxx
DOPPLER_PROJECT=oece-tech
DOPPLER_CONFIG=dev

# 或直接使用 Doppler CLI
doppler run -- npm run dev
```

---

## 📊 架構圖

```
Telegram User
    ↓
Telegram Bot API
    ↓
Google Cloud Run (telegram-bot-zhuge)
    ↓
    ├─→ Doppler (讀取配置)
    ├─→ Gemini Key 1 (OECE)
    ├─→ Gemini Key 2 (OECE)
    └─→ Gemini Key 3 (OECE)
```

---

## 🧪 測試

### 1. 健康檢查

```bash
curl https://telegram-bot-zhuge-xxx.run.app/
```

應該返回：
```json
{
  "status": "ok",
  "bot": "Onion-Mcp",
  "persona": "諸葛亮",
  "keys": 3,
  "doppler": "oece-tech",
  "uptime": 123.45
}
```

### 2. Telegram 測試

1. 打開 Telegram
2. 搜索 `@qitiandashengqianqian_bot`
3. 發送 `/start`
4. 發送問題，例如：
   ```
   如何在感情中佔據主動？
   ```

---

## 💰 成本估算

### Google Cloud Run
- **免費額度**: 200 萬請求/月
- **計費**: $0.40/百萬請求
- **預估**: 免費（低流量）

### Gemini API
- **2.0 Flash Exp**: 免費（實驗版）
- **2.5 Pro**: ฿0.28/1K tokens
- **2.5 Flash**: ฿0.14/1K tokens

### Doppler
- **免費計劃**: 5 個項目
- **當前使用**: 1 個項目（oece-tech）

**總成本**: ฿0-50/月

---

## 🔧 故障排除

### 問題 1: Bot 不回覆

**檢查**:
```bash
# 查看日誌
gcloud run services logs read telegram-bot-zhuge --region asia-southeast1 --limit 50

# 檢查 Webhook
curl https://api.telegram.org/bot8364183144:AAEIK0LENbquiX_KT_U1pGPU06t1bvn0z2w/getWebhookInfo
```

### 問題 2: Gemini API 錯誤

**檢查環境變量**:
```bash
gcloud run services describe telegram-bot-zhuge --region asia-southeast1 --format="value(spec.template.spec.containers[0].env)"
```

### 問題 3: Doppler 連接失敗

**驗證 Token**:
```bash
curl -H "Authorization: Bearer $DOPPLER_TOKEN" \
  https://api.doppler.com/v3/configs/config/secrets?project=oece-tech&config=dev
```

---

## 📚 相關文檔

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Google Cloud Run](https://cloud.google.com/run/docs)
- [Doppler](https://docs.doppler.com/)
- [Gemini API](https://ai.google.dev/docs)

---

## 🎯 下一步

### 網站集成 Doppler

1. 安裝 Doppler CLI:
   ```bash
   brew install dopplerhq/cli/doppler
   ```

2. 登錄:
   ```bash
   doppler login
   ```

3. 設置項目:
   ```bash
   cd /Users/deepweay/Documents/github/oece-tech
   doppler setup --project oece-tech --config dev
   ```

4. 運行開發服務器:
   ```bash
   doppler run -- npm run dev
   ```

5. 構建生產版本:
   ```bash
   doppler run -- npm run build
   ```

---

**狀態**: ✅ 代碼完成，待部署  
**部署**: `./deploy-with-doppler.sh`  
**測試**: @qitiandashengqianqian_bot
