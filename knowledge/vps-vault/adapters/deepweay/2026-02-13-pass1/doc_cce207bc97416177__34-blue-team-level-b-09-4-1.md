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
part: 9
---

## 4.1 Kibana 規則基礎
4.11 **創建規則**：在 Kibana > Security > Rules，新增 threshold rule。例如，Failed login >5/min：

```kql
event.category:authentication and event.outcome:failure | stats count by source.ip | where count > 5
```

4.12 **步驟詳解**：1. 選擇 index pattern (e.g., logs-*)。2. 設定查詢。3. 定義 threshold (e.g., count >5 in 1 min)。4. 動作：發送警報到 Slack 或 email。

4.13 **風險提示**：假陽性多？調整 threshold，避免警報疲勞。最佳實踐：測試規則於模擬環境。
