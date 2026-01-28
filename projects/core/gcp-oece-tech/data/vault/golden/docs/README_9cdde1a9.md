# OECE.TECH - Digital Nomad Dev Journal

![Cyberpunk Pixel Style](https://img.shields.io/badge/style-cyberpunk-00fff9?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![VPS Optimized](https://img.shields.io/badge/VPS-2GB%20RAM-success?style=for-the-badge)

個人博客和社交中樞，記錄從大廠開發者轉型為數字遊民的旅程。

## ✨ 特性

- 🎨 **賽博朋克像素風格** - 現代化的視覺設計
- 📚 **Markdown 教程系統** - 類似 GitHub README 的美觀渲染
- 🤖 **Telegram Bot** - Claude AI 驅動的智能助手
- 🐦 **Twitter 集成** - 實時推文更新
- 🚀 **極致內存優化** - 專為 2GB RAM VPS 設計，運行時僅需~400MB
- ⚡ **靜態生成** - Next.js SSG模式，無SSR開銷
- 📦 **PM2部署** - 輕量級進程管理，零停機更新
- 🔄 **GitHub Actions** - 自動化構建+rsync部署

## 🛠️ 技術棧

- **前端**: Next.js 14 (Static Export), React 18, TypeScript
- **樣式**: CSS (Cyberpunk Theme)
- **Markdown**: react-markdown, remark-gfm
- **Bot**: Telegram Bot API, Claude API
- **部署**: PM2 + rsync (無Docker)
- **CI/CD**: GitHub Actions

## 📦 快速開始

### 本地開發

1. **克隆項目**
   ```bash
   git clone https://github.com/yourusername/oece.tech.git
   cd oece.tech
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **運行開發服務器**
   ```bash
   npm run dev
   ```

4. **訪問網站**
   打開 [http://localhost:3000](http://localhost:3000)

### VPS 部署 (PM2)

1. **配置環境變量**
   ```bash
   cp .env.example .env
   # 編輯 .env 文件，添加你的 API keys
   ```

2. **使用部署腳本**
   ```bash
   chmod +x deploy-pm2.sh
   ./deploy-pm2.sh
   ```

3. **或手動部署**
   ```bash
   npm ci
   npm run build
   npm run pm2:start
   ```

4. **查看日誌**
   ```bash
   npm run pm2:logs
   ```

**內存使用**: 靜態服務僅需 ~300-400MB RAM

## 📝 添加教程

在 `content/tutorials/` 目錄下創建 `.md` 文件：

```markdown
---
title: "教程標題"
description: "簡短描述"
date: "2024-10-23"
category: "分類"
---

# 教程內容

這裡是你的教程內容...
```

## 🤖 Telegram Bot 配置

1. 從 [@BotFather](https://t.me/botfather) 獲取 Bot Token
2. 從 [Anthropic](https://console.anthropic.com/) 獲取 Claude API Key
3. 在 `.env` 文件中配置

```bash
cd telegram-bot
npm install
npm start
```

## 🚀 VPS 部署指南

### 系統要求

- 至少 2GB RAM
- 1 CPU Core
- 20GB 硬盤空間
- Ubuntu 20.04+ 或類似系統

### 部署步驟

1. **安裝 Docker 和 Docker Compose**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

2. **克隆項目到 VPS**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/oece.tech.git
   cd oece.tech
   ```

3. **配置環境變量**
   ```bash
   cp .env.example .env
   nano .env  # 編輯配置
   ```

4. **啟動服務**
   ```bash
   docker-compose up -d --build
   ```

5. **配置 Nginx (可選)**
   ```nginx
   server {
       listen 80;
       server_name oece.tech;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### 內存優化建議

1. **配置 Swap**
   ```bash
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

2. **限制容器內存**（已在 docker-compose.yml 中配置）
   - Web: 1GB limit, 512MB reserved
   - Bot: 512MB limit, 256MB reserved

3. **監控內存使用**
   ```bash
   docker stats
   free -h
   ```

## 🔄 GitHub Actions 自動部署

配置 GitHub Secrets：

- `VPS_HOST` - VPS IP 地址
- `VPS_USERNAME` - SSH 用戶名
- `VPS_SSH_KEY` - SSH 私鑰
- `VPS_PORT` - SSH 端口（默認 22）

推送到 `main` 分支會自動觸發部署。

## 📊 項目結構

```
oece.tech/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 全局佈局
│   ├── page.tsx             # 首頁
│   ├── globals.css          # 全局樣式
│   └── tutorials/           # 教程頁面
├── content/                 # Markdown 內容
│   └── tutorials/           # 教程文件
├── telegram-bot/            # Telegram Bot
│   ├── bot.js              # Bot 主文件
│   └── package.json        # Bot 依賴
├── .github/                 # GitHub Actions
│   └── workflows/
├── Dockerfile              # Web 應用 Dockerfile
├── docker-compose.yml      # Docker Compose 配置
└── next.config.js          # Next.js 配置
```

## 🎨 自定義

### 修改主題顏色

編輯 `app/globals.css` 中的 CSS 變量：

```css
:root {
  --accent-cyan: #00fff9;
  --accent-pink: #ff006e;
  --accent-purple: #8b5cf6;
  /* ... */
}
```

### 修改社交鏈接

編輯 `app/page.tsx` 中的鏈接部分。

## 🤝 貢獻

歡迎提交 Issues 和 Pull Requests！

## 📄 License

MIT License

## 📧 聯繫方式

- 網站: [oece.tech](https://oece.tech)
- Twitter: [@youraccount](https://twitter.com/youraccount)
- Telegram: [@youraccount](https://t.me/youraccount)
- YouTube: [@yourchannel](https://youtube.com/@yourchannel)

---

**Built with ☕ while traveling the world**
