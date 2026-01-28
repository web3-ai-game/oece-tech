# 🌊 DigitalOcean VPS 配置文档

## 📊 服务器规格

```
提供商: DigitalOcean
套餐: Basic Droplet
规格:
  - RAM: 2GB
  - CPU: 2 vCPU
  - SSD: 60GB
  - 流量: 3TB/月
  - 价格: $12/月 ($144/年)
区域: Singapore (sgp1) 或 Hong Kong (sgp1)
操作系统: Ubuntu 22.04 LTS
```

## 🗄️ 数据库配置

```
类型: DigitalOcean Managed PostgreSQL (推荐)
或: MySQL 8.0
套餐: Basic ($15/月)
规格:
  - RAM: 1GB
  - Disk: 10GB
  - 自动备份
  - 高可用性

免费方案: SQLite (当前使用)
迁移方案: 准备 PostgreSQL 适配器
```

## 🔑 SSH 连接信息

### 首次连接

```bash
# SSH 登录
ssh root@YOUR_DROPLET_IP

# 更新系统
apt update && apt upgrade -y

# 安装必要工具
apt install -y curl git build-essential
```

### 创建部署用户

```bash
# 创建 geeksea 用户
adduser geeksea
usermod -aG sudo geeksea

# 设置 SSH Key
mkdir -p /home/geeksea/.ssh
cp ~/.ssh/authorized_keys /home/geeksea/.ssh/
chown -R geeksea:geeksea /home/geeksea/.ssh
chmod 700 /home/geeksea/.ssh
chmod 600 /home/geeksea/.ssh/authorized_keys

# 切换到部署用户
su - geeksea
```

## 📦 环境安装

### 1. 安装 Node.js 18

```bash
# 使用 nvm 安装
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

nvm install 18
nvm use 18
nvm alias default 18

# 验证
node --version  # v18.x.x
npm --version   # 9.x.x
```

### 2. 安装 PM2

```bash
npm install -g pm2

# 设置开机自启
pm2 startup
sudo env PATH=$PATH:/home/geeksea/.nvm/versions/node/v18.x.x/bin pm2 startup systemd -u geeksea --hp /home/geeksea
```

### 3. 安装 Nginx

```bash
sudo apt install -y nginx

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 🚀 项目部署

### 1. 克隆项目

```bash
cd /home/geeksea
git clone https://github.com/YOUR_USERNAME/geeksea.git
cd geeksea

# 安装依赖
npm install
```

### 2. 环境变量配置

```bash
# 创建 .env.production
nano .env.production
```

内容：
```env
# 生产环境
NODE_ENV=production

# JWT Secret (生成强密钥)
JWT_SECRET=your_super_secret_key_here_change_this_in_production

# 数据库 (SQLite)
DATABASE_URL=./database/geeksea.db

# 站点配置
NEXT_PUBLIC_SITE_URL=https://geeksea.com
NEXT_PUBLIC_SITE_NAME=GeekSEA
NEXT_PUBLIC_API_URL=https://api.geeksea.com

# Cloudflare (速度测试，无需配置)
# IPinfo (可选)
IPINFO_TOKEN=your_token_here

# Stripe (可选)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Notion (可选)
NOTION_API_KEY=secret_xxx
NOTION_DATABASE_ID=xxx
```

### 3. 初始化数据库

```bash
# 创建数据库目录
mkdir -p database

# 初始化数据库
npm run db:init

# 创建 Admin 账号
npm run create-admin

# 种子数据（可选）
npm run db:seed
```

### 4. 构建项目

```bash
npm run build
```

### 5. PM2 启动

```bash
# 启动应用
pm2 start npm --name "geeksea" -- start

# 保存配置
pm2 save

# 查看状态
pm2 status
pm2 logs geeksea
```

## 🌐 Nginx 配置

### 创建配置文件

```bash
sudo nano /etc/nginx/sites-available/geeksea
```

内容：
```nginx
# GeekSEA 配置
upstream geeksea_upstream {
    server 127.0.0.1:3000;
    keepalive 64;
}

# HTTP -> HTTPS 重定向
server {
    listen 80;
    listen [::]:80;
    server_name geeksea.com www.geeksea.com;
    
    return 301 https://$server_name$request_uri;
}

