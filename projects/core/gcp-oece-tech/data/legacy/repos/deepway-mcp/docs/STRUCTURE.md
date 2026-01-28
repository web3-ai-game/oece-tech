# DeepWay.me 項目結構說明

## 目錄結構

```
deepway-mcp/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # 認證路由組
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (main)/            # 主要應用路由組
│   │   ├── forum/         # 論壇相關頁面
│   │   ├── shop/          # 商城相關頁面
│   │   ├── tutorials/     # 教程相關頁面
│   │   ├── community/     # 社群相關頁面
│   │   └── layout.tsx
│   ├── api/               # API 路由
│   │   ├── auth/
│   │   ├── posts/
│   │   ├── products/
│   │   └── users/
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首頁
│   └── globals.css        # 全局樣式
├── components/            # React 組件
│   ├── ui/               # shadcn/ui 基礎組件
│   ├── forum/            # 論壇專用組件
│   ├── shop/             # 商城專用組件
│   ├── layout/           # 布局組件
│   └── common/           # 通用組件
├── lib/                   # 工具函數與核心邏輯
│   ├── db.ts             # Prisma 客戶端
│   ├── auth.ts           # 認證邏輯
│   ├── utils.ts          # 工具函數
│   ├── validators/       # Zod 驗證 schemas
│   └── api/              # API 相關工具
├── prisma/               # 數據庫
│   ├── schema.prisma     # Prisma schema
│   ├── migrations/       # 數據庫遷移
│   └── seed.ts           # 種子數據
├── public/               # 靜態資源
│   ├── images/
│   ├── icons/
│   └── uploads/
├── styles/               # 額外樣式文件
├── types/                # TypeScript 類型定義
├── config/               # 配置文件
└── docs/                 # 項目文檔
```

## 核心模塊說明

### 認證系統
- 使用 NextAuth.js v5
- 支持郵箱/密碼登錄
- 可擴展 OAuth 登錄（Google, GitHub）

### 論壇系統
- 多層級分類
- 富文本編輯
- 標籤系統
- 點贊、收藏功能

### 商品系統
- 商品管理
- 購物車
- 訂單系統

### 教程系統
- 課程分類
- 進度追蹤
- 互動學習

## 技術要點

### 數據庫設計
- 使用 Prisma ORM
- PostgreSQL 作為主數據庫
- Redis 用於緩存和會話

### API 設計
- RESTful API
- 可選 tRPC 用於類型安全
- 統一的錯誤處理

### 前端架構
- Server Components 優先
- Client Components 用於互動
- 使用 Zustand 管理客戶端狀態

### 性能優化
- 圖片優化（Next/Image）
- 代碼分割
- 服務端渲染
- 增量靜態生成（ISR）
