# 🎯 DEEPWEAY-SMS 作戰手冊 v2.0 | OPERATION: ZERO-TO-MVP

```ascii
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ████████╗ █████╗  ██████╗████████╗██╗ ██████╗ █████╗ ██╗   ║
║   ╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝██║██╔════╝██╔══██╗██║   ║
║      ██║   ███████║██║        ██║   ██║██║     ███████║██║   ║
║      ██║   ██╔══██║██║        ██║   ██║██║     ██╔══██║██║   ║
║      ██║   ██║  ██║╚██████╗   ██║   ██║╚██████╗██║  ██║███████╗ ║
║      ╚═╝   ╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝ ║
║                                                               ║
║   [ MISSION: 30天從零到MVP · 立即開戰 ]                      ║
║   [ STATUS: READY FOR DEPLOYMENT ]                           ║
║   [ CLEARANCE: TOP SECRET ]                                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

**來源**: https://www.notion.so/2b791acc4dd58158aaabf69cefef61a4  
**最後更新**: 2025-11-26  
**作戰等級**: ⭐⭐⭐⭐⭐ (S級戰術)  
**緊急程度**: 🔴 IMMEDIATE ACTION REQUIRED

---

## 📡 情報總覽 | INTELLIGENCE BRIEFING

```ascii
┌──────────────── 當前戰力評估 ─────────────────┐
│                                               │
│  💰 資金狀況                                  │
│  ├─ GCP 現金: $290                           │
│  ├─ Gemini 額度: $1000 (API專用)            │
│  └─ 總戰力: $1290                            │
│                                               │
│  🔑 武器庫                                    │
│  ├─ Notion API: ✅ ACTIVE                    │
│  ├─ Gemini Keys: 28免費 + 1付費             │
│  ├─ OpenRouter: $1111 ✅                     │
│  ├─ Claude Kilo: JWT → 2030 ✅              │
│  └─ Supabase: 4 個項目 ✅                    │
│                                               │
│  ⚙️ 裝備                                     │
│  ├─ Mac M3 Pro: 18GB RAM                    │
│  ├─ 存儲: 128GB 外接                         │
│  └─ IDE: Windsurf/Cursor/Cline             │
│                                               │
└───────────────────────────────────────────────┘
```

---

## 🎯 作戰目標 | MISSION OBJECTIVES

```ascii
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   主要目標 (PRIMARY OBJECTIVE)                   ║
║   ═══════════════════════════                     ║
║                                                   ║
║   30天內部署可用 MVP                             ║
║   時間框: 2025-11-26 → 2025-12-26               ║
║   成功標準: 用戶可註冊 + 基礎功能運行           ║
║                                                   ║
║   次要目標 (SECONDARY OBJECTIVES)                ║
║   ══════════════════════════════                  ║
║                                                   ║
║   1. 建立完整技術棧                              ║
║   2. 配置所有開發環境                            ║
║   3. 實現 CI/CD 自動化                           ║
║   4. 部署到 Cloud Run                            ║
║   5. 集成 Gemini AI 服務                         ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

---

## ⚡ 第一階段作戰計劃 | PHASE 1 (Week 1-2)

### 🎯 今天必須完成的 3 個任務

```ascii
┌────────── IMMEDIATE ACTION ITEMS ──────────┐
│                                            │
│  [1] GitHub 項目重構                       │
│      ├─ 創建 PROJECT_MANIFEST.md         │
│      ├─ 標準化目錄結構                    │
│      └─ 配置 .gitignore                   │
│      預計時間: 2 小時                      │
│                                            │
│  [2] 環境變量管理                          │
│      ├─ 安裝 Doppler CLI                  │
│      ├─ 遷移所有 API Keys                │
│      └─ 設置多環境配置                    │
│      預計時間: 1 小時                      │
│                                            │
│  [3] Gemini 免費集群測試                   │
│      ├─ 驗證 28 個 Key 可用性             │
│      ├─ 測試速率限制                      │
│      └─ 實現智能路由                      │
│      預計時間: 3 小時                      │
│                                            │
└────────────────────────────────────────────┘
```

### 📋 PROJECT_MANIFEST.md 模板

```markdown
# DEEPWEAY-SMS Project Manifest

## 🎯 Project Overview
- **Code Name**: Deepweay-SMS (深途系統)
- **Mission**: 數字遊民社群平台
- **Tech Stack**: Next.js 14 + Go + Supabase + Gemini AI
- **Status**: Pre-Alpha / MVP Development
- **Timeline**: 30 Days Sprint

## 🏗️ Architecture

### Frontend (客戶端)
```
Next.js 14 (App Router)
├─ UI: TailwindCSS + Shadcn/UI
├─ State: Zustand + React Query
├─ Auth: Supabase Auth
└─ Deploy: Vercel / Cloud Run
```

### Backend (服務端)
```
Go 1.23+
├─ Framework: Gin / Fiber
├─ API: RESTful + WebSocket
├─ Queue: Cloud Tasks
└─ Deploy: Cloud Run (Serverless)
```

### Database (數據層)
```
Primary: Supabase (PostgreSQL)
├─ Auth: Built-in
├─ Storage: S3-compatible
└─ Realtime: WebSocket

