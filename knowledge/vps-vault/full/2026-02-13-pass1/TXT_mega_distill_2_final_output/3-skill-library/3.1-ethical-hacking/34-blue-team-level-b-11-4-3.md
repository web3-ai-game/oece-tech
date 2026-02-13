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
part: 11
---

## 4.3 表格匯總：常見規則類型

| 規則類型     | 範例                              | 偵測目標                | MITRE 映射          |
|--------------|-----------------------------------|-------------------------|---------------------|
| Threshold   | Failed logins >5/min             | Brute force            | T1110              |
| Anomaly     | Unusual log volume               | Recon activity         | T1595              |
| Correlation | Login after port scan            | Multi-stage attack     | TA0001             |

4.24 **真實案例**：OWASP 引用，2021 Log4j 漏洞中，Splunk 規則偵測 JNDI 注入（來源：MITRE CVE-2021-44228）。在 ELK 中，用規則 grep "jndi:ldap" 於 access logs。

⚡ **實戰要點**  
- **寫作技巧**：從簡單 threshold 開始，用 Sigma 擴充。  
- **調試**：模擬攻擊測試規則。  
- **數量**：目標寫 10+ 規則。  
- **資源**：SigmaHQ GitHub。  

# 5. 🔍 Anomaly 檢測與進階工具
Anomaly 檢測是 SIEM 的高級功能，使用機器學習捕捉非規則模式。
