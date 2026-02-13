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

# 1. 🚀 藍隊 B級概述
嘿，藍隊戰士們！作為一名資深工程師，我得告訴你，進入 B級就像從新手村升級到中級副本一樣刺激。這裡我們不再只是被動防禦，而是開始主動監控和分析日誌，捕捉那些紅隊的鬼祟足跡。想像一下，你像個偵探一樣，透過 SIEM (Security Information and Event Management) 系統，挖掘隱藏在海量日誌中的異常行為。這不僅是技術活兒，更是藝術——早一步發現，就能阻止攻擊於無形中。

在這個級別，我們聚焦於日誌集中、分析和 anomaly 檢測，基於 MITRE ATT&CK 框架的 DS0029 (Execution: Logs) 知識點。預備知識？確保你已經掌握了 A級基礎，比如基本網路安全概念和簡單的日誌查看。如果你還在 A級掙扎，趕緊回去複習吧！（知識圖譜連接：deepweay-me/ethical-hacking/blue-team-level-a）

## 1.1 B級定位與目標
1.11 **核心任務**：日誌集中與分析，檢測紅隊偵察跡象。紅隊在偵察階段往往會留下足跡，比如頻繁的登入失敗或異常的系統查詢。透過 SIEM，我們能將分散的日誌彙集起來，進行即時分析。這裡的 MITRE DS0029 強調了日誌作為執行階段證據的重要性——攻擊者可能試圖刪除或修改日誌，但我們要先一步捕捉它們。

1.12 **範圍與工具**：我們將部署開源 SIEM，如 ELK Stack (Elasticsearch, Logstash, Kibana)，並學習規則寫作和 anomaly 檢測。為什麼開源？因為它免費、靈活，且適合學習。Splunk Free 也是個好選擇，但 ELK 更適合自訂。範圍不包括商業級 SIEM 如 Splunk Enterprise 或 QRadar，那留給 C級吧。

1.13 **行業標準**：根據 Gartner SIEM Magic Quadrant 2024，ELK (Elastic Security) 被評為領導者，強調其在開源領域的強大分析能力。OSSEC 作為 HIDS (Host-based Intrusion Detection System) 補充，也符合 CIS (Center for Internet Security) Benchmarks 的日誌管理推薦。記住，好的 SIEM 不是只收集日誌，而是轉化為 actionable intelligence。

1.14 **學習曲線與挑戰**：預計花費 40 小時，包括部署、配置和規則調試。挑戰在於處理大數據——想像你的伺服器日誌每天產生 GB 級資料，ELK 能幫你過濾，但你得學會寫高效查詢。風險提示：部署時注意資源分配，否則 Elasticsearch 可能吃光你的 RAM，導致系統崩潰。最佳實踐：從小規模開始，監控單一伺服器，逐步擴展。

## 1.2 相關知識圖譜連接
1.21 連接 A級：基礎日誌查看（如 tail -f /var/log/auth.log）。
1.22 進階到 C級：進階 SIEM 整合與 SOAR (Security Orchestration, Automation and Response)。
1.23 橫向連接：紅隊偵察技巧（deepweay-me/ethical-hacking/red-team-recon）——知道敵人怎麼攻擊，才能更好地防禦。

⚡ **實戰要點**  
- **目標**：檢測 MITRE DS0029 相關威脅。  
- **工具**：ELK Stack 為主，OSSEC 輔助。  
- **時間**：40 小時，聚焦規則寫作。  
- **風險**：日誌洪水可能導致性能問題，使用索引優化。  

# 2. 🛠️ ELK Stack 部署與配置
ELK Stack 是藍隊的瑞士軍刀——Elasticsearch 存儲資料，Logstash 處理管道，Kibana 視覺化介面。部署它就像組裝一台高效的日誌機器人，讓它為你工作。讓我們一步步來，記住，我會補充實戰細節，讓你避免常見坑。

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

## 2.3 表格匯總：ELK 組件角色

| 組件          | 角色                          | 關鍵端口 | 最佳實踐                  |
|---------------|-------------------------------|----------|---------------------------|
| Elasticsearch | 存儲與索引日誌               | 9200    | 啟用分片，監控集群健康   |
| Logstash      | 資料處理與過濾               | 5044    | 使用 grok 模式解析       |
| Kibana        | 視覺化與查詢                 | 5601    | 設定 dashboard 警報      |

⚡ **實戰要點**  
- **部署步驟**：Docker Compose 一鍵啟動，避免手動安裝。  
- **資源管理**：監控 RAM 使用，生產用至少 16GB。  
- **安全**：開發禁用 xpack，生產啟用。  
- **擴展**：從單節點開始，後續加 cluster。  

# 3. 📥 日誌收集與整合
收集日誌是 SIEM 的第一步——沒有資料，就沒有分析。Filebeat 和 Syslog-ng 是你的好幫手，讓我們深入探討。

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

## 3.3 真實案例分析
3.31 **NIST 引用**：根據 NIST SP 800-92 (Guide to Computer Security Log Management)，日誌收集應涵蓋所有關鍵系統，優先處理安全事件。案例：2017 Equifax 洩露事件中，缺乏集中日誌導致攻擊未及時檢測（來源：SANS Institute 報告）。

