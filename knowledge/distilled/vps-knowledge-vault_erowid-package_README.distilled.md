---
source: vps-knowledge-vault_erowid-package_README.md
distilled_at: 2026-02-14T09:28:44.750Z
model: grok-4-1-fast-non-reasoning
---

# Erowid 知識蒸餾包 文檔

## 介紹

**Erowid 知識蒸餾包** 是 OECE（AI 知識蒸餾系統）專案的一部分，專門從 Erowid 資料庫中提取並蒸餾高價值知識。這份包涵蓋了 Erowid 網站的結構化內容，包括化學物質、植物、藥理學分類等，總計 1,683 個 URL 的完整索引。Erowid 是一個知名的公共資源庫，提供關於心靈活性物質（psychoactives）的教育性資訊，涵蓋劑量、安全性、效果與歷史脈絡。

此包設計用於 AI 模型訓練、知識檢索或研究應用，透過蒸餾引擎（Distill Engine）將原始網頁內容轉換為結構化、AI 友好的格式。

**生成時間**：2026-02-01  
**預計 API 成本**：~$1.10（使用 grok-4-1-fast-reasoning 模型）

## 內容結構

包內文件組織清晰，按主題分門別類：

| 文件名稱              | 描述                          | 內容重點 |
|-----------------------|-------------------------------|----------|
| `README.md`          | 本文件                        | 專案概述與使用指南 |
| `01-OVERVIEW.md`     | 總覽與統計                    | 完整統計數據與摘要 |
| `02-CHEMICALS.md`    | 化學物質索引                  | 130 種化學物質詳情 |
| `03-PLANTS.md`       | 植物索引                      | 70 種植物詳情 |
| `04-PHARMACOLOGY.md` | 藥理學分類                    | 藥理機制與分類 |
| `05-INTEGRATION.md`  | 蒸餾引擎整合文檔              | 技術整合指南 |
| `erowid-structure.json` | 完整 URL 結構             | 1,683 條 URL 的 JSON 索引 |
| `erowid-distill-list.md` | 蒸餾任務清單               | 處理任務清單 |

這些文件提供從高階概述到細粒度索引的完整覆蓋，適合開發者、研究人員或 AI 工程師使用。

## 統計數據

Erowid 包涵蓋廣泛的資料類型，以下為關鍵統計：

| 類別     | 數量   | 說明 |
|----------|--------|------|
| **總 URL** | 1,683 | 完整爬取與索引的頁面 |
| **化學物質** | 130  | 合成化合物與藥物詳情 |
| **植物**    | 70   | 天然植物來源索引 |
| **圖書館**  | 1,285 | 經驗報告、文獻與參考 |
| **其他**    | 198  | 健康、法律與綜合資源 |

這些數據來自 Erowid 的核心內容，聚焦於教育性資訊，而非醫療建議。

## 核心概念

### Erowid 知識蒸餾包
這是一個基於 Erowid 資料的 **AI 知識蒸餾系統**，透過自動化爬取、解析與壓縮，將海量網頁轉換為高效的知識表示形式。蒸餾過程保留關鍵事實（如劑量範圍、效果描述、風險警示），同時去除冗餘，適合 RAG（Retrieval-Augmented Generation）或微調應用。

### OECE 專案
**OECE**（Open Encyclopedia of Consciousness Exploration）是一個開源 AI 專案，致力於構建心靈活性物質領域的知識圖譜。Erowid 包是其子模組，提供標準化資料管道，支持多語言擴展與持續更新。

## 快速使用指南

### 1. 解壓與安裝
```bash
# 解壓檔案
tar -xzf erowid-package.tar.gz

# 進入目錄
cd erowid-package
```

### 2. 查看概述
```bash
# 快速瀏覽統計與總覽
cat 01-OVERVIEW.md
```

### 3. 啟動蒸餾引擎
蒸餾引擎用於處理原始資料生成 AI 就緒輸出：
```bash
# 切換到引擎目錄並啟動（以化學物質為例）
cd /root/distill-engine
./distill-engine erowid chemicals

# 其他選項
./distill-engine erowid plants      # 處理植物
./distill-engine erowid full        # 全量處理
```

**依賴**：需預裝 Python 3.10+、Distill Engine（詳見 `05-INTEGRATION.md`）。

### 4. 驗證與測試
- 檢查 JSON 結構：`jq '. | length' erowid-structure.json`（應輸出 1683）
- 預覽化學物質：`head -20 02-CHEMICALS.md`

## 整合與擴展

參考 `05-INTEGRATION.md` 以：
- 連接到 LangChain 或 LlamaIndex
- 自訂蒸餾提示
- 批量生成嵌入（Embeddings）

**注意事項**：
- 所有資料源自公共 Erowid 網站，僅用於教育與研究。
- 尊重 Erowid 的使用條款，避免商業濫用。
- 生成時間為 2026-02-01，若需更新，請重新執行蒸餾任務。

如有問題，參閱 `erowid-distill-list.md` 或聯繫 OECE 社群。