# HTTPS 配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name geeksea.com www.geeksea.com;

    # SSL 证书 (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/geeksea.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/geeksea.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # Next.js 静态资源缓存
    location /_next/static {
        proxy_pass http://geeksea_upstream;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /_next/image {
        proxy_pass http://geeksea_upstream;
        add_header Cache-Control "public, max-age=86400";
    }

    # API 路由
    location /api {
        proxy_pass http://geeksea_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 默认路由
    location / {
        proxy_pass http://geeksea_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/geeksea /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

## 🔐 SSL 证书 (Let's Encrypt)

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d geeksea.com -d www.geeksea.com

# 自动续期
sudo certbot renew --dry-run

# 添加自动续期任务
sudo crontab -e
# 添加: 0 3 * * * certbot renew --quiet
```

## 🔄 自动部署脚本

### GitHub Webhook 部署

创建 `/home/geeksea/deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# 项目目录
cd /home/geeksea/geeksea

# 拉取最新代码
echo "📥 Pulling latest code..."
git pull origin main

# 安装依赖
echo "📦 Installing dependencies..."
npm install

# 构建项目
echo "🔨 Building project..."
npm run build

# 数据库迁移（如果有）
echo "🗄️ Running migrations..."
npm run db:migrate || true

# 重启 PM2
echo "♻️ Restarting application..."
pm2 restart geeksea

echo "✅ Deployment completed!"
```

设置权限：
```bash
chmod +x /home/geeksea/deploy.sh
```

### GitHub Actions 自动部署

创建 `.github/workflows/deploy-do.yml`:

```yaml
name: Deploy to DigitalOcean

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Deploy to DO VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DO_HOST }}
          username: geeksea
          key: ${{ secrets.DO_SSH_KEY }}
          script: |
            /home/geeksea/deploy.sh
```

## 📊 监控和维护

### PM2 监控

```bash
# 实时监控
pm2 monit

# 查看日志
pm2 logs geeksea
pm2 logs geeksea --lines 100

# 重启应用
pm2 restart geeksea

# 查看资源使用
pm2 show geeksea
```

### 系统监控

```bash
# 磁盘使用
df -h

# 内存使用
free -h

# CPU 使用
top
htop  # 需要先安装: sudo apt install htop

# 网络流量
vnstat  # 需要先安装: sudo apt install vnstat
```

### 日志管理

```bash
# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PM2 日志轮转
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 50M
pm2 set pm2-logrotate:retain 7
```

## 🛡️ 安全加固

### 防火墙配置

```bash
# UFW 防火墙
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
sudo ufw status
```

### Fail2Ban

```bash
# 安装
sudo apt install -y fail2ban

# 配置
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# 启动
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### 定期备份

创建 `/home/geeksea/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/home/geeksea/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 备份数据库
cp /home/geeksea/geeksea/database/geeksea.db $BACKUP_DIR/geeksea_$DATE.db

# 只保留最近7天的备份
find $BACKUP_DIR -name "geeksea_*.db" -mtime +7 -delete

echo "✅ Backup completed: geeksea_$DATE.db"
```

添加定时任务：
```bash
crontab -e
# 每天凌晨2点备份
0 2 * * * /home/geeksea/backup.sh
```

## 🔧 故障排除

### 应用无法启动

```bash
# 查看 PM2 错误日志
pm2 logs geeksea --err

# 检查端口占用
sudo netstat -tulpn | grep 3000

# 重新构建
cd /home/geeksea/geeksea
npm run build
pm2 restart geeksea
```

### Nginx 502 错误

```bash
# 检查 Next.js 是否运行
pm2 status

# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 磁盘空间不足

```bash
# 查找大文件
du -h /home/geeksea/geeksea | sort -rh | head -20

# 清理 node_modules
npm prune --production

# 清理 PM2 日志
pm2 flush

# 清理旧备份
rm -f /home/geeksea/backups/geeksea_old*.db
```

## 📈 性能优化

### Node.js 优化

```bash
# PM2 集群模式
pm2 start npm --name "geeksea" -i 2 -- start

# 最大内存限制
pm2 start npm --name "geeksea" --max-memory-restart 1G -- start
```

### 数据库优化

```sql
-- SQLite 优化
PRAGMA journal_mode=WAL;
PRAGMA synchronous=NORMAL;
PRAGMA cache_size=10000;
PRAGMA temp_store=MEMORY;
```

## 📞 快速命令

```bash
# 应用管理
alias geeksea-restart='pm2 restart geeksea'
alias geeksea-logs='pm2 logs geeksea'
alias geeksea-status='pm2 show geeksea'

# 系统管理
alias geeksea-backup='/home/geeksea/backup.sh'
alias geeksea-deploy='/home/geeksea/deploy.sh'
alias geeksea-update='cd /home/geeksea/geeksea && git pull && npm install && npm run build && pm2 restart geeksea'
```

---

**服务器配置完成后，访问**: https://geeksea.com
**SSH 地址**: `ssh geeksea@YOUR_DROPLET_IP`
