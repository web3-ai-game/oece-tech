---
source: TXT_mega-distill_2-final-output_3-skill-library_3.1-ethical-hacking_34-blue-team-level-b-18-6-3.md
distilled_at: 2026-02-14T09:35:39.632Z
model: grok-4-1-fast-non-reasoning
---

# 道德黑客藍隊 - B級：日誌分析與 SIEM 入門

**類別**: deepweay-me/ethical-hacking  
**標籤**: [藍隊, SIEM, ELK, splunk-free, log分析, anomaly]  
**語言**: zh-TW  
**建立日期**: 2026-02-12  
**來源**: kilo-code-distilled  
**Vector Ready**: true  
**Embedding Model**: BAAI/bge-m3  
**等級**: B  
**團隊**: blue  
**先決條件**: [level-a](ethical-hacking-blue-team-level-a)  
**蒸餾者**: grok-4-0709  
**蒸餾時間**: 2024-07-20T12:00:00Z  
**部分**: 18 / 總字數：約 4200 字  

---

## 介紹：藍隊 B 級的起點

歡迎進入**道德黑客藍隊 B 級**！如果你已完成 [A 級先決條件](ethical-hacking-blue-team-level-a)，恭喜你具備基礎網路防禦知識。現在，我們將進入**日誌分析與 SIEM（Security Information and Event Management）入門**的核心領域。

> **藍隊精髓**：持續學習。B 級不是終點，而是成為「日誌分析高手」的起點。透過本課程，你將學會從海量日誌中偵測異常、設定警報，並掌握 ELK Stack 等免費工具，達成**成就：日誌分析高手**。

**為何學習日誌分析？**  
在紅隊（攻擊者）製造混亂時，藍隊依賴日誌還原攻擊路徑。SIEM 是藍隊的「大腦」，整合多源資料、即時檢測威脅。根據 MITRE ATT&CK 框架，80% 的攻擊偵測來自日誌分析。

**學習路徑**：參考下方 B 級技能圖譜總結表格，循序學習部署 → 收集 → 規則 → 檢測。

### B 級技能圖譜總結表格
| 技能領域 | 關鍵概念          | 工具/技術            | 學習重點     |
|----------|-------------------|----------------------|--------------|
| **部署** | Docker ELK       | Compose, YAML       | 資源管理    |
| **收集** | Beats, Syslog    | Filebeat 配置       | 多源整合    |
| **規則** | KQL, Sigma       | Threshold/Anomaly   | 假陽性控制  |
| **檢測** | ML Jobs, OSSEC   | Rules XML           | 即時警報    |

**預計學習時間**：20-30 小時。環境需求：Docker、Linux VM（推薦 Ubuntu 22.04）。

---

## 部分 1：SIEM 基礎與藍隊角色

### 什麼是 SIEM？
SIEM（Security Information and Event Management）是藍隊的核心工具，負責：
- **收集**：從伺服器、防火牆、應用程式等收集日誌。
- **標準化**：轉換成統一格式（如 ECS - Elastic Common Schema）。
- **儲存與索引**：支援 PB 級查詢。
- **分析**：規則匹配、機器學習異常偵測。
- **警報**：即時通知（Email/Slack）。

**常見 SIEM 工具對比**：
| 工具       | 優點                  | 缺點              | 適合情境       |
|------------|-----------------------|-------------------|----------------|
| **ELK**   | 免費、開源、可擴展   | 學習曲線陡        | 初學者/中小企業 |
| **Splunk Free** | 強大搜尋（SPL）     | 授權限制（500MB/d）| 快速原型     |
| **OSSEC** | 輕量級 HIDS          | 無 GUI            | 邊緣設備      |

**藍隊 B 級目標**：部署 ELK + Beats，分析 Syslog，設定基本規則。

---

## 部分 2：部署 Docker ELK Stack（資源管理重點）

ELK = **Elasticsearch（儲存） + Logstash（處理） + Kibana（視覺化）**。使用 Docker Compose 快速部署。

### 步驟 1：環境準備
```bash
# 安裝 Docker & Compose
sudo apt update && sudo apt install docker.io docker-compose -y
sudo systemctl start docker
```

### 步驟 2：docker-compose.yml 配置
建立 `docker-compose.yml`（重點：資源管理，避免 OOM）：
```yaml
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.14.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false  # 開發環境禁用
      - ES_JAVA_OPTS=-Xms1g -Xmx1g   # 資源限制：1GB RAM
    ports:
      - "9200:9200"
    volumes:
      - esdata:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.14.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5044:5044"
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.14.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

volumes:
  esdata:
```

**資源管理提示**：
- **RAM**：至少 4GB（ES 需 50% heap）。
- **YAML 最佳實務**：使用 `depends_on` 確保順序；volumes 持久化資料。
- 啟動：`docker-compose up -d`。驗證：瀏覽 http://localhost:5601。

**常見問題**：ES OOM → 調低 `ES_JAVA_OPTS`；端口衝突 → 修改 ports。

---

## 部分 3：日誌收集 - Beats 與 Syslog 多源整合

### Filebeat：輕量日誌船夫
Filebeat 是 Elastic Beats 家族，轻量級日誌收集器。支援 Syslog、Apache、系統日誌。

#### 安裝與配置（Filebeat 配置重點）
```bash
# 在目標主機安裝
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-8.14.0-linux-x86_64.tar.gz
tar xzvf filebeat-8.14.0-linux-x86_64.tar.gz
cd filebeat-8.14.0-linux-x86_64
```

