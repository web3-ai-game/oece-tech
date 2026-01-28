# 🌊 Windsurf 接手開發指南

## 🎯 項目概覽

**項目名稱**: GCP SMS 向量噴射系統  
**核心功能**: 雙群聊定時噴射 + 向量切割 + Debug迭代  
**技術棧**: Node.js + Express + Gemini API + PM2  

---

## 🚀 快速啟動

### 1. 環境準備

```bash
# 進入項目目錄
cd /home/svs-main-key/GCP

# 安裝依賴
npm install

# 配置環境變量
cp config/.env.vector-jet.template config/.env.vector-jet
nano config/.env.vector-jet
```

### 2. 配置 Gemini Keys

編輯 `.env.vector-jet`:
```bash
# 免費Key（日常開發）
GEMINI_FREE_KEY=your_free_key_here
GEMINI_FREE_MODEL=gemini-2.5-flash-lite

# 收費Keys（定時噴射）
GEMINI_PRO_30=your_paid_key_1
GEMINI_PRO_31=your_paid_key_2
GEMINI_PRO_32=your_paid_key_3
GEMINI_PRO_33=your_paid_key_4

# Token限制
MAX_TOKENS_PER_KEY=30000
```

### 3. 啟動服務

```bash
# 方式1: 單次執行（測試）
node core/dual-chat-jet-system.js

# 方式2: PM2守護進程（生產）
pm2 start core/config/ecosystem.dual-jet.json

# 方式3: 定時任務（Cron）
crontab config/crontab-dual-jet.txt
```

---

## 📂 項目結構

```
/home/svs-main-key/GCP/
├── 📂 core/                    # 核心服務
│   ├── server.js              # API服務器
│   ├── dual-chat-jet-system.js # 雙群聊噴射系統 ⭐
│   └── config/
│       └── ecosystem.dual-jet.json
│
├── 📂 scripts/                # 自動化腳本
│   ├── setup/                 # 部署腳本
│   ├── monitoring/            # 監控腳本
│   └── keys/                  # Key驗證
│
├── 📂 docs/                   # 文檔
│   ├── guides/                # 使用指南
│   ├── reports/               # 測試報告
│   └── architecture/          # 架構文檔
│
├── 📂 projects/               # 子項目
│   ├── deepweay-sms/
│   ├── notion-sms/
│   └── ...
│
└── 📂 logs/                   # 日誌文件
```

---

## 🔥 核心功能說明

### 1. 雙群聊噴射系統

**文件**: `core/dual-chat-jet-system.js`

**功能**:
- ✅ 每小時自動執行
- ✅ 4個收費Key並發調用
- ✅ 每個Key限制30000 token
- ✅ 噴射持續3分鐘
- ✅ 向量0.1精度切割

**使用**:
```bash
# 單次執行
node core/dual-chat-jet-system.js

# 守護進程（每小時自動執行）
node core/dual-chat-jet-system.js --daemon

# 生成報告
node core/dual-chat-jet-system.js --report
```

### 2. 向量精度切割

**核心邏輯**:
```javascript
function vectorPrecisionCut(context, precision = 0.1) {
  // 將內容以0.1精度切割
  // 每個片段獨立處理
  // 實現細緻的Debug分析
}
```

**特性**:
- 🎯 0.1精度 = 10%切割
- 🧩 並發處理多個片段
- 🔄 迭代優化上下文
- 🐛 Debug模式分析

### 3. Token控制策略

**限制機制**:
```javascript
MAX_TOKENS_PER_KEY: 30000  // 每個key上限
JET_DURATION: 180000       // 噴射3分鐘
VECTOR_PRECISION: 0.1      // 向量精度
```

**監控**:
- 實時統計token使用量
- 達到限制自動停止
- 生成使用率報告

---

## 🛠️ 開發工作流

### 日常開發

```bash
# 1. 拉取最新代碼
git pull origin main

# 2. 修改代碼
nano core/dual-chat-jet-system.js

# 3. 測試運行
node core/dual-chat-jet-system.js

# 4. 查看日誌
tail -f logs/dual-jet-out.log

# 5. 提交代碼
git add .
git commit -m "feat: 優化向量切割邏輯"
git push origin main
```

### 部署流程

```bash
# 1. 停止現有服務
pm2 stop dual-chat-jet-daemon

# 2. 拉取代碼
git pull

# 3. 重啟服務
pm2 restart dual-chat-jet-daemon

# 4. 檢查狀態
pm2 status
pm2 logs dual-chat-jet-daemon
```

