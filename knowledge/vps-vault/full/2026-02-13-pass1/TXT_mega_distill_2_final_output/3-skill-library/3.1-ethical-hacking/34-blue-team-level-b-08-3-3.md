---
title: 道德黑客藍隊 - B級：日誌分析與 SIEM 入門
slug: ethical-hacking-blue-team-level-b
category: deepweay-me/ethical-hacking
tags: [藍隊, SIEM, ELK, splunk-free, log分析, anomaly]
lang: zh-TW
created: 2026-02-12
source: kilo-code-distilled
vector_ready: true
embedding_model: BAAI/bge-m3
level: B
team: blue
prereq: level-a
distilled_by: grok-4-0709
distilled_at: 2024-07-20T12:00:00Z
---
part: 8
---

## 3.3 真實案例分析
3.31 **NIST 引用**：根據 NIST SP 800-92 (Guide to Computer Security Log Management)，日誌收集應涵蓋所有關鍵系統，優先處理安全事件。案例：2017 Equifax 洩露事件中，缺乏集中日誌導致攻擊未及時檢測（來源：SANS Institute 報告）。

3.32 **MITRE 連接**：在 ATT&CK T1070 (Indicator Removal on Host) 中，攻擊者刪除日誌；及時收集能對抗此術。

⚡ **實戰要點**  
- **配置重點**：paths 和 output 正確。  
- **測試**：總是用 test 命令驗證。  
- **規模**：從單檔開始，擴到多源。  
- **資源**：Elastic Docs - Beats Guide。  

# 4. 🛡️ 檢測規則寫作
規則是 SIEM 的靈魂——它們定義了什麼是「異常」。我們從 Kibana 規則開始，逐步到 Sigma。