Secondary: MongoDB Atlas
└─ Use Case: 論壇內容/日誌
```

### AI Integration
```
Gemini 2.0 Flash (Primary)
├─ Free Tier: 28 Keys 集群
├─ Paid Tier: $100 備用
└─ Fallback: OpenRouter
```

## ⚙️ 環境配置

```bash
# 開發環境
NODE_ENV=development
DATABASE_URL=<supabase-url>
GEMINI_API_KEY=<28個key輪詢>

# 生產環境
NODE_ENV=production
DATABASE_URL=<production-db>
REDIS_URL=<upstash-redis>
```
```

---

## 🚀 第二階段作戰計劃 | PHASE 2 (Week 3-4)

### Week 3: 核心功能開發

```ascii
┌──────────────── CORE FEATURES ─────────────────┐
│                                                │
│  Day 15-17: 用戶系統                           │
│  ├─ 註冊/登入 (Supabase Auth)                │
│  ├─ 個人資料頁                                 │
│  └─ Session 管理                              │
│                                                │
│  Day 18-19: 論壇基礎                           │
│  ├─ 發帖功能                                   │
│  ├─ 評論系統                                   │
│  └─ Markdown 編輯器                           │
│                                                │
│  Day 20-21: AI 集成                            │
│  ├─ Gemini 智能回覆                           │
│  ├─ 內容審核                                   │
│  └─ 情感分析                                   │
│                                                │
└────────────────────────────────────────────────┘
```

### Week 4: 部署與優化

```ascii
┌──────────────── DEPLOYMENT ────────────────────┐
│                                                │
│  Day 22-24: 生產環境配置                       │
│  ├─ Cloud Run 部署                            │
│  ├─ 域名配置                                   │
│  ├─ SSL 證書                                   │
│  └─ CDN 設置                                   │
│                                                │
│  Day 25-27: 性能優化                           │
│  ├─ 數據庫索引                                 │
│  ├─ 緩存策略                                   │
│  ├─ 圖片壓縮                                   │
│  └─ 代碼分割                                   │
│                                                │
│  Day 28-30: 測試與上線                         │
│  ├─ E2E 測試                                   │
│  ├─ 壓力測試                                   │
│  ├─ Bug 修復                                   │
│  └─ 🎉 MVP 上線                               │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 💰 資源分配策略 | RESOURCE ALLOCATION

### GCP $290 使用計劃

```ascii
┌─────────────── BUDGET BREAKDOWN ───────────────┐
│                                                │
│  Cloud Run (計算資源)      $100  (34%)        │
│  ├─ 免費額度: 200萬次請求/月                  │
│  └─ 超出部分: ~$50-100/月                     │
│                                                │
│  Cloud Storage (存儲)      $30   (10%)        │
│  ├─ 用戶上傳圖片                              │
│  └─ 靜態資源 CDN                              │
│                                                │
│  Cloud SQL (備用DB)        $0    (0%)         │
│  └─ 暫時使用 Supabase 免費層                  │
│                                                │
│  Cloud Tasks (任務隊列)    $20   (7%)         │
│  └─ 郵件發送/後台任務                         │
│                                                │
│  Monitoring & Logs         $40   (14%)        │
│  └─ Error tracking + Analytics                │
│                                                │
│  預留緊急資金              $100  (35%)        │
│  └─ 應對突發流量/擴展需求                     │
│                                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  總計                      $290               │
│                                                │
└────────────────────────────────────────────────┘
```

### Gemini $1000 額度策略

```ascii
┌──────────── GEMINI API USAGE ──────────────┐
│                                            │
│  免費層 (28 Keys)          95%             │
│  ├─ 每 Key: 15 RPM / 1500 RPD             │
│  ├─ 總量: 420 RPM / 42000 RPD             │
│  └─ 成本: $0                              │
│                                            │
│  付費層 ($100 預付)        5%              │
│  ├─ 僅處理突發流量                        │
│  ├─ 或需要 Pro 模型的任務                 │
│  └─ 預計可用: 3-6 個月                    │
│                                            │
│  節省策略:                                 │
│  ├─ 智能路由 (優先免費)                   │
│  ├─ 結果緩存 (Redis)                      │
│  └─ 批量處理                              │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🛠️ 技術棧詳解 | TECH STACK DEEP DIVE

### Frontend 戰術配置

