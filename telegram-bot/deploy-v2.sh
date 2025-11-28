#!/bin/bash
set -e # 遇到錯誤立即停止

# --- 配置區 ---
PROJECT_ID="oece-tech-9aa8d"
SERVICE_NAME="onion-mcp-bot"
REGION="asia-southeast1" # 推薦使用靠近用戶的區域
# ----------------

echo "🤖 初始化諸葛亮 Bot 部署序列..."

# 1. 檢查是否在正確目錄
if [ ! -f "Dockerfile" ]; then
    echo "❌ 錯誤：找不到 Dockerfile！"
    echo "請確保你在 'oece-tech/telegram-bot' 目錄下執行此腳本。"
    exit 1
fi

# 2. 獲取 Token (交互式輸入，避免硬編碼洩漏)
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "🔑 請輸入新的 Telegram Bot Token (輸入後回車):"
    read -s TELEGRAM_BOT_TOKEN
fi

echo "📦 開始構建鏡像 (GCR)..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME --project $PROJECT_ID

echo "🚀 部署到 Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --set-env-vars TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN \
  --set-env-vars GEMINI_KEY_1=$GEMINI_API_KEY_1 \
  --set-env-vars GEMINI_KEY_2=$GEMINI_API_KEY_2 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 1

# 獲取服務 URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --project $PROJECT_ID --format 'value(status.url)')

echo ""
echo "✅ 服務已部署: $SERVICE_URL"
echo "🔗 正在設置 Webhook..."

# 設置 Webhook
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$SERVICE_URL/webhook/$TELEGRAM_BOT_TOKEN\"}"

echo ""
echo "🎉 部署完成！諸葛亮已就位。"
