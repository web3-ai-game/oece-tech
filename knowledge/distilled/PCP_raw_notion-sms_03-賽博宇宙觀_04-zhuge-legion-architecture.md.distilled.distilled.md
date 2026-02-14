---
source: PCP_raw_notion-sms_03-賽博宇宙觀_04-zhuge-legion-architecture.md.distilled.md
distilled_at: 2026-02-14T09:36:12.275Z
model: grok-4-1-fast-non-reasoning
---

# 諸葛亮軍團系統知識文檔

## 系統概述

**諸葛亮軍團系統**（Zhuge Liang Legion System）是一個先進的AI決策支持平台，專為複雜決策場景設計。它利用多代理AI協作機制，生成基於**納什均衡**（Nash Equilibrium）的優化解決方案。納什均衡源自博弈論，指在多方參與的策略互動中，各方均無單方面改變策略的誘因，從而達到穩定平衡狀態。

系統模擬諸葛亮的「軍團」智慧集體，透過5個併發運行的AI Agent進行多角度推理，涵蓋理想化、攻擊性、現實性、創新變異及最終仲裁環節。適用於商業策略、風險評估、產品開發、投資決策等需要多維度考量的場景，幫助用戶避免單一視角的決策盲點。

### 核心功能：5個併發AI Agent推理流程
系統的核心是並行執行的5個AI Agent，每個負責特定角色，形成閉環決策管道：
1. **理想方案Agent**：生成無約束的完美解決方案，作為基準藍圖。
2. **紅隊攻擊Agent**：模擬對手或風險方，從弱點出發進行攻擊性測試，暴露潛在漏洞。
3. **現實評估Agent**：整合資源、時限、環境等實際因素，提供可行性評估。
4. **盲盒變異Agent**：引入隨機變異與創意「盲盒」元素，探索非顯性創新路徑。
5. **納什仲裁Agent**：綜合前4個輸出，計算納什均衡點，輸出最終穩定策略。

此流程確保決策不僅理想化，還具備魯棒性（robustness）和創新性，典型決策週期<30秒。

## 架構與技術棧

系統採用**混合AI模型架構**，結合本地高效推理與雲端高精度仲裁，實現零成本本地運算+低成本雲端增強：
- **本地核心**：Yi-6B INT8量化模型（基於Llama架構的中文優化變體），支援零成本併發推理。INT8量化將模型大小壓縮至~4GB，推理速度達本地GPU/CPU的數十Tokens/秒。
- **雲端仲裁**：Google Gemini 1.5 Pro API，處理最終納什均衡計算，提供高階語言理解與數學推理能力。
- **成本優化**：本地模型承擔95%工作負載，僅在仲裁階段調用API，**降低95%總成本**（相較純雲端方案）。

### 技術棧細節
| 組件 | 技術 | 功能 |
|------|------|------|
| **後端語言** | Go | 高併發、低延遲服務器，處理Agent協調與API調度。 |
| **本地推理引擎** | llama.cpp | 高效C++推理庫，支援多模型併發與GPU加速（Metal/ROCm/CUDA）。 |
| **數據緩存** | SQLite | 輕量級嵌入式資料庫，存儲歷史決策與中間結果，無需外部依賴。 |
| **向量搜索** | Qdrant Lite | 嵌入式向量資料庫，用於相似決策檢索與知識增強，提升Agent推理品質。 |

架構圖（概念）：
```
用戶輸入 → Go服務器 → 5x Yi-6B Agents (llama.cpp並發) → 向量檢索(Qdrant) + 緩存(SQLite) → Gemini API仲裁 → 納什均衡輸出
```

## 成本與經濟性

諸葛亮軍團系統極致注重成本控制，適合個人開發者、中小企業或研究者：
- **單次決策成本**：$0.02–$0.05（主要來自Gemini API調用；本地推理免費）。
- **月成本預計**：低於$30（假設每日100次決策，含API費用與潛在雲部署）。
- **比較基準**：相較純GPT-4o或Claude方案，成本降幅>90%，無需昂貴GPU硬體。

成本 Breakdown：
- 本地Yi-6B：$0（電費忽略不計）。
- Gemini 1.5 Pro：~0.01$/千Tokens（僅仲裁~1K Tokens）。
- 規模擴展：月10K次決策仍<10 USD。

## 部署方案

系統設計為輕量、可移植，支持多環境部署：
1. **Mac本地運行**（推薦入門）：
   - 先決條件：macOS + Apple Silicon (M1+) 或 Intel + Homebrew。
   - 安裝：`go run main.go` + 下載Yi-6B模型（~4GB）。
   - 優勢：即開即用，無網路依賴（除仲裁）。

2. **Docker容器化**：
   - Dockerfile一鍵構建，包含llama.cpp、Qdrant Lite與SQLite。
   - 運行：`docker run -p 8080:8080 zhuge-legion:latest`。
   - 支援x86/ARM，跨平台一致性。

3. **雲部署：GCP Cloud Run**（可選生產級）：
   - Serverless容器，自動擴展，按請求計費（月<5 USD）。
   - 部署命令：`gcloud run deploy zhuge-legion --source .`。
   - 整合GCP Secret Manager存儲API金鑰。

### 快速啟動指南
```
git clone <repo>
cd zhuge-legion
# 下載模型
./scripts/download-model.sh
# 配置Gemini API Key
export GEMINI_API_KEY=your_key
go run main.go
# API端點：curl -X POST http://localhost:8080/decide -d '{"query": "your decision problem"}'
```

## 優勢與應用案例
- **優勢**：低成本、高併發、納什均衡保證策略穩定性、本地隱私（無雲端洩漏中間推理）。
- **應用**：商業談判（預測對手反應）、產品迭代（紅隊測試）、投資組合優化（均衡風險/回報）。

此文檔基於提供事實編寫，未來版本可擴展基準測試與進階配置。聯繫開發者獲取源碼與更新。