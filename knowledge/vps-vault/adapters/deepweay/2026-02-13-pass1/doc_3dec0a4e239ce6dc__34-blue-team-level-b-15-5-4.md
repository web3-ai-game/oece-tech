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
part: 15
---

## 5.4 學習資源與進階路線
5.41 **資源**：Elastic.co Docs, SANS SEC555 (SIEM 課程)。書籍：《The Practice of Network Security Monitoring》 by Richard Bejtlich。
5.42 **進階**：學習 Splunk Free，整合 Threat Intelligence (e.g., AlienVault OTX)。
5.43 **知識圖譜連接**：藍隊 C級 - 進階 SIEM（deepweay-me/ethical-hacking/blue-team-level-c）。

⚡ **實戰要點**  
- **ML 啟用**：從預建 job 開始。  
- **OSSEC**：用於主機級檢測。  
- **測試**：模擬 anomaly 如 flood logins。  
- **里程碑**：部署 SIEM + 10 規則。  

# 6. 📊 案例研究與總結