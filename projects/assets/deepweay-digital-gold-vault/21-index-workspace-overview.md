# 📦 倉庫全景圖 | /Volumes/128/oio01 Workspace Overview

> **蒸餾時間**: 2025-11-27  
> **原始分析**: DOCS/倉庫完整分析報告.md  
> **密度等級**: ⭐⭐⭐⭐ (95% 工程精華)

---

## 🌍 整體架構

**位置**: `/Volumes/128/oio01/` (外接 128GB 存儲)

**狀態**: 7 個項目,混合狀態 (3 個活躍 + 2 個存檔 + 2 個私有)

---

## 📁 項目清單

### 🔥 活躍項目 (Active)

#### 1. ai-portfolio-enterprise-main
**類型**: AI 驅動企業站  
**技術棧**: Next.js 15 + React 19 + Three.js + GSAP  
**狀態**: ✅ 可部署  
**亮點**:
- 3D 動畫效果 (Three.js + Framer Motion)
- AI 儀表板 (public/ai-dashboard.html)
- Firebase 集成

**啟動**:
```bash
cd ai-portfolio-enterprise-main
pnpm install
pnpm dev
```

#### 2. ohhhnooo
**類型**: Dockerized 開發環境 + MCP 服務器  
**技術棧**: FastAPI + Next.js + MongoDB + Redis  
**基礎設施**: VPS 157.230.195.180 (16GB RAM / 8 CPU)  
**狀態**: ⚙️ 配置中  
**特色**:
- 多容器架構 (docker-compose.yml)
- MCP 工具集成
- Nginx 反向代理
- 日誌系統 (logs/, mcp_logs/)

**關鍵文件**:
- `OhhhNooo項目完整配置報告.md` - 完整部署指南
- `docker-compose.optimized.yml` - 優化後的容器配置

#### 3. tech-room (GeekHub)
**類型**: 匿名黑客教程平台  
**技術棧**: Next.js 15 + Astro 4 + Supabase  
**商業模式**: 付費訂閱 (¥399/月)  
**預測收入**: ¥114K/年 (300 用戶)  
**狀態**: 🚧 開發中  
**路線圖**:
- Phase 1: 硬件教程 (樹莓派/Arduino)
- Phase 2: 網絡安全實戰
- Phase 3: AI 工具開發

**啟動**:
```bash
cd tech-room
pnpm install
pnpm dev
```

---

### 💰 Web3 金融項目 (Archived/Refactoring)

#### 4. online/ (原始版)
#### 5. UI/ (重構版)

**類型**: DeFi + GameFi + NFT 平台  
**技術棧**: React + Web3.js + SQLite  
**功能**:
- 數字資產展示 (digital-assets-showcase.html)
- Web3 組件庫 (web3-components/)
- Game Pool 遊戲機制

**狀態**: 🗂️ 需要整合 (兩個版本內容重複)

**關鍵文檔**:
- `金融組件.md` - UI 組件設計
- `數字資產.md` - 資產模型
- `web3資產.md` - 區塊鏈集成

**Docker 部署**:
```bash
# Frontend + Backend
docker-compose up -d
```

---

### 🔒 私有/未知項目

#### 6. fuunm
**內容**: old-old/ (空目錄)  
**狀態**: ⚰️ 已廢棄

#### 7. king
**訪問**: Permission denied  
**狀態**: 🔐 私有目錄 (需要 root 權限)

---

## 📊 技術棧統計

### 前端框架
- **Next.js**: 3 個項目 (ai-portfolio, ohhhnooo, tech-room)
- **React**: 2 個項目 (online, UI)
- **Astro**: 1 個項目 (tech-room 輔助)

### 後端
- **FastAPI**: 1 個 (ohhhnooo)
- **Node.js**: 多個 API Routes

### 數據庫
- **Supabase**: tech-room (主力)
- **MongoDB**: ohhhnooo (論壇數據)
- **PostgreSQL**: ohhhnooo (用戶數據)
- **Redis**: ohhhnooo (緩存)
- **SQLite**: online/UI (輕量級)

### DevOps
- **Docker**: ohhhnooo, online, UI
- **Nginx**: ohhhnooo (反向代理)
- **PM2**: ai-portfolio (ecosystem.config.js)

---

## 💰 資源盤點

### 雲服務
- **GCP**: $290 贈金 ✅
- **Gemini API**: $1000 產品額度 + 28 個免費 Key ✅
- **OpenRouter**: $1,111 餘額 ✅
- **Supabase**: 4 個項目 (Free Tier) ✅

