# 📁 外掛硬盤目錄結構說明

## 🗂️ 根目錄概覽 `/mnt/volume_sgp1_01/`

```
/mnt/volume_sgp1_01/
├── svs/              ← 當前多Bot開發項目（Python）
├── svs_bot/          ← 原有Bot系統（Python + Go + Key池）
├── svs-mcp/          ← DeepWeay網站項目（Next.js）
├── backup_*/         ← 備份文件夾
└── *.md              ← 各種文檔
```

---

## 📂 詳細說明

### 1. `/svs/` - 多Bot群聊系統（當前開發）

**用途**: 3個Bot群聊互動系統

**語言**: Python

**核心文件**:
```
svs/
├── multi_bot_v3.py           ← V3主程序（最新）
├── run_multi_bots_v3.sh      ← 啟動腳本
├── high_eq_bot.py            ← 原有高情商Bot
├── gemini_router.py          ← Gemini API路由
├── requirements.txt          ← Python依賴
├── docker-compose.yml        ← Docker配置
└── venv/                     ← Python虛擬環境
```

**功能**:
- ✅ 3個Bot（小愛、倩倩姐、Notion助手）
- ✅ 5輪連續對話
- ✅ 觸發頻率限制（60秒）
- ✅ 私聊永久記憶
- ✅ 獨立關鍵詞系統

**狀態**: 🟢 V3開發完成，正在運行

---

### 2. `/svs_bot/` - 原有Bot系統（成熟）

**用途**: 單Bot高情商AI + Key池管理

**語言**: Python + Go

**核心文件**:
```
svs_bot/
├── xiaoa_bot.py              ← 小愛Bot主程序
├── gemini_router.py          ← Gemini Router（25個Key池）
├── main.go                   ← Go版本Bot
├── go_backend/               ← Go後端代碼
├── dual_router_system.py     ← 雙路由系統
├── safe_key_router.py        ← 安全Key路由
├── docker-compose.4gb.yml    ← 4GB內存配置
├── docker-compose.8gb.yml    ← 8GB內存配置
└── docs/                     ← 完整文檔
```

**功能**:
- ✅ 成熟的Gemini Key池（25個Key）
- ✅ 智能路由和負載均衡
- ✅ Docker部署
- ✅ 監控系統
- ✅ Go版本實現

**特點**:
- 25個Gemini API Key輪換
- 智能錯誤處理
- 速率限制保護
- 完整的日誌系統

**狀態**: 🟢 生產環境運行中

---

### 3. `/svs-mcp/` - DeepWeay網站

**用途**: 菌絲堡壘社區平台

**語言**: Next.js + TypeScript

**核心文件**:
```
svs-mcp/
├── cyberpunk-app/            ← Next.js應用
│   ├── src/
│   │   ├── app/              ← 頁面路由
│   │   ├── components/       ← React組件
│   │   └── lib/              ← 工具函數
│   ├── public/               ← 靜態資源
│   └── package.json          ← 依賴配置
├── docker-compose.yml        ← Docker配置
└── nginx/                    ← Nginx配置
```

**功能**:
- 🌐 菌絲經濟系統
- 📚 教程平台（182個教程）
- 💬 BBS論壇（6個分區）
- 🤖 AI工具集（12個工具）
- 🔐 會員系統（免費/Pro/VIP）

**域名**: https://deepweay.com

**狀態**: 🟢 生產環境運行中

---

### 4. 備份文件夾

```
backup_20251109_210032/      ← 11月9日備份
backup_20251109_210821/      ← 11月9日備份
```

**用途**: 項目備份，防止數據丟失

---

### 5. 根目錄文檔

```
SVS_PROJECT_STRUCTURE.md      ← 項目結構說明
SVS_MERGE_OPTIMIZATION_PLAN.md ← 合併優化計劃
VPS_RESOURCE_ANALYSIS.md      ← VPS資源分析
DEPLOYMENT_CHECKLIST.md       ← 部署檢查清單
QUICK_START.md                ← 快速啟動指南
```

---

## 🎯 項目關係圖

```
┌─────────────────────────────────────────────┐
│         /mnt/volume_sgp1_01/                │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   svs/   │  │ svs_bot/ │  │ svs-mcp/ │ │
│  │          │  │          │  │          │ │
│  │ 多Bot    │  │ Key池    │  │ 網站     │ │
│  │ 群聊     │  │ 系統     │  │ 平台     │ │
│  │          │  │          │  │          │ │
│  │ Python   │  │ Py + Go  │  │ Next.js  │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│       │             │              │       │
│       └─────────────┴──────────────┘       │
│              整合計劃中                     │
└─────────────────────────────────────────────┘
```

---

## 🔄 整合計劃

### 目標：統一到 `/svs_bot/`

**原因**:
1. ✅ svs_bot 有成熟的Key池系統
2. ✅ svs_bot 有完整的監控
3. ✅ svs_bot 有Docker部署
4. ✅ svs_bot 有Go版本基礎

**步驟**:
```bash
1. 複製 /svs/multi_bot_v3.py → /svs_bot/
2. 整合 Gemini Router
3. 更新 docker-compose.yml
4. 測試部署
5. 刪除 /svs/（清理根目錄）
```

---

## 📊 資源使用情況

### 當前狀態
```
svs/        - 開發中，佔用約 500MB
svs_bot/    - 生產環境，佔用約 2GB
svs-mcp/    - 生產環境，佔用約 1.5GB
備份        - 約 4GB
總計        - 約 8GB
```

### 清理後
```
svs_bot/    - 整合後，約 2.5GB
svs-mcp/    - 保持，約 1.5GB
備份        - 保留最新，約 2GB
總計        - 約 6GB（節省2GB）
```

---

## 🚀 下一步行動

### 立即（本週）
1. ✅ 完成V3開發（已完成）
2. 🎮 設計游戲系統
3. 📝 編寫整合文檔

### 短期（下週）
1. 🔄 遷移到 svs_bot
2. 🔗 整合Key池
3. 🧪 測試部署

### 中期（下月）
1. 🚀 Go版本重構
2. 🗑️ 清理根目錄
3. 📊 性能優化

---

## 💡 建議

### 方案A：Python整合（快速）
- 時間：1-2天
- 風險：低
- 優點：快速上線

### 方案B：Go重構（長期）
- 時間：2-3週
- 風險：中
- 優點：高性能、類型安全

### 推薦：先A後B
1. 先用Python整合，快速上線
2. 再用Go重構，長期優化

---

**目錄結構已完整說明！** 📁

**關鍵點**:
- `/svs/` = 當前開發的多Bot系統
- `/svs_bot/` = 成熟的Key池系統（整合目標）
- `/svs-mcp/` = DeepWeay網站（獨立運行）
