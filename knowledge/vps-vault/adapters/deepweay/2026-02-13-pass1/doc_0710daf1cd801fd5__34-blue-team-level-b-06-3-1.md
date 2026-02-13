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
part: 6
---

## 3.1 Filebeat 安裝與配置
3.11 **安裝**：`sudo apt update && sudo apt install filebeat`。這是 Elastic Beats 家族的一員，輕量級日誌運輸器。

3.12 **詳細配置**：編輯 /etc/filebeat/filebeat.yml：

```yaml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/auth.log  # 認證日誌
      - /var/log/syslog    # 系統日誌
    fields:
      service: system-logs
output.logstash:
  hosts: ["localhost:5044"]
setup.kibana:
  host: "localhost:5601"
```

3.13 **啟動與驗證**：`sudo systemctl start filebeat && sudo systemctl enable filebeat`。檢查狀態：`sudo filebeat test output`。風險提示：如果路徑錯誤，Filebeat 會默默失敗——總是用 `filebeat test config` 驗證。

3.14 **進階模組**：啟用 system 模組：`sudo filebeat modules enable system`，這會自動收集 auth 和 syslog。
