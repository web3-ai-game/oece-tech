# 🚀 DigitalOcean 部署指南

## 💰 年度預算：$200 美元方案

**目標**：用最少的錢運行專業教程站

---

## 📊 DigitalOcean 定價方案（2025最新）

### 方案 1: App Platform（推薦）⭐

**優勢**：
- ✅ 零配置部署
- ✅ 自動擴展
- ✅ 自動HTTPS
- ✅ 內建CI/CD
- ✅ 適合Next.js

**定價**：
```
Basic Plan: $5/月 = $60/年
- 1 GB RAM
- 1 vCPU
- 自動擴展
- 100GB 帶寬/月
```

**數據庫（SQLite 本地）**：
```
免費！使用項目內建的 SQLite
或
Managed Database: $15/月（按需升級）
```

**總計**：
- **最低**: $60/年（僅App）
- **推薦**: $60/年（用內建SQLite）
- **升級**: $240/年（加Managed DB）

---

### 方案 2: Droplet VPS

**定價**：
```
Basic Droplet: $6/月 = $72/年
- 1 GB RAM
- 1 vCPU
- 25 GB SSD
- 1000 GB 流量

Regular Droplet: $12/月 = $144/年
- 2 GB RAM
- 1 vCPU  
- 50 GB SSD
- 2000 GB 流量
```

**額外費用**：
```
Floating IP: 免費（綁定Droplet時）
Snapshots: $0.05/GB/月（可選）
Load Balancer: $12/月（可選）
```

**總計**：
- **最低**: $72/年（Basic）
- **推薦**: $144/年（Regular）

---

## 🎯 推薦方案

### 🥇 方案 A: App Platform + 內建 SQLite
**費用**: $60/年（$5/月）

**適合**：
- 用戶量 < 1000
- 早期MVP階段
- 無需複雜配置

**部署步驟**：
1. 推送代碼到 GitHub
2. 連接 DigitalOcean App Platform
3. 自動部署
4. 完成！

---

### 🥈 方案 B: App Platform + Managed Database
**費用**: $240/年（$20/月）

**適合**：
- 用戶量 1000-5000
- 需要數據備份
- 需要更好性能

**配置**：
- App Platform: $5/月
- PostgreSQL Database: $15/月
- 總計: $20/月

---

### 🥉 方案 C: Basic Droplet (自管理)
**費用**: $72/年（$6/月）

**適合**：
- 喜歡完全控制
- 有DevOps經驗
- 願意手動維護

**需要做**：
- 手動配置Nginx
- 手動配置SSL
- 手動更新系統
- 自己處理監控

---

## 🚀 方案 A 部署步驟（推薦）

### 步驟 1: 準備代碼

```bash
# 1. 初始化 Git
cd /Users/svs.loline/Documents/xiangmu/tech-room
git init

# 2. 添加 .gitignore（已有）
# 確保 database/ 和 .env 被忽略

# 3. 提交代碼
git add .
git commit -m "Initial commit: GeekSEA Tutorial Platform"

# 4. 推送到 GitHub
git remote add origin https://github.com/YOUR_USERNAME/geeksea.git
git push -u origin main
```

### 步驟 2: 創建 App Platform 應用

