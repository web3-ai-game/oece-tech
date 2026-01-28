# 快速啟動指南

10 分鐘內啟動你的數字遊民博客！

## 📋 前置檢查清單

- [ ] Node.js 18+ 已安裝
- [ ] Git 已安裝
- [ ] Telegram Bot Token（可選）
- [ ] Claude API Key（可選）

## 🚀 本地開發（3 分鐘）

```bash
# 1. 克隆項目
git clone https://github.com/yourusername/oece.tech.git
cd oece.tech

# 2. 安裝依賴
npm install

# 3. 啟動開發服務器
npm run dev

# 4. 訪問 http://localhost:3000
```

就這麼簡單！🎉

## 🐳 Docker 部署（5 分鐘）

### 選項 A: 快速測試

```bash
# 構建並運行（不需要 Bot）
docker-compose up -d web

# 訪問 http://localhost:3000
```

### 選項 B: 完整部署（含 Telegram Bot）

```bash
# 1. 配置環境變量
cp .env.example .env
nano .env  # 添加你的 API keys

# 2. 啟動所有服務
docker-compose up -d --build

# 3. 查看狀態
docker-compose ps
```

## 📝 添加你的第一篇教程

```bash
# 1. 創建文件
nano content/tutorials/my-first-tutorial.md

# 2. 添加內容（複製下面的模板）
```

```markdown
---
title: "我的第一篇教程"
description: "這是一個測試教程"
date: "2024-10-23"
category: "測試"
---

# 我的第一篇教程

這是正文內容...

## 代碼示例

\```bash
echo "Hello World"
\```

## 列表

- 項目 1
- 項目 2
- 項目 3
```

刷新瀏覽器，訪問 `/tutorials` 查看！

## 🤖 啟動 Telegram Bot

```bash
# 1. 進入 bot 目錄
cd telegram-bot

# 2. 創建 .env
echo "TELEGRAM_BOT_TOKEN=你的token" > .env
echo "CLAUDE_API_KEY=你的key" >> .env

# 3. 安裝依賴
npm install

# 4. 啟動
npm start
```

在 Telegram 中測試你的 Bot！

## 🌐 VPS 部署（10 分鐘）

### 最簡單的方式

在 VPS 上執行：

```bash
# 1. 克隆項目
cd /var/www
git clone https://github.com/yourusername/oece.tech.git
cd oece.tech

# 2. 配置環境變量
cp .env.example .env
nano .env

# 3. 運行部署腳本
chmod +x deploy.sh
./deploy.sh
```

完成！訪問你的 VPS IP 查看網站。

### 詳細步驟

參考 [DEPLOY.md](./DEPLOY.md) 獲取完整部署指南。

## 🎨 自定義

### 修改網站信息

編輯 `app/page.tsx`：

```tsx
// 修改標題
<h1>YOUR SITE NAME</h1>

// 修改社交鏈接
<a href="https://twitter.com/youraccount">Twitter</a>
```

### 修改顏色主題

編輯 `app/globals.css`：

```css
:root {
  --accent-cyan: #00fff9;  /* 改成你喜歡的顏色 */
  --accent-pink: #ff006e;
}
```

### 修改 Logo

編輯 `app/page.tsx` 中的：

```tsx
<div className="pixel-logo">YOUR LOGO</div>
```

## 📦 項目結構

```
oece.tech/
├── app/                    # Next.js 頁面
│   ├── page.tsx           # 首頁
│   ├── tutorials/         # 教程頁面
│   └── journey/           # 旅程頁面
├── content/               # Markdown 內容
│   └── tutorials/         # 教程文件 (.md)
├── telegram-bot/          # Telegram Bot
│   └── bot.js            # Bot 主文件
├── docker-compose.yml     # Docker 配置
└── package.json          # 依賴配置
```

## 🔧 常用命令

```bash
# 開發
npm run dev              # 啟動開發服務器
npm run build            # 構建生產版本
npm start                # 運行生產版本

# Docker
docker-compose up -d     # 啟動所有服務
docker-compose down      # 停止所有服務
docker-compose logs -f   # 查看日誌
docker-compose ps        # 查看狀態

# Git
git add .
git commit -m "update"
git push origin main     # 推送會自動觸發部署（如果配置了 GitHub Actions）
```

## ❓ 常見問題

### 端口被佔用

```bash
# 修改端口（docker-compose.yml）
ports:
  - "8080:3000"  # 改成 8080 或其他端口
```

### 內存不足

```bash
# 配置 Swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Bot 不響應

```bash
# 檢查日誌
cd telegram-bot
npm start  # 查看錯誤信息

# 驗證 token
curl https://api.telegram.org/bot你的TOKEN/getMe
```

## 📚 下一步

- [ ] 添加更多教程到 `content/tutorials/`
- [ ] 自定義顏色和樣式
- [ ] 配置域名和 SSL
- [ ] 設置 GitHub Actions 自動部署
- [ ] 集成 Twitter API
- [ ] 添加評論功能

## 🆘 需要幫助？

- 查看 [README.md](./README.md)
- 查看 [DEPLOY.md](./DEPLOY.md)
- 提交 [GitHub Issue](https://github.com/yourusername/oece.tech/issues)

---

**開始你的數字遊民之旅吧！✈️**
