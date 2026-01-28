作為技術文檔蒸餾與擴寫專家，我為您整理如下：

---

### 1. 極精簡的一段摘要

本手冊詳盡指導如何創建 Slack App 並獲取 Bot Token，以在 Slack 工作區實現消息發送、事件接收及互動應用。內容涵蓋從應用創建、權限配置、安裝、獲取 `xoxb-` 開頭的 Bot Token，到測試、邀請 Bot 及安全存儲等關鍵步驟，確保您能順利啟用 Slack Bot 功能。

### 2. 條列式關鍵要點

*   **核心流程：** 創建 Slack App，選擇 "From scratch"，填寫基本信息。
*   **權限配置：** 在 "OAuth & Permissions" 中添加 Bot Token Scopes，如 `chat:write` (發送消息) 和 `channels:read` (讀取頻道) 是基礎。
*   **獲取 Token：** 安裝應用至工作區後，在 "OAuth & Permissions" 頁面獲取 `xoxb-` 開頭的 Bot User OAuth Token。
*   **Bot 邀請：** Bot 需被明確邀請至頻道（例如 `/invite @bot_name`）才能讀取或發送消息。
*   **安全存儲：** 將 Bot Token 安全地保存為環境變量或使用秘密管理工具，避免硬編碼。
*   **進階功能：** 可配置事件訂閱以接收消息和響應互動，或使用 Webhook 進行單向通知。
*   **問題排查：** 留意 `channel_not_found` (未邀請 Bot) 和 `invalid_auth` (Token 錯誤) 等常見問題。

### 3. 可執行建議

1.  **實施最小權限原則：** 在配置 Bot Token Scopes 時，僅授予 Bot 完成其功能所需的最小權限（例如，僅發送消息的 Bot 只需 `chat:write`）。避免授予過多不必要的權限，以降低潛在安全風險。
2.  **區分開發與生產環境：** 為不同環境（開發、測試、生產）創建獨立的 Slack App 和 Bot。這有助於隔離各環境的配置和數據，避免在生產環境中意外觸發測試行為，並簡化問題排查。
3.  **優先考慮 Token 安全存儲：** 務必將獲取的 Bot Token 存儲在環境變量、秘密管理服務（如 Doppler）中，或使用其他安全的配置方式。嚴禁將 Token 硬編碼在代碼中或明文存儲在版本控制系統中。

---