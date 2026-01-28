# 部署指南

## 快速開始

### 1. 環境準備

```bash
# 克隆倉庫
git clone https://github.com/web3-ai-game/svs-mcp.git
cd svs-mcp/cyberpunk-app

# 安裝依賴
npm install
```

### 2. 環境變量配置

參考 `ENV_SETUP.md` 配置你的 `.env.local` 文件：

```bash
cp .env.example .env.local
# 編輯 .env.local 填入你的 API keys
```

### 3. 本地開發

```bash
npm run dev
```

訪問 http://localhost:3000

### 4. 生產構建

```bash
npm run build
npm start
```

## Docker 部署

### 使用 Docker Compose

```bash
# 構建並啟動
docker-compose up -d

# 查看日誌
docker-compose logs -f cyberpunk-app

# 停止服務
docker-compose down
```

### 單獨使用 Docker

```bash
# 構建鏡像
docker build -t cyberpunk-nexus .

# 運行容器
docker run -p 3000:3000 --env-file .env.local cyberpunk-nexus
```

## Nginx 反向代理

配置已包含在 `nginx/nginx.conf` 中：

- HTTP/2 支持
- Gzip 壓縮
- 靜態文件緩存
- SSL/TLS 配置（需要證書）
- 安全頭部

## VPS 部署步驟

### 1. SSH 連接到服務器

```bash
ssh root@your-vps-ip
```

### 2. 克隆並設置

```bash
git clone https://github.com/web3-ai-game/svs-mcp.git
cd svs-mcp/cyberpunk-app
cp .env.example .env.local
# 編輯 .env.local
```

### 3. 使用 PM2 管理進程

```bash
npm install -g pm2
npm install
npm run build
pm2 start npm --name "cyberpunk-nexus" -- start
pm2 save
pm2 startup
```

### 4. 配置 Nginx

```bash
sudo cp nginx/nginx.conf /etc/nginx/sites-available/cyberpunk
sudo ln -s /etc/nginx/sites-available/cyberpunk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 環境變量說明

| 變量名 | 說明 | 必需 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 項目 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase 可發布 Key | ✅ |
| `GEMINI_API_KEY` | Google Gemini API Key | ✅ |
| `NODE_ENV` | 環境（development/production） | ❌ |

## 監控和維護

### 查看日誌

```bash
# PM2 日誌
pm2 logs cyberpunk-nexus

# Docker 日誌
docker-compose logs -f

# Nginx 日誌
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 重啟服務

```bash
# PM2
pm2 restart cyberpunk-nexus

# Docker
docker-compose restart

# Nginx
sudo systemctl restart nginx
```

## 性能優化

### Next.js 優化

- ✅ 啟用 SWC 編譯器
- ✅ 圖片自動優化
- ✅ 代碼分割
- ✅ Tree-shaking
- ✅ Standalone 輸出

### Nginx 優化

- ✅ Gzip 壓縮
- ✅ 靜態資源緩存
- ✅ HTTP/2
- ✅ 連接池

## 故障排查

### 構建失敗

```bash
# 清理緩存
rm -rf .next node_modules
npm install
npm run build
```

### 端口被佔用

```bash
# 查找並終止進程
lsof -i :3000
kill -9 <PID>
```

### Nginx 錯誤

```bash
# 測試配置
sudo nginx -t

# 重新加載
sudo systemctl reload nginx
```

## 安全建議

- 🔒 使用 HTTPS（Let's Encrypt）
- 🔒 定期更新依賴
- 🔒 環境變量不要提交到 Git
- 🔒 使用防火牆（UFW/iptables）
- 🔒 配置 fail2ban
- 🔒 定期備份數據

## 聯繫支持

- GitHub: https://github.com/web3-ai-game/svs-mcp
- Issues: https://github.com/web3-ai-game/svs-mcp/issues
