---
title: 社會工程學防禦指南
slug: survival-social-engineering-defense
category: survival-skills
tags: [社工, phishing, vishing, pretexting, awareness, MITRE]
lang: zh-TW
created: 2026-02-12
source: kilo-code-distilled
vector_ready: true
embedding_model: BAAI/bge-m3
distilled_by: grok-4-0709
distilled_at: 2026-07-09T12:00:00Z
---
part: 5
---

## 1.5 進階主題與風險管理 🔍
現在，讓我們深入一些進階內容，幫助你從防禦轉向主動預防。

### 1.51 風險評估框架
使用 NIST RMF（Risk Management Framework）評估社會工程學風險。步驟包括識別資產、評估威脅和實施控制。

#### 1.511 量化風險
公式：風險 = 可能性 × 影響。根據 Verizon DBIR，Phishing 可能性高達 1/3。

表格匯總：風險等級

| 風險類型    | 可能性 | 影響   | 緩解措施             |
|-------------|--------|--------|----------------------|
| Phishing   | 高    | 高    | 訓練 + DMARC        |
| Vishing    | 中    | 高    | Callback 政策       |
| Smishing   | 中    | 中    | SMS 過濾 app        |

### 1.52 真實案例分析
引用 MITRE 的案例：2020 年 Twitter 攻擊，攻擊者用 Vishing 騙取員工憑證，導致名人帳戶被劫持推廣比特幣詐騙。損失：數百萬美元。SANS 分析顯示，這是因缺乏 2FA 和訓練所致。

另一案例：2019 年 Capital One breach（OWASP 引用），Phishing 導致 1 億客戶資料洩露。教訓：雲端配置錯誤放大社工風險。

### 1.53 最佳實踐與常見錯誤
常見錯誤：信任未驗證的請求。最佳實踐：實施 Zero Trust 模型（NIST SP 800-207），假設所有請求都是惡意的。
