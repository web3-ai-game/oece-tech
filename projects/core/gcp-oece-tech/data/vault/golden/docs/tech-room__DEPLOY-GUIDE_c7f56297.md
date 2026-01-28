# 🚀 GeekSEA 完整部署指南

本指南提供三種部署方案，選擇最適合你的方式。

---

## 📋 目錄

1. [方案對比](#方案對比)
2. [Cloudflare Pages（推薦）](#方案1-cloudflare-pages推薦)
3. [DigitalOcean VPS](#方案2-digitalocean-vps)
4. [Vercel](#方案3-vercel)
5. [環境變量配置](#環境變量配置)
6. [自定義域名](#自定義域名)
7. [故障排除](#故障排除)

---

## 方案對比

| 特性 | Cloudflare Pages | DigitalOcean | Vercel |
|------|------------------|--------------|--------|
| **價格** | 完全免費 | $5/月起 | 免費（Hobby） |
| **帶寬** | 無限制 | 1TB/月 | 100GB/月 |
| **CDN** | ✅ 全球 | ❌ 需自行配置 | ✅ 全球 |
| **構建時間** | 無限制 | 無限制 | 100 小時/月 |
| **自定義域名** | ✅ 免費 SSL | ✅ 免費 SSL | ✅ 免費 SSL |
| **適合場景** | 靜態站點 | 完全控制 | 快速部署 |
| **推薦指數** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 方案1: Cloudflare Pages（推薦）

**優勢**：完全免費、全球 CDN、自動 HTTPS、無限帶寬

### 步驟 1: 準備代碼

```bash
# 確保代碼已推送到 GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 步驟 2: 連接 Cloudflare Pages

1. 訪問 [Cloudflare Pages](https://pages.cloudflare.com/)
2. 點擊「Create a project」
3. 選擇「Connect to Git」
4. 授權 GitHub 並選擇 `tech-room` 倉庫

### 步驟 3: 配置構建設置

```yaml
Project name: geeksea
Production branch: main
Build command: npm run build
Build output directory: dist
Root directory: /
```

### 步驟 4: 環境變量

在 Cloudflare Pages 設置中添加：

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
PUBLIC_SITE_URL=https://geeksea.pages.dev
```

### 步驟 5: 部署

- 點擊「Save and Deploy」
- 等待 2-5 分鐘
- 訪問 `https://geeksea.pages.dev`

### 🎉 完成！

你的網站已經上線，每次推送到 `main` 分支都會自動部署。

---

## 方案2: DigitalOcean VPS

**優勢**：完全控制、可運行後端、適合學習

### 步驟 1: 創建 Droplet

1. 登錄 [DigitalOcean](https://www.digitalocean.com/)
2. 創建新 Droplet：
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic ($5/月)
   - **Region**: 選擇最近的
   - **Authentication**: SSH Key（推薦）

### 步驟 2: 執行部署腳本

```bash
# 本地操作：上傳腳本
scp setup-remote-dev.sh root@YOUR_DROPLET_IP:~/

# SSH 登錄
ssh root@YOUR_DROPLET_IP

# 執行腳本
chmod +x setup-remote-dev.sh
./setup-remote-dev.sh
```

腳本會自動安裝：
- Node.js 20
- Code-Server（Web VSCode）
- Docker
- n8n（自動化工具）
- Nginx（反向代理）
- 防火牆和安全配置

### 步驟 3: 部署項目

```bash
# 進入項目目錄
cd ~/geeksea

# 安裝依賴
npm install

# 構建項目
npm run build

# 使用 PM2 運行（持久化）
npm install -g pm2
pm2 start npm --name "geeksea" -- run preview
pm2 save
pm2 startup
```

### 步驟 4: 配置 Nginx

```bash
sudo nano /etc/nginx/sites-available/geeksea
```

添加配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

啟用站點：

```bash
sudo ln -s /etc/nginx/sites-available/geeksea /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 步驟 5: 配置 SSL

```bash
# 安裝 Certbot
sudo apt install certbot python3-certbot-nginx

# 獲取證書
sudo certbot --nginx -d your-domain.com

# 自動更新
sudo certbot renew --dry-run
```

### 🎉 完成！

訪問 `https://your-domain.com`

---

## 方案3: Vercel

**優勢**：零配置、自動優化、快速部署

### 步驟 1: 安裝 Vercel CLI

```bash
npm i -g vercel
```

### 步驟 2: 登錄

```bash
vercel login
```

### 步驟 3: 部署

```bash
# 進入項目目錄
cd tech-room

# 部署到生產環境
vercel --prod
```

### 步驟 4: 環境變量

```bash
# 添加環境變量
vercel env add PUBLIC_SUPABASE_URL
vercel env add PUBLIC_SUPABASE_ANON_KEY
```

### 步驟 5: 重新部署

```bash
vercel --prod
```

### 🎉 完成！

Vercel 會提供一個 `.vercel.app` 域名。

---

## 環境變量配置

### 必需變量

```env
# Supabase（如果使用認證功能）
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 站點配置
PUBLIC_SITE_URL=https://your-domain.com
PUBLIC_SITE_NAME=GeekSEA
PUBLIC_SITE_DESCRIPTION=專業技術教程平台
```

### 可選變量

```env
# Google Analytics
PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX

# Umami Analytics（自托管）
PUBLIC_UMAMI_WEBSITE_ID=your-website-id
PUBLIC_UMAMI_URL=https://analytics.your-domain.com

# Plausible Analytics
PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
```

---

## 自定義域名

### Cloudflare Pages

1. 在 Cloudflare Pages 項目設置中點擊「Custom domains」
2. 添加你的域名
3. Cloudflare 會自動配置 DNS

### DigitalOcean

1. 在域名註冊商添加 A 記錄：
   ```
   Type: A
   Name: @
   Value: YOUR_DROPLET_IP
   TTL: 3600
   ```

2. 添加 www 記錄：
   ```
   Type: CNAME
   Name: www
   Value: your-domain.com
   TTL: 3600
   ```

### Vercel

1. 在 Vercel 項目設置中點擊「Domains」
2. 添加你的域名
3. 按照提示配置 DNS

---

## 故障排除

### 構建失敗

**問題**：`npm run build` 失敗

**解決**：

```bash
# 清理緩存
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# 重新構建
npm run build
```

### 環境變量未生效

**問題**：`PUBLIC_*` 變量未定義

**解決**：

1. 確保變量名以 `PUBLIC_` 開頭
2. 重新部署項目
3. 檢查 `.env` 文件位置

### 404 錯誤

**問題**：頁面顯示 404

**解決**：

檢查路由配置：

```bash
# 確保 dist 目錄存在
ls -la dist/

# 檢查 Astro 配置
cat astro.config.mjs
```

### SSL 證書問題

**問題**：HTTPS 無法訪問

**解決**：

```bash
# DigitalOcean
sudo certbot renew --dry-run
sudo nginx -t
sudo systemctl reload nginx

# Cloudflare/Vercel
# 等待 DNS 傳播（最多 24 小時）
```

### 性能優化

**問題**：頁面加載慢

**解決**：

1. **啟用壓縮**：

```nginx
# /etc/nginx/nginx.conf
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

2. **優化圖片**：

```bash
npm run optimize:images
```

3. **啟用緩存**：

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 持續集成/部署（CI/CD）

### GitHub Actions

創建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: geeksea
          directory: dist
```

---

## 監控與分析

### 1. Cloudflare Web Analytics

免費、隱私友好、無需 Cookie

```html
<!-- 添加到 <head> -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
        data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
```

### 2. 自托管 Umami

```bash
# Docker 部署
docker run -d \
  --name umami \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://username:password@db:5432/umami \
  ghcr.io/umami-software/umami:postgresql-latest
```

### 3. Plausible Analytics

輕量級、開源、GDPR 友好

```html
<script defer data-domain="your-domain.com" 
        src="https://plausible.io/js/script.js"></script>
```

---

## 備份策略

### 自動備份腳本

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/root/backups"

# 創建備份目錄
mkdir -p $BACKUP_DIR

# 備份項目文件
tar -czf $BACKUP_DIR/geeksea-$DATE.tar.gz /root/geeksea

# 備份數據庫（如果有）
# pg_dump your_database > $BACKUP_DIR/db-$DATE.sql

# 上傳到 S3/Dropbox/Drive
# rclone copy $BACKUP_DIR remote:backups

# 清理 30 天前的備份
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

設置定時任務：

```bash
# 每天凌晨 3 點執行
crontab -e
0 3 * * * /root/backup.sh
```

---

## 安全檢查清單

- [ ] 啟用 HTTPS
- [ ] 配置防火牆（UFW）
- [ ] 定期更新系統
- [ ] 使用強密碼
- [ ] 配置 SSH 密鑰
- [ ] 禁用 root SSH 登錄
- [ ] 啟用 Fail2ban
- [ ] 設置自動備份
- [ ] 監控服務器狀態
- [ ] 配置 CSP 頭

---

## 📞 需要幫助？

- 📧 Email: support@example.com
- 💬 GitHub Issues: [提交問題](https://github.com/web3-ai-game/tech-room/issues)
- 📖 文檔: [完整文檔](https://geeksea.dev/docs)

---

<div align="center">

**祝部署順利！🚀**

Made with ❤️ by GeekSEA Team

</div>
