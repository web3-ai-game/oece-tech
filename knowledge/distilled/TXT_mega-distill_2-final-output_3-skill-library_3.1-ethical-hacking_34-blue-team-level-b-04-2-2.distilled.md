---
source: TXT_mega-distill_2-final-output_3-skill-library_3.1-ethical-hacking_34-blue-team-level-b-04-2-2.md
distilled_at: 2026-02-14T09:27:38.083Z
model: grok-4-1-fast-non-reasoning
---

# 道德黑客藍隊 - B級：日誌分析與 SIEM 入門

**類別**：deepweay-me/ethical-hacking  
**標籤**：藍隊, SIEM, ELK, splunk-free, log分析, anomaly  
**語言**：zh-TW  
**創建日期**：2026-02-12  
**來源**：kilo-code-distilled  
**向量準備**：true  
**嵌入模型**：BAAI/bge-m3  
**等級**：B級  
**團隊**：藍隊 (Blue Team)  
**先決條件**：A級課程  
**蒸餾者**：grok-4-0709  
**蒸餾時間**：2024-07-20T12:00:00Z  
**部分**：第4部分  

---

## 介紹

在道德黑客藍隊訓練的 B 級課程中，我們聚焦於**日誌分析**與 **SIEM（Security Information and Event Management）系統**的入門知識。這是藍隊防禦核心技能，用於偵測入侵、分析攻擊模式與異常行為（anomaly detection）。本節特別介紹 **ELK Stack（Elasticsearch, Logstash, Kibana）** 中的 **Logstash 配置**，這是開源 SIEM 的關鍵組件，適合替代商業工具如 Splunk（免費版限制多）。

**藍隊角色脈絡**：紅隊（攻擊者）留下日誌足跡，藍隊透過 SIEM 收集、解析與視覺化這些日誌，及早發現威脅。ELK 是輕量、高度可自訂的選擇，廣泛用於企業環境。

**先決條件提醒**：完成 A 級基礎（網路基礎、基本工具），熟悉 Docker 與 docker-compose。

---

## 核心概念：Logstash 在 ELK 中的角色

**Logstash** 是 ELK Stack 的資料處理管道（pipeline），負責：
- **輸入（Input）**：從多來源（如 Beats、檔案、syslog）接收日誌。
- **過濾（Filter）**：解析結構化資料（如 grok 模式提取 IP、時間戳）。
- **輸出（Output）**：送至 Elasticsearch 索引，或其他目的地（如檔案、資料庫）。

這形成完整 SIEM 流程：Beats（輕量代理）→ Logstash（處理）→ Elasticsearch（儲存/搜尋）→ Kibana（儀表板）。

---

## 2.2 節：Logstash 配置範例

### 2.21 基本管道配置

創建 `logstash.conf` 檔案，這是 Logstash 的核心設定檔。以下是完整範例，適用於 Docker 環境中的 ELK Stack：

```conf
input {
  beats {
    port => 5044  # 監聽 Filebeat 等 Beats 代理的預設埠
  }
}

filter {
  grok {
    match => { 
      "message" => "%{SYSLOGBASE} %{DATA:message}" 
      # SYSLOGBASE 模式解析標準 syslog 格式（時間戳、host、程式），剩餘存為 message 欄位
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]  # Elasticsearch 容器位址與埠
    index => "logs-%{+YYYY.MM.dd}"   # 動態索引名稱，按日期分區（e.g., logs-2024.07.20）
  }
}
```

#### 配置解釋
| 區塊 | 功能 | 關鍵點 |
|------|------|--------|
| **input** | 接收 Beats 資料 | `port => 5044`：Filebeat/Metricbeat 標準埠，支援高流量日誌。 |
| **filter** | 資料解析 | `grok` 模式：將未結構化 `message` 轉為結構化欄位，便於 Elasticsearch 查詢。`%{SYSLOGBASE}` 匹配常見 syslog（如 `<134>Oct 11 22:14:15 mymachine su: 'su root' failed for lonvick`）。 |
| **output** | 儲存資料 | 連至 Elasticsearch，按日索引提升效能與保留政策。 |

**部署提示**：
- 將此 conf 置於 Docker 卷掛載路徑（e.g., `./logstash/config/logstash.conf`）。
- 確保 `docker-compose.yml` 中定義 elasticsearch 服務與網路連通。

### 2.22 測試與驗證

1. **重啟 Logstash**：
   ```
   docker-compose restart logstash
   ```
   - 觀察容器日誌：`docker-compose logs logstash`，確認無語法錯誤（如 "Pipeline main started"）。

2. **驗證資料流**：
   - 從 Filebeat 發送測試日誌（e.g., 生成 syslog）。
   - 查詢 Elasticsearch：`curl -X GET "elasticsearch:9200/_cat/indices?v"`，確認 `logs-YYYY.MM.dd` 索引出現。
   - Kibana 中建立索引模式 `logs-*`，查看即時資料。

**常見問題排除**：
- **連線失敗**：檢查 Docker 網路（同一 network），elasticsearch 健康狀態（`curl elasticsearch:9200/_cluster/health`）。
- **Grok 解析失敗**：使用 [Grok Debugger](https://grokdebug.herokuapp.com/) 測試模式。
- **效能**：生產環境加 `queue.type: persisted` 於 input，避免資料遺失。

---

## 進階應用與藍隊實戰

- **異常偵測（Anomaly）**：在 filter 加 `date { match => ["timestamp", "MMM dd HH:mm:ss"] }`，搭配 Kibana ML 模組偵測流量突增。
- **替代工具**：Splunk Free（500MB/日限制）可用類似 pipeline，但 ELK 無限擴展。
- **安全強化**：生產中啟用 SSL（`ssl => true`）、X-Pack 認證。

**下一節預覽**：Kibana 儀表板建置與自訂查詢。

---

**文件結束**。此文檔基於提供事實，補充藍隊脈絡與實務提示。歡迎回饋以優化蒸餾內容！