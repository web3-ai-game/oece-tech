# Dual Bot Architecture v2.0

## 🎭 Bot 分工

### BongBong (@qitiandashengqianqian_bot) - 主聊天 Bot
**定位**: 靠譜、穩重、母親信任的主要對話夥伴

| 功能 | 狀態 | 說明 |
|------|------|------|
| 💬 聊天 | ✅ | 日常對話、情感支持 |
| 📝 筆記 | ✅ | 完整繼承筆記功能 |
| 🌿 養生 | ✅ | 健康建議、中醫知識 |
| 📰 新聞 | ✅ | Gemini+Grok 輿論對比 |
| 🎨 創作 | ✅ | 寫作助手、故事續寫 |

### Admin Bot (@svs_notion_bot) - 管理/生成 Bot
**定位**: 分擔工作、處理生成任務、遊戲娛樂

| 功能 | 狀態 | 說明 |
|------|------|------|
| 🛂 簽證 | ✅ | 簽證政策查詢 |
| 🧠 腦力 | ✅ | 腦筋急轉彎、記憶訓練 |
| 🎮 遊戲 | 🔨 | 數獨、五子棋、成語接龍 |
| 🖼️ 圖片 | ✅ | AI 圖片生成 |
| 🎬 視頻 | ✅ | AI 視頻生成 |
| 🔮 真實之眼 | ✅ | 多模型交叉驗證 |

---

## 📋 菜單系統 (無關鍵詞觸發)

所有功能通過菜單按鈕觸發，不再使用關鍵詞：

```
BongBong 主菜單:
┌─────────────────────────────────────┐
│ 💬 聊天 │ 📝 筆記 │ 🌿 養生 │
├─────────────────────────────────────┤
│ 📰 新聞 │ 🎨 創作 │ ⚙️ 設置 │
└─────────────────────────────────────┘

Admin 主菜單:
┌─────────────────────────────────────┐
│ 🛂 簽證 │ 🧠 腦力 │ 🎮 遊戲 │
├─────────────────────────────────────┤
│ 🖼️ 圖片 │ 🎬 視頻 │ 🔮 真實之眼 │
└─────────────────────────────────────┘
```

---

## ⏰ 閒置自動分析 (1小時無活動)

當群組 1 小時無活動時，兩個 Bot 會自動執行：

### 分析流程
```
1. 檢測到 1 小時無活動
2. 獲取最近對話記錄
3. 兩個 Bot 各自分析 (最便宜模型)
   - BongBong: Gemini 2.0 Flash Lite
   - Admin: Grok 3 Mini
4. 各自生成 1-2 輪總結
5. 向量化存入記憶
6. 靜默執行，不發送消息
```

### 模型選擇 (最便宜)
| Bot | 模型 | 用途 |
|-----|------|------|
| BongBong | gemini-2.0-flash-lite | 語意分析、總結 |
| Admin | grok-3-mini | 輿論分析、補充 |

---

## 📰 新聞功能 (Gemini + Grok 對比)

### 流程
```
1. 用戶點擊「📰 新聞」按鈕
2. 並行調用:
   - Gemini 2.5 Flash Lite: 20 條新聞摘要
   - Grok 3 Mini: 20 條輿論觀點
3. 合併對比輸出長文
4. 分段發送 (避免消息過長)
```

### 輸出格式
```
📰 每日新聞 + 輿論對比 | 2025-12-07

━━━ 📍 大陸政治 ━━━
📰 新聞: [標題]
🗣️ 輿論: [網友觀點]
⚖️ 對比: [差異分析]

(重複 20 條...)
```

---

## 🔄 PM2 守護進程

### ecosystem.config.cjs
```javascript
module.exports = {
  apps: [
    {
      name: 'bongbong-bot',
      script: 'src/index.js',
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      },
      error_file: 'logs/bot-error.log',
      out_file: 'logs/bot-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 5000,
      max_restarts: 10
    }
  ]
};
```

---

## 🗄️ 資源估算

### 記憶體使用
- BongBong Bot: ~150MB
- Admin Bot: ~100MB
- MongoDB 連接: ~50MB
- 緩存: ~50MB
- **總計**: ~350-400MB (8GB VPS 足夠)

### API 調用估算 (每日)
| 模型 | 調用次數 | 用途 |
|------|----------|------|
| Gemini 2.5 Pro | 10-20 | 創作、深度分析 |
| Gemini 2.5 Flash | 50-100 | 一般對話 |
| Gemini 2.0 Flash Lite | 100-200 | 閒置分析、新聞 |
| Grok 3 Mini | 50-100 | 輿論、閒置分析 |

---

## 📁 文件結構

```
src/
├── services/
│   ├── dualBotService.js      # 雙 Bot 協調
│   ├── bongbongService.js     # BongBong 核心 (NEW)
│   ├── adminBotService.js     # Admin Bot 核心 (RENAMED)
│   ├── idleAnalysisService.js # 閒置分析 (NEW)
│   ├── newsCompareService.js  # 新聞對比 (NEW)
│   ├── notebookService.js     # 筆記服務
│   ├── creativeService.js     # 創作服務
│   ├── visaService.js         # 簽證服務
│   └── ...
├── config/
│   ├── menus/
│   │   ├── bongbongMenus.js   # BongBong 菜單
│   │   └── adminMenus.js      # Admin 菜單
│   └── ...
└── ...
```
