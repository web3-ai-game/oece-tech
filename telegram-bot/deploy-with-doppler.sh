#!/bin/bash
# 🚀 部署 Telegram Bot 到 Google Cloud Run (使用 Doppler)

set -e

PROJECT_ID="oece-tech-9aa8d"
SERVICE_NAME="telegram-bot-zhuge"
REGION="asia-southeast1"

echo "🤖 部署諸葛亮 Bot V2 到 Google Cloud Run..."
echo ""

# 1. 檢查當前目錄
if [ ! -f "bot-v2.js" ]; then
    echo "❌ 錯誤：找不到 bot-v2.js"
    echo "請在 telegram-bot 目錄執行此腳本"
    exit 1
fi

# 2. 檢查 Doppler Token
if [ -z "$DOPPLER_TOKEN" ]; then
    echo "⚠️  DOPPLER_TOKEN 未設置"
    echo "從 sms-key 加載..."
    source /Users/deepweay/Documents/github/sms-key/FINAL-KEYS-CONFIG.env
fi

# 3. 構建 Docker 鏡像
echo "📦 構建 Docker 鏡像..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME --project $PROJECT_ID

# 4. 部署到 Cloud Run（使用 Doppler）
echo "🚀 部署到 Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --set-env-vars TELEGRAM_BOT_TOKEN=8364183144:AAEIK0LENbquiX_KT_U1pGPU06t1bvn0z2w \
  --set-env-vars DOPPLER_TOKEN=$DOPPLER_TOKEN \
  --set-env-vars DOPPLER_PROJECT=oece-tech \
  --set-env-vars DOPPLER_CONFIG=dev \
  --set-env-vars GEMINI_KEY_1=$OECE_GEMINI_KEY_1 \
  --set-env-vars GEMINI_KEY_2=$OECE_GEMINI_KEY_2 \
  --set-env-vars GEMINI_KEY_3=$OECE_GEMINI_KEY_3 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3

# 5. 獲取 Service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --project $PROJECT_ID --format 'value(status.url)')

echo ""
echo "✅ 部署完成！"
echo "📡 Service URL: $SERVICE_URL"
echo ""

# 6. 設置 Telegram Webhook
echo "🔗 設置 Telegram Webhook..."
WEBHOOK_URL="$SERVICE_URL/webhook/8364183144:AAEIK0LENbquiX_KT_U1pGPU06t1bvn0z2w"

curl -X POST "https://api.telegram.org/bot8364183144:AAEIK0LENbquiX_KT_U1pGPU06t1bvn0z2w/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$WEBHOOK_URL\"}"

echo ""
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 諸葛亮 Bot V2 已上線！"
echo ""
echo "📱 測試: 在 Telegram 發送消息給 @qitiandashengqianqian_bot"
echo "🌐 Service URL: $SERVICE_URL"
echo "🔑 Doppler: oece-tech/dev"
echo "🧠 Model: Gemini 2.0 Flash Exp"
echo "⚡ Keys: 3 個（負載均衡）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
