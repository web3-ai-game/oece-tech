這份文檔是 GCP 雲架構的密鑰主清單，旨在追蹤各項服務（如 Gemini、MongoDB、Supabase、Firebase 等）的 API 密鑰與 Token 狀態。它詳列了已配置、需驗證及待獲取的密鑰，並提供詳細的獲取步驟、配置腳本，以及使用 Doppler 進行安全集中管理的指南，確保開發與部署順暢。

### 條列式關鍵要點

1.  **全面密鑰狀態追蹤：** 文檔詳細列出多個雲服務（Gemini、MongoDB、Supabase、Firebase、OpenRouter、GitHub 等）的 API 密鑰狀態，包括已配置、需驗證及待獲取。
2.  **詳細密鑰獲取指南：** 為 MongoDB Atlas、Supabase、Firebase、OpenRouter 及 GitHub Token 等服務提供了具體的帳號創建、項目初始化及密鑰獲取步驟。
3.  **Doppler 集中密鑰管理：** 強調使用 Doppler 作為核心密鑰管理平台，提供登錄、設置、批量上傳及驗證密鑰的指南，確保密鑰的安全同步與使用。
4.  **快速配置與初始化：** 包含一鍵導出 `.env.local` 環境變量模板的腳本，以及 Firebase CLI 的安裝、登錄與項目初始化指南。
5.  **資源規劃與進度追蹤：** 對各服務的免費額度進行了對比，並提供詳細的配置完成清單，便於資源規劃和項目進度追蹤。

### 可執行