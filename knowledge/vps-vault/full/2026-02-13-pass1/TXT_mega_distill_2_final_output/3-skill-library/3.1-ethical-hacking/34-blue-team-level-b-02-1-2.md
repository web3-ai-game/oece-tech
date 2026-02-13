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
part: 2
---

## 1.2 相關知識圖譜連接
1.21 連接 A級：基礎日誌查看（如 tail -f /var/log/auth.log）。
1.22 進階到 C級：進階 SIEM 整合與 SOAR (Security Orchestration, Automation and Response)。
1.23 橫向連接：紅隊偵察技巧（deepweay-me/ethical-hacking/red-team-recon）——知道敵人怎麼攻擊，才能更好地防禦。

⚡ **實戰要點**  
- **目標**：檢測 MITRE DS0029 相關威脅。  
- **工具**：ELK Stack 為主，OSSEC 輔助。  
- **時間**：40 小時，聚焦規則寫作。  
- **風險**：日誌洪水可能導致性能問題，使用索引優化。  

# 2. 🛠️ ELK Stack 部署與配置
ELK Stack 是藍隊的瑞士軍刀——Elasticsearch 存儲資料，Logstash 處理管道，Kibana 視覺化介面。部署它就像組裝一台高效的日誌機器人，讓它為你工作。讓我們一步步來，記住，我會補充實戰細節，讓你避免常見坑。
