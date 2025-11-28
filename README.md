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
# 使用 Doppler 注入環境變量
./dev.sh

# 或手動啟動
doppler run --project oece-tech-prod --config dev -- npm run dev
```

訪問: http://localhost:3000

### 部署到 Firebase

```bash
# 初始化 Firebase Hosting
firebase init hosting

# 部署
doppler run --project oece-tech-prod --config dev -- firebase deploy
```

## 🔧 技術棧

- **框架**: Next.js 16 (App Router)
- **語言**: TypeScript
- **樣式**: TailwindCSS
- **後端**: Firebase (Hosting + Realtime Database)
- **AI**: OpenRouter API ($1111 餘額)
- **搜索**: Algolia
- **監控**: Sentry
- **部署**: Firebase Hosting + Cloud Functions Gen 2

## 📦 環境變量

所有環境變量通過 **Doppler** 管理，不在代碼中寫死。

### Firebase
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### AI Keys
- `OPENROUTER_API_KEY` - OpenRouter API ($1111 餘額)

### Monitoring
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry 錯誤追蹤

### Search
- `ALGOLIA_APP_ID`
- `ALGOLIA_ADMIN_API_KEY`
- `ALGOLIA_SEARCH_API_KEY`

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
