---
source: TXT_mega-distill_2-final-output_3-skill-library_3.1-ethical-hacking_34-blue-team-level-b-15-5-4.md
distilled_at: 2026-02-14T09:33:28.702Z
model: grok-4-1-fast-non-reasoning
---

# 道德黑客藍隊 - B級：日誌分析與 SIEM 入門

**Slug**：ethical-hacking-blue-team-level-b  
**類別**：deepweay-me/ethical-hacking  
**標籤**：[藍隊, SIEM, ELK, splunk-free, log分析, anomaly]  
**語言**：zh-TW  
**創建日期**：2026-02-12  
**來源**：kilo-code-distilled  
**向量準備**：true  
**嵌入模型**：BAAI/bge-m3  
**等級**：B  
**團隊**：blue  
**先決條件**：level-a  
**蒸餾者**：grok-4-0709  
**蒸餾時間**：2024-07-20T12:00:00Z  
**部分**：15  

---

## 介紹

在道德黑客的藍隊防禦領域，**B級**聚焦於**日誌分析與 SIEM（Security Information and Event Management）入門**。藍隊負責偵測、回應與防禦攻擊，而日誌是現代安全運營（SecOps）的核心。SIEM 系統能集中收集、分析與視覺化日誌，幫助識別異常（anomaly）與威脅。

本文件基於藍隊 A級基礎，介紹實務部署 ELK Stack（Elasticsearch、Logstash、Kibana）、Splunk Free，以及基本規則撰寫。主題強調**從被動收集到主動檢測**的轉變，適用於中小型環境。

**為何重要？** 攻擊者常透過隱藏蹤跡規避即時檢測，日誌分析可追溯事件，提供 forensic 證據。根據 SANS 報告，80% 的攻擊可透過日誌提早發現。

---

## 核心概念

### 日誌分析基礎
- **日誌類型**：系統日誌（syslog）、應用日誌（Apache/Nginx）、安全日誌（Windows Event Logs、auth.log）。
- **挑戰**：高量噪音、格式不一、時間同步問題。
- **脈絡**：藍隊需過濾噪音，聚焦異常如暴力破解（brute-force）或權限提升。

### SIEM 簡介
- **功能**：收集（ingest）、索引、搜尋、警示（alerting）、儀表板（dashboard）。
- **開源 vs 商業**：ELK（免費）、Splunk（企業級，Free 版限 500MB/日）。
- **藍隊角色**：部署 SIEM → 定義規則 → 監控 anomaly → 調查事件。

### 關鍵工具
| 工具 | 描述 | 優點 | 藍隊應用 |
|------|------|------|----------|
| **ELK Stack** | Elasticsearch (儲存)、Logstash (處理)、Kibana (視覺化) | 開源、可擴展 | 日誌集中、anomaly 偵測 |
| **Splunk Free** | 商業 SIEM 免費版 | 強大查詢語言 (SPL) | 快速原型、規則測試 |
| **OSSEC** | 開源 HIDS (Host Intrusion Detection System) | 主機級檢測 | 整合 SIEM，監控檔案變更/入侵 |

---

## 部署指南（步驟式）

### 1. 環境準備（先決：Level A 的 Linux 基礎）
- 安裝 Docker 或 Ubuntu 22.04。
- 開啟必要端口：9200 (Elasticsearch)、5601 (Kibana)、514 (syslog UDP)。

### 2. ELK Stack 快速部署
```bash
# 使用 Docker Compose (elastic.co 示例)
curl -O https://raw.githubusercontent.com/elastic/docker-compose-files/main/elasticsearch/elasticsearch.yml
docker-compose up -d
```
- **配置 Logstash**：解析 syslog，過濾 IP/時間戳。
- **Kibana 儀表板**：預建模板監控登入失敗。

### 3. Splunk Free 安裝
- 下載自 splunk.com，單機部署。
- 啟用 Forwarders 收集遠端日誌。

### 4. OSSEC 整合（主機級檢測）
- 安裝：`apt install ossec-hids-server`。
- 配置：監控 `/var/log/auth.log`，產生警報送至 SIEM。

**里程碑**：部署 SIEM + 撰寫 10 個規則（如偵測 >5 次失敗登入）。

---

## 實戰要點與測試

### ML 啟用（Machine Learning 異常偵測）
- **從預建 job 開始**：ELK Machine Learning 模組內建登入 anomaly 模型。
- 配置：Kibana → ML → Create Job → 選擇 "rare" 或 "frequent" 登入模式。

### 測試情境
- **模擬 anomaly**：
  1. Flood logins：`for i in {1..100}; do ssh invalid@target; done`。
  2. 觀察 SIEM：搜尋 `failed_login > 10`，觸發警報。
- **預期結果**：儀表板顯示峰值，ML 標記為 outlier。

### 規則撰寫範例（Splunk SPL / ELK Query）
```splunk
# Splunk：偵測暴力破解
index=security sourcetype=auth (action=failure) | stats count by src_ip | where count > 5
```
```elastic
# ELK：Kibana Query
event.code: "4625" AND source.ip: * | bucket_span: 5m | anomaly_score > 75
```

**OSSEC 規則**：自訂 decoder 解析自訂日誌，警報等級 10。

---

## 常見陷阱與最佳實務
- **效能**：索引過多欄位導致延遲，使用 ILM (Index Lifecycle Management)。
- **噪音管理**：白名單信任 IP，基線正常流量。
- **安全**：啟用 X-Pack 認證，限制 Kibana 存取。
- **規模化**：中小環境用單節點，大型用 Beats (Filebeat) 代理。

---

## 學習資源與進階路線 (5.4)

### 資源 (5.41)
- **Elastic.co Docs**：官方 ELK 指南（elastic.co/guide）。
- **SANS SEC555**：SIEM 深度課程，涵蓋規則工程。
- **書籍**：《The Practice of Network Security Monitoring》 by Richard Bejtlich – 日誌監控聖經，強調 NSM（Network Security Monitoring）。

### 進階 (5.42)
- 學習 **Splunk Free**：練習 SPL 查詢，模擬攻擊。
- 整合 **Threat Intelligence**：如 AlienVault OTX API，拉取 IOC（Indicators of Compromise）至 SIEM。

### 知識圖譜連接 (5.43)
- **藍隊 C級 - 進階 SIEM**（[deepweay-me/ethical-hacking/blue-team-level-c](deepweay-me/ethical-hacking/blue-team-level-c)）：擴展至 EDR、自動化 SOAR。

---

## 總結與里程碑
完成本級，即能獨立部署 SIEM、分析日誌並偵測基本 anomaly。**實戰里程碑**：SIEM 上線 + 10 規則 + 成功測試 flood logins。

進階至 C級前，實作 Threat Intel 整合。藍隊之路，從日誌開始 – **記住：每筆日誌都是故事，學會傾聽**。

**下一級預覽**：進階 SIEM、自動化回應。