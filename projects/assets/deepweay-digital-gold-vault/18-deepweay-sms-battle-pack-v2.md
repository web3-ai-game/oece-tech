# 🚀 DEEPWEAY-SMS 戰鬥包 v2.0 | 2025-11-26 立即開戰版

> **來源**: Notion sms-sms 整合  
> **蒸餾時間**: 2025-11-27  
> **頁面ID**: 2b791acc4dd58158aaabf69cefef61a4  
> **密度等級**: ⭐⭐⭐⭐⭐ (100% 戰略精華)

---

## 📊 當前資源清單 (2025-11-26 更新)

### 💰 真實可用資金
- **Google Cloud Platform**: $290 贈金 ✅
- **Gemini 產品贈金**: $1000 (虛擬額度,僅限 Gemini API) ✅
- **總計**: **$290 現金 + $1000 API 額度**

### 🔑 核心 API Keys

⚠️ **機密等級**: 🔴 詳細密鑰請查看 `14-info-resource-library.md` (已從 Git 排除)

```
Notion API: ✅ 已配置
Gemini Keys: 28個免費集群 + 1個付費 Key ($100)
OpenRouter: $1,111 餘額
Claude Kilo: JWT 有效至 2030年
Supabase: 4個項目 (PostgreSQL + Auth)
GitHub: 學生包 + Personal Token
```

### 🛠️ 開發工具
- **Mac M3 Pro**: 18GB RAM + 500GB SSD
- **外接存儲**: 128GB
- **IDEs**: 
  - Windsurf Pro (下個月不續費)
  - Cursor (可用)
  - **Cline 擴展** (推薦用這個)

---

## 🎯 第一階段目標 (Week 1-2)

### 立即要做的 3 件事

#### 1️⃣ GitHub 項目重構 (今天完成)

創建標準化的項目結構文檔: `PROJECT_MANIFEST.md`

**文件位置**: `/PROJECT_MANIFEST.md`

**內容結構**:
```markdown
# DEEPWEAY-SMS Project Manifest

## Project Overview
- **Name**: Deepweay-SMS (深途系統)
- **Type**: 數字遊民社群平台
- **Tech Stack**: Next.js 14 + Go + Supabase + Gemini AI
- **Status**: Pre-Alpha / MVP Development

## Architecture
### Frontend
- Framework: Next.js 14 (App Router)
- UI: TailwindCSS + Shadcn/UI
- Deployment: Vercel / Cloud Run

### Backend
- Language: Go 1.23+
- Framework: Gin / Fiber
- Deployment: Cloud Run (Serverless)

### Database
- Primary: Supabase (PostgreSQL)
- Secondary: MongoDB Atlas (論壇內容)
- Cache: Upstash Redis

### AI Integration
- Primary: Google Gemini 2.0 Flash (免費)
- Fallback: OpenRouter (Claude/GPT-4)
- Budget: $1000 Gemini 額度 + $1111 OpenRouter

## Current Sprint (Week 1)
### Priority P0 (Must Have)
1. [ ] 設置 Cline 擴展 + Gemini 配置
2. [ ] 創建前端框架 (Next.js + Shadcn)
3. [ ] 實現 Supabase 認證
4. [ ] 部署到 Cloud Run (測試)

### Priority P1 (Should Have)
1. [ ] BBS 論壇基礎功能
2. [ ] 20Q 心理測試遊戲
3. [ ] Telegram Bot 基礎版
```

#### 2️⃣ 配置 Cline 擴展 (30分鐘)

**為什麼用 Cline?**
- 原生支持 Gemini 2.0 Flash (免費)
- 比 Windsurf 更輕量
- 可以直接調用 Claude API (你的 OpenRouter)

**安裝步驟**:
1. 在 VSCode/Cursor 中安裝 **Cline** 擴展
2. 打開設置 (CMD/CTRL + Shift + P → "Cline: Open Settings")
3. 配置 API:

```json
{
  "cline.apiProvider": "gemini",
  "cline.geminiApiKey": "你的_GOOGLE_API_KEY",
  "cline.geminiModel": "gemini-2.0-flash-exp"
}
```

4. 測試命令:
```
創建一個 Next.js 14 項目,使用 App Router,集成 TailwindCSS
```

#### 3️⃣ 創建 Cline 專用提示詞模板

**文件位置**: `/cline_prompt_template.md`