**filebeat.yml**（多源整合）：
```yaml
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /var/log/syslog
    - /var/log/auth.log  # 多源：系統 + 認證
  fields:
    log_type: linux_syslog

output.logstash:
  hosts: ["your-elk-ip:5044"]  # 指向 Logstash

processors:
  - add_host_metadata: ~
```

啟動：`./filebeat -e -c filebeat.yml`。

### Syslog 整合
- **rsyslog 配置**：`/etc/rsyslog.conf` 加入 `*.* @your-elk-ip:514`（UDP）。
- **Logstash 管道**（logstash.conf）：
```
input {
  beats { port => 5044 }
  syslog { port => 514 }
}
filter {
  grok { match => { "message" => "%{SYSLOGTIMESTAMP:timestamp} %{SYSLOGHOST:hostname} %{DATA:program}\[%{POSINT:pid}\]: %{GREEDYDATA:msg}" } }
}
output {
  elasticsearch { hosts => ["elasticsearch:9200"] index => "syslog-%{+YYYY.MM.dd}" }
}
```

**學習重點**：多源整合（Beats + Syslog），確保 ECS 標準化（timestamp, hostname, msg）。

---

## 部分 4：檢測規則 - KQL、Sigma 與假陽性控制

### Kibana 查詢語言（KQL）
KQL 是 Kibana 的簡單查詢語法。
- **基本**：`hostname: "webserver" AND msg: "failed login"`
- **聚合**：`event.category: authentication | stats count by user.name`
- **時間**：`@timestamp > now-1h`

### Sigma 規則轉換
Sigma 是開源規則格式，跨 SIEM 通用。B 級重點：Threshold（閾值）與 Anomaly（異常）規則。

**範例 Sigma 規則**（暴力破解偵測）：
```yaml
title: SSH Brute Force
id: 12345678-1234-1234-1234-123456789abc
status: stable
description: Detects SSH brute force attempts
logsource:
  category: process_creation
detection:
  selection:
    event.category: authentication
    msg|contains: 'Failed password'
    user.name: '*'
  timeframe: 5m
  condition: selection | count() by user.name > 10  # Threshold 控制假陽性
falsepositives:
  - Legitimate password rotation
level: high
```

**轉換到 KQL**：
```
msg: "Failed password" AND @timestamp > now-5m | stats failed_attempts=count() by user.name | where failed_attempts > 10
```

**假陽性控制**：
- **Whitelist**：排除已知 IP（`NOT source.ip: "10.0.0.0/8"`）。
- **Threshold**：`count() > N`。
- **Anomaly**：基線偏差（後述 ML）。

---

## 部分 5：進階檢測 - ML Jobs 與 OSSEC 即時警報

### Elastic ML Jobs（Anomaly 偵測）
在 Kibana → Machine Learning → Anomaly Detection 建立 Job。
- **資料源**：`syslog-*`。
- **配置**：偵測 `auth.log` 中的登入異常。
```
Function: count
Field: user.name
Bucket span: 15m
Detectors: high_count(user.name)  # 異常用戶登入峰值
```

**警報設定**：Kibana → Alerts → 建立 Rule → ML Anomaly → Slack/Webhook。

### OSSEC 整合（Rules XML）
OSSEC 是免費 HIDS，產生 XML 規則。
- **安裝**：`curl -s https://packages.ossec.net/install.sh | sudo bash`。
- **規則範例**（/var/ossec/etc/rules/local_rules.xml）：
```xml
<rule id="100002" level="10">
  <if_sid>5700</if_sid>  <!-- SSH 登入 -->
  <field name="srcip">192.168.1.0/24</field>  <!-- 內網白名單 -->
  <description>Internal SSH login</description>
  <group>authentication,</group>
</rule>
<group name="local,">
  <rule id="100001" level="12">
    <if_sid>5700</if_sid>
    <match>Failed password</match>
    <description>Potential brute force</description>
  </rule>
</group>
```

**輸出到 ELK**：OSSEC `syslog_output` 至 Logstash。

**即時警報**：OSSEC email + ELK Watcher（`condition: ctx.payload.hits.total > 5`）。

---

## 部分 6：實戰練習與成就挑戰

### 練習 1：部署 ELK + Filebeat
1. 啟動 Stack，收集 `/var/log/auth.log`。
2. Kibana Dashboard：登入失敗 Top 10 用戶。

### 練習 2：Sigma 規則實作
- 下載 [Sigma Repo](https://github.com/SigmaHQ/sigma)，轉換 5 條規則到 KQL。
- 模擬攻擊：`hydra -l user -P passlist.txt ssh://target` → 驗證警報。

### 練習 3：ML Anomaly + OSSEC
- 建立 Brute Force ML Job。
- 整合 OSSEC，設定 Slack 警報。

**成就解鎖**：截圖你的第一個即時警報 → **日誌分析高手**！

---

## 結語與進階路徑

B 級結束！你已掌握 SIEM 入門，從部署到檢測的全流程。記住**藍隊精髓**：持續學習。

**C 級預覽**：進階 ML、Threat Hunting、Splunk SPL。

**資源**：
- [Elastic Docs](https://www.elastic.co/guide/en/index.html)
- [Sigma Rules](https://sigmahq.io/)
- [OSSEC Docs](https://ossec.github.io/)

**トラブルシューティング**：日誌延遲 → 檢查 Beats 連線；假陽性 → 調整 threshold。

持續實戰，成為藍隊菁英！🚀

**總字數**：約 4200 字（含程式碼）。歡迎貢獻 Pull Request！