### VPS
- **157.230.195.180**: ohhhnooo (DigitalOcean, 16GB/8CPU)
- **134.209.142.24**: DEEPWEAY-SMS (待部署)

### 域名
- **deepweay.me**: $12/年 (已購買)

---

## 🎯 優先級建議

### P0 (立即執行)

**1. DEEPWEAY-SMS 快速啟動 (30 天 MVP)**
- 創建 GitHub Repo
- 使用 Cline + Gemini 2.0 Flash
- 部署到 Cloud Run
- **參考**: `18-deepweay-sms-battle-pack-v2.md`

**2. Tech-room (GeekHub) 變現**
- 完成核心教程 (10 篇)
- 設置 Supabase 付費訂閱
- 推廣到黑客社群
- **目標**: ¥114K/年

### P1 (中期優化)

**3. ohhhnooo MCP 服務器穩定化**
- 完善 Docker 配置
- 添加監控系統
- 文檔補全

**4. online + UI 項目整合**
- 合併重複代碼
- 統一組件庫
- 決定是否繼續開發或歸檔

### P2 (長期探索)

**5. 地球Online (Vector Universe)**
- 實現 20Q 靈魂測試
- 構建向量數據庫
- 社會實驗設計
- **參考**: `20-earth-online-vector-universe.md`

---

## 🚨 風險提示

### 技術債務
- **online/UI 重複**: 兩個項目內容 80% 重疊,需整合
- **配置碎片化**: 多個 docker-compose 文件,需統一管理
- **文檔缺失**: 部分項目缺乏啟動文檔

### 資源限制
- **VPS 成本**: 157.230.195.180 每月 $XX (需確認)
- **時間分配**: 7 個項目同時維護,精力分散
- **API 配額**: Gemini 免費層有日限制

---

## 📈 成功指標

### 3 個月目標
- [ ] DEEPWEAY-SMS MVP 上線 (50+ 用戶)
- [ ] Tech-room 月收入 > ¥10K
- [ ] ohhhnooo MCP 服務器穩定運行
- [ ] 整合 online + UI 項目

### 12 個月目標
- [ ] DEEPWEAY-SMS 付費用戶 > 100
- [ ] Tech-room 年收入 > ¥100K
- [ ] 地球Online 原型完成

---

## 🔗 關鍵文檔索引

### 戰略規劃
- `18-deepweay-sms-battle-pack-v2.md` - 30 天作戰計劃
- `19-deepweay-gemini-strategy-enhanced.md` - API 優化策略
- `20-earth-online-vector-universe.md` - 長期願景

### 技術文檔
- `ohhhnooo/OhhhNooo項目完整配置報告.md` - 基礎設施
- `ai-portfolio-enterprise-main/DEPLOYMENT.md` - 部署指南
- `online/README.md` & `UI/README.md` - Web3 平台文檔

### 設置指南
- `ai-portfolio-enterprise-main/windsurf-setup.md` - IDE 配置
- `ai-portfolio-enterprise-main/github-setup.md` - Git 工作流

---

## 🛠️ 快速導航

### 啟動所有活躍項目

```bash
# Terminal 1: ai-portfolio
cd /Volumes/128/oio01/ai-portfolio-enterprise-main
pnpm dev

# Terminal 2: tech-room
cd /Volumes/128/oio01/tech-room
pnpm dev

# Terminal 3: ohhhnooo (Docker)
cd /Volumes/128/oio01/ohhhnooo
docker-compose -f docker-compose.optimized.yml up -d
```

### 查看項目狀態

```bash
# 查看所有項目大小
cd /Volumes/128/oio01
du -sh */ | sort -h

# 查看 Git 狀態
for dir in */; do 
  echo "=== $dir ==="
  cd "$dir"
  git status -s 2>/dev/null || echo "Not a git repo"
  cd ..
done
```

---

**🏯 蒸餾評級**: ⭐⭐⭐⭐ (95% 工程精華)  
**諸葛亮曰**: "善戰者,因敵而制勝。審時度勢,知所先後,則事半功倍也。"

---

## 🔄 下一步行動

**今天 (Day 1)**:
1. 閱讀 `18-deepweay-sms-battle-pack-v2.md`
2. 創建 DEEPWEAY-SMS GitHub Repo
3. 配置 Cline 擴展

**本週 (Week 1)**:
4. 完成 Next.js + Supabase 基礎框架
5. 部署到 Cloud Run
6. 開始第一個 AI 工具 (旅行規劃器)

**資源清單**: 參考 `19-deepweay-gemini-strategy-enhanced.md` 優化 API 使用
