---
source: TXT_mega-distill_2-final-output_2-knowledge-base_2.4-engineering_DIRECTORY_STRUCTURE_PLAN-09--.md
distilled_at: 2026-02-14T09:22:53.199Z
model: grok-4-1-fast-non-reasoning
---

# Linux 文件系統層級與 Volume 管理指南

## 介紹
本指南基於 **Filesystem Hierarchy Standard (FHS)** 標準，涵蓋 Linux 檔案系統結構、掛載點管理、volume 配置、備份策略及 DevOps 自動化實務。適用於伺服器工程、雲端部署與資料遷移情境，整合知識圖譜連結提供深入參考：

- **[FHS 標準深入指南](2-knowledge-base/2.4-engineering/linux-filesystem-hierarchy.md)**
- **[雲端儲存最佳實務](2-knowledge-base/2.4-engineering/cloud-storage-best-practices.md)**
- **[進階備份技術](2-knowledge-base/2.4-engineering/backup-strategies.md)**
- **[Ansible 自動化配置](2-knowledge-base/2.4-engineering/devops-automation.md)**

**Vector Tags**: directory-structure, linux-mounting, volume-management, fstab-configuration, data-migration, backup-strategies, pm2-setup, nginx-paths, symlink-usage, cloud-volumes, filesystem-hierarchy, devops-practices

**元數據**:
- **distilled_by**: grok-4-0709
- **mode**: B
- **part**: 9

## 1. Linux 文件系統層級標準 (FHS)
FHS 定義了 Linux 檔案系統的標準目錄結構，確保系統一致性與可移植性。根目錄 `/` 下各目錄有特定用途，避免混亂。

### 核心目錄說明
| 目錄 | 用途 | 示例內容 | 備註 |
|------|------|----------|------|
| `/bin` | 系統基本命令 | `ls`, `cat`, `cp` | 單使用者模式可用 |
| `/boot` | 啟動相關檔案 | `vmlinuz`, `initrd.img` | 獨立掛載以防根分区滿載 |
| `/dev` | 裝置檔案 | `sda`, `/dev/null` | 動態生成 (udev) |
| `/etc` | 系統配置 | `fstab`, `hosts`, `nginx.conf` | 純文字配置，支援符號連結 |
| `/home` | 使用者家目錄 | `/home/user` | 獨立 volume 管理使用者資料 |
| `/lib` / `/lib64` | 系統程式庫 | 共享物件檔案 | 依賴 `/bin` / `/sbin` |
| `/media` / `/mnt` | 臨時掛載點 | USB、雲端 volume | `/media` 用於可移除媒體 |
| `/opt` | 第三方軟體 | 自訂應用如 PM2、Nginx | 避免覆蓋系統套件 |
| `/proc` | 虛擬檔案系統 | 程序資訊 (`/proc/1`) | 記憶體中生成 |
| `/root` | Root 使用者家目錄 | - | 與 `/home` 分離 |
| `/run` | 執行中程序狀態 | PID 檔案、socket | tmpfs (記憶體掛載) |
| `/srv` | 服務資料 | WWW、FTP 內容 | 伺服器專用 |
| `/sys` | 虛擬檔案系統 | 硬體/核心狀態 | 類似 `/proc` |
| `/tmp` | 臨時檔案 | 程式暫存 | 開機清除，設為 tmpfs |
| `/usr` | 使用者程式 | `/usr/bin`, `/usr/local` | 唯讀掛載最佳 |
| `/var` | 變動資料 | 日誌 (`/var/log`)、快取、 spool | 獨立 volume，避免根分区膨脹 |

**脈絡補充**：在雲端環境，`/var`、`home` 與 `/opt` 應獨立於根分区，使用 LVM 或雲端 EBS/GPD 卷管理成長資料。

## 2. 掛載與 Volume 管理 (linux-mounting, volume-management)
Linux 支援多種檔案系統 (ext4, xfs, btrfs, ZFS) 與掛載機制。雲端最佳實務強調分離持久化資料。

### fstab 配置 (fstab-configuration)
`/etc/fstab` 定義開機掛載。格式：`<device> <mountpoint> <fstype> <options> <dump> <pass>`

**範例 fstab**：
```
# 本地 LVM
UUID=12345678-1234-1234-1234-123456789abc /home ext4 defaults 0 2

# 雲端卷 (AWS EBS)
 /dev/nvme1n1 /var xfs defaults,noatime 0 2

# tmpfs (記憶體)
tmpfs /tmp tmpfs defaults,noexec,nosuid,size=2G 0 0
```

**掛載指令**：
```bash
sudo mount -a  # 驗證 fstab
sudo mount /dev/sdb1 /mnt/data  # 手動掛載
sudo blkid  # 查 UUID
```

**雲端卷最佳實務** (cloud-volumes)：
- AWS：EBS gp3 > io2；加密啟用。
- GCP：Persistent Disk；快照備份。
- 遷移：`rsync -aHAX` 或 `dd` 塊級複製 (data-migration)。

## 3. 符號連結與路徑最佳化 (symlink-usage, nginx-paths)
使用 `ln -s` 管理路徑，避免重複。

**範例**：
```bash
# Nginx 靜態檔案指向 /srv/web
sudo ln -s /srv/web /var/www/html

# PM2 日誌指向 /var/log/pm2
sudo ln -s /opt/app/logs /var/log/pm2
```

**PM2 設定 (pm2-setup)**：
```bash
pm2 start ecosystem.config.js --name app
pm2 save  # 持久化至 /etc/pm2
```

**Nginx 配置 (/etc/nginx/sites-available)**：
```
server {
    root /srv/web;  # 符號連結至獨立卷
    location /logs { alias /var/log/nginx; }
}
```

## 4. 備份策略 (backup-strategies)
結合 **進階備份技術** 文件，採用 3-2-1 原則：3 份副本、2 種媒體、1 份異地。

### 工具與流程
| 策略 | 工具 | 適用情境 |
|------|------|----------|
| 全備份 | `rsync`, `tar` | 初始備份 |
| 增量 | `duplicity`, Restic | 日誌 `/var/log` |
| 快照 | LVM snapshot, BTRFS | 資料庫 `/var/lib` |
| 雲端 | AWS S3 Glacier, Backblaze | 異地備份 |

**自動化範例** (cron + rsync)：
```bash
0 2 * * * rsync -aAX /home/ /backup/home/ && aws s3 sync /backup/ s3://mybucket/
```

## 5. DevOps 自動化 (devops-practices)
使用 **Ansible** 實現配置即程式碼。

**Playbook 範例** (掛載卷與 PM2)：
```yaml
---
- hosts: servers
  tasks:
    - name: Mount data volume
      mount:
        path: /srv/data
        src: /dev/sdb1
        fstype: ext4
        state: mounted

    - name: Setup PM2
      npm:
        name: pm2
        path: /opt/app
        global: yes
```

**部署流程**：
1. Ansible 初始化 fstab 與掛載。
2. 符號連結 Nginx/PM2 路徑。
3. 設定備份 cron 與雲端同步。

## 最佳實務總結
- **分離關注**：根分区小 (20GB)，資料卷獨立。
- **監控**：`df -h`, Prometheus 警報。
- **安全**：SELinux/AppArmor, 最小權限。
- **遷移**：停機 `rsync`，驗證 `diff`。

參考知識圖譜文件以獲最新細節。此指南確保生產環境穩定性與可擴展性。