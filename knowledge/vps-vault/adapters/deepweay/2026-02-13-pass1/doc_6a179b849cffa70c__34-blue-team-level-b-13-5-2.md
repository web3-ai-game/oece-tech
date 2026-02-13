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
part: 13
---

## 5.2 OSSEC 整合
5.21 **安裝**：`sudo apt install ossec-hids-server`。編輯 /var/ossec/etc/ossec.conf，添加 local_rules.xml：

```xml
<rule id="100005" level="10">
  <if_sid>5700</if_sid>  <!-- SSH 相關 -->
  <match>sshd.*Failed password</match>
  <description>Multiple SSH failures</description>
  <group>authentication_failures</group>
</rule>
```

5.22 **啟動**：`sudo /var/ossec/bin/ossec-control start`。整合到 ELK：用 OSSEC agent 發送到 Logstash。

5.23 **進階**：OSSEC decoders 解析自訂日誌。
