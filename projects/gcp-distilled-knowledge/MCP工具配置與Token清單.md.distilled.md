作為技術文檔蒸餾與擴寫專家，我為您整理如下：

### 1. 極精簡的一段摘要 (不超過 80 字)

本文檔詳細闡述 Windsurf MCP 工具配置與 API Token 管理。它列出 Notion、Gemini 等服務的密鑰，並提出 Notion 和 Memory MCP 工具優化方案，將工具總數減少 55%。同時，文件也涵蓋了工具優先級、密鑰安全規則及快速設置指南，旨在提升 AI 助手效率與安全性。

### 2. 條列式關鍵要點 (3-7 條)

*   **API Token 清單：** 提供 Notion、Gemini、GitHub、MongoDB、Supabase、Doppler 及 OpenRouter 等多個服務的 API 密鑰。
*   **MCP 工具優化：** Notion 和 Memory MCP 工具數量經優化後減少 55%，僅保留常用功能，以減少 AI 選擇困難並提升響應速度。
*   **核心 MCP：** Sequential Thinking MCP 被視為最重要，必須保留，用於複雜問題的分步思考和推理。
*   **規則與安全：** 定義 Windsurf AI 助手工具優先級（Memory > Sequential Thinking > Notion）及嚴格的密鑰安全規則（優先使用 Doppler，禁止明文顯示）。
*   **配置指南：** 提供 Windsurf UI 中 Notion、Memory 和 Sequential Thinking MCP 服務器的具體配置步驟。
*   **Doppler 應用：** 推薦使用 Doppler 進行密鑰管理與服務運行，確保環境變量安全與配置一致性。
*   **部署清單：** 包含詳細的配置檢查清單，便於部署驗證和確保所有關鍵配置到位。

### 3. 可執行建議 (3 條)

1.  **立即實施 MCP 工具優化：** 根據文檔建議，精簡 Notion 和 Memory MCP 工具集，僅保留常用功能，以減少 AI 選擇困難並提高響應速度。這將直接提升 AI 助手的效率和決策準確性。
2.  **嚴格遵循密鑰安全與工具優先級規則：** 將 `rules.md` 中的工具優先級和密鑰安全規範（如優先使用 Doppler 管理密鑰，絕不在回覆中顯示密鑰）納入開發與部署流程，並進行定期審核，確保系統安全與穩定性。
3.  **利用 Doppler 進行標準化部署：** 採用文檔提供的 Doppler 命令來管理所有環境變量並運行服務，確保密鑰安全、配置一致性，並簡化新環境的設置流程。同時，將配置清單納入 CI/CD 流程，自動化驗證關鍵配置。