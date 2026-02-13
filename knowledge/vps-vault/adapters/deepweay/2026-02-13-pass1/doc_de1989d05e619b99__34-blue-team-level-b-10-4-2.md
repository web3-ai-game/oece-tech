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
part: 10
---

## 4.2 Sigma 規則轉換
4.21 **介紹**：Sigma 是開源規則語言，github.com/SigmaHQ/sigma 有上千規則。轉換到 ELK：用 sigmac 工具 `pip install sigmac`，然後 `sigmac -t es-qs rule.yml` 生成 KQL。

4.22 **範例規則**：偵測 SSH brute force (從 Sigma 轉換)：

```yaml
title: SSH Brute Force
logsource:
  category: authentication
detection:
  selection:
    event.outcome: failure
    event.module: sshd
  condition: selection | count() by source.ip > 10 in 5m
```

4.23 **整合**：將轉換後的 KQL 貼到 Kibana rule。
