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
part: 3
---

## 2.1 環境準備
2.11 **系統要求**：Ubuntu 20.04+ 或 CentOS 8，至少 4GB RAM 和 2 核 CPU。為什麼？Elasticsearch 是 Java-based，愛吃記憶體。安裝 Docker：`sudo apt update && sudo apt install docker.io docker-compose`。風險提示：確保防火牆允許端口（如 9200 for Elasticsearch），否則連不上。

2.12 **Docker Compose 部署**：這是最簡單的方式，避免依賴衝突。以下是完整 yaml：

```yaml
version: '3.7'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false  # 開發模式，生產禁用
      - ES_JAVA_OPTS="-Xms512m -Xmx512m"  # 記憶體限制
    ports:
      - "9200:9200"
      - "9300:9300"
    volumes:
      - es-data:/usr/share/elasticsearch/data
  logstash:
    image: docker.elastic.co/logstash/logstash:8.12.0
    container_name: logstash
    ports:
      - "5044:5044"  # Beats 輸入
      - "9600:9600"
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch
  kibana:
    image: docker.elastic.co/kibana/kibana:8.12.0
    container_name: kibana
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
volumes:
  es-data:
```

2.13 **啟動與驗證**：`docker-compose up -d`，然後瀏覽 localhost:5601。首次載入可能需要幾分鐘，檢查日誌：`docker logs elasticsearch`。如果出錯，如 JVM 記憶體不足，調整 ES_JAVA_OPTS。最佳實踐：生產環境啟用 xpack.security，設定密碼（參考 Elastic 官方文件）。

2.14 **常見問題排除**：如果 Kibana 連不上 Elasticsearch，檢查 docker 網路：`docker network inspect bridge`。另一個坑：版本不匹配，永遠用相同版本的 ELK 組件。
