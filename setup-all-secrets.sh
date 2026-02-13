#!/bin/bash
# 🔐 一鍵配置所有 GitHub Secrets 和 Doppler

REPO="web3-ai-game/oece-tech"

echo "🔐 開始配置 OECE.tech 完整環境變量..."
echo ""

# ============================================
# GitHub Secrets
# ============================================

echo "📦 配置 GitHub Secrets..."
echo ""

# Firebase 配置（7個）
gh secret set NEXT_PUBLIC_FIREBASE_API_KEY -b"***REDACTED***" -R $REPO
gh secret set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN -b"oece-tech-9aa8d.firebaseapp.com" -R $REPO
gh secret set NEXT_PUBLIC_FIREBASE_DATABASE_URL -b"https://oece-tech-9aa8d-default-rtdb.asia-southeast1.firebasedatabase.app" -R $REPO
gh secret set NEXT_PUBLIC_FIREBASE_PROJECT_ID -b"oece-tech-9aa8d" -R $REPO
gh secret set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET -b"oece-tech-9aa8d.firebasestorage.app" -R $REPO
gh secret set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID -b"501753160098" -R $REPO
gh secret set NEXT_PUBLIC_FIREBASE_APP_ID -b"1:501753160098:web:ae60f099b05b6bc8e812fb" -R $REPO

# Gemini Keys（從火計劃，20個）
gh secret set GEMINI_API_KEY_1 -b"$GEMINI_API_KEY_1" -R $REPO
gh secret set GEMINI_API_KEY_2 -b"$GEMINI_API_KEY_2" -R $REPO
gh secret set GEMINI_API_KEY_3 -b"$GEMINI_API_KEY_3" -R $REPO
gh secret set GEMINI_API_KEY_4 -b"$GEMINI_API_KEY_4" -R $REPO
gh secret set GEMINI_API_KEY_5 -b"$GEMINI_API_KEY_5" -R $REPO
gh secret set GEMINI_API_KEY_6 -b"$GEMINI_API_KEY_6" -R $REPO
gh secret set GEMINI_API_KEY_7 -b"$GEMINI_API_KEY_7" -R $REPO
gh secret set GEMINI_API_KEY_8 -b"$GEMINI_API_KEY_8" -R $REPO
gh secret set GEMINI_API_KEY_9 -b"$GEMINI_API_KEY_9" -R $REPO
gh secret set GEMINI_API_KEY_10 -b"$GEMINI_API_KEY_10" -R $REPO
gh secret set GEMINI_API_KEY_11 -b"$GEMINI_API_KEY_11" -R $REPO
gh secret set GEMINI_API_KEY_12 -b"$GEMINI_API_KEY_12" -R $REPO
gh secret set GEMINI_API_KEY_13 -b"$GEMINI_API_KEY_13" -R $REPO
gh secret set GEMINI_API_KEY_14 -b"$GEMINI_API_KEY_14" -R $REPO
gh secret set GEMINI_API_KEY_15 -b"$GEMINI_API_KEY_15" -R $REPO
gh secret set GEMINI_API_KEY_16 -b"$GEMINI_API_KEY_16" -R $REPO
gh secret set GEMINI_API_KEY_17 -b"$GEMINI_API_KEY_17" -R $REPO
gh secret set GEMINI_API_KEY_18 -b"$GEMINI_API_KEY_18" -R $REPO
gh secret set GEMINI_API_KEY_19 -b"$GEMINI_API_KEY_19" -R $REPO
gh secret set GEMINI_API_KEY_20 -b"$GEMINI_API_KEY_20" -R $REPO

# OpenRouter
gh secret set OPENROUTER_API_KEY -b"$OPENROUTER_API_KEY" -R $REPO

# MongoDB
gh secret set MONGODB_URI -b"$MONGODB_URI" -R $REPO

# Algolia
gh secret set ALGOLIA_APP_ID -b"$ALGOLIA_APP_ID" -R $REPO
gh secret set ALGOLIA_ADMIN_API_KEY -b"$ALGOLIA_ADMIN_API_KEY" -R $REPO
gh secret set ALGOLIA_SEARCH_API_KEY -b"$ALGOLIA_SEARCH_API_KEY" -R $REPO

# Sentry
gh secret set NEXT_PUBLIC_SENTRY_DSN -b"$NEXT_PUBLIC_SENTRY_DSN" -R $REPO

echo ""
echo "✅ 所有 GitHub Secrets 配置完成！"
echo ""

# ============================================
# Doppler 配置
# ============================================

echo "📦 配置 Doppler 環境變量..."
echo ""

DOPPLER_TOKEN="${DOPPLER_TOKEN:-}"  # 從環境變量讀取

# 注入到 Doppler
curl -X POST "https://api.doppler.com/v3/configs/config/secrets" \
  -H "Authorization: Bearer $DOPPLER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project": "oece-tech",
    "config": "dev",
    "secrets": {
      "FIREBASE_API_KEY": "***REDACTED***",
      "MONGODB_URI": "'"$MONGODB_URI"'",
      "GEMINI_KEY_1": "'"$GEMINI_API_KEY_1"'",
      "GEMINI_KEY_2": "'"$GEMINI_API_KEY_2"'",
      "OPENROUTER_API_KEY": "'"$OPENROUTER_API_KEY"'"
    }
  }'

echo ""
echo "✅ Doppler 配置完成！"
echo ""

# ============================================
# 驗證
# ============================================

echo "📋 驗證 GitHub Secrets..."
gh secret list -R $REPO | head -30

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 所有配置完成！"
echo ""
echo "下一步："
echo "  git commit --allow-empty -m '🚀 Trigger deployment'"
echo "  git push origin main"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
