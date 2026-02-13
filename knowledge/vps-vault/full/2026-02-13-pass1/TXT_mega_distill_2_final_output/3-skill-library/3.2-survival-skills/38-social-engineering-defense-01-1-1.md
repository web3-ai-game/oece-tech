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
part: 1
---

## 1.1 定義與歷史
社會工程學的核心定義是：利用人類的心理弱點、信任和疏忽來獲取敏感資訊或權限，而非直接攻擊技術系統。這不是什麼新鮮事，早在大航海時代，間諜就用類似手法竊取情報。但在數位時代，它被 Kevin Mitnick 在他的經典著作《The Art of Deception》（欺騙的藝術）中系統化描述。Mitnick 曾是 FBI 通緝的頭號駭客，他不是靠寫病毒，而是靠打電話假裝 IT 人員騙取密碼。根據 MITRE ATT&CK 框架的 T1566 Phishing 子類別，這類攻擊經常被用來作為初始存取（Initial Access）的手段。

### 1.11 心理基礎與演變
社會工程學依賴於幾大心理原理：權威服從（Authority）、社會證明（Social Proof）和緊急感（Urgency）。例如，攻擊者可能假裝是你的老闆，命令你立即提供資料。歷史上，1970 年代的電話詐騙（Phone Phreaking）是早期形式，駭客如 Captain Crunch 用玩具哨子模擬電話信號騙取免費通話。到 21 世紀，隨著網際網路普及，攻擊從線下轉移到線上。根據 Verizon 的 Data Breach Investigations Report (DBIR) 2023 年版，82% 的資料外洩事件涉及人類因素，其中社會工程學佔比高達 74%。

### 1.12 MITRE ATT&CK 框架整合
MITRE ATT&CK 框架將社會工程學歸類為多個 Tactics，例如 Reconnaissance (TA0043) 和 Initial Access (TA0001)。具體到 T1566 Phishing，它包括 Spear Phishing Attachment (T1566.001)，這是針對特定目標的精準攻擊。為什麼這重要？因為了解框架能幫助你映射防禦措施。舉例來說，NIST SP 800-53 指南建議在安全意識訓練中涵蓋這些 Tactics。
