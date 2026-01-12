#!/bin/bash
# OECE.tech 快速部署/更新腳本
# 在 VPS 上執行: bash deploy.sh

set -e

APP_DIR="/var/www/oece-tech"
cd $APP_DIR

echo "📥 拉取最新代碼..."
git pull origin main

echo "📦 安裝依賴..."
npm install

echo "🔨 構建項目..."
npm run build

echo "🔄 重啟應用..."
pm2 restart oece-tech

echo "✅ 部署完成！"
pm2 status
