#!/bin/bash
# 🔧 一鍵修復所有問題

echo "🔧 開始修復 OECE.tech 部署問題..."
echo ""

# 1. 確保在正確目錄
if [ ! -f "firebase.json" ]; then
    echo "❌ 錯誤：不在 oece-tech 項目目錄"
    echo "請執行："
    echo "  cd /Users/deepweay/Documents/github/oece-tech"
    echo "  ./FIX-ALL.sh"
    exit 1
fi

echo "✅ 當前目錄正確: $(pwd)"
echo ""

# 2. 配置 gcloud
echo "☁️ 配置 gcloud 項目..."
gcloud config set project oece-tech-9aa8d
echo "✅ gcloud 項目已設置"
echo ""

# 3. 配置 firebase
echo "🔥 配置 Firebase 項目..."
firebase use oece-tech-9aa8d
echo "✅ Firebase 項目已設置"
echo ""

# 4. 檢查環境變量
echo "🔑 檢查環境變量..."
if [ -z "$NEXT_PUBLIC_FIREBASE_API_KEY" ]; then
    echo "⚠️  環境變量未加載，正在加載..."
    if [ -f ".env.local" ]; then
        export $(cat .env.local | xargs)
        echo "✅ 從 .env.local 加載"
    else
        echo "❌ .env.local 不存在"
    fi
else
    echo "✅ 環境變量已加載"
fi
echo ""

# 5. 清理舊文件
echo "🧹 清理構建產物..."
rm -rf .next .firebase build-error.log firebase-debug.log
echo "✅ 清理完成"
echo ""

# 6. 構建項目
echo "📦 構建項目..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 構建失敗"
    exit 1
fi
echo "✅ 構建成功"
echo ""

# 7. 部署到 Firebase
echo "🚀 部署到 Firebase Hosting..."
firebase deploy --only hosting --project oece-tech-9aa8d
if [ $? -ne 0 ]; then
    echo "❌ 部署失敗"
    exit 1
fi
echo "✅ 部署成功"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 修復完成！"
echo ""
echo "訪問: https://oece-tech-9aa8d.web.app"
echo "或: https://oece.tech"
echo ""
echo "如果看到舊版本，強制刷新: Cmd + Shift + R"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
