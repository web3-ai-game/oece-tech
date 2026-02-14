---
source: PCP_raw_gcp_workspace_crontab-dual-jet.txt
distilled_at: 2026-02-14T09:30:17.955Z
model: grok-4-1-fast-non-reasoning
---

# 雙群聊噴射系統 (Dual Chat Jet System) 知識文檔

## 系統概述

**雙群聊噴射系統 (Dual Chat Jet System)** 是一個自動化腳本系統，專門用於定時執行群聊相關任務（如訊息噴射操作），透過 Crontab 實現高頻率自動化運行。系統設計高效、穩定，並包含日誌記錄、資源監控與統計報告功能，適合長期無人值守運作。

### 核心組件
| 組件 | 描述 | 路徑/名稱 |
|------|------|-----------|
| **系統名稱** | 雙群聊噴射系統 (Dual Chat Jet System) | - |
| **主要腳本** | 核心執行腳本，負責群聊噴射邏輯 | `dual-chat-jet-system.js` |
| **工作目錄** | 系統運行根目錄，所有腳本與日誌存放處 | `/home/svs-main-key/GCP` |
| **Node.js 執行環境** | 系統依賴的 Node.js 運行時 | `/usr/bin/node` |

**運行命令範例**：
```bash
cd /home/svs-main-key/GCP
/usr/bin/node dual-chat-jet-system.js
```

## Crontab 任務配置

系統透過 Crontab 實現自動化排程，所有任務均在工作目錄 `/home/svs-main-key/GCP` 下執行，並將輸出重定向至 `logs/` 目錄下的對應日誌檔案。以下為完整任務清單：

| 任務名稱 | Crontab 表達式 | 執行內容 | 日誌輸出 | 說明 |
|----------|----------------|----------|----------|------|
| **每小時大噴射** | `0 * * * *` | 執行 `dual-chat-jet-system.js` | `logs/cron-dual-jet.log` | 每小時整點執行主要噴射任務，高頻自動化核心 |
| **日誌清理** | `0 4 * * *` | `find logs/ -name "*.log" -mtime +7 -delete` | - | 每天凌晨 4 點清理 7 天前日誌，防止磁碟空間耗盡 |
| **統計報告** | `0 8 * * *` | 執行 `dual-chat-jet-system.js --report` | `logs/daily-report.log` | 每天早上 8 點生成統計報告，包含前日執行數據 |
| **資源監控** | `*/15 * * * *` | 執行 `monitor.sh` | `logs/monitor.log` | 每 15 分鐘檢查系統資源（CPU、記憶體、磁碟），確保穩定運行 |

**Crontab 完整範例**（可直接匯入）：
```
# 每小時大噴射
0 * * * * cd /home/svs-main-key/GCP && /usr/bin/node dual-chat-jet-system.js >> logs/cron-dual-jet.log 2>&1

# 日誌清理 (每天凌晨4點)
0 4 * * * find /home/svs-main-key/GCP/logs/ -name "*.log" -mtime +7 -delete

# 統計報告 (每天早上8點)
0 8 * * * cd /home/svs-main-key/GCP && /usr/bin/node dual-chat-jet-system.js --report >> logs/daily-report.log 2>&1

# 資源監控 (每15分鐘)
*/15 * * * * cd /home/svs-main-key/GCP && ./monitor.sh >> logs/monitor.log 2>&1
```

## 安裝與管理步驟

遵循以下步驟完成系統部署、配置與日常管理。**所有操作需以 root 或具有 Crontab 權限的使用者執行**。

### 1. 準備工作目錄
```bash
cd /home/svs-main-key/GCP
# 確保檔案存在：dual-chat-jet-system.js、monitor.sh、crontab-dual-jet.txt
mkdir -p logs
chmod +x dual-chat-jet-system.js monitor.sh  # 若為可執行腳本
```

### 2. Crontab 配置流程
1. **查看當前 Crontab**：
   ```bash
   crontab -l
   ```
   - 確認現有任務，避免衝突。

2. **編輯 Crontab**（手動調整）：
   ```bash
   crontab -e
   ```
   - 在編輯器中貼上上述 Crontab 範例。

3. **匯入預設配置**（推薦，一鍵導入）：
   ```bash
   crontab crontab-dual-jet.txt
   ```

4. **驗證配置**：
   ```bash
   crontab -l
   ```
   - 確認任務已正確載入。

### 3. 日誌管理與監控
- **即時查看主要日誌**：
  ```bash
  tail -f logs/cron-dual-jet.log
  ```
- **查看報告**：
  ```bash
  tail -f logs/daily-report.log
  ```
- **資源監控**：
  ```bash
  tail -f logs/monitor.log
  ```
- **手動測試噴射**：
  ```bash
  cd /home/svs-main-key/GCP && /usr/bin/node dual-chat-jet-system.js
  ```
- **手動生成報告**：
  ```bash
  cd /home/svs-main-key/GCP && /usr/bin/node dual-chat-jet-system.js --report
  ```

### 4. 常見問題排除
| 問題 | 解決方案 |
|------|----------|
| Crontab 不執行 | 檢查工作目錄權限、`PATH` 環境變數；使用絕對路徑 |
| Node.js 錯誤 | 確認 `/usr/bin/node` 可用；檢查腳本依賴（如 npm modules） |
| 日誌無輸出 | 確認 `>> logs/*.log 2>&1` 重定向正確；檢查目錄權限 |
| 磁碟滿 | 手動執行 `find logs/ -name "*.log" -mtime +7 -delete` |
| 監控告警 | 檢視 `logs/monitor.log`，調整伺服器資源 |

## 最佳實務
- **備份**：定期備份 `dual-chat-jet-system.js` 與 `crontab-dual-jet.txt`。
- **監控**：設定外部工具（如 Prometheus）監控 `logs/monitor.log` 中的告警。
- **更新**：修改腳本後，手動測試再更新 Crontab。
- **安全**：限制工作目錄權限 `chmod 755 /home/svs-main-key/GCP`，避免未授權存取。

此文檔基於提供的核心事實編寫，確保 100% 準確性。如需擴充腳本細節或自訂配置，請參考原始腳本原始碼。