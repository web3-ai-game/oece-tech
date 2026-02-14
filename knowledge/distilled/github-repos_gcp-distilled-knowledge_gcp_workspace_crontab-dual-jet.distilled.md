---
source: github-repos_gcp-distilled-knowledge_gcp_workspace_crontab-dual-jet.txt
distilled_at: 2026-02-14T09:29:16.716Z
model: grok-4-1-fast-non-reasoning
---

# GCP 雙群聊噴射系統 Crontab 配置知識文檔

## 概述

本知識文檔詳細說明了 **GCP 雙群聊噴射系統** 的 Crontab 自動化任務配置、管理與維護指南。系統位於 `/home/svs-main-key/GCP`，透過定時任務實現每小時業務執行、日誌清理、統計報告生成及資源監控，確保系統穩定運行。

**核心功能**：
- **雙群聊噴射系統**：每小時自動執行主要業務邏輯（`dual-chat-jet-system.js`）
- **自動化運維**：日誌清理、每日報告、資源監控
- **Crontab 格式**：`分 時 日 月 星期 命令`

---

## Crontab 任務配置

### 1. 每小時噴射任務
```
0 * * * * cd /home/svs-main-key/GCP && /usr/bin/node dual-chat-jet-system.js >> logs/cron-dual-jet.log 2>&1
```
- **執行頻率**：每小時第 0 分鐘（00:00, 01:00, 02:00 等）
- **功能**：切換至專案目錄，執行主要業務腳本
- **日誌**：`logs/cron-dual-jet.log`（標準輸出 + 錯誤輸出重定向）

### 2. 日誌清理任務
```
0 4 * * * find /home/svs-main-key/GCP/logs -name "*.log" -mtime +7 -delete
```
- **執行頻率**：每天凌晨 4:00
- **功能**：刪除 7 天前（`-mtime +7`）的所有 `.log` 檔案
- **目的**：防止日誌佔用過多磁碟空間

### 3. 統計報告任務
```
0 8 * * * cd /home/svs-main-key/GCP && /usr/bin/node dual-chat-jet-system.js --report >> logs/daily-report.log 2>&1
```
- **執行頻率**：每天早上 8:00
- **功能**：執行帶 `--report` 參數的報告生成模式
- **日誌**：`logs/daily-report.log`

### 4. 資源監控任務
```
*/15 * * * * /home/svs-main-key/GCP/monitor.sh >> logs/monitor.log 2>&1
```
- **執行頻率**：每 15 分鐘（`*/15`）
- **功能**：執行系統資源監控腳本
- **日誌**：`logs/monitor.log`

---

## 系統路徑與檔案結構

```
├── /home/svs-main-key/GCP/                    # 專案根目錄
│   ├── dual-chat-jet-system.js                 # 主要業務腳本 (支援 --report 參數)
│   ├── monitor.sh                              # 資源監控腳本
│   └── logs/                                   # 日誌目錄
│       ├── cron-dual-jet.log                   # 每小時噴射任務日誌
│       ├── daily-report.log                    # 每日報告日誌
│       └── monitor.log                         # 資源監控日誌
└── crontab-dual-jet.txt                        # Crontab 配置文件
```

---

## 安裝與管理步驟

### 1. 查看當前 Crontab 配置
```bash
crontab -l
```

### 2. 編輯 Crontab（互動模式）
```bash
crontab -e
```

### 3. 導入完整配置
```bash
crontab crontab-dual-jet.txt
```
> **注意**：確保 `crontab-dual-jet.txt` 包含上述所有任務配置

### 4. 驗證配置
```bash
crontab -l
```

### 5. 常見管理命令
```bash
# 即時查看日誌
tail -f /home/svs-main-key/GCP/logs/cron-dual-jet.log

# 查看所有日誌
ls -lh /home/svs-main-key/GCP/logs/

# 手動執行測試
cd /home/svs-main-key/GCP && /usr/bin/node dual-chat-jet-system.js

# 檢查磁碟使用
df -h

# 重啟 cron 服務（若需要）
sudo systemctl restart cron
```

---

## 日誌管理

### 日誌重定向說明
```
>> logs/xxx.log 2>&1
```
- `>>`：追加標準輸出（stdout）
- `2>&1`：將錯誤輸出（stderr）重定向至標準輸出
- **效果**：所有輸出（正常 + 錯誤）都寫入同一日誌檔案

### 自動清理機制
- **觸發時間**：每天凌晨 4:00
- **清理條件**：7 天前修改的 `.log` 檔案
- **命令解析**：
  ```bash
  find /path/to/logs -name "*.log" -mtime +7 -delete
  ```
  - `-name "*.log"`：匹配日誌檔案
  - `-mtime +7`：修改時間超過 7 天
  - `-delete`：直接刪除（無提示）

---

## 疑難排解

### 常見問題
| 問題 | 解決方案 |
|------|----------|
| 任務未執行 | `crontab -l` 檢查配置，`systemctl status cron` 檢查服務 |
| 權限錯誤 | 確保 `/home/svs-main-key/GCP` 有執行權限 |
| Node 版本問題 | 確認 `/usr/bin/node` 路徑正確 |
| 日誌無輸出 | 檢查腳本內部錯誤，測試手動執行 |
| 磁碟滿 | 手動清理：`find logs/ -name "*.log" -delete` |

### 監控檢查點
```bash
# 檢查最近執行記錄
grep "CRON" /var/log/syslog | tail -10

# 驗證腳本可執行
ls -la /home/svs-main-key/GCP/dual-chat-jet-system.js
```

---

## 最佳實踐

1. **備份配置**：定期備份 `crontab -l > backup-crontab.txt`
2. **日誌輪轉**：7 天自動清理已足夠，大流量系統可調整為 3-5 天
3. **錯誤通知**：可在 `monitor.sh` 中加入郵件/推送告警
4. **測試環境**：修改路徑在新環境部署前先手動測試
5. **版本控制**：將 `crontab-dual-jet.txt` 加入 Git 倉庫

---

**文檔最後更新**：基於提供的關鍵事實清單  
**適用系統**：Linux (支援 Crontab 的發行版)