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
part: 16
---

## 6.1 深度案例：Log4Shell 檢測
6.11 **背景**：CVE-2021-44228，攻擊者用 JNDI 注入執行遠端程式碼。檢測：grep "jndi:ldap" /var/log/apache2/access.log，或在 Kibana 查詢。

6.12 **ELK 規則**：

```kql
message : /jndi:(ldap|rmi|dns)/
```

6.13 **教訓**：根據 NIST IR 8270，及時日誌分析能減輕零日攻擊影響（引用：MITRE 報告）。