1. 訪問 [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. 點擊 "Create App"
3. 選擇 GitHub 倉庫
4. 選擇 `geeksea` 倉庫

### 步驟 3: 配置應用

**環境變量**：
```env
JWT_SECRET=your-production-secret-key-here
NODE_ENV=production
DATABASE_URL=/data/geeksea.db
```

**構建命令**：
```bash
npm run build
```

**運行命令**：
```bash
npm run start
```

**健康檢查**：
```
Path: /
Port: 3000
```

### 步驟 4: 配置持久化存儲（SQLite）

在 App Platform 配置：
```yaml
databases:
  - name: geeksea-db
    engine: UNMANAGED
    # 使用本地文件系統
```

### 步驟 5: 部署

1. 點擊 "Deploy"
2. 等待 5-10 分鐘
3. 獲取 URL: `https://your-app.ondigitalocean.app`
4. 完成！

---

## 🔧 方案 C: Droplet 手動部署

### 步驟 1: 創建 Droplet

```bash
# 選擇：
- Ubuntu 22.04 LTS
- Basic Plan ($6/月)
- 選擇最近的數據中心
- 添加 SSH Key
```

### 步驟 2: 連接 Droplet

```bash
ssh root@YOUR_DROPLET_IP
```

### 步驟 3: 安裝依賴

```bash
# 更新系統
apt update && apt upgrade -y

# 安裝 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 安裝 PM2
npm install -g pm2

# 安裝 Nginx
apt install -y nginx

# 安裝 Certbot（SSL）
apt install -y certbot python3-certbot-nginx
```

### 步驟 4: 部署應用

```bash
# 克隆代碼
cd /var/www
git clone https://github.com/YOUR_USERNAME/geeksea.git
cd geeksea

# 安裝依賴
npm install

# 構建應用
npm run build

# 初始化數據庫
npm run db:init
npm run db:seed

# 使用 PM2 啟動
pm2 start npm --name "geeksea" -- start
pm2 save
pm2 startup
```

### 步驟 5: 配置 Nginx

```nginx
# /etc/nginx/sites-available/geeksea
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# 啟用網站
ln -s /etc/nginx/sites-available/geeksea /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 步驟 6: 配置 SSL

```bash
certbot --nginx -d your-domain.com
```

---

## 📊 成本對比表

| 方案 | 月費 | 年費 | RAM | CPU | 存儲 | 配置難度 |
|------|------|------|-----|-----|------|---------|
| App Platform (Basic) | $5 | $60 | 1GB | 1vCPU | 自動 | ⭐ 簡單 |
| App + Managed DB | $20 | $240 | 1GB | 1vCPU | 10GB | ⭐⭐ 中等 |
| Basic Droplet | $6 | $72 | 1GB | 1vCPU | 25GB | ⭐⭐⭐ 複雜 |
| Regular Droplet | $12 | $144 | 2GB | 1vCPU | 50GB | ⭐⭐⭐ 複雜 |

---

## 🎯 用戶量建議

### < 100 用戶
✅ **App Platform Basic** ($5/月)
- 內建 SQLite
- 完全夠用

### 100-1000 用戶
✅ **App Platform Basic** ($5/月)
- 內建 SQLite
- 監控性能

### 1000-5000 用戶
⚠️ **考慮升級**
- App Platform Pro ($12/月)
- 或 Managed Database ($15/月)

### > 5000 用戶
🚀 **需要擴展**
- 多個 App 實例
- Load Balancer
- Redis 緩存
- CDN（Cloudflare免費）

---

## 🛡️ 性能優化

### 對於 $5/月 App Platform

1. **使用 SQLite**（已經在用）
2. **靜態文件優化**
   - 使用 next/image
   - 壓縮圖片
   
3. **緩存策略**
   ```typescript
   // next.config.js
   module.exports = {
     images: {
       minimumCacheTTL: 60,
     },
   }
   ```

4. **代碼分割**
   - Next.js 自動處理
   - 使用動態導入

5. **監控**
   - DigitalOcean 內建監控
   - 設置警報

---

## 📈 擴展路徑

### 階段 1: MVP（$60/年）
- App Platform Basic
- 內建 SQLite
- < 1000 用戶

### 階段 2: 成長（$144-240/年）
- Regular Droplet 或
- App + Managed DB
- 1000-5000 用戶

### 階段 3: 規模化（$500+/年）
- 多實例部署
- Load Balancer
- CDN
- Redis 緩存
- PostgreSQL Cluster

---

## 🔒 安全建議

1. **環境變量**
   - 永不提交到 Git
   - 使用 DO 環境變量管理

2. **SSL/TLS**
   - App Platform 自動處理
   - Droplet 使用 Certbot

3. **數據庫備份**
   ```bash
   # 定時備份 SQLite
   0 2 * * * cp /data/geeksea.db /backups/geeksea-$(date +\%Y\%m\%d).db
   ```

4. **防火牆**
   - DO 雲端防火牆（免費）
   - 只開放 80, 443, 22

---

## 📞 快速決策

### 你想要...

#### 最簡單 + 最便宜？
→ **App Platform Basic** ($60/年)

#### 完全控制？
→ **Basic Droplet** ($72/年)

#### 最佳性能/價格比？
→ **Regular Droplet** ($144/年)

#### 企業級可靠性？
→ **App + Managed DB** ($240/年)

---

## 🎉 推薦：從這裡開始

```bash
# 1. 推送到 GitHub
git push origin main

# 2. 訪問 DigitalOcean
https://cloud.digitalocean.com/apps

# 3. 創建 App（5分鐘搞定）
# 4. 享受自動部署！
```

**年度成本**: $60  
**每月成本**: $5  
**每天成本**: $0.16  

**一杯咖啡的價格，運行一整個月！** ☕✨

---

**需要幫助？查看 [DEPLOY-VPS-OPTIMIZATION.md](./DEPLOY-VPS-OPTIMIZATION.md)** 🚀
