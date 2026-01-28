## 1. 極精簡的一段摘要

本手冊旨在指導開發者，透過 Kilo Code CLI、GitHub Copilot 等多個 AI CLI 工具，構建高效的「AI 駕駛艙」。核心策略是利用三屏並發佈局和自動化工作流，實現多模型協同作業，涵蓋代碼生成、調試、架構設計等場景，以最大化開發效率和成本效益。

## 2. 條列式關鍵要點

*   **多 AI CLI 整合**：核心目標是利用 Kilo Code CLI、GitHub Copilot、Claude Code 和 Gemini CLI 等多個 AI 工具，實現多模型並發協作，最大化開發者生產力。
*   **「三屏並發」佈局**：推薦採用 VS Code 中 GitHub Copilot Chat (頂部)、Kilo Code (左上)、編輯器 (中間)、文檔/預覽 (右側) 和 Gemini CLI (左下) 搭配多個終端的佈局，形成高效工作流。
*   **Kilo Code 作為核心編排**：Kilo Code CLI 具備多模式（架構師、調試、編排等）、並發任務、管道處理及 CI/CD 集成能力，並可通過 `autoApproval` 配置實現高度自動化。
*   **模型選擇與成本優化**：根據任務類型（如提取、擴展、調試、架構設計），靈活選擇不同 AI 模型（Gemini Flash、Claude Sonnet/Opus 等）及溫度參數，以平衡成本與效果。
*   **高效工作流實戰**：提供文檔生成、調試、架構設計等具體實戰案例，展示如何結合不同 AI 工具的優勢