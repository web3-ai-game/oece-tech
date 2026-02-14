---
source: github-repos-distill_markdown_gcp-distilled-knowledge_gcp_workspace_compare_tiers.md
distilled_at: 2026-02-14T09:18:58.355Z
model: grok-4-1-fast-non-reasoning
---

# Gemini API 速率限制指南

本文檔詳細說明 Google Gemini API 的速率限制（Rate Limits），包括免費層（Free Tier）和收費層（Paid Tier 1）的具體配額。這些限制基於 **RPM**（Requests Per Minute，每分鐘請求數）、**TPM**（Tokens Per Minute，每分鐘令牌數）和 **RPD**（Requests Per Day，每日請求數）。了解這些限制有助於開發者優化應用程式、避免配額超限，並選擇合適的模型。

速率限制是 API 提供者用來管理資源、確保服務穩定性的標準機制。**RPM** 控制請求頻率，**TPM** 限制令牌處理量（輸入+輸出），**RPD** 則是每日總上限。超過限制會觸發錯誤（如 429 Too Many Requests），建議使用指數退避（Exponential Backoff）重試策略。

## 免費層 (Free Tier)
免費層適合測試、原型開發或低流量應用。模型性能較基礎，速率限制相對保守，適合輕量使用。

| 模型                  | RPM   | TPM    | RPD    | 備註          |
|-----------------------|-------|--------|--------|---------------|
| **gemini-2.5-flash-lite** | 15   | 250K  | 1K    | -             |
| **gemini-2.5-flash**     | 10   | 250K  | 250   | -             |
| **gemini-2.5-pro**       | 2    | 125K  | 50    | **超慢**（適合極低頻率任務） |
| **gemini-2.0-flash-lite**| 30   | 1M    | 200   | 免費層最快選項 |

**使用建議**：從 `gemini-2.0-flash-lite` 開始測試，提供較高 TPM 適合中等令牌量任務。每日上限低，需監控使用量。

## 收費層 (Paid Tier 1)
收費層需付費 API 金鑰，解鎖高性能模型和大幅提升的配額。適合生產環境、高流量應用或需要低延遲的場景。計費基於令牌使用量（詳見 Google AI Studio 定價）。

| 模型                     | RPM    | TPM    | RPD     | 備註          |
|--------------------------|--------|--------|---------|---------------|
| **gemini-3-pro-preview** | 25    | 1M    | 250    | **主力**（平衡性能與成本） |
| **gemini-2.5-pro**       | 150   | 2M    | 10K    | **強力**（高吞吐量任務）   |
| **gemini-2.0-flash-lite**| 4K    | 4M    | ∞      | **超高速**（無每日上限，極致延遲敏感） |

**使用建議**：主力模型 `gemini-3-pro-preview` 適合大多數生產應用；`gemini-2.0-flash-lite` 適用即時聊天或高併發場景，其 4K RPM 遠超免費層。

## 核心結論與比較
- **收費層比免費層快 75 倍**：這基於關鍵指標比較，例如 RPM（最高 4K vs. 30，提升 ~133 倍）、TPM（最高 4M vs. 1M，提升 4 倍）和 RPD（∞ vs. 1K）。實際加速取決於模型選擇，但整體吞吐量大幅提升，適合規模化部署。
- **升級效益**：免費層每日上限嚴格（最高 1K RPD），收費層提供近乎無限擴展（∞ RPD），並支援更高智慧模型如 `gemini-3-pro-preview`。
- **最佳實踐**：
  - 監控 [Google AI Studio 儀表板](https://aistudio.google.com/app/apikey) 使用量。
  - 批量請求（Batching）可最���化 TPM 效率。
  - 免費層用於 POC，生產切換收費層。
  - 更高配額需聯繫 Google 申請 Tier 2+。

**注意**：配額可能隨 Google 更新變動，請參考[官方文件](https://ai.google.dev/gemini-api/docs/rate-limits)確認最新資訊。這些限制適用於單一專案/金鑰，多專案可平行擴展容量。