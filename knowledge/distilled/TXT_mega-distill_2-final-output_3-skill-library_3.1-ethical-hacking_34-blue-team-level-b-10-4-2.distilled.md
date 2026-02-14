---
source: TXT_mega-distill_2-final-output_3-skill-library_3.1-ethical-hacking_34-blue-team-level-b-10-4-2.md
distilled_at: 2026-02-14T09:30:50.474Z
model: grok-4-1-fast-non-reasoning
---

# 道德黑客藍隊 - B級：日誌分析與 SIEM 入門

**Slug**：ethical-hacking-blue-team-level-b  
**類別**：deepweay-me/ethical-hacking  
**標籤**：藍隊, SIEM, ELK, splunk-free, log分析, anomaly  
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
**部分**：10  

## 介紹

在道德黑客藍隊（Blue Team）的 B 級課程中，我們聚焦於**日誌分析**與 **SIEM（Security Information and Event Management）** 的入門知識。這是藍隊防禦的核心技能，能幫助你從海量日誌中偵測異常（anomaly）、入侵跡象與潛在威脅。本文將介紹開源工具如 **ELK Stack（Elasticsearch, Logstash, Kibana）**、**Sigma 規則**，以及免費 Splunk 替代方案。假設你已完成 Level A 的基礎知識（如基本網路與系統安全）。

SIEM 的價值在於**集中化日誌收集、標準化分析與即時警示**。例如，偵測 SSH 暴力破解（Brute Force）攻擊，從而阻擋惡意 IP。

## 核心概念

### 1. SIEM 與日誌分析基礎
- **SIEM 簡介**：SIEM 系統整合多來源日誌（如系統、應用、網路），提供搜尋、關聯與警示功能。常見開源方案：
  - **ELK Stack**：Elasticsearch（儲存/搜尋）、Logstash（處理）、Kibana（視覺化）。
  - **Splunk Free**：企業級工具，免費版限 500MB/日，適合入門。
- **日誌分析流程**：
  1. 收集（e.g., Syslog, Windows Event Logs）。
  2. 標準化（解析格式）。
  3. 規則匹配（偵測異常）。
  4. 警示與調查。
- **異常偵測（Anomaly Detection）**：不僅依賴簽名規則，還使用統計方法（如頻率門檻）識別偏差行為。

### 2. Sigma：開源通用規則語言
Sigma 是藍隊的標準化武器，**獨立於特定 SIEM**，讓規則跨平台通用。
- **官方倉庫**： [github.com/SigmaHQ/sigma](https://github.com/SigmaHQ/sigma)，包含**上千條規則**，涵蓋 Windows、Linux、雲端、網路等。
- **結構**：
  ```yaml
  title: Rule Name
  logsource:
    category: authentication  # 日誌來源類別
  detection:
    selection:
      field: value  # 事件條件
    condition: selection | count() by source.ip > 10  # 聚合條件
  ```
- **優勢**：社群貢獻，易轉換到 ELK、Splunk、QRadar 等。

### 3. 將 Sigma 轉換到 ELK（Kibana）
使用 **sigmac** 工具將 Sigma YAML 轉為 **KQL（Kibana Query Language）** 或其他格式。
- **安裝**：
  ```bash
  pip install sigmac
  ```
- **轉換命令**：
  ```bash
  sigmac -t es-qs rule.yml  # -t es-qs：輸出 Elasticsearch Query String (KQL)
  ```
- **輸出範例**：轉換後的 KQL 可直接貼入 Kibana 的 **Detection Rules** 或 **Lens 查詢**。

#### 範例：偵測 SSH Brute Force 攻擊
從 Sigma 倉庫下載 `linux/auth/sshd_bruteforce.yml`，轉換後的規則：
- **Logsource**：
  ```yaml
  category: authentication  # Linux SSH 登入日誌
  ```
- **Detection**：
  ```yaml
  selection:
    event.outcome: failure  # 登入失敗
    event.module: sshd      # SSH 服務模組
  condition: selection | count() by source.ip > 10 in 5m  # 同一 IP 在 5 分鐘內失敗 >10 次
  ```
- **轉換後 KQL**（sigmac 輸出）：
  ```
  event.outcome: "failure" and event.module: "sshd" | stats count() by source.ip | where count > 10
  ```
- **時間視窗**：使用 Kibana 的 `in 5m` 語法指定 5 分鐘內聚合。

### 4. 整合步驟：ELK 中的部署
1. **準備 ELK**：部署 ELK Stack（Docker 或雲端如 Elastic Cloud）。
2. **匯入日誌**：配置 Logstash 收集 `/var/log/auth.log`（Linux SSH 日誌）。
3. **轉換 Sigma**：執行 `sigmac` 生成 KQL。
4. **建立 Kibana Rule**：
   - 前往 Kibana > **Security > Rules** > **Create Rule**。
   - 貼上 KQL，設定**時間範圍**（e.g., 5m）、**嚴重度**（High）、**動作**（Email/Slack 警示）。
5. **測試**：模擬攻擊（`hydra -l user -P passlist.txt ssh://target`），觀察警示。

| 步驟 | 工具/命令 | 輸出 |
|------|-----------|------|
| 1. 下載規則 | `git clone https://github.com/SigmaHQ/sigma` | rule.yml |
| 2. 轉換 | `sigmac -t es-qs rule.yml` | KQL 查詢 |
| 3. 貼入 Kibana | Kibana UI | 自動警示 |

### 5. 進階技巧與 Splunk Free 替代
- **Splunk Free 整合**：下載 Splunk Enterprise Free，使用 `sigmac -t splunk-spl` 轉換規則，貼入 Splunk 的 **Search**。
- **Anomaly 擴展**：
  - 使用 ML（如 Elastic ML Jobs）偵測基線偏差。
  - 結合 Sigma 的聚合：`count() by user.ip > threshold`。
- **常見挑戰**：
  | 問題 | 解決 |
  |------|------|
  | 日誌格式不符 | 使用 Logstash Grok 解析 |
  | 假陽性 | 調整門檻（e.g., >20 次）或白名單 |
  | 效能 | 索引優化，僅監控關鍵來源 |

## 實作練習
1. 安裝 ELK + sigmac。
2. 下載 SSH Brute Force 規則，轉換並測試。
3. 擴展：偵測 PowerShell 下載（Sigma: `windows/process_creation/proc_creation_powershell_downloader.yml`）。

## 結論與下一步
掌握 Sigma + ELK 是藍隊日誌分析的基石，能有效提升偵測率。本級結束後，進階到 C 級：自訂規則與機器學習 anomaly。參考 [SigmaHQ 文檔](https://sigmahq.io/docs) 與 Elastic 教學。

**安全提醒**：僅用於授權環境，遵守法規。