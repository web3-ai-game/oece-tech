# 🏆 數字資產蒸餾系統 2.0 - Digital Gold Distiller

> **極速蒸餾珍貴的數字黃金 | Powered by Gemini 2.5 Pro**

## 💎 什麼是數字資產蒸餾？

將散落在 26 個 GitHub 倉庫中的 444 個文檔（數字黃金）通過 AI 深度思考提煉為高價值知識資產。

### 🔥 核心特性

- **4階段蒸餾流程**：去重 → 提取 → 邏輯分析 → 創意擴展
- **溫度控制策略**：
  - 0.5 (普通) - 去重分析
  - 0.2 (低溫) - 精確內容提取
  - 0.1 (極低溫) - 邏輯流程分析
  - 1.2 (高溫) - 創意想像力擴展
- **3容器並發架構**：每容器獨立 API，3 倍速蒸餾
- **PM2 實時監控**：泰銖計價 + $10 USD 熔斷保護
- **斷點續傳**：checkpoint 系統，成本超標自動暫停

## 📊 項目統計

```
📁 源數據：26 個 GitHub 倉庫
📄 文檔總數：444 個 (已去重至 507 個)
💰 預算限制：$10 USD (฿355 THB)
🧵 並發數：3 個容器
📈 萬token價格：฿177.50 THB (Gemini 2.5 Pro)
```

## 🚀 快速開始

### 方式 1: 一鍵啟動 (推薦)

```bash
# 克隆項目
git clone https://github.com/web3-ai-game/kill-old.git
cd kill-old

# 啟動 3 容器蒸餾系統
./deploy.sh

# PM2 監控
pm2 logs distiller
```

### 方式 2: 手動啟動

```bash
# 安裝依賴
pip3 install google-generativeai python-dotenv

# 配置 API keys
export GEMINI_PAID_KEY_1="your-key-1"
export GEMINI_PAID_KEY_2="your-key-2"
export GEMINI_PAID_KEY_3="your-key-3"

# 啟動單容器蒸餾
python3 distiller_v2.py

# 啟動 PM2 監控
pm2 start ecosystem.config.js
pm2 monit
```

## 📂 項目結構

```
kill-old/
├── organized_docs/              # 507 個已去重文檔
│   ├── 01_readmes/              # 35 個 README
│   ├── 02_documentation/        # 436 個文檔
│   ├── 03_notes_and_misc/       # 34 個筆記
│   └── 04_licenses/             # 2 個許可證
├── distiller_v2.py              # 主蒸餾腳本 (Gemini 2.5 Pro)
├── ecosystem.config.js          # PM2 配置
├── deploy.sh                    # 一鍵部署腳本
├── checkpoint.json              # 斷點續傳數據
└── distilled_results/           # 蒸餾結果輸出
    ├── stage1_dedup.json        # 階段1: 去重
    ├── stage2_extract.json      # 階段2: 提取
    ├── stage3_logic.json        # 階段3: 邏輯
    └── stage4_creative.json     # 階段4: 創意
```

## 🔧 配置說明

### API Keys 配置

在 `.env` 文件中配置收費 Gemini keys：

```bash
# Gemini 2.5 Pro 收費 Keys
GEMINI_PAID_KEY_1=AIzaSyA3ikY04T94AoAwndr20QxV9nl4w_NF_u4
GEMINI_PAID_KEY_2=AIzaSyAj08QZ4B8CMU_CTG-QtGUEv0gBHZbM_cQ
GEMINI_PAID_KEY_3=AQ.Ab8RN6LioS7k0Ipycl6oKXFuhww6VTXuosXwgeS8VMpTyZUFcw
```

### PM2 監控配置

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'distiller-1',
      script: 'distiller_v2.py',
      interpreter: 'python3',
      env: { API_KEY_INDEX: 0 }
    },
    {
      name: 'distiller-2',
      script: 'distiller_v2.py',
      interpreter: 'python3',
      env: { API_KEY_INDEX: 1 }
    },
    {
      name: 'distiller-3',
      script: 'distiller_v2.py',
      interpreter: 'python3',
      env: { API_KEY_INDEX: 2 }
    },
    {
      name: 'monitor',
      script: 'pm2-monitor.js',
      interpreter: 'node'
    }
  ]
};
```

## 💰 成本控制

- **自動熔斷**：成本達到 $10 USD 時自動停止
- **實時監控**：每 2 秒更新 token 消耗和成本
- **泰銖計價**：本地化價格顯示 (1 USD = 35.5 THB)
- **檢查點保存**：每處理 5 個文檔自動保存進度

## 📈 實時監控

```
╔══════════════════════════════════════════════════════╗
║      🧪 智能蒸餾監控 - PM2 Dashboard (泰銖本位)       ║
╠══════════════════════════════════════════════════════╣
║  📊 進度: 127/444 (28.6%)
║  ⏱️  運行: 1856s
╠══════════════════════════════════════════════════════╣
║  💰 Token 消耗 (泰銖本位)
║     輸入:  50,800 tokens
║     輸出:  12,700 tokens
║     總計:  63,500 tokens
║
║     💵 成本: $2.8440 USD
║     💴 成本: ฿100.96 THB
║
║     📈 萬token價格: ฿177.50 THB
║     🟢 正常運行 (限制: $10 / ฿355)
╠══════════════════════════════════════════════════════╣
║  🖥️  VPS 資源
║     CPU:      12.3%
║     內存:     4567MB / 15991MB (28.5%)
║     容器:     3 個
╚══════════════════════════════════════════════════════╝
```

## 🎯 蒸餾策略

### 階段 1: 去重分析 (溫度 0.5)
```python
{
  "is_unique": true,
  "duplicate_of": "",
  "uniqueness_score": 8
}
```

### 階段 2: 內容提取 (溫度 0.2)
```python
{
  "core_concepts": ["API設計", "微服務架構"],
  "key_code": "genai.GenerativeModel(...)",
  "actionable_items": ["部署到 GCP", "配置 PM2"]
}
```

### 階段 3: 邏輯分析 (溫度 0.1)
```python
{
  "logic_flow": ["用戶請求", "API路由", "模型調用", "響應返回"],
  "dependencies": ["python3", "google-generativeai"],
  "tech_stack": ["Python", "Node.js", "PM2"],
  "complexity": 7
}
```

### 階段 4: 創意擴展 (溫度 1.2)
```python
{
  "potential_uses": ["AI知識庫", "自動文檔生成"],
  "innovation_ideas": ["多語言蒸餾", "向量化檢索"],
  "metaphors": ["數字煉金術", "知識蒸餾器"]
}
```

## 🛠️ 技術棧

- **AI 模型**: Google Gemini 2.5 Pro
- **後端**: Python 3.12
- **監控**: PM2 + Node.js
- **並發**: ThreadPoolExecutor (3 workers)
- **容錯**: 斷點續傳 + 熔斷保護

## 📜 許可證

MIT License - 自由使用，保留署名

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📞 聯繫方式

- GitHub: [@web3-ai-game](https://github.com/web3-ai-game)
- 項目倉庫: [kill-old](https://github.com/web3-ai-game/kill-old)

---

**🏆 蒸餾你的數字黃金，釋放知識價值！**

Generated with Claude Code 💙
