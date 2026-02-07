# 🚀 OECE.tech - 極客母艦 | 項目導航

> Tech Hub & Project Navigator

## 🎯 項目簡介

**OECE Tech** 是一個基於 Next.js 16 + Firebase 的極客項目導航平台，提供：

- 📊 **項目展示**: 所有技術項目的中央枢紐
- 🔍 **智能搜索**: Algolia 全文搜索
- 🤖 **AI 展示**: OpenRouter 多模型能力展示
- 📊 **監控告警**: Sentry 實時錯誤追蹤
- ⚡ **極速加載**: 優化的路由與緩存

## 🚀 快速開始

### 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev
```

訪問: http://localhost:3000

### 部署到 Firebase

```bash
# 構建項目
npm run build

# 部署到 Firebase Hosting
firebase deploy --only hosting
```

## 🔧 技術棧

- **框架**: Next.js 16 (App Router)
- **語言**: TypeScript
- **樣式**: TailwindCSS
- **後端**: Firebase (Hosting + Realtime Database)
- **AI**: Gemini API
- **搜索**: Algolia
- **監控**: Sentry
- **部署**: Firebase Hosting + Cloud Functions Gen 2

## 📦 環境變量

創建 `.env.local` 文件並填入以下變量：

```bash
# Firebase 配置
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# OpenRouter API (可選)
OPENROUTER_API_KEY=your_openrouter_key
```

## 🔄 CI/CD

GitHub Actions 自動部署到 Firebase Hosting。

**觸發條件**:
- Push 到 `main` 分支
- Pull Request 到 `main` 分支

**部署流程**:
1. Checkout 代碼
2. 安裝依賴 (Node.js 20)
3. 構建項目 (注入環境變量)
4. 部署到 Firebase Hosting

## 📚 相關文檔

- [Firebase Console](https://console.firebase.google.com/project/oece-tech-9aa8d)
- [Doppler Dashboard](https://dashboard.doppler.com)
- [GitHub Repository](https://github.com/web3-ai-game/oece-tech)

## 🛠️ 開發指南

### 安裝依賴

```bash
npm install
```

### 本地開發

```bash
# 方式 1: 使用腳本
./dev.sh

# 方式 2: 使用 Doppler
doppler run --project oece-tech-prod --config dev -- npm run dev

# 方式 3: 手動設置環境變量 (不推薦)
npm run dev
```

### 構建生產版本

```bash
npm run build
```

### 部署

```bash
# 部署到 Firebase
firebase deploy

# 或使用 Doppler
doppler run --project oece-tech-prod --config dev -- firebase deploy
```

## 🔐 安全

- ✅ 所有敏感 Keys 存儲在 Doppler
- ✅ GitHub Secrets 用於 CI/CD
- ✅ `.env` 文件已被 `.gitignore` 排除
- ✅ Firebase Security Rules 已配置

## 📝 License

MIT

---

**Created**: 2025-11-28  
**Status**: ✅ 開發中  
**Domain**: oece.tech
# 🚀 OECE.tech - Tech Hub & AI Companion Platform

> **Mission**: 个人 IP 打造 + AI 工具聚合站 + 伴侣功能试验场
> **Owner**: Tanyl Chou | DeepWeay Labs | 🌏 Southeast Asia Digital Nomad

---

## 🎯 Project Overview

OECE.tech is a **PWA-first** tech portfolio and AI companion platform featuring:

- 🏠 **Project Showcase**: GitHub repos navigation hub
- 🤖 **AI Companion**: Grok-powered conversational partner (20人小圈子试用)
- 📚 **Knowledge Base**: 1016 books vector search
- 🎬 **Content Hub**: YouTube/Twitter 内容分发中心

**Live**: [oece.tech](https://oece.tech) | **Bot**: [@svs_pve_bot](https://t.me/svs_pve_bot)

---

## 🛠️ Tech Stack

```yaml
Frontend:
  framework: Next.js 16 (App Router)
  language: TypeScript
  styling: TailwindCSS + Radix UI
  deployment: Vercel (Primary) / Firebase Hosting (Backup)

