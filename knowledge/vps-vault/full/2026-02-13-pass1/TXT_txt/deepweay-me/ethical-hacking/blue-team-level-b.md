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
---

# 1. 藍隊 B級概述
## 1.1 B級定位
1.11 日誌集中與分析，檢測紅隊偵察跡象（MITRE DS0029 Logs）。
1.12 範圍：開源 SIEM 部署，規則寫作，anomaly 檢測。
1.13 標準：Gartner SIEM Magic Quadrant 2024，ELK/OSSEC。

## 1.2 ELK Stack 部署
1.21 Docker Compose：
```
version: '3'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.0
    environment:
      - discovery.type=single-node
  logstash:
    image: docker.elastic.co/logstash/logstash:8.12.0
  kibana:
    image: docker.elastic.co/kibana/kibana:8.12.0
```
1.22 啟動：`docker-compose up -d`，Kibana localhost:5601。

## 1.3 日誌收集
1.31 Filebeat：安裝 `sudo apt install filebeat`，配置 /etc/filebeat/filebeat.yml：
```
filebeat.inputs:
- type: log
  paths:
    - /var/log/auth.log
output.logstash:
  hosts: ["localhost:5044"]
```
1.32 Syslog-ng：rsyslog 配置 remote log。

## 1.4 檢測規則
1.41 Kibana 規則：
 - Failed login >5/min：`event.category:authentication and event.outcome:failure | stats count by source.ip | where count >5`。
1.42 Sigma 規則轉換：github.com/SigmaHQ/sigma 通用規則。

## 1.5 Anomaly 檢測
1.51 ML module：Kibana ML job `authentication_log_rate`。
1.52 OSSEC：`sudo apt install ossec-hids-server`，local_rules.xml 加：
```
<rule id="100005" level="10">
  <if_sid>5700</if_sid>
  <match>sshd</match>
  <description>Multiple SSH failures</description>
</rule>
```

## 1.6 案例
1.61 Log4Shell 檢測：grep jndi /var/log。

**B級里程碑**：部署 SIEM，寫 10+ 規則。預計 40 小時，資源：Elastic.co docs。