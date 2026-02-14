---
source: TXT_mega-distill_2-final-output_3-skill-library_3.1-ethical-hacking_34-blue-team-level-b-13-5-2.md
distilled_at: 2026-02-14T09:30:21.060Z
model: grok-4-1-fast-non-reasoning
---

# 道德黑客藍隊 - B級：日誌分析與 SIEM 入門

**Slug**：ethical-hacking-blue-team-level-b  
**類別**：deepweay-me/ethical-hacking  
**標籤**：藍隊, SIEM, ELK, splunk-free, log分析, anomaly  
**語言**：zh-TW  
**建立日期**：2026-02-12  
**來源**：kilo-code-distilled  
**Vector Ready**：true  
**Embedding Model**：BAAI/bge-m3  
**等級**：B  
**團隊**：blue  
**先決條件**：level-a  
**蒸餾者**：grok-4-0709  
**蒸餾時間**：2024-07-20T12:00:00Z  
**部分**：13  

---

## 介紹

在道德黑客藍隊（Blue Team）的 B 級課程中，我們聚焦於**日誌分析**與 **SIEM（Security Information and Event Management）系統**的入門應用。本單元主題為 **OSSEC HIDS 伺服器**的整合，用於即時偵測與分析系統日誌。OSSEC（Open Source HIDS SECurity）是一個開源的主機入侵偵測系統（HIDS），擅長監控檔案變更、系統日誌與根除套件偵測。

透過本課程，您將學習：
- 安裝與設定 OSSEC 伺服器
- 撰寫自訂規則偵測 SSH 失敗登入攻擊（`authentication_failures`）
- 將 OSSEC Agent 日誌整合至 **ELK 堆疊（Elasticsearch, Logstash, Kibana）**
- 使用 OSSEC Decoders 解析自訂日誌格式

此課程適合已完成 **Level A**（基礎藍隊概念）的學習者，強調實作導向的防禦技能。

---

## 核心概念

### 1. OSSEC HIDS 簡介
OSSEC 是一個輕量級、跨平台的 HIDS，能夠：
- 收集並分析系統日誌（syslog, auth.log 等）
- 偵測檔案完整性變更（File Integrity Monitoring, FIM）
- 主動回應警報（Active Response，如封鎖 IP）

**藍隊應用**：OSSEC 作為 SIEM 的前端，負責日誌規範化與初步規則匹配，將警報轉發至後端如 ELK 或 Splunk Free。

### 2. SIEM 與日誌流程
```
Client (OSSEC Agent) → OSSEC Server → Logstash (ELK) → Elasticsearch → Kibana Dashboard
```
- **OSSEC Agent**：部署在端點，收集本地日誌並發送至 Server。
- **OSSEC Server**：集中分析，套用規則產生警報。
- **Logstash**：接收 OSSEC JSON 日誌，解析並索引至 Elasticsearch。
- **Kibana**：視覺化異常（如 SSH 暴力破解）。

### 3. 自訂規則與 Decoder
- **規則（Rules）**：基於正則匹配日誌，觸發警報等級（Level 0-16）。
- **Decoder**：解析非標準日誌格式，讓 OSSEC 理解自訂應用程式輸出。

---

## 關鍵步驟：OSSEC 安裝與設定

### 步驟 1：安裝 OSSEC HIDS Server
在 Ubuntu/Debian 系統上執行：
```bash
sudo apt update
sudo apt install ossec-hids-server
```
- 安裝後，OSSEC 預設位於 `/var/ossec/`。
- 驗證：`sudo /var/ossec/bin/ossec-control status`。

### 步驟 2：編輯設定檔
編輯主設定檔 `/var/ossec/etc/ossec.conf`：
```xml
<ossec_config>
  <!-- 啟用 JSON 輸出，用於 ELK 整合 -->
  <global>
    <jsonout_output>yes</jsonout_output>
  </global>
  
  <!-- 本地規則引用 -->
  <rules>
    <include>local_rules.xml</include>
  </rules>
</ossec_config>
```