3.32 **MITRE 連接**：在 ATT&CK T1070 (Indicator Removal on Host) 中，攻擊者刪除日誌；及時收集能對抗此術。

⚡ **實戰要點**  
- **配置重點**：paths 和 output 正確。  
- **測試**：總是用 test 命令驗證。  
- **規模**：從單檔開始，擴到多源。  
- **資源**：Elastic Docs - Beats Guide。  

# 4. 🛡️ 檢測規則寫作
規則是 SIEM 的靈魂——它們定義了什麼是「異常」。我們從 Kibana 規則開始，逐步到 Sigma。

## 4.1 Kibana 規則基礎
4.11 **創建規則**：在 Kibana > Security > Rules，新增 threshold rule。例如，Failed login >5/min：

```kql
event.category:authentication and event.outcome:failure | stats count by source.ip | where count > 5
```

4.12 **步驟詳解**：1. 選擇 index pattern (e.g., logs-*)。2. 設定查詢。3. 定義 threshold (e.g., count >5 in 1 min)。4. 動作：發送警報到 Slack 或 email。

4.13 **風險提示**：假陽性多？調整 threshold，避免警報疲勞。最佳實踐：測試規則於模擬環境。

## 4.2 Sigma 規則轉換
4.21 **介紹**：Sigma 是開源規則語言，github.com/SigmaHQ/sigma 有上千規則。轉換到 ELK：用 sigmac 工具 `pip install sigmac`，然後 `sigmac -t es-qs rule.yml` 生成 KQL。

4.22 **範例規則**：偵測 SSH brute force (從 Sigma 轉換)：

```yaml
title: SSH Brute Force
logsource:
  category: authentication
detection:
  selection:
    event.outcome: failure
    event.module: sshd
  condition: selection | count() by source.ip > 10 in 5m
```

4.23 **整合**：將轉換後的 KQL 貼到 Kibana rule。

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

## 5.1 Kibana ML 模組
5.11 **設定 ML Job**：在 Kibana > Machine Learning > Create job，選擇 authentication_log_rate：監控登入速率異常。

5.12 **配置詳解**：Bucket span: 15m, Detector: high_count by source.ip。啟動後，它會學習正常模式，標記偏差。

5.13 **風險**：初始學習期需資料，假陽性高。最佳實踐：結合規則使用。

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

## 5.3 真實案例分析
5.31 **SANS 案例**：2020 SolarWinds 攻擊中，anomaly 檢測捕捉異常 DLL 加載（來源：SANS ISC 報告）。在 ELK 中，用 ML job 監控 process events。

5.32 **CIS 推薦**：CIS Controls v8 強調 anomaly 檢測於 Control 12 (Boundary Defense)。

## 5.4 學習資源與進階路線
5.41 **資源**：Elastic.co Docs, SANS SEC555 (SIEM 課程)。書籍：《The Practice of Network Security Monitoring》 by Richard Bejtlich。
5.42 **進階**：學習 Splunk Free，整合 Threat Intelligence (e.g., AlienVault OTX)。
5.43 **知識圖譜連接**：藍隊 C級 - 進階 SIEM（deepweay-me/ethical-hacking/blue-team-level-c）。

⚡ **實戰要點**  
- **ML 啟用**：從預建 job 開始。  
- **OSSEC**：用於主機級檢測。  
- **測試**：模擬 anomaly 如 flood logins。  
- **里程碑**：部署 SIEM + 10 規則。  

# 6. 📊 案例研究與總結
## 6.1 深度案例：Log4Shell 檢測
6.11 **背景**：CVE-2021-44228，攻擊者用 JNDI 注入執行遠端程式碼。檢測：grep "jndi:ldap" /var/log/apache2/access.log，或在 Kibana 查詢。

6.12 **ELK 規則**：

```kql
message : /jndi:(ldap|rmi|dns)/
```

6.13 **教訓**：根據 NIST IR 8270，及時日誌分析能減輕零日攻擊影響（引用：MITRE 報告）。

## 6.2 B級里程碑
6.21 **達成標準**：部署完整 ELK，寫 10+ 規則，設定 anomaly job。總時數 40 小時。
6.22 **下一步**：練習紅藍對抗，模擬紅隊攻擊並檢測。

## 6.3 總結表格：B級技能圖譜

| 技能領域     | 關鍵概念                    | 工具/技術              | 學習重點                |
|--------------|-----------------------------|------------------------|-------------------------|
| 部署        | Docker ELK                 | Compose, YAML          | 資源管理               |
| 收集        | Beats, Syslog              | Filebeat 配置          | 多源整合               |
| 規則        | KQL, Sigma                 | Threshold/Anomaly      | 假陽性控制             |
| 檢測        | ML Jobs, OSSEC             | Rules XML              | 即時警報               |

恭喜！你現在是日誌分析高手了。記住，藍隊的精髓是持續學習——下個挑戰等著你！（總字數約 4200 字）