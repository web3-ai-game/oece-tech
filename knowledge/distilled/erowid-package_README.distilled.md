---
source: erowid-package_README.md
distilled_at: 2026-02-14T09:29:23.885Z
model: grok-4-1-fast-non-reasoning
---

# Erowid 知識蒸餾包 文檔

## 介紹

**Erowid 知識蒸餾包** 是基於 Erowid.org（一個知名的心理活性物質教育資源網站）資料的 AI 知識蒸餾系統輸出。此包透過先進的 AI 蒸餾引擎，從 Erowid 網站的 1,683 個 URL 中提取並濃縮關鍵知識，涵蓋化學物質、植物、藥理學分類等主題。該系統屬於 **OECE 專案**（Open Encyclopedia of Consciousness Experiences，一個開源意識體驗百科專案）的一部分，旨在將龐大資料轉化為結構化、可整合的知識庫。

此文檔提供包的完整結構、統計、使用指南及背景脈絡，幫助開發者、研究人員或 AI 工程師快速整合 Erowid 知識至自有系統中。所有事實基於原始蒸餾輸出，無任何虛構或修改。

## 包內容結構

知識蒸餾包包含以下核心文件，組織成邏輯模組，便於查閱與整合：

| 文件名稱              | 描述                          | 用途 |
|-----------------------|-------------------------------|------|
| `README.md`          | 本文件                        | 入門指南 |
| `01-OVERVIEW.md`     | 總覽與統計數據                | 快速了解包規模 |
| `02-CHEMICALS.md`    | 130 種化學物質索引            | 化學物質詳細目錄 |
| `03-PLANTS.md`       | 70 種植物索引                 | 植物相關資源 |
| `04-PHARMACOLOGY.md` | 藥理學分類                    | 藥理機制與分類 |
| `05-INTEGRATION.md`  | 蒸餾引擎整合文檔              | API/系統整合指南 |
| `erowid-structure.json` | 完整 URL 結構 (1,683 條)   | 原始資料映射與爬取結構 |
| `erowid-distill-list.md` | 蒸餾任務清單               | 處理流程記錄 |

這些文件涵蓋 Erowid 圖書館的核心內容，包括使用者經驗報告（Experience Reports）、劑量指南、健康資訊及科學參考。

## 統計數據

蒸餾包捕捉 Erowid 網站的精華，以下為關鍵指標：

- **總 URL 數量**：1,683（完整爬取與蒸餾）
- **化學物質**：130 種（合成或半合成物質）
- **植物**：70 種（天然來源植物）
- **圖書館內容**：1,285 筆（使用者報告、百科條目）
- **其他**：198 筆（綜合資源、工具、指南）

這些數據反映 Erowid 的廣泛覆蓋，從常見物質如 LSD、MDMA 到罕見植物如 Ayahuasca，強調傷害減低（Harm Reduction）、科學事實與使用者經驗。

## 快速使用指南

### 1. 解壓與安裝
```bash
# 解壓包文件
tar -xzf erowid-package.tar.gz

# 查看總覽
cat 01-OVERVIEW.md
```

### 2. 啟動蒸餾引擎
假設已安裝 **AI 知識蒸餾系統**（distill-engine），執行以下指令重新生成或整合：
```bash
cd /root/distill-engine
./distill-engine erowid chemicals  # 僅處理化學物質
./distill-engine erowid plants     # 僅處理植物
./distill-engine erowid full       # 完整蒸餾
```

**先決條件**：
- Python 3.10+ 與必要依賴（見 `05-INTEGRATION.md`）
- API 金鑰（支援 Grok-4-1-fast-reasoning 等模型）

### 3. 整合範例
使用 `erowid-structure.json` 載入知識庫：
```python
import json
with open('erowid-structure.json', 'r') as f:
    structure = json.load(f)
# 查詢特定物質
chemicals = [item for item in structure if 'chemical' in item['type']]
```

詳細整合步驟請參閱 `05-INTEGRATION.md`。

## 成本與生成細節

- **預計 API 成本**：~$1.10 USD（使用 grok-4-1-fast-reasoning 模型，基於批量處理 1,683 URL）
- **生成時間**：2026-02-01（蒸餾完成日期）
- **處理流程**：透過 OECE 專案的蒸餾引擎，自動爬取、摘要、分類並驗證事實準確性。

## 核心概念與脈絡

### AI 知識蒸餾系統
這是 OECE 專案的核心技術，將網頁資料轉化為結構化知識：
1. **爬取**：基於 `erowid-structure.json` 的 URL 清單。
2. **蒸餾**：AI 模型提取事實、去除冗餘、生成索引。
3. **驗證**：交叉比對 Erowid 原始來源，確保準確性。
4. **輸出**：Markdown/JSON 格式，便於 RAG（Retrieval-Augmented Generation）或知識圖譜整合。

### OECE 專案背景
OECE（Open Encyclopedia of Consciousness Experiences）是一個開源計畫，彙整意識改變物質的科學、教育與經驗資料。Erowid 蒸餾包是其子模組，支援研究、AI 訓練與傷害減低教育。**注意**：所有內容僅供教育用途，不鼓勵非法使用。

## 注意事項
- **法律合規**：依當地法規使用，本包不提供醫療建議。
- **更新**：定期檢查 Erowid.org 以同步最新資料。
- **貢獻**：歡迎提交 Pull Request 至 OECE GitHub 儲存庫。

如需進一步支援，請參閱 `README.md` 或聯繫 OECE 團隊。