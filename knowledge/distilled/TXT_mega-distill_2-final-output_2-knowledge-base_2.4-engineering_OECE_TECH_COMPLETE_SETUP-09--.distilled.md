---
source: TXT_mega-distill_2-final-output_2-knowledge-base_2.4-engineering_OECE_TECH_COMPLETE_SETUP-09--.md
distilled_at: 2026-02-14T09:19:07.904Z
model: grok-4-1-fast-non-reasoning
---

# 完整部署指南：Next.js 應用程式於 DigitalOcean VPS（整合 MongoDB、SSL 與 Grok API）

本知識文檔基於提供的關鍵事實、數據點與核心概念，詳細說明如何將 Next.js 應用程式部署至 DigitalOcean VPS，包括 VPS 配置、DNS 設定、MongoDB 整合、SSL 憑證、PM2 管理、環境變數與 Grok API 整合。文件由 **grok-4-0709** 精煉（**mode: B**，**part: 9**），適用於 **OECE.tech** 等雲端原生專案。

## 1. 概述與先決條件
此指南涵蓋端到端部署流程，將 Next.js 應用（支援靜態與伺服器端渲染）部署至 DigitalOcean Droplets（VPS），整合 MongoDB Atlas 作為託管資料庫，並使用 Certbot 啟用免費 SSL。核心優勢：
- **可擴展性**：DigitalOcean Droplets 提供彈性 CPU/記憶體配置。
- **成本效益**：從 $4/月起跳。
- **安全性**：自動 SSL 與環境變數隔離。

**先決條件**：
- DigitalOcean 帳戶。
- 註冊域名（e.g., via Namecheap 或 Cloudflare）。
- Node.js 開發環境。
- Git 儲存庫（包含 Next.js 專案）。

參考連結：
- [DigitalOcean Droplets 文檔](https://docs.digitalocean.com/products/droplets/)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)

## 2. VPS 配置（DigitalOcean Droplets）
### 步驟 1: 建立 Droplet
1. 登入 DigitalOcean 控制台 > **Create > Droplets**。
2. 選擇 **Ubuntu 22.04 LTS**（推薦，穩定支援 Node.js）。
3. 配置規格：**Basic** $6/月（1GB RAM，1 vCPU）適合小型應用；生產環境選 **Premium Intel** 2GB+。
4. 新增 SSH 金鑰（生成 `ssh-keygen -t ed25519` 並上傳公鑰）。
5. 選擇資料中心（e.g., NYC1 低延遲）。
6. **Networking**：啟用 IPv6，新增防火牆（僅開放 22、80、443、3000 埠）。

### 步驟 2: 初始伺服器設定
SSH 連線後執行：
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm nginx certbot python3-certbot-nginx git
sudo npm install -g pm2
sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw enable
sudo usermod -aG sudo $USER  # 非 root 使用
```

**脈絡**：Nginx 作為反向代理，PM2 管理 Node.js 程序持久化。

## 3. DNS 設定
1. 在域名註冊商新增 **A 記錄**：`@` → Droplet IP，`www` → 同 IP。
2. **TXT 記錄** 驗證 Certbot（稍後）。
3. TTL 設為 300 秒（快速傳播）。

**提示**：使用 Cloudflare Proxy 提升 DDoS 防護與快取（免費方案）。

## 4. Next.js 部署
### 步驟 1: 專案準備
在本地：
```bash
npm install
npm run build  # 產生 .next/
```
推送至 Git，並在 VPS 上：
```bash
git clone https://github.com/your-repo.git app
cd app
npm install --production
npm run build
```

### 步驟 2: PM2 啟動與管理
```bash
pm2 start npm --name "next-app" -- start -p 3000
pm2 startup  # 系統啟動自動運行
pm2 save
pm2 monit  # 監控日誌/資源
```
**環境變數**（`.env.local` 或 systemd）：
```
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/db
GROK_API_KEY=your-grok-api-key
NEXTAUTH_SECRET=random-string
```

**脈絡**：PM2 確保零停機重啟，支援叢集模式（`--instances max`）。

參考：[Next.js 部署文檔](https://nextjs.org/docs/deployment)

## 5. MongoDB 整合（託管服務）
使用 **MongoDB Atlas**（免費 M0 叢集起步）：
1. [註冊 Atlas](https://www.mongodb.com/cloud/atlas) > **Build Cluster** > AWS/GCP/Azure（免費層）。
2. 建立資料庫使用者並獲取連接字串。
3. 白名單 VPS IP（0.0.0.0/0 開發用，生產限 IP）。
4. 在 Next.js 中：
```javascript
// lib/mongodb.js
import { MongoClient } from 'mongodb';
const uri = process.env.DATABASE_URL;
export async function connect() { /* ... */ }
```

**脈絡**：Atlas 處理備份、高可用與自動擴展，避免自管 MongoDB 的複雜性。

## 6. SSL 憑證（Certbot）
自動 Let's Encrypt：
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
- 產生 `/etc/letsencrypt/live/` 憑證。
- Certbot 自動新增 Nginx 重定向（HTTP → HTTPS）。

**Nginx 配置**（`/etc/nginx/sites-available/default`）：
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
sudo nginx -t && sudo systemctl reload nginx
```

參考：[Certbot 教學](https://certbot.eff.org/)

## 7. API 整合（Grok API 示例）
在 Next.js API Routes 中整合 Grok API：
```javascript
// pages/api/grok.js
export default async function handler(req, res) {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GROK_API_KEY}` },
    body: JSON.stringify({ model: 'grok-beta', messages: [{ role: 'user', content: req.body.prompt }] })
  });
  const data = await response.json();
  res.json(data);
}
```
**安全性**：僅環境變數存 API 金鑰，避免 Git 洩漏。

## 8. 監控、維護與最佳實踐
| 面向 | 工具/實踐 | 說明 |
|------|-----------|------|
| **監控** | PM2 + DigitalOcean Monitoring | CPU/記憶體警報，免費。 |
| **備份** | `pm2 snapshot` + Atlas 備份 | 每日自動。 |
| **CI/CD** | GitHub Actions → SSH 部署 | 自動建置/部署。 |
| **擴展** | DigitalOcean Load Balancer + 多 Droplet | 水平擴展。 |
| **安全性** | Fail2Ban、自動更新、`NODE_ENV=production` | 防暴力破解。 |

**常見問題排除**：
- **502 Bad Gateway**：檢查 PM2 狀態 (`pm2 status`) 與 Nginx proxy。
- **SSL 失效**：`sudo certbot renew --dry-run` 測試。
- **MongoDB 連線失敗**：驗證 IP 白名單與 URI。

## 9. 向量標籤索引
- **OECE.tech** / **Cloud Native**：雲端原生部署範例。
- **VPS Configuration** / **DigitalOcean**：Droplet 最佳化。
- **DNS Setup** / **SSL Certificate**：域名與安全。
- **Next.js Deployment** / **PM2 Management**：應用管理。
- **MongoDB** / **API Integration** / **Grok API**：後端與 AI 整合。
- **Environment Variables**：安全配置。

此文檔確保生產就緒部署。如需自訂，參考連結或擴展至 Kubernetes（DigitalOcean Kubernetes）。更新日期：基於 grok-4-0709 精煉。