---
source: TXT_mega-distill_2-final-output_3-skill-library_3.1-ethical-hacking_34-blue-team-level-b-09-4-1.md
distilled_at: 2026-02-14T09:31:48.633Z
model: grok-4-1-fast-non-reasoning
---

# 道德黑客藍隊 - B級：日誌分析與 SIEM 入門

**Slug**: ethical-hacking-blue-team-level-b  
**類別**: deepweay-me/ethical-hacking  
**標籤**: 藍隊, SIEM, ELK, splunk-free, log分析, anomaly  
**語言**: zh-TW  
**創建日期**: 2026-02-12  
**來源**: kilo-code-distilled  
**Vector Ready**: true  
**Embedding Model**: BAAI/bge-m3  
**等級**: B  
**團隊**: blue  
**先決條件**: level-a  
**蒸餾者**: grok-4-0709  
**蒸餾時間**: 2024-07-20T12:00:00Z  
**部分**: 9  

---

## 介紹

在道德黑客藍隊（Blue Team）的 B 級課程中，我們聚焦於**日誌分析與 SIEM（Security Information and Event Management）入門**。藍隊防禦的核心在於及早偵測威脅，而 SIEM 系統如 ELK Stack（Elasticsearch、Logstash、Kibana）是實現此目標的關鍵工具。本節（4.1 節）介紹 **Kibana 規則基礎**，教你如何建立偵測規則來識別異常行為，例如暴力破解攻擊。這是從 Level A（基礎日誌收集）進階到自動化威脅偵測的橋樑。

**為何重要？**  
現代攻擊隱藏在海量日誌中，手動分析不可能應付。Kibana 規則能自動化監控、產生警報，幫助藍隊快速回應。ELK 是開源首選，免費替代 Splunk，適合中小型團隊。

---

## 先決條件回顧（Level A）

- 已部署 ELK Stack（Elasticsearch 作為儲存、Kibana 作為 UI）。
- 配置 index pattern 如 `logs-*`，接收系統/應用日誌。
- 熟悉基本 KQL（Kibana Query Language）語法。

---

## 核心概念：Kibana 規則基礎（4.1 節）

Kibana 的**規則引擎**允許你定義偵測邏輯，當條件滿足時觸發警報。規則位於 **Kibana > Security > Rules**，支援多種類型，如 Threshold Rule（閾值規則，用於計數異常）。

### 規則類型示例：Threshold Rule
- **情境**：偵測失敗登入超過 5 次/分鐘（常見暴力破解指標）。
- **邏輯**：統計特定 IP 的失敗登入次數，若超過閾值則警報。

#### KQL 查詢示例
```kql
event.category:authentication and event.outcome:failure | stats count by source.ip | where count > 5
```
- **解釋**：
  - `event.category:authentication`：過濾認證相關事件。
  - `event.outcome:failure`：僅失敗事件。
  - `stats count by source.ip`：按來源 IP 統計計數。
  - `where count > 5`：篩選超過 5 次的 IP。

此查詢基於 Elastic Common Schema (ECS)，確保日誌標準化。

---

## 創建規則步驟

1. **導航與選擇 Index Pattern**：
   - 進入 **Kibana > Security > Rules > Create new rule**。
   - 選擇 **Threshold Rule**。
   - 選定 index pattern，例如 `logs-*`（涵蓋所有日誌索引）。

2. **設定查詢**：
   - 輸入 KQL 查詢：
     ```kql
     event.category:authentication and event.outcome:failure
     ```
   - 定義聚合：`Count of records` 分組於 `source.ip`，閾值 `is above 5`。

3. **定義 Threshold**：
   - 時間範圍：**1 分鐘**（Last 1 minute）。
   - 條件：`count > 5`（每分鐘超過 5 次失敗登入）。

4. **設定動作（Actions）**：
   - 選擇通知通道：Slack webhook、Email 或內建 Connector。
   - 自訂警報訊息，例如：
     ```
     偵測到可疑 IP {{context.hits.source.ip}} 失敗登入 {{context.value}} 次/分鐘！
     ```

5. **測試與啟用**：
   - 使用 **Preview** 驗證歷史資料。
   - 儲存並啟用規則。

**完整流程圖示意**：
```
Kibana UI → Create Rule → Threshold → KQL Input → Threshold (5/1min) → Actions (Slack/Email) → Test → Activate
```

---

## 風險提示與最佳實踐

### 常見風險
- **假陽性過多**：正常使用者偶爾輸錯密碼可能觸發警報，導致「警報疲勞」（Alert Fatigue）。
- **效能影響**：過多規則會消耗 Elasticsearch 資源。

### 最佳實踐
| 實踐 | 說明 | 示例 |
|------|------|------|
| **調整 Threshold** | 從保守值開始（如 >10），依環境微調 | 生產環境：>10/分鐘；測試：>5 |
| **測試於模擬環境** | 使用工具如 Atomic Red Team 產生模擬攻擊 | 執行失敗登入腳本，驗證警報 |
| **結合多規則** | 層疊規則（如失敗登入 + 異常 User-Agent） | 減少假陽性 30% |
| **定期審核** | 每週檢查規則效能與假陽性 | Kibana > Rules > Rule Actions |
| **擴展到 Anomaly** | 進階使用 Machine Learning 偵測未知威脅 | Kibana ML Jobs |

**範例調整**：若假陽性高，將查詢改為：
```kql
event.category:authentication and event.outcome:failure and not source.ip:10.0.0.* | stats count by source.ip | where count > 10
```
（排除內網 IP，提高準確性）。

---

## 進階提示與延伸閱讀

- **ELK vs. Splunk Free**：ELK 完全開源，Splunk Free 限 500MB/日。ELK 適合自建 SIEM。
- **常見 Anomaly 偵測**：流量突增、罕見端口掃描。
- **下節預覽（4.2）**：自訂 Dashboard 與 Correlation Rules。

**練習任務**：
1. 部署 ELK，匯入樣本日誌。
2. 建立上述規則，模擬攻擊測試警報。

此文檔由 grok-4-0709 蒸餾自 kilo-code-distilled，確保知識精煉且實戰導向。歡迎貢獻 Pull Request！

---

*最後更新：2026-02-12 | © deepweay-me*