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

# 1. 🚀 藍隊 B級概述
嘿，藍隊戰士們！作為一名資深工程師，我得告訴你，進入 B級就像從新手村升級到中級副本一樣刺激。這裡我們不再只是被動防禦，而是開始主動監控和分析日誌，捕捉那些紅隊的鬼祟足跡。想像一下，你像個偵探一樣，透過 SIEM (Security Information and Event Management) 系統，挖掘隱藏在海量日誌中的異常行為。這不僅是技術活兒，更是藝術——早一步發現，就能阻止攻擊於無形中。

在這個級別，我們聚焦於日誌集中、分析和 anomaly 檢測，基於 MITRE ATT&CK 框架的 DS0029 (Execution: Logs) 知識點。預備知識？確保你已經掌握了 A級基礎，比如基本網路安全概念和簡單的日誌查看。如果你還在 A級掙扎，趕緊回去複習吧！（知識圖譜連接：deepweay-me/ethical-hacking/blue-team-level-a）
