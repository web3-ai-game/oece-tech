---
source: TXT_mega-distill_2-final-output_2-knowledge-base_2.4-engineering_DIRECTORY_STRUCTURE_PLAN-08--.md
distilled_at: 2026-02-14T09:21:08.268Z
model: grok-4-1-fast-non-reasoning
---

# Linux 伺服器磁碟管理與資料保護最佳實務知識文檔

本知識文檔彙整 Linux 伺服器環境中磁碟管理、資料遷移與災難恢復的核心最佳實務。這些指南基於生產環境經驗，旨在預防常見故障、確保資料完整性並提升系統穩定性。適用於 Ubuntu、CentOS 等常見發行版。

## 1. 磁碟使用監控

**核心原則**：磁碟滿載會導致應用程式崩潰、服務中斷甚至系統凍結。實施持續監控是運維基礎。

### 推薦命令與工具
- **即時檢查**：始終使用 `df -h` 監控磁碟使用情況，避免意外滿載。
  ```bash
  df -h  # 人性化顯示使用量 (GB/MB)
  watch -n 5 df -h  # 每 5 秒自動刷新
  ```
- **進階監控**：
  | 工具 | 用途 | 安裝命令 |
  |------|------|----------|
  | `ncdu` | 互動式磁碟使用分析 | `sudo apt install ncdu` |
  | Prometheus + Node Exporter | 圖形化長期監控 | Docker 部署 |
  | `iotop` | 即時 I/O 瓶頸診斷 | `sudo apt install iotop` |

### 警報閾值建議
- **警告**：>80% 使用率
- **緊急**：>95% 使用率 → 立即清理 `/tmp`、log 檔案或擴容

## 2. fstab 修改安全流程

**/etc/fstab** 是系統開機掛載配置，錯誤修改可能導致 boot 失敗進入救援模式。

### 修改前必做清單
```
1. 備份原檔：sudo cp /etc/fstab /etc/fstab.bak.$(date +%Y%m%d)
2. 測試掛載：sudo mount -a  # 驗證語法無誤
3. 模擬重啟：sudo systemctl reboot  # 或使用 live CD 測試
```

### 常見陷阱與解決
| 問題 | 原因 | 修復方法 |
|------|------|----------|
| UUID 錯誤 | 磁碟替換後未更新 | `blkid` 重新取得 UUID |
| nofail 遺漏 | 外部磁碟斷線導致 boot 失敗 | 新磁碟條目加 `nofail` |
| 權限問題 | umask 配置錯誤 | 明確指定 `uid=1000,gid=1000` |

## 3. 資料遷移最佳實務

**避免使用 `mv`**：跨磁碟區遷移會複製後刪除，失敗時無法恢復。

### 推薦工具：rsync
```bash
# 安全遷移範例：從 volume-01 移到 volume-02
rsync -avH --progress --stats /data/old/ /data/new/
# 參數說明：
# -a: 保留權限、擁有者、時間戳
# -v: 詳細輸出
# -H: 保留 hard links
# --progress: 顯示進度
```

**優點比較**：
| 方法 | 保留權限 | 支持中斷恢復 | 跨磁碟區安全 |
|------|----------|--------------|--------------|
| `mv` | ❌ | ❌ | ❌ |
| `rsync` | ✅ | ✅ | ✅ |
| `cp` | ❌ | ❌ | ⚠️ |

遷移完成後：驗證檔案數量 (`find . -type f | wc -l`) 與 checksum (`sha256sum`)。

## 4. 應用程式配置最佳化

相對路徑在服務重啟或使用者切換時易出錯。

### PM2 配置範例 (ecosystem.config.js)
```javascript
module.exports = {
  apps: [{
    name: 'myapp',
    script: '/opt/myapp/server.js',
    cwd: '/opt/myapp',  // 絕對工作目錄
    env: {
      NODE_ENV: 'production',
      DATA_PATH: '/mnt/volume-02/data'  // 絕對資料路徑
    }
  }]
};
```

