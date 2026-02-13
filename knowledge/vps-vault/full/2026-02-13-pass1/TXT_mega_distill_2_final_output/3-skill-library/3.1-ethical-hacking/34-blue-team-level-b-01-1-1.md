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
part: 1
---

## 1.1 B級定位與目標
1.11 **核心任務**：日誌集中與分析，檢測紅隊偵察跡象。紅隊在偵察階段往往會留下足跡，比如頻繁的登入失敗或異常的系統查詢。透過 SIEM，我們能將分散的日誌彙集起來，進行即時分析。這裡的 MITRE DS0029 強調了日誌作為執行階段證據的重要性——攻擊者可能試圖刪除或修改日誌，但我們要先一步捕捉它們。

1.12 **範圍與工具**：我們將部署開源 SIEM，如 ELK Stack (Elasticsearch, Logstash, Kibana)，並學習規則寫作和 anomaly 檢測。為什麼開源？因為它免費、靈活，且適合學習。Splunk Free 也是個好選擇，但 ELK 更適合自訂。範圍不包括商業級 SIEM 如 Splunk Enterprise 或 QRadar，那留給 C級吧。

1.13 **行業標準**：根據 Gartner SIEM Magic Quadrant 2024，ELK (Elastic Security) 被評為領導者，強調其在開源領域的強大分析能力。OSSEC 作為 HIDS (Host-based Intrusion Detection System) 補充，也符合 CIS (Center for Internet Security) Benchmarks 的日誌管理推薦。記住，好的 SIEM 不是只收集日誌，而是轉化為 actionable intelligence。

1.14 **學習曲線與挑戰**：預計花費 40 小時，包括部署、配置和規則調試。挑戰在於處理大數據——想像你的伺服器日誌每天產生 GB 級資料，ELK 能幫你過濾，但你得學會寫高效查詢。風險提示：部署時注意資源分配，否則 Elasticsearch 可能吃光你的 RAM，導致系統崩潰。最佳實踐：從小規模開始，監控單一伺服器，逐步擴展。
