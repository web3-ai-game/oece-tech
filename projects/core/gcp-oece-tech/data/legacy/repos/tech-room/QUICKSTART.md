# 🚀 GeekSEA 快速開始指南

## 📋 前置要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

## ⚡ 一鍵啟動

```bash
# 方法 1: 使用啟動腳本（推薦）
./启动GeekSEA.sh

# 方法 2: 手動啟動
npm install
npm run db:init
npm run dev
```

## 🔧 詳細安裝步驟

### 1️⃣ 安裝依賴

```bash
npm install
```

### 2️⃣ 配置環境變量

```bash
# 複製環境變量模板
cp .env.example .env

# 編輯 .env 文件，設置 JWT_SECRET
# 生產環境必須修改為安全的隨機字符串
```

### 3️⃣ 初始化數據庫

```bash
npm run db:init
```

這會創建以下表：
- ✅ `users` - 用戶表
- ✅ `tutorials` - 教程表
- ✅ `tutorial_tags` - 教程標籤表
- ✅ `user_progress` - 學習進度表
- ✅ `comments` - 評論表
- ✅ `likes` - 點贊表

### 4️⃣ 啟動開發服務器

```bash
npm run dev
```

訪問 **http://localhost:3000** 🎉

## 🎯 核心功能測試

### 註冊新用戶

1. 訪問 http://localhost:3000/auth/register
2. 填寫用戶名、郵箱、密碼
3. 點擊「註冊帳號」

### 登入系統

1. 訪問 http://localhost:3000/auth/login
2. 輸入郵箱/用戶名和密碼
3. 點擊「登入」

### 瀏覽教程

1. 訪問 http://localhost:3000/tutorials
2. 瀏覽不同分類的教程
3. 點擊教程查看詳情

## 📁 項目結構

```
GEEK/
├── app/                    # Next.js 應用
│   ├── (auth)/            # 認證頁面
│   ├── api/               # API 路由
│   └── page.tsx           # 首頁
├── components/            # React 組件
│   ├── layout/            # 佈局組件
│   └── ui/                # UI 組件
├── lib/                   # 工具庫
│   ├── auth.ts           # 認證邏輯
│   ├── db.ts             # 數據庫
│   └── utils.ts          # 工具函數
├── database/             # SQLite 數據庫
├── scripts/              # 腳本文件
└── styles/               # 樣式文件
```

## 🎨 設計風格

### 像素化配色

- **Primary**: `#00ff88` (螢光綠)
- **Secondary**: `#ff00ff` (像素粉)
- **Accent**: `#00ffff` (青色)
- **Dark**: `#1a1a2e` (深藍黑)
- **Light**: `#eeeeee` (淺色)

### 字體

- **像素字體**: Press Start 2P
- **等寬字體**: JetBrains Mono
- **無襯線**: Inter

## 🔐 認證系統

### JWT Token 流程

1. 用戶註冊/登錄
2. 服務器生成 JWT Token
3. 前端保存 Token 到 localStorage
4. 後續請求攜帶 Token (Authorization: Bearer {token})
5. 服務器驗證 Token

### API 端點

```typescript
POST /api/auth/register  // 註冊
POST /api/auth/login     // 登錄
GET  /api/auth/me        // 獲取當前用戶
```

## 🗄️ 數據庫管理

```bash
# 初始化數據庫
npm run db:init

# 填充示例數據（可選）
npm run db:seed

# 數據庫遷移
npm run db:migrate
```

## 🚀 部署到生產環境

### Vercel 部署

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### 環境變量配置

生產環境必須設置：
- `JWT_SECRET` - JWT 密鑰（強隨機字符串）
- `DATABASE_URL` - 數據庫路徑
- `NEXT_PUBLIC_SITE_URL` - 站點 URL

## 🐛 常見問題

### Q: 數據庫錯誤？
A: 運行 `npm run db:init` 重新初始化

### Q: 端口被佔用？
A: 修改 `package.json` 中的端口號，或停止佔用 3000 端口的進程

### Q: Token 無效？
A: 清除 localStorage，重新登錄

### Q: 樣式沒有生效？
A: 確保運行了 `npm install` 並重啟開發服務器

## 📚 更多文檔

- [完整 README](./README.md)
- [API 文檔](./docs/API.md)
- [部署指南](./docs/DEPLOYMENT.md)
- [貢獻指南](./docs/CONTRIBUTING.md)

## 💡 提示

- 首次運行會自動安裝依賴和初始化數據庫
- 開發模式支持熱重載
- 數據庫文件位於 `database/geeksea.db`
- 修改環境變量後需要重啟服務器

## 🎉 開始開發

現在你已經準備好開始開發了！

```bash
# 啟動開發服務器
npm run dev

# 訪問應用
open http://localhost:3000
```

**Happy Coding! 🚀**
