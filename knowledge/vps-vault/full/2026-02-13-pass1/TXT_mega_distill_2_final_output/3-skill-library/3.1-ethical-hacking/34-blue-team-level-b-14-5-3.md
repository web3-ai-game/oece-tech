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
part: 14
---

## 5.3 真實案例分析
5.31 **SANS 案例**：2020 SolarWinds 攻擊中，anomaly 檢測捕捉異常 DLL 加載（來源：SANS ISC 報告）。在 ELK 中，用 ML job 監控 process events。

5.32 **CIS 推薦**：CIS Controls v8 強調 anomaly 檢測於 Control 12 (Boundary Defense)。
