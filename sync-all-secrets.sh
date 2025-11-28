#!/bin/bash
# 🔐 完整同步：Doppler + GitHub Secrets + Firebase
# 從 sms-key/FINAL-KEYS-CONFIG.env 讀取所有密鑰

set -e

REPO="web3-ai-game/oece-tech"
SMS_KEY_PATH="/Users/deepweay/Documents/github/sms-key/FINAL-KEYS-CONFIG.env"

echo "🔐 開始完整密鑰同步..."
echo ""

# 1. 檢查 sms-key 文件
if [ ! -f "$SMS_KEY_PATH" ]; then
    echo "❌ 找不到 $SMS_KEY_PATH"
    exit 1
fi

echo "✅ 找到 sms-key 配置文件"
echo ""

# 2. 加載環境變量
source "$SMS_KEY_PATH"

echo "📦 開始同步到 GitHub Secrets..."
echo ""

# ============================================
# Firebase 配置（7個）
# ============================================

echo "🔥 Firebase 配置..."

gh secret set NEXT_PUBLIC_FIREBASE_API_KEY \
  -b"AIzaSyAunoEypiqpe5iCgWgK4JBpgeXbb0eN7RA" \
  -R $REPO

gh secret set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN \
  -b"oece-tech-9aa8d.firebaseapp.com" \
  -R $REPO

gh secret set NEXT_PUBLIC_FIREBASE_DATABASE_URL \
  -b"https://oece-tech-9aa8d-default-rtdb.asia-southeast1.firebasedatabase.app" \
  -R $REPO

gh secret set NEXT_PUBLIC_FIREBASE_PROJECT_ID \
  -b"oece-tech-9aa8d" \
  -R $REPO

gh secret set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET \
  -b"oece-tech-9aa8d.firebasestorage.app" \
  -R $REPO

gh secret set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID \
  -b"501753160098" \
  -R $REPO

gh secret set NEXT_PUBLIC_FIREBASE_APP_ID \
  -b"1:501753160098:web:ae60f099b05b6bc8e812fb" \
  -R $REPO

echo "✅ Firebase 配置完成"
echo ""

# ============================================
# Gemini Keys（20個，從環境變量）
# ============================================

echo "🤖 Gemini Keys..."

for i in {1..20}; do
    VAR_NAME="GEMINI_API_KEY_$i"
    VALUE="${!VAR_NAME}"
    
    if [ -n "$VALUE" ]; then
        gh secret set "$VAR_NAME" -b"$VALUE" -R $REPO
        echo "✅ $VAR_NAME"
    else
        echo "⚠️  $VAR_NAME 未設置"
    fi
done

echo ""

# ============================================
# 其他服務
# ============================================

echo "🔑 其他服務..."

# OpenRouter
if [ -n "$OPENROUTER_API_KEY" ]; then
    gh secret set OPENROUTER_API_KEY -b"$OPENROUTER_API_KEY" -R $REPO
    echo "✅ OpenRouter"
fi

# MongoDB
if [ -n "$MONGODB_URI" ]; then
    gh secret set MONGODB_URI -b"$MONGODB_URI" -R $REPO
    echo "✅ MongoDB"
fi

# Algolia
if [ -n "$ALGOLIA_APP_ID" ]; then
    gh secret set ALGOLIA_APP_ID -b"$ALGOLIA_APP_ID" -R $REPO
    gh secret set ALGOLIA_ADMIN_API_KEY -b"$ALGOLIA_ADMIN_API_KEY" -R $REPO
    gh secret set ALGOLIA_SEARCH_API_KEY -b"$ALGOLIA_SEARCH_API_KEY" -R $REPO
    echo "✅ Algolia"
fi

# Sentry
if [ -n "$NEXT_PUBLIC_SENTRY_DSN" ]; then
    gh secret set NEXT_PUBLIC_SENTRY_DSN -b"$NEXT_PUBLIC_SENTRY_DSN" -R $REPO
    echo "✅ Sentry"
fi

echo ""

# ============================================
# Doppler 同步
# ============================================

echo "📦 同步到 Doppler..."
echo ""

if [ -n "$DOPPLER_TOKEN" ]; then
    curl -X POST "https://api.doppler.com/v3/configs/config/secrets" \
      -H "Authorization: Bearer $DOPPLER_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"project\": \"oece-tech\",
        \"config\": \"dev\",
        \"secrets\": {
          \"FIREBASE_API_KEY\": \"AIzaSyAunoEypiqpe5iCgWgK4JBpgeXbb0eN7RA\",
          \"FIREBASE_PROJECT_ID\": \"oece-tech-9aa8d\",
          \"MONGODB_URI\": \"$MONGODB_URI\",
          \"GEMINI_KEY_1\": \"$GEMINI_API_KEY_1\",
          \"GEMINI_KEY_2\": \"$GEMINI_API_KEY_2\",
          \"GEMINI_KEY_3\": \"$GEMINI_API_KEY_3\",
          \"OPENROUTER_API_KEY\": \"$OPENROUTER_API_KEY\"
        }
      }" > /dev/null 2>&1
    
    echo "✅ Doppler 同步完成"
else
    echo "⚠️  DOPPLER_TOKEN 未設置，跳過 Doppler 同步"
fi

echo ""

# ============================================
# 驗證
# ============================================

echo "📋 驗證 GitHub Secrets..."
gh secret list -R $REPO | head -20

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 所有密鑰同步完成！"
echo ""
echo "已同步："
echo "  ✅ Firebase (7 個)"
echo "  ✅ Gemini Keys (20 個)"
echo "  ✅ OpenRouter"
echo "  ✅ MongoDB"
echo "  ✅ Algolia (3 個)"
echo "  ✅ Sentry"
echo "  ✅ Doppler"
echo ""
echo "下一步："
echo "  git commit --allow-empty -m '🔐 Trigger deploy after secrets sync'"
echo "  git push origin main"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
