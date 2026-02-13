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
part: 4
---

## 2.2 Logstash 配置範例
2.21 **基本管道**：創建 logstash.conf：

```conf
input {
  beats {
    port => 5044
  }
}
filter {
  grok {
    match => { "message" => "%{SYSLOGBASE} %{DATA:message}" }
  }
}
output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "logs-%{+YYYY.MM.dd}"
  }
}
```

2.22 **測試**：`docker-compose restart logstash`，確保它能接收資料。
