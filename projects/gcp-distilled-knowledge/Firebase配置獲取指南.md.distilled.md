好的，這是一份針對您提供的 Firebase 配置文檔的蒸餾與擴寫結果：

---

### 1. 極精簡的一段摘要

本文檔詳述兩種獲取 Firebase 配置的方法：CLI（推薦）與 Console。它展示了配置的 JavaScript 及環境變量格式，列出 Spark Plan 免費額度，並指導如何快速啟用 Firebase 項目。

### 2. 條列式關鍵要點

*   **配置獲取方式多樣**：可透過 Firebase CLI 的 `firebase apps:sdkconfig WEB` 命令（推薦），或經由 Firebase Console 項目設定手動複製 Web App 配置。
*   **配置格式標準化**：獲取的配置為 JavaScript 對象格式，應轉換為 `.env.local` 等環境變量形式，以便安全地在應用中使用。
*   **免費層服務豐富**：Firebase Spark Plan (免費層) 提供 Authentication、Firestore、Cloud Storage、Hosting 和 Cloud Functions 等核心服務的慷慨額度。
*   **項目快速初始化**：使用 `firebase init` 命令可引導式地初始化 Firebase 項目，並選擇啟用 Firestore、Authentication、Hosting 等服務。
*   **GCP 整合啟用**：若無現有 Firebase 項目，可直接在 GCP Console 中啟用 Firebase 服務。

### 3. 可執行建議

1.  **優先使用 CLI 進行配置管理**：在開發工作流程中，建議將 Firebase CLI 整合到自動化腳本或 CI/CD 流程中，以程式化方式獲取和更新配置，減少手動錯誤並提高效率。
2.  **嚴格遵循環境變量規範**：所有 Firebase 相關的敏感配置（如 `apiKey`）都應以環境變量形式（例如存儲在 `.env.local` 或 CI/CD 環境變量中）管理，絕不應硬編碼到版本控制的代碼中，以確保安全性。
3.  **監控並規劃免費額度使用**：在項目開發初期，應詳細了解 Firebase Spark Plan 的免費額度限制，並定期監控各服務的使用情況，避免因超出免費額度而產生不必要的費用。若預期流量較大，應及早規劃升級至 Blaze Plan。