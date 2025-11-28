#!/bin/bash
# 🚀 部署 Onion-Mcp Bot 到 Google Cloud Run

echo "🤖 部署諸葛亮 Bot 到 Google Cloud Run..."
echo ""

# 配置
PROJECT_ID="oece-tech-9aa8d"
SERVICE_NAME="onion-mcp-bot"
REGION="asia-southeast1"

# 構建 Docker 鏡像
echo "📦 構建 Docker 鏡像..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# 部署到 Cloud Run
echo "🚀 部署到 Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars TELEGRAM_BOT_TOKEN=8364183144:AAEIK0LENbquiX_KT_U1pGPU06t1bvn0z2w \
  --set-env-vars GEMINI_KEY_1=$GEMINI_API_KEY_1 \
  --set-env-vars GEMINI_KEY_2=$GEMINI_API_KEY_2 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 3 \
  --min-instances 0

# 獲取 URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')

echo ""
echo "✅ 部署完成！"
echo "📡 Service URL: $SERVICE_URL"
echo ""

# 設置 Telegram Webhook
echo "🔗 設置 Telegram Webhook..."
WEBHOOK_URL="$SERVICE_URL/webhook/8364183144:AAEIK0LENbquiX_KT_U1pGPU06t1bvn0z2w"

curl -X POST "https://api.telegram.org/bot8364183144:AAEIK0LENbquiX_KT_U1pGPU06t1bvn0z2w/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$WEBHOOK_URL\"}"

echo ""
echo ""
echo "🎉 諸葛亮 Bot 已上線！"
echo "📱 測試: 在 Telegram 發送消息給 @qitiandashengqianqian_bot"
echo ""
