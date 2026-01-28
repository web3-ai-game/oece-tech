# 🔥🔥 雙群聊定時噴射系統

> **每小時自動執行 | 4個收費Key並發 | 3分鐘大噴射 | 向量0.1精度切割**

## 🎯 系統概覽

這是一個自動化的雙群聊AI噴射系統，專門設計用於：
- ✅ **定時執行**: 每小時自動觸發
- ✅ **多Key並發**: 4個Gemini Pro收費key同時工作
- ✅ **Token控制**: 每個key限制30000 token
- ✅ **向量切割**: 0.1精度思維切割
- ✅ **Debug迭代**: 自動分析和優化上下文

---

## 🚀 快速啟動

### 方式1: 一鍵啟動（推薦）

```bash
cd /home/svs-main-key/GCP
./start-dual-jet.sh
```

選擇啟動模式：
1. **測試模式** - 單次執行，立即查看效果
2. **守護進程** - PM2管理，自動重啟
3. **定時任務** - Crontab每小時執行

### 方式2: 手動啟動

```bash
# 單次執行（測試）
node dual-chat-jet-system.js

# 守護進程（生產）
pm2 start ecosystem.dual-jet.json

# 定時任務（Cron）
crontab crontab-dual-jet.txt
```

---

## 📋 核心功能

### 1️⃣ 雙群聊並發噴射

同時向2個群聊發送AI生成內容：
- 主戰場群聊
- 副戰場群聊

### 2️⃣ 向量精度切割

```javascript
vectorPrecisionCut(context, 0.1)
```

將思維以10%精度切割，實現：
- 🎯 細緻的分析
- 🧩 並發處理
- 🔄 迭代優化

### 3️⃣ Token智能控制

```javascript
MAX_TOKENS_PER_KEY: 30000  // 每個key限制
JET_DURATION: 180000       // 噴射3分鐘
```

自動監控並防止超限。

### 4️⃣ Debug模式分析

每次噴射包含：
- 代碼庫問題掃描
- 性能瓶頸識別
- 架構改進建議
- 上下文壓縮優化

---

## ⚙️ 配置說明

### 環境變量

創建 `.env.vector-jet`:

```bash
# 收費Keys（4個）
GEMINI_PRO_30=your_key_1
GEMINI_PRO_31=your_key_2
GEMINI_PRO_32=your_key_3
GEMINI_PRO_33=your_key_4

# 模型配置
MODEL=gemini-3-pro-preview
MAX_TOKENS_PER_KEY=30000
VECTOR_PRECISION=0.1
```

### PM2配置

`ecosystem.dual-jet.json`:
- 自動重啟
- 日誌管理
- 每小時cron觸發

### Crontab配置

```bash
# 每小時執行
0 * * * * cd /home/svs-main-key/GCP && node dual-chat-jet-system.js
```

---

## 📊 監控和日誌

### 查看狀態

```bash
# PM2狀態
pm2 status

# 實時日誌
pm2 logs dual-chat-jet-daemon

# 查看報告
cat logs/dual-chat-jet-report.md
```

### 日誌文件

```
logs/
├── dual-jet-out.log         # 標準輸出
├── dual-jet-error.log       # 錯誤日誌
├── cron-dual-jet.log        # Cron日誌
└── dual-chat-jet-report.md  # 統計報告
```

---

## 📈 統計報告示例

```markdown
# 統計報告

## 總體統計
- 總輪次: 145
- 總Token: 487,234
- 上次噴射: 2025-11-26T10:00:00Z

## Key使用情況

### key_1
- Token消耗: 28,450 / 30,000
- 使用率: 94.83%

### key_2
- Token消耗: 29,120 / 30,000
- 使用率: 97.07%
```

---

## 🔧 常用命令

### 服務管理

```bash
# 啟動
./start-dual-jet.sh

# 查看狀態
pm2 status

# 重啟
pm2 restart dual-chat-jet-daemon

# 停止
pm2 stop dual-chat-jet-daemon

# 查看日誌
pm2 logs
```

### 調試

```bash
# 測試運行
node dual-chat-jet-system.js

# 查看實時日誌
tail -f logs/dual-jet-out.log

# 生成報告
node dual-chat-jet-system.js --report
```

---

## 📖 相關文檔

- 📘 [Windsurf 接手開發指南](./WINDSURF_HANDOVER_GUIDE.md)
- 📗 [根目錄優化方案](./ROOT_OPTIMIZATION_PLAN.md)
- 📕 [API文檔](./docs/guides/AI_CLI_玩法手冊.md)
- 📙 [架構設計](./docs/architecture/Go并发向量调用架构.md)

---

## 🎯 系統架構

```
┌─────────────────────────────────────────┐
│         定時觸發器（Cron/PM2）            │
└──────────────┬──────────────────────────┘
               │ 每小時
               ▼
┌─────────────────────────────────────────┐
│      雙群聊噴射控制器                     │
│  - 讀取配置                               │
│  - 初始化Keys                             │
│  - 啟動噴射流程                           │
└──────────────┬──────────────────────────┘
               │
      ┌────────┴────────┐
      ▼                 ▼
┌───────────┐     ┌───────────┐
│ 群聊1     │     │ 群聊2     │
└─────┬─────┘     └─────┬─────┘
      │                 │
      │  向量切割 (0.1) │
      ▼                 ▼
┌──────────────────────────────┐
│     4個Key並發調用            │
│  Key1 │ Key2 │ Key3 │ Key4   │
└──────┬───────────────────────┘
       │
       │ 3分鐘噴射
       ▼
┌──────────────────────────────┐
│    Gemini Pro API            │
│  - Debug分析                 │
│  - 思維迭代                  │
│  - 上下文優化                │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│    結果處理 & 報告生成        │
│  - Token統計                 │
│  - 性能分析                  │
│  - 生成報告                  │
└──────────────────────────────┘
```

---

## 💡 技術特點

### 1. 並發架構
- Promise.all並發調用4個key
- 最大化吞吐量
- 智能錯誤處理

### 2. Token控制
- 實時監控token消耗
- 達到限制自動停止
- 防止超額費用

### 3. 向量切割
- 0.1精度（10%粒度）
- 細緻的內容分析
- 並發處理片段

### 4. Debug模式
- 自動代碼掃描
- 性能瓶頸分析
- 架構優化建議

---

## 🔐 安全措施

1. **Key安全**
   - 環境變量存儲
   - 不提交到Git
   - 日誌脫敏處理

2. **Token限制**
   - 嚴格控制上限
   - 實時監控消耗
   - 自動停止機制

3. **錯誤處理**
   - 單個key失敗不影響其他
   - 詳細錯誤日誌
   - 自動重試機制

---

## 📞 支持

- **文檔**: `/home/svs-main-key/GCP/docs/`
- **問題**: GitHub Issues
- **開發**: Windsurf AI

---

## 📝 更新日誌

### v1.0.0 (2025-11-26)
- ✅ 雙群聊噴射系統
- ✅ 向量0.1精度切割
- ✅ 4個Key並發調用
- ✅ Token智能控制
- ✅ Debug模式分析
- ✅ PM2守護進程
- ✅ Cron定時任務
- ✅ 統計報告生成

---

## 🎯 路線圖

- [ ] 集成Telegram Bot
- [ ] Web控制面板
- [ ] 向量數據庫
- [ ] 更多群聊支持
- [ ] 實時監控Dashboard
- [ ] 自動化測試套件

---

**項目**: GCP SMS 向量噴射系統  
**版本**: v1.0.0  
**更新**: 2025-11-26  
**團隊**: DeepWeay SMS
