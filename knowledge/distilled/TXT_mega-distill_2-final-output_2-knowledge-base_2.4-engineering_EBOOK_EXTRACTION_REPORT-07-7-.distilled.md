---
source: TXT_mega-distill_2-final-output_2-knowledge-base_2.4-engineering_EBOOK_EXTRACTION_REPORT-07-7-.md
distilled_at: 2026-02-14T09:19:15.327Z
model: grok-4-1-fast-non-reasoning
---

# Linux 文件系統恢復與優化知識文檔

## 概述
本文件記錄了一次 Linux 系統中文件恢復操作的完整流程，涵蓋**立即行動**、**驗證清理**以及**內存優化**三個核心階段。該操作針對大規模文件移動（4,103 個文件）進行，強調數據完整性、系統資源管理和長期穩定性。適用於伺服器環境中類似的大量 Markdown 文件處理場景。

## 7.1 立即行動：快速文件恢復
### 背景脈絡
在文件意外移動或系統中斷後，首要目標是**立即恢復數據完整性**。延遲可能導致數據丟失或覆蓋，特別是在 `/tmp` 等臨時目錄易被清理的環境中。

### 核心行動
使用 `find` 命令高效定位並移動文件：
```bash
find /tmp/markdown-output/ -type f -exec mv {} /Ebook/ \;
```

### 執行原理
- **`find -exec`**：安全迭代處理每個匹配文件，避免 shell 展開限制（適合超過 ARG_MAX 的文件數）。
- **高效性**：直接移動而非複製，減少 I/O 操作。
- **驗證步驟**：執行後立即檢查目標目錄：
  ```bash
  ls /Ebook/ | wc -l  # 確認文件數量
  ```

### 預期結果
成功恢復 **4,103 個文件**，確保零數據丟失。

## 7.2 驗證與清理：確保系統整潔
### 背景脈絡
恢復後需驗證結果並釋放臨時空間。`/tmp` 目錄常被自動清理，殘留文件會浪費磁碟空間並影響後續操作。

### 核心行動
1. **文件數驗證**：
   ```bash
   ls -l /Ebook/ | wc -l  # 應顯示 4,104（包含目錄本身）
   ```
   - 確認 **4,103 個文件** 已正確到位。

2. **臨時目錄清理**：
   ```bash
   rm -rf /tmp/markdown-output/
   ```

### 執行原理與注意事項
- **`ls -l | wc -l`**：提供詳細列表計數，更可靠於簡單 `ls`。
- **`rm -rf`**：遞歸強制刪除，適用於已驗證空的臨時目錄。
- **空間釋放**：典型 Markdown 文件集可能佔用數 GB，清理後監控 `df -h` 確認磁碟使用率下降。

## 7.3 內存優化：長期伺服器穩定
### 背景脈絡
處理大規模文件操作（如 4,103 個文件）會消耗大量內存，尤其在長期運行伺服器上。無 swap 空間可能導致 OOM（Out of Memory）殺死進程。

### 核心行動
1. **創建 swap 文件**：
   ```bash
   # 創建 4GB swap 文件（根據系統內存調整）
   fallocate -l 4G /swapfile
   chmod 600 /swapfile
   mkswap /swapfile
   swapon /swapfile
   ```

2. **優化 swap 參數**：
   ```bash
   sysctl vm.swappiness=10
   echo 'vm.swappiness=10' >> /etc/sysctl.conf  # 永久生效
   ```

### 執行原理
- **Swap 作用**：作為虛擬內存擴展，緩解 RAM 壓力。預設 `swappiness=60` 過高，易頻繁換入換出。
- **`vm.swappiness=10`**：僅在內存使用達 90% 時啟用 swap，平衡性能與穩定。
- **監控命令**：
  ```bash
  free -h          # 查看 swap 使用
  swapon --show    # 列出 swap 設備
  ```

### 長期益處
- 防止文件處理任務崩潰。
- 適用於持續 Markdown 轉換、web 伺服器等高負載場景。

## 完整操作檢查清單
| 階段 | 命令 | 預期輸出 | 狀態 |
|------|------|----------|------|
| 7.1 恢復 | `find ... -exec mv` | 無錯誤 | ☐ |
| 7.1 驗證 | `ls /Ebook/ \| wc -l` | 4,103 | ☐ |
| 7.2 清理 | `rm -rf /tmp/markdown-output/` | 目錄消失 | ☐ |
| 7.2 確認 | `ls -l /Ebook/ \| wc -l` | 4,104 | ☐ |
| 7.3 Swap | `swapon /swapfile` | Swap 啟用 | ☐ |
| 7.3 優化 | `sysctl vm.swappiness` | =10 | ☐ |

## 常見問題與故障排除
- **文件數不符**：檢查權限（`chown`）、路徑大小寫。
- **內存不足**：擴大 swap 或升級 RAM。
- **權限錯誤**：使用 `sudo` 或調整目錄擁有者。

此文檔確保操作**可重現性**與**最佳實踐**，適用於類似的大規模文件管理任務。