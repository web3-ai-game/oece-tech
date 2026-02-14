---
source: TXT_mega-distill_2-final-output_3-skill-library_3.1-ethical-hacking_34-blue-team-level-b-17-6-2.md
distilled_at: 2026-02-14T09:21:26.364Z
model: grok-4-1-fast-non-reasoning
---

# 道德黑客藍隊 - B級：日誌分析與 SIEM 入門

**Slug**: ethical-hacking-blue-team-level-b  
**類別**: deepweay-me/ethical-hacking  
**標籤**: [藍隊, SIEM, ELK, splunk-free, log分析, anomaly]  
**語言**: zh-TW  
**建立日期**: 2026-02-12  
**來源**: kilo-code-distilled  
**Vector Ready**: true  
**Embedding Model**: BAAI/bge-m3  
**等級**: B  
**團隊**: blue  
**先決條件**: level-a  
**蒸餾者**: grok-4-0709  
**蒸餾日期**: 2024-07-20T12:00:00Z  
**部分**: 17  

---

## 介紹

歡迎來到**道德黑客藍隊 B 級**課程：**日誌分析與 SIEM 入門**。本課程聚焦於藍隊（Blue Team）核心技能，教你如何透過日誌分析和 SIEM（Security Information and Event Management，安全資訊與事件管理）系統，檢測網路中的異常行為與潛在威脅。

### 為什麼學習日誌分析與 SIEM？
- **藍隊角色**：藍隊負責防禦，SIEM 是現代 SOC（Security Operations Center）的核心工具，能即時收集、分析海量日誌，識別攻擊跡象。
- **從 A 級到 B 級**：A 級（先決條件）已掌握基礎網路與系統知識；B 級進入實戰，學習部署 SIEM、撰寫檢測規則，並進行異常檢測（anomaly detection）。
- **主題焦點**：部署 ELK Stack 或 Splunk Free，處理日誌、建立規則，總計 40 小時實作。

**預期成果**：完成後，你能獨立建置 SIEM 環境，檢測常見攻擊如暴力破解、資料外洩等。

---

## 核心概念

### 1. 日誌分析基礎
日誌（Logs）是系統、應用程式、網路設備產生的記錄檔，記錄使用者行為、系統事件等。藍隊透過分析日誌，重建攻擊時間線（Timeline）。

- **日誌類型**：
  | 類型 | 來源 | 範例用途 |
  |------|------|----------|
  | **系統日誌** | /var/log/syslog (Linux), Event Viewer (Windows) | 登入失敗、服務啟動 |
  | **應用日誌** | Apache/Nginx access/error log | HTTP 請求、SQL 注入嘗試 |
  | **網路日誌** | Firewall/IDS (e.g., Suricata) | 異常流量、端口掃描 |
  | **安全日誌** | Auth.log, Windows Security | 權限變更、特權提升 |

- **分析流程**：
  1. **收集**：聚合多源日誌。
  2. **標準化**：轉換為統一格式（如 JSON）。
  3. **索引與搜尋**：使用 SIEM 查詢。
  4. **相關性分析**：連結事件（如 IP 多次失敗登入 → 暴力破解）。
  5. **視覺化**：儀表板顯示趨勢。

### 2. SIEM 簡介
SIEM 整合日誌管理（SIM）與事件管理（SEM），支援即時警示與歷史調查。

- **關鍵功能**：
  - **聚合**：集中多源日誌。
  - **規則引擎**：自訂檢測規則（e.g., "5 分鐘內 10 次失敗登入"）。
  - **異常檢測**：機器學習識別基線偏差（anomaly）。
  - **警示**：Email/Slack 通知。

### 3. 關鍵工具
| 工具 | 描述 | 優點 | 免費版限制 |
|------|------|------|------------|
| **ELK Stack** (Elasticsearch + Logstash + Kibana) | 開源 SIEM 套件 | 免費、無限擴展、彈性 | 需自建伺服器 |
| **Splunk Free** | 商業 SIEM 免費版 | 易用 GUI、強大搜尋 | 每日 500MB 索引上限 |

**推薦起步**：用 Docker 快速部署 ELK，練習 Splunk Free 學習語法。

---

## B 級實作指南

### 環境準備（先決條件：Level A）
- **硬體**：Ubuntu 22.04 VM (8GB RAM, 4 CPU)。
- **工具安裝**：
  ```bash
  # Docker 部署 ELK (單機版)
  docker-compose up -d  # 使用官方 docker-compose.yml
  ```
- **日誌來源**：Syslog-NG、Filebeat、模擬攻擊工具（如 Atomic Red Team）。

### 6.21 達成標準（40 小時總計）
完成以下里程碑，即達 B 級標準：

1. **部署完整 ELK Stack (10 小時)**：
   - 安裝 Elasticsearch (搜尋引擎)、Logstash (資料處理)、Kibana (視覺化)。
   - 配置 Filebeat 收集主機日誌。
   - 驗證：Kibana 中看到即時日誌。

2. **撰寫 10+ 規則 (15 小時)**：
   使用 KQL (Kibana Query Language) 或 Splunk SPL 建立檢測規則。
   
   **範例規則**（ELK Kibana Detection）：
   | 規則 ID | 描述 | KQL 查詢範例 |
   |---------|------|-------------|
   | R1 | 暴力破解 | `event.category:authentication and event.outcome:failure and source.ip:* and cardinality(source.ip) > 5` |
   | R2 | 特權提升 | `event.action:sudo and user.name:NOT root` |
   | R3 | 異常端口掃描 | `network.protocol:TCP and destination.port:22 and source.ip:*` |
   | ... (總 10+ 規則) | 涵蓋 MITRE ATT&CK TTPs 如 Recon、Lateral Movement |  |

   **Splunk Free 等價**：`index=security sourcetype=auth failure | stats count by src_ip | where count>10`。

3. **設定 Anomaly Job (10 小時)**：
   - 使用 Elasticsearch ML (Machine Learning) 或 Splunk ML Toolkit。
   - **步驟**：
     1. 建立基線：正常流量（如登入次數）。
     2. 設定 Job：檢測偏差（e.g., 夜間高流量）。
     3. 警示：當分數 > 75 時觸發。
   - 範例：偵測 "異常登入高峰"。

4. **測試與驗證 (5 小時)**：
   - 模擬攻擊：使用 nmap 掃描、hydra 暴力破解。
   - 確認規則觸發警示。

**進度追蹤**：每規則記錄 False Positive 率 < 5%。

### 6.22 下一步（C 級預備）
- **紅藍對抗練習**：部署紅隊工具（如 Covenant），模擬攻擊並用 SIEM 檢測。
- **進階**：整合 OSINT、威脅情報（Threat Intel），自動化回應（SOAR）。

---

## 最佳實務與常見陷阱
- **效能優化**：ELK 索引過多 → 增加分片；Splunk 達上限 → 轉 ELK。
- **隱私考量**：匿名化敏感日誌 (e.g., PII)。
- **陷阱**：
  - 未解析日誌 → 規則失效。
  - 忽略時區 → 時間線錯亂。
  - 無基線 → Anomaly 誤報。

## 資源與參考
- **官方文件**：Elastic.co (ELK), Splunk.com/free。
- **練習環境**：TryHackMe "Splunk Rooms", HackTheBox "Blue Team Tracks"。
- **進階閱讀**：MITRE ATT&CK for 日誌映射。

**恭喜達成 B 級！** 繼續前進，成為 SOC 分析師。總時數：40 小時。🚀