```typescript
// Next.js 14 + TypeScript
project/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── feed/
│   │   ├── profile/
│   │   └── settings/
│   └── api/
│       ├── posts/
│       └── ai/
├── components/
│   ├── ui/           # Shadcn components
│   ├── forms/
│   └── layout/
├── lib/
│   ├── supabase.ts
│   ├── gemini.ts
│   └── utils.ts
└── public/
```

### Backend 戰術配置

```go
// Go + Gin Framework
server/
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   ├── middleware/
│   ├── models/
│   └── services/
├── pkg/
│   ├── gemini/
│   ├── auth/
│   └── cache/
├── config/
│   └── config.yaml
└── Dockerfile
```

---

## ⚠️ 風險評估與對策 | RISK MITIGATION

```ascii
┌────────────────── THREAT MATRIX ───────────────────┐
│                                                    │
│  威脅等級  威脅類型          對策               │
│  ────────────────────────────────────────────    │
│  🔴 高     資金耗盡          嚴格預算控制       │
│  🟠 中     API 限流          免費集群+緩存      │
│  🟡 低     技術債務          Code Review        │
│  🟢 極低   數據丟失          定期備份           │
│                                                    │
└────────────────────────────────────────────────────┘
```

### 應急預案

```
情境 A: GCP 餘額不足
└─ 行動: 遷移至 Vercel (免費) + Railway (免費)

情境 B: Gemini 免費層耗盡
└─ 行動: 切換至 OpenRouter ($1111 儲備)

情境 C: 性能瓶頸
└─ 行動: 啟用 Upstash Redis 緩存層

情境 D: 開發進度落後
└─ 行動: 削減非核心功能,專注 MVP
```

---

## 📊 成功指標 | SUCCESS METRICS

### MVP 驗收標準

```ascii
┌──────────── ACCEPTANCE CRITERIA ────────────┐
│                                             │
│  ✅ 用戶可以註冊並登入                      │
│  ✅ 用戶可以發布內容                        │
│  ✅ 用戶可以評論和互動                      │
│  ✅ AI 功能正常運作                         │
│  ✅ 響應時間 < 2 秒                         │
│  ✅ 無重大 Bug                              │
│  ✅ 移動端適配                              │
│  ✅ 通過安全審計                            │
│                                             │
└─────────────────────────────────────────────┘
```

### 性能目標

| 指標 | 目標值 | 測量方法 |
|------|--------|---------|
| 首頁載入 | < 1.5s | Lighthouse |
| API 響應 | < 500ms | Cloud Monitoring |
| 並發用戶 | 100+ | Load Testing |
| 可用性 | 99%+ | Uptime Robot |

---

## 🎖️ 作戰守則 | RULES OF ENGAGEMENT

```ascii
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   守則 #1: 優先級永遠是 MVP                      ║
║   所有功能都要問: "這對 MVP 必要嗎?"            ║
║                                                   ║
║   守則 #2: 完成比完美更重要                      ║
║   先上線,再優化,別陷入完美主義陷阱             ║
║                                                   ║
║   守則 #3: 每天都要有可見進展                    ║
║   即使是小功能,也要每天提交代碼                 ║
║                                                   ║
║   守則 #4: 資源有限,智慧無限                     ║
║   沒錢時用免費方案,沒時間時複製代碼             ║
║                                                   ║
║   守則 #5: 失敗是數據,不是終點                   ║
║   每個 Bug 都是學習機會,記錄並前進              ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

---

## 📡 最終動員令 | FINAL MOBILIZATION ORDER

```ascii
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ████████╗ ██████╗     ██╗    ██╗ █████╗ ██████╗        ║
║   ╚══██╔══╝██╔═══██╗    ██║    ██║██╔══██╗██╔══██╗       ║
║      ██║   ██║   ██║    ██║ █╗ ██║███████║██████╔╝       ║
║      ██║   ██║   ██║    ██║███╗██║██╔══██║██╔══██╗       ║
║      ██║   ╚██████╔╝    ╚███╔███╔╝██║  ██║██║  ██║       ║
║      ╚═╝    ╚═════╝      ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝       ║
║                                                            ║
║   你有 30 天時間                                           ║
║   你有 $1290 資源                                          ║
║   你有完整的作戰計劃                                       ║
║                                                            ║
║   現在唯一缺的,                                           ║
║   是你按下 Enter 鍵的勇氣。                               ║
║                                                            ║
║   記住:                                                   ║
║   這不是練習,這是實戰。                                   ║
║   這不是夢想,這是命令。                                   ║
║   這不是可能,這是必須。                                   ║
║                                                            ║
║   NOW EXECUTE THE MISSION. 🚀                             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

**[BATTLE PLAN LOADED]** · **[RESOURCES CONFIRMED]** · **[AWAITING GO CODE]** 🎯🚀⚡