### Nginx 配置範例
```nginx
server {
    root /mnt/volume-02/www;  # 絕對路徑
    index index.html index.htm;
    
    # 日誌絕對路徑
    access_log /mnt/volume-02/logs/access.log;
    error_log /mnt/volume-02/logs/error.log;
}
```

**檢查清單**：
- `grep -r "\.\./" /etc/nginx/` → 搜尋相對路徑
- `pm2 ecosystem` → 驗證 PM2 配置

## 5. 備份策略：3-2-1 規則

**3-2-1 原則**：
- **3 份備份**：生產 + 現場備份 + 離線備份
- **2 種媒介**：本地磁碟 + 雲端/磁帶
- **1 份離線**：防止勒索軟體加密

### 實作架構
```
生產環境 (volume-01)
    ↓ 日增量備份
現場備份 (volume-02) ← 離線拷貝，每週輪換
    ↓ 快照
雲端備份 (AWS S3 / Backblaze B2)
```

**自動化腳本範例**：
```bash
#!/bin/bash
# 每日備份到 volume-02
rsync -a --delete /data/ /mnt/volume-02/backup/data/$(date +%Y%m%d)/
# 建立快照
lvcreate -s /dev/vg/volume-02 -n backup-$(date +%Y%m%d)
```

## 6. Symlinks (符號連結) 維護

斷鏈 symlinks 會導致應用程式失敗但不易察覺。

### 定期審核命令
```bash
# 檢查所有斷鏈
find / -type l -xtype l 2>/dev/null | head -20

# 詳細檢查特定目錄
ls -l /opt/myapp/ | grep '^l.*\->.*(No such file or directory)'

# 批次修復
for link in $(find /data -type l -xtype l); do
    echo "Broken symlink: $link"
    # rm "$link"  # 謹慎刪除
done
```

**排程檢查**：加入 crontab `0 2 * * 0 find / -type l -xtype l >> /var/log/broken_links.log`

## 7. 雲端與快照備份

**快照優勢**：區塊級別、瞬間一致、無 I/O 影響。

### LVM 快照建立
```bash
# 建立快照 (5GB 空間)
lvcreate -L 5G -s -n data-snapshot /dev/vg/volume-01/data

# 備份快照
rsync -a /dev/vg/volume-01/data-snapshot /backup/

# 移除快照
lvremove /dev/vg/volume-01/data-snapshot
```

**雲端整合**：
| 服務 | 特色 | 定價 |
|------|------|------|
| AWS EBS Snapshots | 自動化、跨區域複製 | $0.05/GB/月 |
| DigitalOcean Volumes | 簡單 API | $0.10/GB/月 |
| Backblaze B2 | 低成本冷備份 | $0.005/GB/月 |

## 8. 災難恢復演練 (DR)

**定期測試**：未測試的備份等同無備份。

### 模擬流程
```
1. 關閉生產服務：systemctl stop nginx pm2
2. 模擬 volume 故障：dmsetup remove volume-01
3. 從 volume-02 還原：
   mount /dev/vg/volume-02/backup /mnt/restore
   rsync -a /mnt/restore/data/ /data/
4. 驗證服務：systemctl status nginx
5. 記錄 RTO/RPO：恢復時間/資料損失
```

**演練頻率**：
- **每月**：完整還原測試
- **每季**：跨環境遷移演練
- **每年**：全公司 DR 演習

## 快速參考清單

| 任務 | 命令/檢查點 |
|------|-------------|
| 磁碟監控 | `df -h` / `watch df -h` |
| fstab 測試 | `sudo mount -a` |
| 資料遷移 | `rsync -avH` |
| Symlinks 檢查 | `find / -type l -xtype l` |
| 快照備份 | `lvcreate -s` |
| DR 測試 | 模擬 `dmsetup remove` |

遵循這些實務可將磁碟相關故障率降低 90%以上。建議將本指南加入團隊 Wiki 並定期演練。