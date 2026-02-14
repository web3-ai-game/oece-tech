---
source: TXT_mega-distill_2-final-output_3-skill-library_3.1-ethical-hacking_34-blue-team-level-b-12-5-1.md
distilled_at: 2026-02-14T09:28:01.142Z
model: grok-4-1-fast-non-reasoning
---

# 道德黑客藍隊 - B級：日誌分析與 SIEM 入門

**類別**：deepweay-me/ethical-hacking  
**標籤**：[藍隊, SIEM, ELK, splunk-free, log分析, anomaly]  
**語言**：zh-TW  
**建立日期**：2026-02-12  
**來源**：kilo-code-distilled  
**Vector Ready**：true  
**Embedding Model**：BAAI/bge-m3  
**等級**：B  
**團隊**：blue  
**先決條件**：level-a  
**蒸餾者**：grok-4-0709  
**蒸餾日期**：2024-07-20T12:00:00Z  
**部分**：12

## 介紹

在道德黑客藍隊（Blue Team）的實務中，日誌分析與 SIEM（Security Information and Event Management）系統是防禦核心。ELK Stack（Elasticsearch、Logstash、Kibana）作為開源 SIEM 解決方案，提供強大的日誌收集、索引與視覺化功能。本文件聚焦 B 級入門，介紹 Kibana Machine Learning (ML) 模組，用於異常檢測（如登入速率異常），幫助藍隊成員快速部署並監控潛在威脅。先決條件為 Level A（基礎日誌收集與查詢）。

SIEM 的價值在於將海量日誌轉化為可行動洞察，透過機器學習自動識別偏差行為，補充傳統規則的不足。

## 核心概念

### SIEM 與日誌分析基礎
- **SIEM 角色**：整合多源日誌（如系統、網路、應用），進行即時監控、相關分析與警報。
- **ELK Stack 優勢**：免費開源（Splunk Free 替代）、可擴展，支持 ML 異常檢測。
- **異常檢測（Anomaly Detection）**：機器學習模型學習「正常」基線，標記偏差（如突然激增的登入嘗試），適用於零日攻擊或內部威脅。

### Kibana ML 模組
Kibana ML 是 ELK 的內建機器學習功能，用於無監督異常檢測。常見應用包括：
- 監控登入速率（authentication_log_rate）。
- 偵測高流量 IP、異常使用者行為等。

**關鍵事實**：
- 自動學習歷史資料，建立正常模式。
- 支援多種偵測器（detector），如計數（count）、高計數（high_count）。

## 設定 ML Job 指南

### 步驟 1：存取 Kibana ML
1. 登入 Kibana 儀表板。
2. 導航至 **Kibana > Machine Learning > Create job**。

### 步驟 2：選擇與配置 Job
- **預設範本**：選擇 `authentication_log_rate`（專用於監控登入速率異常）。
- **配置詳解**：
  | 參數          | 值    | 說明 |
  |---------------|-------|------|
  | **Bucket span** | 15m  | 時間桶大小，每 15 分鐘聚合一次資料。過短易噪音，過長延遲偵測。 |
  | **Detector**     | high_count by source.ip | 偵測每個 `source.ip` 的高計數事件。模型學習正常登入速率，標記異常峰值（如暴力破解）。 |

- **其他設定**：
  - **資料饋送**：選擇索引模式（如 `auth-*` 或 `logs-*`），確保包含登入事件（如 SSH、Windows 登入）。
  - **影響分數**：自動計算異常嚴重度（0-100），高分優先調查。

### 步驟 3：啟動與監控
- 儲存並啟動 Job。
- 功能：模型需初始學習期（至少 7 天資料），之後標記偏差為「異常」（anomaly）。
- 視覺化：在 **Anomaly Explorer** 查看時間線、IP 貢獻圖。

**範例查詢過濾**（在 Job 設定中）：
```
event.category: "authentication" AND event.outcome: "failure"
```
這聚焦失敗登入，強化暴力破解偵測。

## 風險與限制

- **初始學習期**：需足夠歷史資料（建議 2-4 週），否則模型不準。
- **假陽性率高**：正常變動（如維護高峰）可能觸發警報。脈絡：新部署環境噪音大，需手動調整閾值。
- **資源需求**：ML Job 消耗 CPU/記憶體，生產環境監控 X-Pack 授權（免費版有限制）。

## 最佳實踐

- **結合規則使用**：ML 異常 + Kibana 規則（如 Sigma 規則）雙重驗證，降低假陽性。
  - 範例：ML 標記異常後，觸發 Sigma 規則檢查 IOC（Indicators of Compromise）。
- **調優技巧**：
  - 調整 bucket span 至業務週期（e.g., 5m 給高頻環境）。
  - 使用多偵測器：新增 `rare by user.name` 偵測罕見使用者。
  - 定期審核：每週檢查 Anomaly Results，排除已知假陽性。
- **擴展應用**：
  | 場景          | ML Job 範本          | 偵測目標 |
  |---------------|----------------------|----------|
  | 登入異常     | authentication_log_rate | source.ip 高計數 |
  | 網路流量     | network_traffic_count | dest.port 偏差 |
  | 檔案存取     | file_access_rate     | host.name 異常 |

- **Splunk Free 替代**：若偏好 Splunk，使用內建 MLTK（Machine Learning Toolkit）模擬相同功能，但 ELK 更適合開源環境。

## 結論與下一步

本入門掌握 Kibana ML 後，藍隊可從被動日誌搜尋轉向主動異常狩獵。實務中，整合 Alerting 發送 Slack/Email 通知，提升響應速度。

**進階資源**：
- ELK 官方文件：[Kibana ML](https://www.elastic.co/guide/en/machine-learning)
- 實作 Lab：部署 auth 日誌，監控模擬暴力破解。

透過持續練習，將 ML 融入 SOC（Security Operations Center）流程，強化道德黑客防禦能力。