**模板內容**:
```markdown
# DEEPWEAY-SMS 開發指令模板

## 角色設定
你是一個全棧架構師,正在開發 DEEPWEAY-SMS 項目。

## 項目信息
- **技術棧**: Next.js 14 + Go + Supabase + Gemini AI
- **風格**: 極簡黑客風格 (GitHub Dark Mode)
- **原則**: 
  1. 代碼密度優先,避免冗餘
  2. 使用 TypeScript (前端) 和 Go (後端)
  3. 所有 API 調用必須有錯誤處理
  4. UI 組件使用 Shadcn/UI

## 輸出要求
1. **直接給代碼**: 不要解釋太多,直接上實現
2. **文件路徑**: 明確指出文件應該放在哪裡
3. **依賴清單**: 如果需要新的 npm/go 包,列出來
4. **測試用例**: 如果是核心功能,給一個簡單的測試
```

---

## 🗂️ 項目文件結構 (標準版)

```
deepweay-sms/
├── frontend/                    # Next.js 前端
│   ├── app/
│   │   ├── (auth)/             # 認證頁面
│   │   ├── (dashboard)/        # 儀表板
│   │   ├── tools/              # AI 工具
│   │   ├── bbs/                # 論壇
│   │   └── api/                # API Routes
│   ├── components/
│   │   ├── ui/                 # Shadcn 組件
│   │   ├── bbs/
│   │   └── ai-tools/
│   ├── lib/
│   │   ├── gemini/             # Gemini 客戶端
│   │   ├── supabase/           # Supabase 客戶端
│   │   └── utils/
│   └── package.json
│
├── backend/                     # Go 後端
│   ├── cmd/api/main.go
│   ├── internal/
│   │   ├── handlers/           # HTTP 處理器
│   │   ├── models/             # 數據模型
│   │   └── services/           # 業務邏輯
│   ├── pkg/
│   │   ├── gemini/             # Gemini 客戶端
│   │   └── db/                 # 數據庫
│   └── go.mod
│
├── docs/                        # 文檔
│   ├── api/                    # API 文檔
│   ├── architecture/           # 架構圖
│   └── prompts/                # Prompt 模板
│
└── scripts/                     # 腳本
```

---

## 🔥 核心開發計劃 (30天)

### Week 1: 基礎設施 (11/26 - 12/02)

**Day 1-2: 項目初始化**
- [ ] 創建 GitHub Repo
- [ ] 設置 PROJECT_MANIFEST.md
- [ ] 配置 Cline 擴展
- [ ] 創建 Next.js + Go 基礎框架

**Day 3-4: 認證系統**
- [ ] Supabase Auth 集成
- [ ] 登錄/註冊頁面
- [ ] 用戶 Profile 頁面

**Day 5-7: 部署測試**
- [ ] Cloud Run 部署 (前端 + 後端)
- [ ] 綁定自定義域名
- [ ] CI/CD 設置 (GitHub Actions)

### Week 2: 核心功能 (12/03 - 12/09)

**BBS 論壇 (P0)**
- [ ] 發帖/回帖功能
- [ ] Markdown 編輯器
- [ ] 自動翻譯 (Gemini Flash Lite)

**AI 工具 #1: 旅行規劃器 (P0)**
- [ ] 表單設計 (目的地/天數/預算)
- [ ] Gemini API 調用
- [ ] 結果展示 (行程/預算分解)

### Week 3: AI 功能擴展 (12/10 - 12/16)

**20Q 心理測試遊戲 (P1)**
- [ ] 遊戲流程設計
- [ ] Gemini 生成問題
- [ ] 結果分析 + "Soul Vector" 生成

**Telegram Bot 基礎版 (P1)**
- [ ] Bot 框架 (Go + Telegram API)
- [ ] 對話功能 (Gemini Flash)
- [ ] Redis 會話管理

### Week 4: 優化 + 測試 (12/17 - 12/23)

**性能優化**
- [ ] Gemini 限流優化
- [ ] 前端加載優化
- [ ] 數據庫查詢優化

**用戶測試**
- [ ] 邀請 10-20 個測試用戶
- [ ] 收集反饋
- [ ] Bug 修復

---

## 💸 成本控制策略

### 資金分配 (第一個月)

| 項目 | 預算 | 說明 |
|------|------|------|
| **Cloud Run** | $50 | 前端 + 後端部署 |
| **Gemini API** | $0 | 使用 $1000 贈金 |
| **Supabase** | $0 | 免費層 (500MB) |
| **域名** | $12 | deepweay.me (已購買) |
| **預留** | $38 | 緊急用 |
| **總計** | **$100/月** | 不超過 GCP $290 贈金 |

