---
source: PCP_raw_PROJECT_MANIFEST.md
distilled_at: 2026-02-14T09:32:25.777Z
model: grok-4-1-fast-non-reasoning
---

# Deepweay-SMS (深途系統) 知識文檔

## 專案概覽

**Deepweay-SMS**（簡稱深途系統）是一個專為**數字遊民（Digital Nomads）**設計的社群平台，旨在提供線上交流、內容分享、心理測試與 AI 輔助工具，幫助用戶在全球移動中建立連結與自我成長。

### 核心特性
- **目標用戶**：數字遊民、遠端工作者、自由職業者
- **平台類型**：社群 + 工具 + 遊戲整合
- **當前狀態**：**Pre-Alpha / MVP 開發階段**
- **開發模式**：敏捷衝刺（Sprint-based），目前進行 **Week 1**

### 技術堆疊總覽
```
Frontend: Next.js 14 (App Router) + TailwindCSS + Shadcn/UI
Backend: Go 1.23+ (Gin/Fiber) 
Database: Supabase (PostgreSQL) + MongoDB Atlas + Upstash Redis
AI: Google Gemini 2.0 Flash + OpenRouter (備援)
Deployment: Vercel/Cloud Run (Serverless)
```

## 系統架構

### 前端架構
```
Framework: Next.js 14 (App Router)
UI Library: TailwindCSS + Shadcn/UI (可組合式組件)
State Management: React Context / Zustand (規劃中)
Deployment: Vercel (靜態) / Cloud Run (SSR)
```

**設計原則**：
- 響應式設計（Mobile-First）
- 暗黑模式支援
- 無頭架構（Headless UI）

### 後端架構
```
Language: Go 1.23+ (高效能、輕量級)
Framework: Gin 或 Fiber (高性能 HTTP 路由)
API 規範: RESTful + GraphQL (未來)
Deployment: Google Cloud Run (Serverless 自動擴展)
```

**主要 API 端點**（規劃）：
- `/auth` - 用戶認證
- `/forum` - BBS 論壇
- `/games` - 遊戲模組
- `/ai` - AI 互動

### 資料庫與儲存
| 類型 | 技術 | 用途 | 備註 |
|------|------|------|------|
| **主要資料庫** | Supabase (PostgreSQL) | 用戶、認證、核心資料 | RLS 權限控制、即時訂閱 |
| **內容資料庫** | MongoDB Atlas | BBS 貼文、評論 | 文件導向、高寫入量 |
| **快取層** | Upstash Redis | Session、熱門內容 | Serverless Redis |

### AI 整合架構
```
Primary: Google Gemini 2.0 Flash (免費額度優先)
Fallback: OpenRouter (Claude 3.5 / GPT-4o)
Budget: $1000 (Gemini) + $1111 (OpenRouter)
```

**AI 使用場景**：
- 智能聊天助手
- 內容推薦
- 心理測試分析
- 貼文自動摘要

## 當前開發衝刺 (Week 1)

### 🎯 P0 優先級 (Must Have - 本週核心交付)
| 任務 | 狀態 | 負責人 | 預計完成 |
|------|------|--------|----------|
| 1. 設置 Cline 擴展 + Gemini 配置 | 🔄 進行中 | | Day 2 |
| 2. 創建前端框架 (Next.js + Shadcn) | ✅ 完成 | | Day 1 |
| 3. 實現 Supabase 認證 | 🔄 進行中 | | Day 3 |
| 4. 部署到 Cloud Run (測試) | ⏳ 待開始 | | Day 5 |

**P0 交付目標**：基礎架構就緒，可運行認證流程

### 🚀 P1 優先級 (Should Have - 下週目標)
| 任務 | 狀態 | 預計完成 |
|------|------|----------|
| 1. BBS 論壇基礎功能 | ⏳ 規劃中 | Week 2 |
| 2. 20Q 心理測試遊戲 | ⏳ 規劃中 | Week 2 |
| 3. Telegram Bot 基礎版 | ⏳ 規劃中 | Week 2 |

**功能描述**：
- **BBS 論壇**：數字遊民專屬討論區（城市分享、工作機會）
- **20Q 心理測試**：AI 驅動的 20 題人格測驗
- **Telegram Bot**：即時通知 + 快速登入

## 部署與環境配置

### 環境變數 (`.env`)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# AI
GEMINI_API_KEY=your_gemini_key
OPENROUTER_API_KEY=your_openrouter_key

# Redis
UPSTASH_REDIS_URL=your_redis_url
UPSTASH_REDIS_TOKEN=your_redis_token
```

### 部署流程
```
1. Frontend: `vercel --prod`
2. Backend: `gcloud run deploy deepweay-api`
3. Database: Supabase Dashboard 配置
4. AI: 環境變數注入
```

## 未來路線圖

### Alpha 版 (4 週內)
```
✅ Week 1: 基礎架構 + 認證
✅ Week 2: BBS + 20Q 遊戲
✅ Week 3: Telegram Bot + AI 聊天
✅ Week 4: 測試 + 封閉 Beta
```

### Beta 版 (8 週內)
- 完整論壇系統
- 數字遊民地圖
- 工作機會板
- 行動 App (React Native)

## 貢獻指南
1. Fork 儲存庫
2. 建立功能分支 `feature/[name]`
3. 提交 PR 至 `develop` 分支
4. 遵循 Conventional Commits

**聯絡方式**：Discord / Telegram 群組（開發中）

---

*文檔最後更新：Week 1進行中 | 版本：v0.1.0*