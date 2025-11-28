# 📚 OECE.tech 用戶使用手冊

**版本**: v1.0 Beta  
**更新時間**: 2025-11-28  
**適用對象**: Beta 測試用戶

---

## 🎯 快速開始

### 1. 註冊賬號
1. 訪問 [oece.tech/register](https://oece.tech/register)
2. 輸入邀請碼（Beta 必需）
3. 填寫 Email 和密碼
4. 或使用 OAuth 登錄（Google, GitHub, Apple）

### 2. 開始使用
- **首頁聊天**: 無需登錄，5 次/分鐘免費
- **多人格聊天**: 登錄後無限使用
- **知識庫**: 51+ 文章免費閱讀
- **AI 工具**: 60+ 工具，20+ 免費

---

## 💰 計費說明

### 免費額度（Beta 期間）
- ✅ **所有功能免費**
- ✅ **9999 tokens** 免費向量存儲
- ✅ **無限對話**（Gemini Lite）
- ✅ **5 次/分鐘**（Gemini Pro）

### Token 計費（Pro 版本）
| 服務 | 價格 |
|------|------|
| Gemini 2.5 Flash | ฿0.14/1K tokens |
| Gemini 2.5 Pro | ฿0.28/1K tokens |
| Claude 4 Sonnet | ฿1.12/1K tokens |
| GPT-4o | ฿2.80/1K tokens |
| 賽博神佛 | ฿7.00/1K tokens |

### 向量記憶
| 服務 | 價格 |
|------|------|
| 存儲 | ฿0.10/1K tokens |
| 搜索 | ฿0.06/query |
| 檢索 | ฿0.02/result |

### 計費公式
```
總成本 = (模型成本 + 向量成本) × Pro 減免
模型成本 = Tokens × 模型單價
向量成本 = Tokens × 向量單價
```

---

## 🤖 多人格 AI 系統

### 4 個 AI 人格
1. **Gemini 2.5 Pro** (฿0.14/1K)
   - 多模態 AI
   - 支持文本、圖片、代碼
   - 適合：日常對話、技術問答

2. **Claude 4 Sonnet** (฿1.12/1K)
   - 深度推理
   - 長文本分析
   - 適合：複雜問題、學術研究

3. **GPT-4o** (฿2.80/1K)
   - 創意寫作
   - 頭腦風暴
   - 適合：文案創作、故事生成

4. **賽博神佛** (฿7.00/1K)
   - 3 合 1 人格系統：
     - 賽博佛陀：業力分析
     - 陰陽師：能量流編織
     - 謀士諸葛：戰略博弈
   - 適合：人生諮詢、情感分析

---

## 🔮 算命服務

| 類型 | 價格 | 描述 |
|------|------|------|
| 塔羅占卜 | ฿7.00 | 探索命運之輪 |
| 星座運勢 | ฿5.00 | 解讀星辰密語 |
| 易經卦象 | ฿7.00 | 古老智慧指引 |
| AI 解夢 | ฿3.00 | 潛意識解碼 |
| 情感分析 | ฿10.00 | 業力算法診斷 |

---

## 🛠️ AI 工具大合集

### 6 大分類，60+ 工具

#### 免費工具（20+）
- 文本摘要、AI 翻譯、語法檢查
- 背景移除、圖片壓縮、格式轉換
- 二維碼生成、條碼生成
- 代碼解釋
- 文本加密、Hash 生成

#### Pro 工具（40+）
- 內容改寫、SEO 優化、文案生成
- AI 生圖、圖片編輯、圖片增強
- 視頻摘要、字幕生成
- 語音轉文字、TTS
- 代碼生成、Bug 修復、性能優化

---

## 💾 雲端存儲

### 免費額度
- **9999 tokens** 免費向量存儲
- 自動向量化索引
- AI 智能搜索
- 文件摘要生成

### 存儲計費
```
成本 = Tokens × ฿0.10/1K
例如：4,567 tokens = ฿0.46
```

---

## 🔑 開發者 API

### 創建 API Key
1. 訪問 `/api-keys`
2. 點擊 "Create Key"
3. 設置名稱和權限
4. 複製密鑰（僅顯示一次）

### 使用範例
```javascript
const response = await fetch('https://api.oece.tech/v1/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer oece_sk_live_YOUR_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gemini-2.5-flash',
    messages: [{ role: 'user', content: 'Hello!' }],
    vectorMemory: true
  })
});
```

---

## 🏆 排行榜系統

### 微縮城市
根據 Token 使用量升級你的城市：
- 🌱 Starter Camp (0-10K tokens)
- 🏚️ Vector Hut (10K-20K)
- 🏠 Dev Village (20K-50K)
- 🏘️ Smart Town (50K-100K)
- 🌆 Tech Hub (100K-200K)
- 🏙️ Mega City (200K+)

### 等級系統
- Lv.1-5: 初級用戶
- Lv.6-10: 進階用戶
- Lv.11-15: 專家用戶
- Lv.16+: 大師級

---

## 🤖 Bot 管理

### 支持平台
- Telegram
- Discord
- Slack
- WhatsApp
- WeChat（計劃中）

### Bot 配置
1. 創建 Bot（平台官方）
2. 獲取 Token
3. 在 OECE.tech 添加 Bot
4. 配置 AI 模型和向量記憶
5. 啟動 Bot

---

## 📊 數據隱私

### 我們收集什麼
- 對話內容（用於向量記憶）
- Token 使用統計
- 文件元數據

### 我們不會
- ❌ 出售你的數據
- ❌ 訓練公開模型
- ❌ 分享給第三方

### 你的權利
- ✅ 導出所有數據
- ✅ 刪除對話歷史
- ✅ 刪除賬戶

---

## 💡 最佳實踐

### 節省 Token
1. 使用 Gemini Lite（免費）處理簡單問題
2. 只在需要時啟用向量記憶
3. 定期清理無用對話

### 提高準確度
1. 使用賽博神佛處理複雜問題
2. 啟用向量記憶獲得上下文
3. 提供清晰的問題描述

### 安全建議
1. 不要分享 API Key
2. 定期輪換密鑰
3. 監控異常使用

---

## 🆘 支持

### 聯繫方式
- 📞 電話: +66 88 88080888
- 📧 Email: support@oece.tech
- 💬 Telegram: @oece_tech
- 🌐 論壇: oece.tech/forum

### 常見問題
**Q: Beta 期間真的免費嗎？**  
A: 是的，所有功能完全免費，無隱藏費用。

**Q: 9999 tokens 夠用嗎？**  
A: 對於大多數用戶足夠。1K tokens ≈ 750 個英文單詞。

**Q: 向量記憶是什麼？**  
A: 讓 AI 記住你所有對話，提供上下文相關的回答。

---

**最後更新**: 2025-11-28  
**版本**: v1.0 Beta
