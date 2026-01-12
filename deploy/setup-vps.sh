#!/bin/bash
# OECE.tech VPS 部署腳本
# 在 VPS 上執行此腳本

set -e

echo "🚀 OECE.tech VPS 部署開始..."

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 變量
DOMAIN="oece.tech"
APP_DIR="/var/www/oece-tech"
REPO_URL="https://github.com/web3-ai-game/oece-tech.git"

echo -e "${YELLOW}[1/7] 更新系統...${NC}"
apt update && apt upgrade -y

echo -e "${YELLOW}[2/7] 安裝依賴...${NC}"
# 安裝 Node.js 20.x
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

# 安裝 Nginx
apt install -y nginx certbot python3-certbot-nginx git

# 安裝 PM2
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

echo -e "${YELLOW}[3/7] 創建應用目錄...${NC}"
mkdir -p $APP_DIR
mkdir -p /var/log/pm2
mkdir -p /var/www/certbot

echo -e "${YELLOW}[4/7] 克隆/更新代碼...${NC}"
if [ -d "$APP_DIR/.git" ]; then
    cd $APP_DIR
    git pull origin main
else
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

echo -e "${YELLOW}[5/7] 安裝依賴並構建...${NC}"
cd $APP_DIR
npm install
npm run build

echo -e "${YELLOW}[6/7] 配置 Nginx...${NC}"
# 複製 Nginx 配置（先用 HTTP）
cat > /etc/nginx/sites-available/oece.tech << 'EOF'
server {
    listen 80;
    server_name oece.tech www.oece.tech;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 啟用站點
ln -sf /etc/nginx/sites-available/oece.tech /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 測試並重載 Nginx
nginx -t && systemctl reload nginx

echo -e "${YELLOW}[7/7] 啟動應用...${NC}"
cd $APP_DIR

# 創建 .env.local（需要手動填入）
if [ ! -f ".env.local" ]; then
    echo -e "${RED}⚠️  請創建 .env.local 文件並填入環境變量${NC}"
    echo "參考: .env.local.example"
fi

# 使用 PM2 啟動
pm2 delete oece-tech 2>/dev/null || true
pm2 start npm --name "oece-tech" -- start
pm2 save
pm2 startup

echo ""
echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""
echo "📋 下一步："
echo "1. 確保 DNS A 記錄指向此 VPS IP"
echo "2. 創建 .env.local 文件"
echo "3. 運行 SSL 配置: sudo certbot --nginx -d oece.tech -d www.oece.tech"
echo ""
echo "🔧 常用命令："
echo "  pm2 logs oece-tech    # 查看日誌"
echo "  pm2 restart oece-tech # 重啟應用"
echo "  pm2 status            # 查看狀態"
