# 🍄 DeepWay.me - 菌絲部落 Mycelium Community

> 🌍 面向歐美與東南亞的真菌愛好者社群平台  
> 小而美的迷你佈局 · 官網級 UI/UX · AI 驅動開發

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Netlify](https://img.shields.io/badge/Netlify-Deploy-00C7B7)](https://www.netlify.com/)
[![Supabase](https://img.shields.io/badge/Supabase-DB-3ECF8E)](https://supabase.com/)

## 🎯 項目定位

**DeepWay.me** 採用 **混合架構** (Hybrid Architecture),結合靜態站點與動態服務:

| 模塊 | 技術棧 | 部署方式 | 成本 | 狀態 |
|------|--------|----------|------|------|
| 🏠 **主站+論壇+聊天** | Next.js 14 | VPS 2v4g | $12/月 | ✅ 運行中 |
| 📚 **教程系統** | Nextra | Netlify 靜態 | 免費 | 🚧 規劃中 |
| 🤖 **AI 工具集** | React SPA | Netlify 靜態 | 免費 | 🚧 規劃中 |
| 🔑 **Key Pool API** | Python FastAPI | VPS | 已包含 | ✅ 運行中 |
| 💬 **Telegram Bot** | Python 3.12 | VPS | 已包含 | ✅ 運行中 |

**總成本**: $12/月 (僅 VPS) + $0 (Netlify 免費 100GB 流量)


## 🏗️ 混合架構設計

### 架構圖

```
┌─────────────────────────────────────────────────────────┐
│                    用戶訪問層                             │
│  deepway.me (主站) · learn.deepway.me (教程)              │
│  tools.deepway.me (AI工具)                               │
└────────────┬────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ↓                 ↓
┌─────────────┐  ┌─────────────────────────────┐
│  Netlify    │  │  VPS 2v4g (68.183.239.153) │
│  靜態託管   │  │  $12/月                     │
├─────────────┤  ├─────────────────────────────┤
│ 📚 教程站   │  │ 🌐 Next.js (論壇+聊天)      │
│   (免費)    │  │ 🔑 Gemini Router (1GB)      │
│             │  │ 💾 Redis (512MB)            │
│ 🤖 AI工具站 │  │ 🤖 Telegram Bots (768MB)    │
│   (免費)    │  │ 🗄️ Supabase (PostgreSQL)    │
└─────────────┘  └─────────────────────────────┘
```

### 項目結構

```
deepway-mcp/                      # 主倉庫 (Monorepo)
├── apps/
│   ├── web/                     # VPS 部署
│   │   ├── app/
│   │   │   ├── page.tsx        # ✅ 首頁 (已完成)
│   │   │   ├── forum/          # 🚧 論壇 (開發中)
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [category]/
│   │   │   │   └── thread/[id]/
│   │   │   ├── chat/           # 🚧 聊天室 (規劃中)
│   │   │   │   └── page.tsx
│   │   │   ├── tools/          # 🚧 AI工具集 (規劃中)
│   │   │   │   ├── page.tsx
│   │   │   │   ├── ai-chat/
│   │   │   │   └── analyzer/
│   │   │   └── api/
│   │   │       ├── forum/
│   │   │       ├── chat/
│   │   │       └── gemini/     # Proxy 到 Gemini Router
│   │   └── components/
│   │       ├── forum/          # 論壇組件
│   │       ├── chat/           # 聊天組件
│   │       └── ui/             # shadcn/ui
│   │
│   ├── gemini-router/          # VPS 部署
│   │   ├── api_server.py       # FastAPI 服務
│   │   └── gemini_key_pool.py  # 18 Keys 路由
│   │
│   └── telegram-bot/           # VPS 部署
│       ├── high_eq_bot.py      # 高情商機器人
│       └── requirements.txt
│
├── tutorials/                   # 📦 獨立倉庫 → Netlify
│   ├── pages/
│   │   ├── index.mdx
│   │   ├── basics/
│   │   └── advanced/
│   └── theme.config.tsx        # Nextra 配置
│
└── ai-tools/                    # 📦 獨立倉庫 → Netlify
    ├── src/
    │   ├── chat/
    │   └── analyzer/
    └── vite.config.ts
```

### 資源分配 (2v4g VPS)

```yaml
服務分配:
  Next.js (主站+論壇+聊天): 2GB
  Gemini Router (Key Pool):  1GB
  Redis (緩存+消息隊列):     512MB
  Telegram Bots (3個):       512MB
  Nginx (反向代理):          256MB
  ────────────────────────────────
  總計:                      4.28GB / 4GB
  優化策略: Swap 2GB 補充
```

## 🚀 快速開始

### 方案 A: 本地開發 (推薦)

```bash
# 1. 克隆倉庫
git clone https://github.com/web3-ai-game/deepweay.git
cd deepweay

# 2. 配置 Doppler (89個環境變量)
doppler login
doppler setup --project deepway-mcp --config dev

# 3. 安裝依賴
cd apps/web
npm install

# 4. 啟動開發服務器
doppler run -- npm run dev
# → http://localhost:3000

# 5. 連接 VPS 服務 (數據庫、Redis、AI)
# .env.local 已配置指向 VPS:
# DATABASE_URL=postgresql://...@68.183.239.153:5432/...
# REDIS_URL=redis://68.183.239.153:6379
# GEMINI_ROUTER_URL=http://68.183.239.153:8000
```

### 方案 B: VPS 遠程開發

```bash
# 1. SSH 連接
ssh root@68.183.239.153

# 2. 進入項目
cd /mnt/volume_sgp1_01/deepway-mcp

# 3. 拉取最新代碼
git pull origin main

# 4. 啟動服務
docker compose up -d

# 5. 查看日誌
docker compose logs -f web
```

### 方案 C: VS Code Remote SSH

```bash
# 1. 安裝擴展: Remote - SSH
# 2. 配置 SSH: ~/.ssh/config
Host deepway-vps
    HostName 68.183.239.153
    User root
    IdentityFile ~/.ssh/id_rsa

# 3. VS Code 連接: Cmd+Shift+P → Remote-SSH
# 4. 打開文件夾: /mnt/volume_sgp1_01/deepway-mcp
```


## 🎨 UI/UX 設計指南

### 設計理念

**菌絲黑 (Mycelium Black) + 螢光綠 (Bio Green)** 主題

```css
/* 主題色板 */
--mycelium-black:   #0A0E0D;  /* 深黑背景 */
--mycelium-dark:    #1A1F1E;  /* 次級背景 */
--mycelium-green:   #00FF88;  /* 主色調 (螢光綠) */
--bio-green:        #39FF14;  /* 強調色 */
--mushroom-brown:   #8B7355;  /* 輔助色 */
--spore-white:      #F5F5F5;  /* 文字色 */
```

### 參考設計

- **Linear.app** - 極簡高效佈局
- **Notion.so** - 卡片式設計
- **Vercel.com** - 現代漸變效果
- **Shroomery.org** - 真菌論壇經典

### 核心原則

```yaml
✅ 暗色模式優先 (菌絲在黑暗中生長)
✅ 移動端優先 (東南亞用戶手機為主)
✅ 極簡導航 (頂部固定 Navbar)
✅ 快速加載 (<2秒首屏)
✅ 無障礙設計 (WCAG 2.1 AA)
```

### 組件庫

- **UI 框架**: shadcn/ui (Radix UI + Tailwind)
- **圖標**: Lucide Icons
- **字體**: Inter (英文) + Noto Sans TC (中文)
- **動畫**: Framer Motion

## 🤖 Telegram Bot

### 支持的機器人

| Bot | 用途 | 狀態 |
|-----|------|------|
| **@svskilo_bot** | 高情商聊天 (主力) | ✅ 運行中 |
| **@svslovea_bot** | 社交互動 | ⏸️ 待激活 |
| **@svsinst_bot** | 小愛助手 | ⏸️ 待激活 |

### Gemini API 配置

```yaml
模型: Gemini 2.0 Flash
Keys: 18個有效 API 密鑰
策略: 3-Tier Round-robin 負載均衡
  - Tier 1 (Flash):      6 keys (15 RPM/key)
  - Tier 2 (Flash-8B):   6 keys (15 RPM/key)  
  - Tier 3 (Pro):        6 keys (2 RPM/key)
限制: ~1500 請求/分鐘總量
監控: http://68.183.239.153:8000/health
```

## 🔑 環境變量管理

### Doppler 配置

**項目**: `deepway-mcp`  
**環境**: `dev` (開發) / `prod` (生產)  
**密鑰數**: 89個

```bash
# 查看所有配置
doppler secrets

# 下載到本地 (.env)
doppler secrets download --no-file --format env > .env

# 上傳新配置
doppler secrets upload .env

# 運行命令 (自動注入環境變量)
doppler run -- npm run dev
doppler run -- python3 bot.py
```

### 關鍵環境變量

```bash
# Supabase (PostgreSQL 數據庫)
SUPABASE_URL=https://qhgdymgxcbyhtxezvoqt.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Gemini Router
GEMINI_ROUTER_URL=http://68.183.239.153:8000

# GitHub (OAuth + Token)
GITHUB_TOKEN=ghp_...
GITHUB_ID=...
GITHUB_SECRET=...

# Notion (內容聚合)
NOTION_TOKEN=ntn_...

# Redis
REDIS_URL=redis://68.183.239.153:6379
```


## 📊 靜態站點部署指南

### Netlify 部署流程

#### 1️⃣ 教程站 (Nextra)

```bash
# 創建獨立倉庫
git clone https://github.com/web3-ai-game/deepway-tutorials.git
cd deepway-tutorials

# 安裝 Nextra
npm install nextra nextra-theme-docs

# 配置 next.config.js
module.exports = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  output: 'export'  // 靜態導出
})

# 構建
npm run build  # 生成 out/ 文件夾

# 部署到 Netlify
# 方法1: 拖放 out/ 文件夾到 netlify.com
# 方法2: 連接 GitHub 自動部署
```

**Netlify 配置** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "out"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2️⃣ AI 工具站 (Vite + React)

```bash
# 創建獨立倉庫
git clone https://github.com/web3-ai-game/deepway-ai-tools.git
cd deepway-ai-tools

# 安裝依賴
npm create vite@latest . -- --template react-ts
npm install

# 配置 API 代理
# vite.config.ts
export default {
  server: {
    proxy: {
      '/api': 'http://68.183.239.153:8000'  // VPS Gemini Router
    }
  },
  build: {
    outDir: 'dist'
  }
}

# 構建並部署
npm run build
netlify deploy --prod --dir=dist
```

### URL 路由規則

```
主站:
  deepway.me                 → VPS Next.js
  deepway.me/forum           → VPS Next.js (論壇)
  deepway.me/chat            → VPS Next.js (聊天)

靜態站:
  learn.deepway.me           → Netlify (教程)
  tools.deepway.me           → Netlify (AI工具)
  
API:
  deepway.me/api/gemini      → VPS Gemini Router
  deepway.me/api/forum       → VPS Next.js API
```

### Netlify 免費層配額

```yaml
免費額度:
  ✅ 帶寬: 100GB/月
  ✅ 構建時間: 300分鐘/月
  ✅ 站點數量: 無限
  ✅ 自定義域名: 支持
  ✅ SSL 證書: 自動
  ✅ CDN: 全球加速
  
對比 Vercel:
  Vercel: 100GB/月 (相同)
  Netlify: 更慷慨的構建時間
  推薦: Netlify (教程) + Vercel (備用)
```

## 📝 相關文檔

- [項目切分計劃](PROJECT_SPLIT_PLAN.md) - 如何拆分為3個倉庫
- [學生包開通指南](STUDENT_PACK_ACTIVATION_PLAN.md) - GitHub/Google/Azure 優惠
- [UI/UX 設計規範](docs/DESIGN_SYSTEM.md) - 完整設計文檔
- [API 文檔](docs/API.md) - 後端 API 規範
- [部署完成報告](DEPLOYMENT_COMPLETE.md) - VPS 部署詳情

## 🎓 學生包與免費服務

已開通服務 (Doppler 中):
- ✅ **Supabase** - PostgreSQL 數據庫 (500MB)
- ✅ **GitHub** - 私有倉庫 + Actions
- ✅ **Notion** - 內容管理
- ✅ **Google Gemini** - 18個 API Keys

推薦開通 (免費/學生優惠):
- 🆓 **Netlify** - 靜態站點託管 (100GB/月)
- 🆓 **Vercel** - 備用託管 (100GB/月)
- 🎓 **Cloudflare Pages** - CDN + 無限帶寬
- 🎓 **DigitalOcean** - $200 學生額度
- 🎓 **MongoDB Atlas** - 512MB 免費數據庫
- 🎓 **Sentry** - 錯誤監控 (學生免費)

查看完整列表: [STUDENT_PACK_ACTIVATION_PLAN.md](STUDENT_PACK_ACTIVATION_PLAN.md)

## 🤝 貢獻指南

歡迎提交 Pull Request！請確保:
- ✅ 代碼通過 ESLint 檢查
- ✅ 新功能有測試覆蓋
- ✅ Commit 遵循 [Conventional Commits](https://www.conventionalcommits.org/)
- ✅ UI 符合設計規範

## 📄 授權

MIT License © 2025 DeepWay.me

## 🔗 相關鏈接

- **主站**: https://deepway.me (VPS)
- **教程**: https://learn.deepway.me (Netlify)
- **AI 工具**: https://tools.deepway.me (Netlify)
- **GitHub**: https://github.com/web3-ai-game/deepweay
- **Doppler**: deepway-mcp 項目
- **Supabase**: qhgdymgxcbyhtxezvoqt.supabase.co

---

**Built with 💚 by AI-Driven Development**  
Powered by: Windsurf AI · GitHub Copilot · Gemini 2.0 Flash

---

**最後更新**: 2025-11-16  
**版本**: 2.0.0 (Monorepo 重構)  
**狀態**: 🚀 Active Development