---

## 📊 監控和日誌

### PM2 監控

```bash
# 查看所有服務狀態
pm2 status

# 查看實時日誌
pm2 logs dual-chat-jet-daemon

# 查看詳細信息
pm2 show dual-chat-jet-daemon

# 監控面板
pm2 monit
```

### 日誌文件

```bash
# 噴射日誌
tail -f logs/dual-jet-out.log

# 錯誤日誌
tail -f logs/dual-jet-error.log

# Cron日誌
tail -f logs/cron-dual-jet.log

# 統計報告
cat logs/dual-chat-jet-report.md
```

### 查看統計

```bash
# 生成最新報告
node core/dual-chat-jet-system.js --report

# 查看報告
cat logs/dual-chat-jet-report.md
```

---

## 🔧 常見問題

### Q1: Key不夠用怎麼辦？

**答**: 在 `dual-chat-jet-system.js` 中添加更多key:

```javascript
PAID_KEYS: [
  process.env.GEMINI_PRO_30,
  process.env.GEMINI_PRO_31,
  process.env.GEMINI_PRO_32,
  process.env.GEMINI_PRO_33,
  process.env.GEMINI_PRO_34,  // 新增
  process.env.GEMINI_PRO_35,  // 新增
]
```

### Q2: 如何調整噴射時長？

**答**: 修改配置:

```javascript
JET_DURATION: 300000,  // 改成5分鐘（300秒）
```

### Q3: 如何調整token限制？

**答**: 修改配置:

```javascript
MAX_TOKENS_PER_KEY: 50000,  // 改成5萬token
```

### Q4: 如何調整執行頻率？

**答**: 修改crontab:

```bash
# 編輯
crontab -e

# 改成每30分鐘執行一次
*/30 * * * * cd /home/svs-main-key/GCP && node core/dual-chat-jet-system.js

# 或改成每2小時執行一次
0 */2 * * * cd /home/svs-main-key/GCP && node core/dual-chat-jet-system.js
```

---

## 🎨 Windsurf 最佳實踐

### 1. 使用 Cascade 模式

Windsurf的Cascade模式特別適合：
- 📝 批量修改代碼
- 🔄 重構大型文件
- 🐛 Debug複雜問題
- 📊 生成文檔

### 2. 快捷命令塊

在 Windsurf 中可以使用：

```
@workspace 分析雙群聊噴射系統的性能瓶頸
@workspace 優化向量切割算法
@workspace 添加新的debug策略
```

### 3. 上下文管理

```
@file core/dual-chat-jet-system.js 解釋噴射邏輯
@folder docs/ 生成API文檔
@terminal 查看當前運行狀態
```

---

## 📈 性能優化建議

### 1. 並發優化

```javascript
// 使用Promise.all並發調用
const results = await Promise.all(
  CONFIG.PAID_KEYS.map((_, idx) => jetWithKey(prompt, idx))
);
```

### 2. 錯誤處理

```javascript
try {
  const result = await jetWithKey(prompt, idx);
} catch (error) {
  // 記錄錯誤但繼續執行
  console.error(`Key ${idx} failed:`, error);
  stats.keyUsage[`key_${idx}`].errors += 1;
}
```

### 3. 內存管理

```javascript
// 定期清理統計數據
if (stats.totalRounds > 1000) {
  stats.totalRounds = 0;
  stats.totalTokens = 0;
}
```

---

## 🔐 安全注意事項

1. **Key管理**: 
   - ❌ 不要提交key到Git
   - ✅ 使用環境變量
   - ✅ 定期輪換key

2. **日誌安全**:
   - ❌ 不要記錄完整key
   - ✅ 只記錄key前4位
   - ✅ 定期清理舊日誌

3. **Token限制**:
   - ✅ 嚴格控制每個key的用量
   - ✅ 監控異常消耗
   - ✅ 設置預算警報

---

## 📞 支持和聯繫

- **文檔**: `/home/svs-main-key/GCP/docs/`
- **問題跟蹤**: GitHub Issues
- **開發團隊**: DeepWeay SMS Team

---

## 🎯 下一步計劃

- [ ] 添加群聊消息接口
- [ ] 集成Telegram Bot
- [ ] 實現向量數據庫存儲
- [ ] 優化Debug策略
- [ ] 添加Web控制面板
- [ ] 實現自動化測試

---

**最後更新**: 2025-11-26  
**版本**: v1.0.0  
**維護者**: Windsurf AI Team