### 省錢技巧

1. **Cloud Run 冷啟動**: 沒人訪問時自動縮減到 0,不扣費
2. **Gemini 免費層**: Flash Lite (1K/天) + Flash (2.5K/天)
3. **Supabase 免費層**: 500MB 數據庫 + 認證系統
4. **靜態資源**: 用 Vercel 免費 CDN

---

## 🛠️ 開發工具設置

### Cline 配置文件

**位置**: `.vscode/settings.json` (或 Cursor 設置)

```json
{
  "cline.apiProvider": "gemini",
  "cline.geminiApiKey": "${GOOGLE_API_KEY}",
  "cline.geminiModel": "gemini-2.0-flash-exp",
  "cline.temperature": 0.7,
  "cline.maxTokens": 8192
}
```

### 環境變量管理

**不要用 .env 文件!** 太危險,容易洩露。

**推薦方案 A: Doppler (免費)**
```bash
# 安裝 Doppler CLI
brew install dopplerhq/cli/doppler

# 登錄
doppler login

# 初始化項目
doppler setup

# 運行項目 (自動注入環境變量)
doppler run -- pnpm dev
```

**推薦方案 B: Google Secret Manager (GCP 原生)**
```bash
# 創建 Secret
gcloud secrets create GOOGLE_API_KEY \
  --data-file=- <<< "你的_KEY"

# Cloud Run 部署時注入
gcloud run deploy deepweay-sms \
  --set-secrets="GOOGLE_API_KEY=GOOGLE_API_KEY:latest"
```

---

## 📊 每日開發檢查清單

### 早上 (開工前)
- [ ] 查看 Notion 當日任務
- [ ] 拉取最新代碼: `git pull origin main`
- [ ] 檢查 Gemini 配額: https://aistudio.google.com/app/apikey

### 開發中
- [ ] 使用 Cline 生成代碼
- [ ] 本地測試: `pnpm dev`
- [ ] Git 提交: `git commit -m "feat: xxx"`

### 晚上 (收工前)
- [ ] 推送代碼: `git push origin main`
- [ ] 更新 Notion 進度
- [ ] 記錄遇到的問題

---

## 🚨 常見問題解決

### Q1: Gemini API 返回 429 錯誤?

**原因**: 超過速率限制 (15 RPM)

**解決**:
```typescript
// 添加重試邏輯
async function callGeminiWithRetry(prompt: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await gemini.generateContent(prompt);
    } catch (error) {
      if (error.status === 429) {
        await new Promise(r => setTimeout(r, 60000)); // 等待 1 分鐘
        continue;
      }
      throw error;
    }
  }
}
```

### Q2: Cloud Run 部署失敗?

**檢查清單**:
1. Dockerfile 是否正確?
2. 環境變量是否設置?
3. 構建日誌有沒有錯誤?

```bash
# 查看構建日誌
gcloud builds list --limit=5
gcloud builds log [BUILD_ID]
```

---

## 🎯 成功指標 (30天後)

### 產品指標
- [ ] MVP 上線
- [ ] 3個核心功能可用 (BBS + 旅行規劃 + 20Q)
- [ ] 50+ 註冊用戶
- [ ] 0 重大 Bug

### 技術指標
- [ ] API 響應時間 < 2秒
- [ ] Gemini 配額使用 < 70%
- [ ] Cloud Run 成本 < $50/月
- [ ] 正常運行時間 > 99%

### 個人指標
- [ ] 掌握 Next.js 14 + Go
- [ ] 理解 Gemini API 限流機制
- [ ] 能獨立部署到 Cloud Run
- [ ] 積累第一批用戶反饋

---

## 🔗 重要鏈接

- **Cloud Run Console**: https://console.cloud.google.com/run
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Gemini API Keys**: https://aistudio.google.com/app/apikey
- **Notion 主文檔**: https://notion.so/187576b9-5ff3-4fba-b6e4-d120d82c5aea

---

**準備好了嗎?** 複製 `cline_prompt_template.md` 到 Cline,然後開始第一個任務:

```
創建 Next.js 14 項目,使用 App Router + TailwindCSS + Shadcn/UI
```

**🏯 蒸餾評級**: ⭐⭐⭐⭐⭐ (100% 戰略精華)  
**諸葛亮曰**: "三十日成軍,此乃速戰速決之良策也。"
