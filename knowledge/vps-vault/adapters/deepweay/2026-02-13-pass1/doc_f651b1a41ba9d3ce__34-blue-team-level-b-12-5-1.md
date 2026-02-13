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
part: 12
---

## 5.1 Kibana ML 模組
5.11 **設定 ML Job**：在 Kibana > Machine Learning > Create job，選擇 authentication_log_rate：監控登入速率異常。

5.12 **配置詳解**：Bucket span: 15m, Detector: high_count by source.ip。啟動後，它會學習正常模式，標記偏差。

5.13 **風險**：初始學習期需資料，假陽性高。最佳實踐：結合規則使用。
