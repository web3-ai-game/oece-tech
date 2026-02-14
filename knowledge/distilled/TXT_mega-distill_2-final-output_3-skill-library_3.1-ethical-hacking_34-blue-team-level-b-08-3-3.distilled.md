---
source: TXT_mega-distill_2-final-output_3-skill-library_3.1-ethical-hacking_34-blue-team-level-b-08-3-3.md
distilled_at: 2026-02-14T09:35:44.701Z
model: grok-4-1-fast-non-reasoning
---

# 道德黑客藍隊 - B級：日誌分析與 SIEM 入門

**Slug**: ethical-hacking-blue-team-level-b  
**類別**: deepweay-me/ethical-hacking  
**標籤**: [藍隊, SIEM, ELK, splunk-free, log分析, anomaly]  
**語言**: zh-TW  
**建立日期**: 2026-02-12  
**來源**: kilo-code-distilled  
**向量準備**: true  
**嵌入模型**: BAAI/bge-m3  
**等級**: B  
**團隊**: blue  
**先決條件**: level-a  
**蒸餾者**: grok-4-0709  
**蒸餾時間**: 2024-07-20T12:00:00Z  
**部分**: 8  

---

## 介紹

在道德黑客藍隊（Blue Team）的 B 級課程中，我們聚焦於**日誌分析**與 **SIEM（Security Information and Event Management）入門**。藍隊防禦的核心在於及時偵測與回應威脅，而日誌是攻擊蹤跡的首要來源。本文基於 NIST 標準與真實案例，介紹從日誌收集到異常偵測的完整流程。

**為何重要？**  
攻擊者常試圖隱藏蹤跡（如刪除日誌），藍隊必須主動收集並分析日誌。SIEM 系統（如 ELK Stack 或 Splunk Free）將分散日誌集中化，提供視覺化與自動化警報。本級先決條件為 Level A（基礎網路與系統知識），適合初階防禦工程師。

---

## 核心概念

### NIST SP 800-92：電腦安全日誌管理指南
NIST SP 800-92 是日誌管理的權威標準，強調：
- **收集範圍**：涵蓋所有關鍵系統，包括伺服器、網路設備、應用程式與端點。
- **優先級**：安全事件（如登入失敗、權限提升）優先於一般系統日誌。
- **最佳實務**：
  | 原則 | 說明 |
  |------|------|
  | 完整性 | 日誌不可篡改，使用時間戳與雜湊驗證。 |
  | 保留期 | 至少 90 天，依合規（如 GDPR）調整。 |
  | 集中化 | 避免分散儲存，轉向 SIEM。 |

**脈絡補充**：此指南源自美國國家標準與技術研究院，廣泛應用於企業與政府。忽略它，可能導致如 Equifax 事件的悲劇。

### Equifax 洩露事件 (2017)
- **事件概述**：駭客利用 Apache Struts 漏洞竊取 1.47 億用戶資料，持續 76 天未被發現。
- **教訓**：缺乏**集中日誌管理**，導致攻擊未及時檢測（SANS Institute 報告）。
- **藍隊啟示**：分散日誌無法即時關聯事件；SIEM 可透過模式匹配（如異常流量）在數小時內警報。

### MITRE ATT&CK T1070：主機指標移除 (Indicator Removal on Host)
- **攻擊術**：駭客清除 Windows Event Logs 或 Linux syslog，隱藏入侵證據。
- **防禦策略**：**及時遠端收集**日誌，對抗此術。
- **脈絡**：MITRE ATT&CK 是藍隊必備框架，T1070 常見於 APT 攻擊（如 ransomware）。SIEM 的即時攝取可保留「刪除前」日誌。

---

## SIEM 入門：ELK Stack 與 Splunk Free
SIEM 整合日誌收集（Beats/Filebeat）、儲存（Elasticsearch）、查詢（Kibana）與警報。

### 架構圖
```
來源系統 (syslog, Windows Events) 
    ↓ Filebeat/Winlogbeat
SIEM (ELK: Elasticsearch + Logstash + Kibana)
    ↓ 索引與搜尋
偵測規則 → 警報 (Email/Slack)
```

**推薦工具**：
- **ELK Stack**：開源免費，適合入門。
- **Splunk Free**：每日 500MB 限制，易用介面。

---

## 實戰要點

### 1. 配置重點：從單檔開始
- **Filebeat 配置範例**（/etc/filebeat/filebeat.yml）：
  ```yaml
  filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/*.log  # 配置重點：paths 正確指向日誌檔
  output.elasticsearch:
    hosts: ["localhost:9200"]  # output 正確指向 ES
  ```
- **驗證**：`filebeat test config` 和 `filebeat test output`。

### 2. 測試流程
- **總是用 test 命令驗證**：避免生產環境崩潰。
  | 步驟 | 命令 | 目的 |
  |------|------|------|
  | 1. 配置檢查 | `filebeat test config` | 語法正確 |
  | 2. 連線測試 | `filebeat test output` | SIEM 可達 |
  | 3. 模擬資料 | `filebeat test generate` | 產生測試事件 |

### 3. 規模擴展
- **階段**：單檔 → 多源（syslog + auth.log）→ 全系統。
- **資源**： [Elastic Docs - Beats Guide](https://www.elastic.co/guide/en/beats/filebeat/current/index.html)。

### 4. Splunk Free 快速上手
- 上傳日誌 → 建立索引 → Kibana-like 儀表板。

---

## 檢測規則：SIEM 的靈魂

規則定義「異常」，從簡單閾值到機器學習。

### 規則類型
| 等級 | 範例 | 工具 |
|------|------|------|
| 入門 | 登入失敗 > 10 次/分 | Kibana 規則 |
| 中階 | 權限提升 + 異常 IP | Sigma 規則轉換 |
| 高階 | 行為基線偏差 | ML Anomaly Detection |

### Kibana 規則入門
1. **建立 Threshold Rule**：
   - 條件：`event.category: authentication AND event.outcome: failure` > 10。
   - 動作：Slack 通知。
2. **從 Sigma 轉換**：使用 `sigma convert` 工具，將開放規則匯入 ELK。

**範例 Sigma 規則**（偵測 T1070）：
```yaml
title: Suspicious Log Clearing
logsource:
  category: process_creation
detection:
  selection:
    Image\|endswith: '\wevtutil.exe'
    CommandLine\|contains: 'cl'  # clear-log
condition: selection
```

**脈絡**：Sigma 是跨 SIEM 的開放標準，藍隊可重複使用社區規則。

---

## 結論與進階路徑
掌握日誌分析是藍隊從被動到主動防禦的轉折點。從 NIST 原則出發，實作 ELK 配置，並建立首個偵測規則。避免 Equifax 式失誤，對抗 MITRE T1070 等術。

**下級預覽 (C級)**：進階 Sigma、威脅狩獵與 SOAR 整合。  
**實作��戰**：部署 ELK，模擬攻擊並偵測。

**參考資源**：
- NIST SP 800-92 (完整 PDF)
- MITRE ATT&CK Navigator
- Elastic Security Labs

此文檔經 grok-4-0709 蒸餾，確保實戰導向。