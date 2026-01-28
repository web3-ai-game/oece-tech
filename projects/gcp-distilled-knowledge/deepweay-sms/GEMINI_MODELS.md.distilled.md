作為技術文檔蒸餾與擴寫專家，針對您提供的文檔，輸出如下：

---

### 1. 極精簡的一段摘要

此文檔概述 Gemini 模型官方 API 檢測結果，詳細列出 Gemini 3 Pro、2.5 Pro/Flash 等各版本模型的正確調用名稱與用途。重點強調 Gemini 3 Pro 的可用性、速率限制及成本，並針對數據清洗、高速處理及客服場景提供具體模型推薦策略。

### 2. 條列式關鍵要點

*   **Gemini 3 Pro 正確調用名稱**：`gemini-3-pro-preview` 是最新主力模型，而非 `gemini-3-pro`，主要用於數據清洗和圖像生成。
*   **Gemini 3 Pro 可用性與限制**：已在 Paid Tier 1 可用，速率限制為 25 RPM、1M TPM、250 RPD，成本與 Gemini 2.5 Pro 相同。
*   **推薦使用策略**：
    *   數據清洗等關鍵任務：使用 `gemini-3-pro-preview`。
    *   高速處理大量任務：推薦 `gemini-2.5-flash`。
    *   免費層客服陣列：選用 `gemini-2.5-flash-lite`。
*   **模型版本豐富**：Gemini 2.5 Pro/Flash 及 2.0 Pro/Flash 系列提供多種穩定版、預覽版、輕量版及實驗版模型，以應對不同需求。
*   **API 測試範例**：文檔提供 `curl` 命令範例，方便快速測試 `gemini-3-pro-preview` 的調用。

### 3. 可執行建議

1.  **優先驗證並採用 `gemini-3-pro-preview`**：針對需要高精度數據清洗或架構設計的關鍵業務，立即更新 API 調用名稱為 `gemini-3-pro-preview`，並參考文檔中的測試命令進行驗證，確保模型能正確啟用。
2.  **根據任務特性優化模型選擇**：審視現有或規劃中的 AI 應用場景，將數據清洗、高速批量處理和免費層客服等任務，分別對應到 `gemini-3-pro-preview`、`gemini-2.5-flash` 和 `gemini-2.5-flash-lite`，以實現性能與成本的最佳平衡。
3.  **監控 Gemini 3 Pro 的速率與成本效益**：密切關注 `gemini-3-pro-preview` 的 API 使用量，確保不超出 25 RPM 和 1M TPM 的速率限制。同時，由於其成本與 2.5 Pro 相同，應評估其在特定任務上的實際效益，為未來的模型選型和預算規劃提供數據支持。