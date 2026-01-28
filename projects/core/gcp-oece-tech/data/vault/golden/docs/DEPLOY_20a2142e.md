# 部署指南

詳細的 VPS 部署步驟指南。

## 前置準備

### 1. VPS 要求

- **系統**: Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- **最低配置**: 2GB RAM, 1 CPU, 20GB 硬盤
- **推薦配置**: 2GB RAM, 2 CPU, 40GB 硬盤

### 2. 獲取必要的憑證

#### Telegram Bot Token
1. 在 Telegram 中搜索 [@BotFather](https://t.me/botfather)
2. 發送 `/newbot` 創建新機器人
3. 按提示設置名稱和用戶名
4. 保存收到的 Token

#### Claude API Key
1. 訪問 [Anthropic Console](https://console.anthropic.com/)
2. 註冊/登錄賬號
3. 在 API Keys 頁面創建新密鑰
4. 保存 API Key

## VPS 初始設置

### 1. 連接到 VPS

```bash
ssh root@your-vps-ip
```

### 2. 更新系統

```bash
apt update && apt upgrade -y
```

### 3. 安裝 Docker

```bash
# 安裝 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 將當前用戶添加到 docker 組
usermod -aG docker $USER

# 啟動 Docker
systemctl start docker
systemctl enable docker
```

### 4. 安裝 Docker Compose

```bash
# 下載 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 添加執行權限
chmod +x /usr/local/bin/docker-compose

# 驗證安裝
docker-compose --version
```

### 5. 安裝 Git

```bash
apt install git -y
```

### 6. 配置 Swap（重要！）

對於 2GB RAM 的 VPS，建議配置 2GB Swap：

```bash
# 創建 Swap 文件
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# 持久化配置
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# 驗證
free -h
```

## 項目部署

### 1. 克隆項目

```bash
# 切換到 www 目錄
cd /var/www

# 克隆項目（替換為你的 GitHub 倉庫）
git clone https://github.com/yourusername/oece.tech.git
cd oece.tech
```

### 2. 配置環境變量

```bash
# 複製環境變量模板
cp .env.example .env

# 編輯 .env 文件
nano .env
```

添加以下內容：

```env
# Telegram Bot 配置
TELEGRAM_BOT_TOKEN=你的_telegram_bot_token

# Claude API 配置
CLAUDE_API_KEY=你的_claude_api_key
```

保存並退出（Ctrl+X, Y, Enter）。

### 3. 添加執行權限

```bash
chmod +x deploy.sh
```

### 4. 首次部署

```bash
./deploy.sh
```

或手動執行：

```bash
# 構建並啟動
docker-compose up -d --build

# 查看日誌
docker-compose logs -f
```

### 5. 驗證部署

```bash
# 檢查容器狀態
docker-compose ps

# 查看日誌
docker-compose logs web
docker-compose logs telegram-bot

# 測試網站
curl http://localhost:3000
```

## 配置域名和 HTTPS

### 1. 安裝 Nginx

```bash
apt install nginx -y
```

### 2. 配置 Nginx

創建配置文件：

```bash
nano /etc/nginx/sites-available/oece.tech
```

添加以下內容：

```nginx
server {
    listen 80;
    server_name oece.tech www.oece.tech;

    location / {
        proxy_pass http://localhost:3000;
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
```

啟用配置：

```bash
ln -s /etc/nginx/sites-available/oece.tech /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 3. 配置 SSL（Let's Encrypt）

```bash
# 安裝 Certbot
apt install certbot python3-certbot-nginx -y

# 獲取證書
certbot --nginx -d oece.tech -d www.oece.tech

# 測試自動續期
certbot renew --dry-run
```

## GitHub Actions 自動部署

### 1. 生成 SSH Key

在你的本地機器上：

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions
```

### 2. 添加公鑰到 VPS

```bash
# 複製公鑰內容
cat ~/.ssh/github-actions.pub

# 在 VPS 上添加到 authorized_keys
echo "公鑰內容" >> ~/.ssh/authorized_keys
```

### 3. 配置 GitHub Secrets

在 GitHub 倉庫中，進入 Settings > Secrets and variables > Actions，添加：

- `VPS_HOST`: VPS IP 地址
- `VPS_USERNAME`: SSH 用戶名（通常是 root）
- `VPS_SSH_KEY`: 私鑰內容（`~/.ssh/github-actions` 的內容）
- `VPS_PORT`: SSH 端口（默認 22）

### 4. 測試自動部署

提交並推送代碼到 main 分支：

```bash
git add .
git commit -m "test: auto deploy"
git push origin main
```

在 GitHub Actions 頁面查看部署進度。

## 常用運維命令

### 查看服務狀態

```bash
docker-compose ps
docker stats
```

### 查看日誌

```bash
# 實時日誌
docker-compose logs -f

# 查看特定服務
docker-compose logs -f web
docker-compose logs -f telegram-bot

# 最近 100 行
docker-compose logs --tail=100
```

### 重啟服務

```bash
# 重啟所有服務
docker-compose restart

# 重啟特定服務
docker-compose restart web
docker-compose restart telegram-bot
```

### 更新代碼

```bash
cd /var/www/oece.tech
./deploy.sh
```

或手動：

```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

### 清理空間

```bash
# 清理未使用的鏡像
docker image prune -a -f

# 清理所有未使用的資源
docker system prune -a -f
```

### 監控內存

```bash
# 系統內存
free -h

# Docker 容器資源使用
docker stats

# 實時監控
htop
```

## 故障排查

### 網站無法訪問

1. 檢查容器狀態：
   ```bash
   docker-compose ps
   ```

2. 查看日誌：
   ```bash
   docker-compose logs web
   ```

3. 檢查端口：
   ```bash
   netstat -tulpn | grep 3000
   ```

### Telegram Bot 不響應

1. 檢查 Bot 容器：
   ```bash
   docker-compose logs telegram-bot
   ```

2. 驗證環境變量：
   ```bash
   cat .env
   ```

3. 測試 API 連接：
   ```bash
   docker-compose exec telegram-bot curl https://api.telegram.org
   ```

### 內存不足

1. 檢查內存使用：
   ```bash
   free -h
   docker stats
   ```

2. 重啟服務：
   ```bash
   docker-compose restart
   ```

3. 確保 Swap 已啟用：
   ```bash
   swapon --show
   ```

### 構建失敗

1. 清理 Docker 緩存：
   ```bash
   docker builder prune -a -f
   ```

2. 重新構建：
   ```bash
   docker-compose build --no-cache
   ```

## 安全建議

1. **更改 SSH 端口**
   ```bash
   nano /etc/ssh/sshd_config
   # Port 22 改為其他端口，如 2222
   systemctl restart sshd
   ```

2. **配置防火牆**
   ```bash
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw allow 2222/tcp  # 你的 SSH 端口
   ufw enable
   ```

3. **定期更新**
   ```bash
   apt update && apt upgrade -y
   ```

4. **備份數據**
   ```bash
   # 備份 .env 文件和內容目錄
   tar -czf backup-$(date +%Y%m%d).tar.gz .env content/
   ```

## 性能優化

### 1. 啟用 Gzip（Nginx）

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript;
```

### 2. 配置緩存（Nginx）

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;

location / {
    proxy_cache my_cache;
    proxy_cache_valid 200 60m;
    # ... 其他配置
}
```

### 3. 限制 Docker 資源

已在 `docker-compose.yml` 中配置。

## 聯繫支持

如有問題，請：
- 提交 [GitHub Issue](https://github.com/yourusername/oece.tech/issues)
- 聯繫: your@email.com

---

**祝部署順利！🚀**