Backend:
  auth: Supabase Auth
  database: MongoDB DO (structured) + Supabase (lightweight)
  storage: DO Spaces + Google Cloud Storage
  realtime: Firebase Realtime Database

AI Services:
  primary: Grok API ($1,111 balance) - 伴侣功能
  architect: Claude API ($1,427 balance) - 架构设计
  backup: OpenRouter ($1,111) - 模型聚合
  video: Veo 3.1 via Google AI Pro - 背景生成

PWA Features:
  - Offline support (Service Worker)
  - Push notifications
  - Add to Home Screen
  - Native-like experience
```

---

## 📁 Project Structure

```
oece-tech/
├── app/
│   ├── page.tsx              # Landing page with Hero + Project Grid
│   ├── projects/             # GitHub repos showcase
│   ├── companion/            # AI companion interface
│   ├── knowledge/            # Vector search for 1016 books
│   └── api/
│       ├── grok/             # Grok API proxy
│       └── veo/              # Veo video generation
├── components/
│   ├── ui/                   # Shadcn/Radix components
│   ├── ProjectCard.tsx       # GitHub project cards
│   ├── CompanionChat.tsx     # Grok companion UI
│   └── SkeletonLoader.tsx    # 微信级骨架屏
├── lib/
│   ├── supabase.ts           # Auth + DB client
│   ├── grok.ts               # Grok API wrapper
│   └── vector.ts             # Knowledge base search
├── public/
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service Worker
└── styles/
    └── globals.css           # Matrix green theme
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Doppler CLI (环境变量管理)
- Firebase CLI (可选，备用部署)

### Development

```bash
# Clone repo
git clone https://github.com/web3-ai-game/oece-tech.git
cd oece-tech

# Install dependencies
npm install

# Start dev server with Doppler
doppler run --project oece-tech-prod --config dev -- npm run dev

# Or without Doppler (创建 .env.local)
npm run dev
```

### Environment Variables

通过 **Doppler** 管理，不在代码中硬编码:

```bash
# Core
NEXT_PUBLIC_SITE_URL=https://oece.tech

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI APIs
GROK_API_KEY=              # Grok 伴侣功能
OPENROUTER_API_KEY=        # 模型聚合备用
GEMINI_API_KEY=            # Veo 视频生成

# Firebase (备用)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=
```

---

## 🎨 Design System

### Colors (Matrix Green Theme)

```css
:root {
  --primary: #00FF41;      /* Matrix Green */
  --background: #0D1117;   /* GitHub Dark */
  --foreground: #C9D1D9;   /* Light Gray */
  --accent: #FF6B6B;       /* Coral Accent */
  --muted: #161B22;        /* Card Background */
}
```

### Typography

- **Headings**: JetBrains Mono (代码风)
- **Body**: Inter (可读性)
- **Code**: Fira Code (带连字)

### Components

使用 Radix UI primitives + TailwindCSS，不用 Material-UI 或 CSS Modules。

---

## 📱 PWA Configuration

### manifest.json

```json
{
  "name": "OECE.tech - Tech Hub",
  "short_name": "OECE",
  "description": "AI工具聚合站 + 个人技术名片",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0D1117",
  "theme_color": "#00FF41",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker Features

- [x] Offline fallback page
- [x] Cache API responses (Grok/OpenRouter)
- [x] Background sync for companion messages
- [ ] Push notifications (Phase 2)

---

## 🤖 AI Companion Feature

### Architecture

```
User → OECE.tech PWA → Grok API Proxy → xAI Grok 4
                    ↓
              Supabase (conversation history)
                    ↓
              Vector DB (knowledge base context)
