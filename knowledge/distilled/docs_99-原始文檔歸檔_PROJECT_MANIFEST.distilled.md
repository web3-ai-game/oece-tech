---
source: docs_99-原始文檔歸檔_PROJECT_MANIFEST.md
distilled_at: 2026-02-14T09:32:11.028Z
model: grok-4-1-fast-non-reasoning
---

# Deepweay-SMS (深途系統) 知識文檔

## 專案概覽

**Deepweay-SMS**（簡稱深途系統）是一個專為**數字遊民（Digital Nomads）**設計的社群平台，旨在為全球遊牧工作者提供連接、分享與成長的數字空間。平台聚焦於生活方式分享、心理健康支持、職業發展與社群互動，支援多語言並強調隱私與效能。

### 核心特點
- **目標用戶**：數字遊民、遠端工作者、自由職業者
- **主要功能**：BBS論壇、心理測試遊戲（20Q）、Telegram Bot、AI驅動內容推薦
- **獨特賣點**：AI輔助社群互動 + 數字遊民生活方式內容
- **開發狀態**：**Pre-Alpha / MVP階段**（第1週Sprint）

### 技術堆疊總覽
```
Frontend: Next.js 14 (App Router) + TailwindCSS + Shadcn/UI
Backend: Go 1.23+ (Gin/Fiber) 
Database: Supabase (PostgreSQL) + MongoDB Atlas + Upstash Redis
AI: Google Gemini 2.0 Flash + OpenRouter
Deployment: Vercel (FE) + Cloud Run (BE, Serverless)
```

## 系統架構

### 前端架構
```
Next.js 14 (App Router)
├── App Directory Structure
├── TailwindCSS + Shadcn/UI Components
├── Server Components (RSC)
└── Client Components (hooks)
```
- **部署**：Vercel（自動CI/CD）或Cloud Run（容器化）
- **狀態管理**：Zustand 或 Context API
- **優化**：Next.js Image、動態導入、SSR/SSG混合

### 後端架構
```
Go 1.23+ (Gin 或 Fiber)
├── RESTful APIs
├── gRPC (未來擴展)
├── Middleware: CORS, Auth, Rate Limiting
└── Serverless: Cloud Run
```
- **API規範**：OpenAPI/Swagger自動生成
- **驗證**：Supabase JWT + 自訂Token

### 資料庫設計
| 類型 | 服務 | 用途 | 備註 |
|------|------|------|------|
| **主要** | Supabase (PostgreSQL) | 用戶、認證、核心資料 | Row Level Security (RLS) |
| **次要** | MongoDB Atlas | BBS論壇貼文、評論 | 彈性Schema |
| **快取** | Upstash Redis | Session、熱門內容、排行 | Serverless Redis |

### AI整合架構
```
Primary: Google Gemini 2.0 Flash (免費額度)
Fallback: OpenRouter (Claude 3.5 Sonnet / GPT-4o)
Budget: $1000 (Gemini) + $1111 (OpenRouter)
```
- **使用場景**：內容生成、心理測試AI、聊天機器人、智能推薦
- **Prompt工程**：結構化Prompt模板 + 上下文管理

## 當前開發進度 (Sprint 1 - 第1週)

### 🎯 P0 優先級（必須完成）
| Task ID | 任務描述 | 預估時間 | 狀態 |
|---------|----------|----------|------|
| P0-01 | 設置 Cline 擴展 + Gemini 配置 | 2小時 | ⏳ |
| P0-02 | 創建前端框架 (Next.js 14 + Shadcn/UI) | 4小時 | ⏳ |
| P0-03 | 實現 Supabase 認證 (Email/Password + OAuth) | 6小時 | ⏳ |
| P0-04 | 部署到 Cloud Run (前端+後端測試) | 3小時 | ⏳ |

**P0完成條件**：基本登入/登出功能 + 部署上線

### 🚀 P1 優先級（應完成）
| Task ID | 任務描述 | 預估時間 | 狀態 |
|---------|----------|----------|------|
| P1-01 | BBS論壇基礎功能 (貼文列表、發文、回覆) | 12小時 | ⏳ |
| P1-02 | 20Q心理測試遊戲 (AI驅動問答) | 8小時 | ⏳ |
| P1-03 | Telegram Bot基礎版 (登入、查詢社群) | 6小時 | ⏳ |

### 📋 未來Sprint規劃
```
Sprint 2: 核心功能完善 + 內容管理
Sprint 3: AI功能深化 + 行動端優化  
Sprint 4: 測試 + Beta上線
```

## 部署與環境配置

### 環境變數模板
```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# AI
GEMINI_API_KEY=your_gemini_key
OPENROUTER_API_KEY=your_openrouter_key

# Redis
UPSTASH_REDIS_URL=your_redis_url
UPSTASH_REDIS_TOKEN=your_redis_token

# Cloud Run
GOOGLE_CLOUD_PROJECT_ID=your_project_id
```

### 部署流程
```bash
# 前端 (Vercel)
vercel --prod

# 後端 (Cloud Run)
gcloud run deploy deepweay-sms-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

## 開發規範與最佳實踐

### 文件結構
```
deepweay-sms/
├── apps/
│   ├── web/          # Next.js 前端
│   └── api/          # Go 後端
├── packages/
│   ├── ui/           # Shadcn 組件
│   └── shared/       # 共用類型/工具
└── docs/             # 本知識文檔
```

### 程式碼規範
- **前端**：ESLint + Prettier + Husky
- **後端**：go fmt + golangci-lint
- **Commit規範**：Conventional Commits
- **分支策略**：Git Flow (main/develop/feature)

## 風險與依賴

### 外部依賴風險
| 服務 | 風險等級 | 緩解措施 |
|------|----------|----------|
| Supabase | 中 | 自建PostgreSQL備案 |
| Gemini AI | 高 | OpenRouter雙重備援 |
| Cloud Run | 低 | Vercel混合部署 |

### 預算追蹤
```
AI預算: $1000 (Gemini) + $1111 (OpenRouter) = $2111
每月監控: Google Cloud Console + OpenRouter Dashboard
```

---

**文檔版本**：v1.0.0  
**最後更新**：Sprint 1 第1週  
**貢獻者**：Deepweay-SMS 核心團隊