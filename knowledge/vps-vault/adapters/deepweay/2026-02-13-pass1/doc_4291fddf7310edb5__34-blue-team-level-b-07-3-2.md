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
part: 7
---

## 3.2 Syslog-ng 與 Rsyslog
3.21 **Rsyslog 配置遠端記錄**：編輯 /etc/rsyslog.conf：

```conf
*.* @192.168.1.100:514  # 發送到遠端伺服器
```

3.22 **Syslog-ng 安裝**：`sudo apt install syslog-ng`，配置 /etc/syslog-ng/syslog-ng.conf：

```conf
source s_local { system(); };
destination d_logstash { tcp("localhost" port(5140)); };
log { source(s_local); destination(d_logstash); };
```

3.23 **比較表格**：

| 工具       | 優點                       | 缺點                     | 使用場景                |
|------------|----------------------------|--------------------------|-------------------------|
| Filebeat  | 輕量，Elastic 整合好      | 僅運輸，不處理          | 現代 ELK 環境          |
| Rsyslog   | 內建，簡單配置            | 舊式，少功能             | 傳統伺服器             |
| Syslog-ng | 靈活過濾，高性能           | 配置複雜                | 大規模部署             |

3.24 **最佳實踐**：結合使用——Filebeat 收集，Logstash 處理。風險：日誌丟失？啟用持久化隊列。