```

### Cost Model (20人小圈子)

| 使用场景 | 月成本估算 |
|----------|-----------|
| 自己用 (SuperGrok 订阅) | $30 |
| 20人共享 (API) | ~$200 |
| 人均成本 | ~$10 |

### Implementation

```typescript
// lib/grok.ts
export async function chat(messages: Message[], userId: string) {
  // 1. 从 Supabase 获取用户对话历史
  const history = await getConversationHistory(userId);
  
  // 2. 从向量库检索相关知识
  const context = await searchKnowledgeBase(messages[messages.length - 1].content);
  
  // 3. 调用 Grok API
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    headers: { 'Authorization': `Bearer ${process.env.GROK_API_KEY}` },
    body: JSON.stringify({
      model: 'grok-4',
      messages: [...history, ...context, ...messages],
    }),
  });
  
  // 4. 保存对话历史
  await saveMessage(userId, response);
  
  return response;
}
```

---

## 📊 Data Models (Supabase)

```sql
-- Users (Supabase Auth handles most of this)
-- Just add profile extension

CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  api_quota INTEGER DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects (GitHub repos showcase)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  github_url TEXT,
  demo_url TEXT,
  tags TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations (AI companion history)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  messages JSONB[],
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Keys (for paid users)
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  key_hash TEXT NOT NULL,
  name TEXT,
  quota INTEGER DEFAULT 10000,
  used INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🚀 Deployment

### Primary: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Environment variables are managed in Vercel Dashboard
# Or sync from Doppler:
doppler secrets download --no-file --format env | vercel env add
```

### Backup: Firebase Hosting

```bash
# Build static export
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### CI/CD (GitHub Actions)

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📈 Roadmap

### Phase 1: MVP (Current)
- [x] Landing page with Matrix theme
- [x] GitHub projects grid
- [ ] PWA configuration
- [ ] Basic skeleton loading
- [ ] Telegram bot integration

### Phase 2: AI Companion
- [ ] Grok API integration
- [ ] Conversation history (Supabase)
- [ ] Knowledge base search
- [ ] Voice chat (Grok voice API)

### Phase 3: Monetization
- [ ] API key management
- [ ] Usage quotas
- [ ] Stripe integration
- [ ] Prompt template store

### Phase 4: Content
- [ ] YouTube integration
- [ ] Veo background generation
- [ ] Auto-posting to Twitter/X

### Phase 5: Subsites
- [x] **me.oece.tech / svs.sos.sbs** - Personal card / digital business card
  - Codename: SVS-SOS
  - Stack: Next.js 14 + TailwindCSS + Framer Motion
  - Features: Bilingual (EN/繁中), QR-friendly, mobile-first, code showcase
  - Certifications: GCP, MongoDB, GitHub, IIT, Red/Blue Team
  - Source: `/oece-me` (linked as subsite)
- [ ] **api.oece.tech** - API gateway
- [ ] **docs.oece.tech** - Documentation hub

---

## 🌐 Subsites Architecture

```
oece.tech (main)
├── me.oece.tech      → Personal card / SVS-SOS profile
├── svs.sos.sbs       → Ultimate base (mirror)
├── api.oece.tech     → API gateway (planned)
└── docs.oece.tech    → Documentation (planned)
```

### me.oece.tech / svs.sos.sbs (SVS-SOS Personal Card)

Digital business card for security consulting, optimized for:
- 📱 Mobile-first QR code scanning
- 🌐 Bilingual EN/繁體中文
- 🔒 Privacy-focused (anonymous by design)
- ⚡ Subtle professional aesthetic

**Development:**
```bash
cd ../oece-me
npm run dev
```

**Deployment:** Firebase Hosting with custom subdomain

---

## 🔐 Security

- ✅ All secrets in Doppler
- ✅ API keys hashed in database
- ✅ Rate limiting on API routes
- ✅ Supabase RLS policies
- ✅ CORS properly configured

---

## 📞 Contact

| Channel | Address | Use Case |
|---------|---------|----------|
| 🔐 Secure | svs.sos@pm.me | 私密沟通 |
| 💼 Business | root@oece.tech | 商务合作 |
| 💬 Telegram | @svskilo | 日常交流 |
| 🤖 Bot | @svs_pve_bot | AI 助手 |
| 📺 YouTube | @oece_tech | 内容订阅 |

---

## 📝 License

MIT

---

**Built by DeepWeay Labs** | 🌏 Southeast Asia Based | 🔐 Security First

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║  oece.tech - Where AI meets Personal Branding                                ║
║  极客母艦 - AI工具聚合 × 数字游民 × 知识变现                                    ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```