# 🌊 GeekSEA - 專業技術教程平台

<div align="center">

**Professional Tech Tutorial Platform | 從零開始的數位遊牧之旅**

[![Astro](https://img.shields.io/badge/Astro-4.15-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

![Version](https://img.shields.io/badge/Version-1.0.0-ff69b4?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)

```
╔══════════════════════════════════════════════════════════════╗
║  從躺平到自由 - 技術覺醒之旅                                  ║
║  FROM LYING FLAT TO FREEDOM - THE TECHNICAL AWAKENING       ║
║                                                              ║
║  [VPS] [Domain] [Payment] [Security] [SEO] [Digital Nomad] ║
╚══════════════════════════════════════════════════════════════╝
```

</div>

---

## 📖 項目簡介

GeekSEA 是一個專注於**實用技術教程**的內容平台，幫助零基礎的新手掌握：

- 🌐 **VPS 服務器部署與管理**
- 🔒 **網絡安全與隱私保護**
- 💳 **跨境支付與數字貨幣**
- 🌍 **域名註冊與 DNS 管理**
- 📈 **SEO 優化與內容變現**
- 💻 **遠程工作與數位遊牧**

### 🎯 核心理念

- **零基礎友好** - 從最基本的概念開始講解
- **實戰導向** - 每篇教程都可以直接上手操作
- **持續更新** - 跟隨技術發展及時更新內容
- **社區驅動** - 歡迎投稿和反饋

---

## 🚀 快速開始

### 本地開發

```bash
# 1. 克隆項目
git clone https://github.com/web3-ai-game/tech-room.git
cd tech-room

# 2. 安裝依賴
npm install

# 3. 啟動開發服務器
npm run dev

# 4. 訪問應用
open http://localhost:4321
```

### 創建新教程

```bash
# 使用腳本快速創建
npm run new:tutorial

# 手動創建
cd src/content/tutorials/zh-TW/vps
touch my-new-tutorial.md
```

---

## 📁 項目結構

```plaintext
tech-room/
├── src/
│   ├── content/              # 內容集合
│   │   ├── tutorials/        # 教程文章
│   │   │   ├── zh-TW/       # 繁體中文
│   │   │   │   ├── vps/     # VPS 教程
│   │   │   │   ├── domain/  # 域名教程
│   │   │   │   ├── payment/ # 支付教程
│   │   │   │   ├── seo/     # SEO 教程
│   │   │   │   ├── tools/   # 工具教程
│   │   │   │   └── security/# 安全教程
│   │   │   └── en/          # 英文版
│   │   ├── experiments/     # 實驗室項目
│   │   └── tools/           # 工具推薦
│   │
│   ├── components/          # UI 組件
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── TutorialCard.astro
│   │   ├── TOC.astro
│   │   ├── CodeBlock.astro
│   │   └── SearchBar.astro
│   │
│   ├── layouts/             # 頁面布局
│   │   ├── BaseLayout.astro
│   │   ├── TutorialLayout.astro
│   │   └── ExperimentLayout.astro
│   │
│   ├── pages/               # 路由頁面
│   │   ├── index.astro      # 首頁
│   │   ├── tutorials/       # 教程列表
│   │   ├── experiments/     # 實驗室
│   │   ├── tools/           # 工具箱
│   │   └── api/             # API 路由
│   │
│   └── lib/                 # 工具函數
│       ├── supabase.ts      # Supabase 客戶端
│       ├── i18n.ts          # 國際化
│       └── utils.ts         # 通用工具
│
├── public/                  # 靜態資源
│   ├── images/
│   ├── fonts/
│   └── favicon.svg
│
├── scripts/                 # 腳本工具
│   ├── new-tutorial.mjs     # 創建教程
│   ├── migrate-from-forum.mjs # 遷移工具
│   └── optimize-images.mjs  # 圖片優化
│
├── astro.config.mjs         # Astro 配置
├── tsconfig.json            # TypeScript 配置
├── tailwind.config.mjs      # Tailwind 配置
├── package.json
└── README.md
```

---

## 🎨 技術棧

### 核心框架

- **[Astro 4.15](https://astro.build/)** - 靜態網站生成器
- **[TypeScript](https://www.typescriptlang.org/)** - 類型安全
- **[Tailwind CSS](https://tailwindcss.com/)** - 原子化 CSS

### 內容管理

- **Content Collections** - Astro 原生內容管理
- **Markdown/MDX** - 內容編寫格式
- **Shiki** - 代碼語法高亮

### 數據與認證

- **[Supabase](https://supabase.com/)** - 後端服務
  - 用戶認證
  - 數據庫
  - 實時訂閱

### 搜索與 SEO

- **[Pagefind](https://pagefind.app/)** - 靜態站點搜索
- **sitemap.xml** - 自動生成
- **RSS Feed** - 內容訂閱

---

## 🌐 部署選項

### 選項 1: Cloudflare Pages（推薦）

**完全免費 + CDN 加速**

```bash
# 連接到 GitHub 後自動部署
# 構建配置：
Build command: npm run build
Build output directory: dist
Node version: 18
```

### 選項 2: DigitalOcean

**$5/月 + 完全控制**

查看詳細部署指南：[DEPLOY-DO.md](./DEPLOY-DO.md)

### 選項 3: Vercel

**免費 Hobby 方案**

```bash
npm i -g vercel
vercel --prod
```

---

## 🔧 環境變量

創建 `.env` 文件：

```env
# Supabase
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 站點配置
PUBLIC_SITE_URL=https://geeksea.dev
PUBLIC_SITE_NAME=GeekSEA
PUBLIC_SITE_DESCRIPTION=專業技術教程平台

# 分析（可選）
PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX
```

---

## 📚 教程分類

### VPS 服務器

- DigitalOcean Droplet 設置
- Nginx 配置與優化
- SSL 證書自動化
- 備份策略
- 監控告警

### 域名管理

- 域名註冊商對比
- DNS 配置詳解
- Cloudflare 設置
- 子域名管理

### 支付工具

- 虛擬信用卡申請
- 跨境支付方案
- 加密貨幣入門
- PayPal 替代方案

### 安全防護

- SSH 密鑰管理
- 防火牆配置
- DDoS 防護
- 隱私保護工具

### SEO 優化

- 關鍵詞研究
- 內容優化
- 技術 SEO
- 外鏈建設

### 工具推薦

- VPS 服務商對比
- CDN 服務選擇
- 開發工具集
- 自動化工具

---

## 🤝 參與貢獻

我們歡迎各種形式的貢獻：

### 投稿教程

1. Fork 本倉庫
2. 創建分支: `git checkout -b tutorial/your-topic`
3. 添加教程: `src/content/tutorials/zh-TW/category/your-tutorial.md`
4. 提交: `git commit -m "Add: your tutorial title"`
5. 推送: `git push origin tutorial/your-topic`
6. 開啟 Pull Request

### 教程格式

```markdown
---
title: "教程標題"
description: "簡短描述（50-150字）"
category: vps
tags: ["tag1", "tag2"]
difficulty: beginner
readTime: 10
isPremium: false
author: "你的名字"
publishedAt: 2024-01-20
lang: zh-TW
---

# 教程標題

## 前言

介紹教程內容...

## 步驟 1

詳細說明...

\`\`\`bash
# 示例代碼
\`\`\`

## 總結

回顧重點...
```

### 報告問題

發現錯誤？請[開啟 Issue](https://github.com/web3-ai-game/tech-room/issues)

---

## 📊 項目統計

<div align="center">

![GitHub Stars](https://img.shields.io/github/stars/web3-ai-game/tech-room?style=social)
![GitHub Forks](https://img.shields.io/github/forks/web3-ai-game/tech-room?style=social)
![GitHub Issues](https://img.shields.io/github/issues/web3-ai-game/tech-room)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/web3-ai-game/tech-room)

</div>

---

## 📝 許可證

本項目採用 [MIT License](LICENSE)

你可以自由地：

- ✅ 商業使用
- ✅ 修改
- ✅ 分發
- ✅ 私人使用

---

## 🙏 致謝

感謝以下開源項目：

- [Astro](https://astro.build/) - 靜態網站生成器
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Supabase](https://supabase.com/) - 後端服務
- [Pagefind](https://pagefind.app/) - 搜索引擎
- [Shiki](https://shiki.matsu.io/) - 語法高亮

---

## 📮 聯繫方式

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/web3-ai-game/tech-room)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/geeksea)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:contact@example.com)

</div>

---

<div align="center">

### 🌊 GeekSEA - 專業技術教程平台

**讓技術變得簡單，讓自由變得可能**

Made with ❤️ by GeekSEA Team

![Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12&height=100&section=footer&text=Happy%20Learning!&fontSize=30&fontColor=fff&animation=twinkling)

</div>
