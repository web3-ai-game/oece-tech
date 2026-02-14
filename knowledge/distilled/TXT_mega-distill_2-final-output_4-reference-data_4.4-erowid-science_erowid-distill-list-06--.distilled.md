---
source: TXT_mega-distill_2-final-output_4-reference-data_4.4-erowid-science_erowid-distill-list-06--.md
distilled_at: 2026-02-14T09:28:02.334Z
model: grok-4-1-fast-non-reasoning
---

# Erowid.org 蒸餾任務清單 - 深度知識擴展

**類別**: 4-reference-data/4.4-erowid-science  
**來源**: erowid/erowid-distill-list.md  
**蒸餾者**: grok-4-0709  
**模式**: B  
**部分**: 6  

## 介紹

Erowid.org 是一個非營利性教育網站，成立於 1995 年，專注於提供準確、平衡的資訊，涵蓋心靈變性物質（psychoactives）、植物、化學品及其效果、健康風險和法律狀態。網站以使用者貢獻的經驗報告（Experience Reports）、科學文獻摘要和百科式條目聞名，強調傷害減低（harm reduction）和客觀性，而非鼓勵使用。Erowid 的資料庫超過 50,000 頁，涵蓋 500 多種物質，來自科學研究、使用者報告和歷史脈絡。本文檔基於 Erowid 蒸餾任務清單，擴展為深度知識指南，包含學習路線圖，幫助使用者系統化探索網站。**注意**：本指南僅供教育目的，所有物質資訊應視為參考，非醫療建議；請遵守當地法律並諮詢專業人士。

## Erowid.org 核心功能與分類概述

- **主頁與統計摘要**：Erowid 主頁（erowid.org）提供 Vaults（主要分類）、Basics、Statistics 和 Search。統計顯示熱門物質如 LSD（超過 2,000 份經驗報告）、Cannabis 和 Mushrooms 的使用趨勢。
- **主要分類**：
  - **Chemicals**：合成物質，如 phenethylamines（e.g., MDMA）、tryptamines（e.g., LSD）和 dissociatives（e.g., ketamine）。
  - **Plants & Herbs**：天然來源，如 peyote cactus（含 mescaline）和 psilocybin mushrooms。
  - **Experience Reports**：超過 40,000 份主觀敘述，標註劑量、效果持續時間和風險。
  - **Health**：毒性、過量案例和交互作用。
  - **Law**：全球法律狀態追蹤。
- **搜尋功能**：支援關鍵字、類別和進階篩選（如劑量範圍），是高效探索工具。

Erowid 的價值在於彌補主流媒體的偏見，提供使用者生成內容與科學數據的平衡視角。

## 學習路線圖

本路線圖分為三級，逐步從基礎熟悉到進階應用，預計初級 2-4 小時、中級 10-20 小時、高級 30+ 小時。目標：掌握 Erowid 作為研究工具的能力。

### 初級：基礎入門
目標：熟悉介面、基本分類和常見物質，建立安全探索習慣。

