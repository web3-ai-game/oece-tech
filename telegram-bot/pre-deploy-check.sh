#!/bin/bash
# 🔍 部署前檢查 - 確保所有配置正確

echo "🔍 執行部署前檢查..."
echo ""

# 1. 檢查當前目錄
echo "📁 檢查當前目錄..."
if [ ! -f "Dockerfile" ]; then
    echo "❌ 錯誤：找不到 Dockerfile"
    echo "當前目錄: $(pwd)"
    echo "請執行: cd /Users/deepweay/Documents/github/oece-tech/telegram-bot"
    exit 1
fi
echo "✅ Dockerfile 存在"

# 2. 檢查 gcloud 配置
echo ""
echo "☁️ 檢查 gcloud 配置..."
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
echo "當前項目: $CURRENT_PROJECT"

if [ "$CURRENT_PROJECT" != "oece-tech-9aa8d" ]; then
    echo "⚠️  警告：項目不匹配"
    echo "執行: gcloud config set project oece-tech-9aa8d"
    gcloud config set project oece-tech-9aa8d
fi
echo "✅ 項目配置正確"

# 3. 檢查環境變量
echo ""
echo "🔑 檢查環境變量..."

if [ -z "$GEMINI_API_KEY_1" ]; then
    echo "⚠️  GEMINI_API_KEY_1 未設置"
    echo "執行: source /Users/deepweay/Documents/github/sms-key/FINAL-KEYS-CONFIG.env"
else
    echo "✅ GEMINI_API_KEY_1: ${GEMINI_API_KEY_1:0:20}..."
fi

if [ -z "$GEMINI_API_KEY_2" ]; then
    echo "⚠️  GEMINI_API_KEY_2 未設置"
else
    echo "✅ GEMINI_API_KEY_2: ${GEMINI_API_KEY_2:0:20}..."
fi

# 4. 檢查 API 啟用狀態
echo ""
echo "🔌 檢查 GCP API..."
gcloud services list --enabled --project oece-tech-9aa8d --filter="name:cloudbuild.googleapis.com OR name:run.googleapis.com" --format="value(name)" | while read api; do
    echo "✅ $api"
done

# 5. 檢查 Telegram Bot Token
echo ""
echo "🤖 Telegram Bot Token 狀態..."
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "⚠️  未設置 TELEGRAM_BOT_TOKEN"
    echo "需要從 BotFather 獲取新 Token"
else
    echo "✅ Token: ${TELEGRAM_BOT_TOKEN:0:10}..."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 檢查完成！"
echo ""
echo "下一步："
echo "1. 確保有新的 Telegram Bot Token"
echo "2. 執行: ./deploy-v2.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