### 步驟 3：建立自訂規則
在 `/var/ossec/etc/rules/local_rules.xml` 中添加 SSH 失敗登入偵測規則：

```xml
<group name="local,ssh,">
  <!-- 單一 SSH 失敗登入（Level 5） -->
  <rule id="100004" level="5">
    <if_sid>5700</if_sid>
    <match>sshd.*Failed password</match>
    <description>SSH authentication failure for user</description>
    <group>authentication_failed,pci_dss_10.2.4,pci_dss_10.2.1,gdpr_IV_35.7.d/</group>
  </rule>
  
  <!-- 多重 SSH 失敗登入（Level 10，高風險） -->
  <rule id="100005" level="10">
    <if_sid>100004</if_sid>
    <same_source_ip />
    <frequency>5</frequency>
    <timeframe>120</timeframe>  <!-- 2 分鐘內 5 次 -->
    <description>Multiple SSH failures from same IP - Possible brute force attack</description>
    <group>authentication_failures,attack,</group>
  </rule>
</group>
```

**規則解釋**：
- `<if_sid>5700</if_sid>`：繼承 OSSEC 內建 SSH 規則。
- `<match>`：正則匹配 `/var/log/auth.log` 中的 "Failed password"。
- `<frequency>`：在指定 `<timeframe>` 內的重複次數觸發高級警報。
- **群組**：`authentication_failures` 用於 Kibana 過濾。

### 步驟 4：OSSEC Decoder（進階：自訂日誌解析）
若有自訂應用日誌，新增 `/var/ossec/etc/decoders/local_decoders.xml`：
```xml
<decoder name="custom_app">
  <prematch>^custom_app: </prematch>
  <regex>user=(\w+), action=(\w+), ip=(\S+)</regex>
  <order>user,action,ip</order>
</decoder>
```

### 步驟 5：啟動與測試
```bash
sudo /var/ossec/bin/ossec-control restart
sudo /var/ossec/bin/ossec-logtest  # 測試規則
```
模擬攻擊：從另一主機多次 SSH 失敗登入，檢查 `/var/ossec/logs/alerts/alerts.log` 中的 Level 10 警報。

---

## ELK 堆疊整合

### Logstash 設定（`/etc/logstash/conf.d/ossec.conf`）
```conf
input {
  beats {
    port => 5044
  }
  # 或直接 TCP 接收 OSSEC
  tcp {
    port => 1514
    type => "ossec"
  }
}

filter {
  if [type] == "ossec" {
    json {
      source => "message"
    }
    # 解析 OSSEC 警報
    mutate {
      add_field => { "alert_level" => "%{[decoder][level]}" }
      add_field => { "rule_group" => "%{[decoder][group]}" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "ossec-%{+YYYY.MM.dd}"
  }
}
```
- 啟動：`sudo systemctl restart logstash`
- 在 Kibana 建立 Dashboard，過濾 `rule_group: authentication_failures` 與 `alert_level >= 10`。

---

## 實務提示與異常偵測（Anomaly）
- **常見攻擊**：SSH 暴力破解（高頻 `Failed password`）、權限提升。
- **效能優化**：僅監控關鍵日誌（如 `/var/log/auth.log`）。
- **免費替代**：Splunk Free（每日 500MB），匯入 OSSEC 日誌檔案。
- **進階挑戰**：整合 OSSEC Active Response 自動封鎖可疑 IP（iptables）。

---

## 結語與下一步
完成本單元後，您能建置基本的 SIEM 管道，偵測常見身份驗證攻擊。**下一課程（Level C）**：進階異常偵測與機器學習整合。

**練習**：
1. 部署 OSSEC Agent 至多台伺服器。
2. 在 Kibana 視覺化 SSH 失敗趨勢。
3. 自訂規則偵測其他服務（如 Apache 401 錯誤）。

參考文件： [OSSEC Documentation](https://ossec.github.io/) | [ELK OSSEC Integration](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-module-ossec.html)