1. **閱讀 Erowid 主頁和統計摘要**：
   - 瀏覽 [Erowid 主頁](https://erowid.org)，查看 "Basics" 和 "Statistics" 頁面。了解分類如 Chemicals、Plants、Drugs A-Z。
   - **脈絡補充**：統計顯示 alcohol 是最常查詢物質（合法但高風險），caffeine 則是日常 psychoactives 的入門示例。

2. **探索常見物質如 alcohol 和 caffeine 的頁面**：
   - **Alcohol**：效果包括欣快、協調喪失；風險：成癮、肝損傷、黑アウト。閱讀 Effects、Health 和 Reports。
   - **Caffeine**：效果：警覺提升；風險：焦慮、心律不整。比較劑量（咖啡 ~100mg vs. 能量飲料）。
   - **學習要點**：每個頁面結構一致（Summary、Effects、Timeline、Chemistry），幫助辨識模式。

3. **練習使用搜尋功能查找 5 個連結**：
   - 搜尋 "LSD"，找到 Vault 頁面；"ayahuasca" 連結 Plants；"overdose" 篩選健康風險。
   - **提示**：使用引號精確搜尋，如 "bad trip"。

**成果**：能獨立導航並總結 3 種物質的基本效果/風險。

### 中級：深度探索
目標：比較類別、數據解析和主觀體驗分析。

1. **分析 CHEMICALS 和 PLANTS 的前 20 頁，比較 phenethylamines 和 tryptamines**：
   | 類別          | 示例                  | 化學結構特徵          | 主要效果                  | 常見風險                  |
   |---------------|-----------------------|-----------------------|---------------------------|---------------------------|
   | **Phenethylamines** | MDMA, 2C-B           | 苯乙胺骨架           | 共理、能量提升           | 血清素耗竭、神經毒性     |
   | **Tryptamines**    | LSD, Psilocybin      | 色胺骨架             | 視覺幻覺、內省           | 壞旅程、HPPD（持續幻覺） |
   - **脈絡**：Phenethylamines 多為合成派對藥，tryptamines 常源自真菌/植物。比較顯示 phenethylamines 作用更快（30-60分），tryptamines 更內省（4-12小時）。

2. **使用代碼範例解析清單，生成自訂表格**：
   - 下載 erowid-distill-list.md（Markdown 清單）。
   - **Python 範例**（使用 pandas）：
     ```python
     import pandas as pd
     import requests
     from bs4 import BeautifulSoup  # 簡化解析

     # 假設從來源載入清單
     data = {'Substance': ['MDMA', 'LSD'], 'Class': ['Phenethylamine', 'Tryptamine']}
     df = pd.DataFrame(data)
     print(df.to_markdown())  # 生成表格
     ```
   - **應用**：篩選前 20 頁，視覺化比較（如效果持續時間）。

3. **閱讀 2-3 個經驗報告，理解主觀差異**：
   - 示例：MDMA "First Time"（正面：連結感）vs. "Overdose"（負面：焦慮）。
   - **洞見**：報告顯示セット/設定（set and setting）影響 70% 體驗差異；劑量變異大（e.g., LSD 100-400μg）。

**成果**：自訂表格和 1 頁比較報告。

### 高級：進階應用
目標：批判分析、整合外部知識和工具開發。

1. **研究真實案例，撰寫分析報告**：
   - 選擇案例如 "Salvia overdose" 或 "Ayahuasca retreat"，分析報告 + Health 頁。
   - **結構**：背景、劑量、效果、風險、教訓。引用 5+ 來源。

2. **整合知識圖譜，連結到外部資源如 PubMed**：
   - 使用工具如 Obsidian 或 Neo4j 建圖：MDMA → serotonin → PubMed "MDMA neurotoxicity"。
   - **示例連結**：
     - [PubMed: Psilocybin therapy](https://pubmed.ncbi.nlm.nih.gov/?term=psilocybin+depression)
     - Erowid → PsychonautWiki → MAPS.org。

3. **開發個人項目，如 Erowid 數據視覺化工具**：
   - **想法**：用 Plotly 繪製 "效果 vs. 劑量熱圖"，從 API/爬蟲擷取數據。
   - **進階**：建 Shiny App 或 Jupyter Notebook，公開分享於 GitHub。
   - **挑戰**：處理主觀數據偏差，加入統計（如平均持續時間）。

**成果**：1 份分析報告 + 開源工具原型。

## 結論與注意事項

此蒸餾任務清單將 Erowid.org 轉化為結構化學習路徑，從入門到專家級應用。透過實踐，使用者不僅掌握 psychoactives 知識，還培養批判思維和數據技能。**重要提醒**：
- Erowid 資訊基於使用者報告，非 FDA 批准；總是驗證科學來源。
- 避免自我實驗；若有健康疑慮，諮詢醫師。
- 貢獻回饋：Erowid 歡迎經驗報告，提升社區知識。

**進一步資源**：
- [Erowid 完整索引](https://erowid.org/psychoactives/psychoactives.shtml)
- 相關書籍：*Erowid Psychedelics Encyclopedia* (1992)。

*文檔最後更新：基於 2023 Erowid 資料蒸餾。*