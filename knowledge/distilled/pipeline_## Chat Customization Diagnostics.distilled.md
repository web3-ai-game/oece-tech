---
source: pipeline_## Chat Customization Diagnostics.md
distilled_at: 2026-02-14T09:32:24.164Z
model: grok-4-1-fast-non-reasoning
---

# Chat Customization Diagnostics 知識文檔

## 警告
**⚠️ 文件包含敏感信息**  
本文件記錄了 GitHub Copilot Chat 的自訂化配置診斷細節，包括檔案路徑、擴展資訊及使用者資料來源。請確保在存取或分享時遵守隱私與安全規範，避免暴露系統特定路徑或使用者資料。

## 概述
GitHub Copilot Chat 支援高度自訂化功能，透過專屬目錄載入 **Custom Agents**、**Instructions**、**Prompt Files** 及 **Skills**，以優化聊天互動體驗。這些配置通常位於專案的 `.github` 目錄或使用者全域儲存空間中。本診斷文件基於系統掃描結果，總結載入的檔案數量、位置、資料來源及相關擴展版本。這些設定允許開發者注入自訂邏輯、提示模板及技能，提升 Copilot 的規劃、初始化及工作流程自動化能力。

## Custom Agents
Custom Agents 是 Copilot Chat 的核心自訂組件，用於定義代理行為，如規劃任務或自動化工作流程。

| 屬性          | 細節                                                                 |
|---------------|----------------------------------------------------------------------|
| **載入檔案數** | 1 個                                                                |
| **位置**      | `.github/agents`                                                    |
| **資料來源**  | User Data                                                           |
| **擴展**      | GitHub.copilot-chat                                                 |
| **檔案**      | `Plan.agent.md`<br>完整路徑：`.vscode-server/data/User/globalStorage/github.copilot-chat/plan-agent/Plan.agent.md` |

**脈絡說明**：  
`Plan.agent.md` 專注於任務規劃代理，位於使用者全域儲存空間的 Copilot Chat 子目錄中。這允許 Copilot 在聊天中自動生成計劃、步驟分解或專案藍圖。

## Instructions
Instructions 提供全域指導原則，影響 Copilot 的回應風格與行為規範。

| 屬性          | 細節                                                                 |
|---------------|----------------------------------------------------------------------|
| **載入檔案數** | 1 個                                                                |
| **位置**      | `.github/instructions`                                              |
| **檔案**      | `copilot-instructions.md`<br>完整路徑：`.github/copilot-instructions.md` |

**脈絡說明**：  
此檔案定義 Copilot 的行為準則，例如回應格式、語言偏好或特定工作流程。置於專案根目錄的 `.github` 下，確保團隊一致性。

## Prompt Files
Prompt Files 是預定義的提示模板，用於標準化常見任務，如初始化專案或儲存提示。

| 屬性          | 細節                                                                 |
|---------------|----------------------------------------------------------------------|
| **載入檔案數** | 3 個                                                                |
| **位置**      | `.github/prompts`                                                   |
| **資料來源**  | User Data                                                           |
| **擴展**      | GitHub.copilot-chat (版本 0.37.5)                                   |
| **檔案**      | - `savePrompt.prompt.md`<br>路徑：`.vscode-server/extensions/github.copilot-chat-0.37.5/assets/prompts/savePrompt.prompt.md`<br>- `plan.prompt.md`<br>路徑：`.vscode-server/extensions/github.copilot-chat-0.37.5/assets/prompts/plan.prompt.md`<br>- `init.prompt.md`<br>路徑：`.vscode-server/extensions/github.copilot-chat-0.37.5/assets/prompts/init.prompt.md` |

**脈絡說明**：  
這些提示檔案來自 Copilot Chat 擴展的內建資產目錄（版本 0.37.5），支援：
- **savePrompt**：儲存自訂提示。
- **plan**：生成專案計劃。
- **init**：專案初始化。  
載入至 `.github/prompts` 以自訂專案特定模板。

## Skills
Skills 擴展 Copilot 的功能模組，可來自多個來源目錄，支持模組化技能載入。

| 位置                  | 描述                          |
|-----------------------|-------------------------------|
| `.github/skills`     | 專案層級技能                  |
| `.agents/skills`     | 代理相關技能                  |
| `.claude/skills`     | Claude 整合技能（若適用）     |
| `~/.copilot/skills`  | 使用者全域技能目錄            |

**脈絡說明**：  
Skills 允許注入自訂工具、腳本或 API 整合，按優先順序從專案目錄到全域目錄載入。這支援跨代理（如 Claude 或 Copilot）的技能共享，提升聊天診斷與自動化能力。

## 診斷建議
- **驗證配置**：檢查 `.vscode-server` 路徑是否正確同步（常見於遠端開發環境如 GitHub Codespaces）。
- **更新擴展**：確保 GitHub.copilot-chat ≥ 0.37.5 以支援最新提示資產。
- **安全性**：避免將敏感路徑提交至公開儲存庫；使用 `.gitignore` 排除 `globalStorage` 資料。
- **疑難排解**：若載入失敗，確認 `.github` 目錄權限及 User Data 同步狀態。

此文檔基於提供的診斷事實生成，旨在提供完整參考。如需調整配置，請參考 [GitHub Copilot Chat 文件](https://docs.github.com/en/copilot)。