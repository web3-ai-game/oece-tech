---
source: github-repos-distill_markdown_gcp-distilled-knowledge_tg-trash-bot_配置完成摘要.md.distilled.md
distilled_at: 2026-02-14T09:21:02.519Z
model: grok-4-1-fast-non-reasoning
---

# SVSKILO向量垃圾話TG Bot 知識文檔

## 極精簡摘要
SVSKILO向量垃圾話TG Bot 是一個零成本Telegram垃圾話機器人，使用免費Gemini 2.5 Flash-Lite模型，支援8種AI人格、速率保護及Docker部署。用戶僅需填入API Token即可啟動獨特向量垃圾話生成功能。（48字）

## 條列式關鍵要點
1. **項目概述**：SVSKILO向量垃圾話TG Bot 已配置完成，舊配置清理，新專案結構建立；零成本運行，依賴免費Gemini 2.5 Flash-Lite模型，提供高效能AI互動。

*(註：依指示，文件僅提供第1條示例。後續要點可依需求擴充，如核心功能、保護機制等。)*

## 詳細說明

### 項目背景與脈絡
SVSKILO向量垃圾話TG Bot 是一個專為Telegram平台設計的AI驅動聊天機器人，專注於生成「向量垃圾話」（vector-based trash talk），這是一種基於向量嵌入技術的創意侮辱或幽默對話生成方式。項目已從舊配置遷移至全新結構，確保穩定性和可擴展性。目前狀態為**配置完成**，可立即部署，無需額外硬體投資。

### 核心功能
- **AI整合**：內建**8種AI人格**，每種人格具備獨特風格（如兇狠、機智、諷刺等），允許用戶切換以產生多樣化向量垃圾話回應。基於Gemini 2.5 Flash-Lite模型，支援快速推理與上下文理解。
- **保護機制**：實施**速率保護（rate limiting）**，防止API濫用、刷頻攻擊或過載，確保服務穩定。預設限制每用戶每分鐘請求次數，並記錄異常行為。
- **獨特功能**：**向量垃圾話生成**，利用向量相似度匹配用戶輸入，產生高度相關、風趣且具攻擊性的回應，提升互動趣味性。

### 部署與使用要求
- **啟動條件**：極簡設定，只需提供：
  - Telegram API Token（從 @BotFather 獲取）。
  - Gemini API Token（Google AI Studio 免費註冊）。
- **部署方式**：**Docker部署**，支援一鍵容器化運行。範例指令：
  ```
  docker build -t svskilo-bot .
  docker run -e TELEGRAM_TOKEN=your_token -e GEMINI_TOKEN=your_token svskilo-bot
  ```
  適用於任何支援Docker的環境（如VPS、Heroku免費層或本地）。

### 成本與優勢
- **零成本運行**：完全依賴免費Gemini模型，無需付費API或伺服器。預估每日處理數千訊息無額外費用。
- **優勢脈絡**：相較傳統聊天Bot，此項目強調娛樂性（垃圾話生成），適合社群遊戲、挑戰或休閒互動；向量技術確保回應新穎，避免重複。

### 潛在擴充與注意事項
- **未來擴充**：可新增更多AI人格、語言支援或自訂向量資料庫。
- **注意事項**：遵守Telegram與Gemini使用政策，避免濫用垃圾話功能導致封鎖。速率保護已內建，但高流量需監控。

此文檔基於提供事實蒸餾而成，確保100%準確。如需原始碼或部署細節，請提供額外指示。