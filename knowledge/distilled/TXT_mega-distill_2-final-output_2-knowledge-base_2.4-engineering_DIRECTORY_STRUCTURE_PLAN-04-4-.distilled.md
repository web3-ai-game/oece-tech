---
source: TXT_mega-distill_2-final-output_2-knowledge-base_2.4-engineering_DIRECTORY_STRUCTURE_PLAN-04-4-.md
distilled_at: 2026-02-14T09:30:29.691Z
model: grok-4-1-fast-non-reasoning
---

# 伺服器備份與配置管理知識文檔

本文檔基於IT最佳實踐，詳細說明備份策略、風險管理、PM2整合以及配置驗證的完整流程。重點強調**資料分離**原則，避免系統盤風險，並遵循**3-2-1備份規則**（3份拷貝、2種媒體、1份離線）。適用於Node.js應用部署於外掛磁碟環境（如DigitalOcean Volumes）。

## 1. 注意事項與風險管理

### 核心原則
- **不要動系統盤**：所有應用資料、備份與專案檔案必須置於**外掛盤**（e.g., `/mnt/volume_sgp1_01`），避免系統重置或故障導致資料遺失。
- **風險管理框架**：源自**ITIL（IT Infrastructure Library）**，強調預防性維護與故障隔離。
- **設計原理**：**分離關注點（Separation of Concerns）**，將系統檔案（OS）、應用程式（Node.js專案）與備份資料物理分離，降低單點故障風險。

### 實務範例
```
# 備份策略：使用rsync每日同步到volume-02
rsync -avz --delete /mnt/volume_sgp1_01/oece-tech/ /mnt/volume_sgp1_02/backup/
```
- **目的**：避免單點故障，volume-sgp1-02作為獨立備份磁碟。
- **Cron Job設定**：`0 2 * * * rsync ...`（每日凌晨2點執行）。

## 2. 備份策略設計（4.1）

### 策略概述
- **備份位置**：專用磁碟**volume-sgp1-02**，作為主要備份目標。
- **背景脈絡**：備份是**災難恢復（Disaster Recovery）**的核心組成，確保業務連續性（Business Continuity）。
- **核心規則**：**3-2-1備份原則**
  | 規則 | 說明 | 實作 |
  |------|------|------|
  | **3份拷貝** | 至少3份資料拷貝 | 生產環境 + volume-02備份 + 離線備份 |
  | **2種媒體** | 使用不同儲存類型 | SSD Volumes + 外部硬碟/NAS |
  | **1份離線** | 至少一份離線儲存 | 定期匯出至S3或物理硬碟 |

### 實作細節
- **工具**：`rsync` 提供增量同步、壓縮與刪除鏡像功能。
- **自動化**：透過**cron job**每日執行：
  ```
  # /etc/crontab
  0 2 * * * root rsync -avz --delete /mnt/volume_sgp1_01/oece-tech/ /mnt/volume_sgp1_02/oece-tech-backup/$(date +\%Y\%m\%d)/
  ```
- **驗證**：執行後檢查`ls -la /mnt/volume_sgp1_02/`確認檔案完整性。

## 3. PM2 配置整合（4.11）

### 背景介紹
- **PM2**：Node.js進程管理器，提供自動重啟、負載均衡與日誌管理，適合生產環境部署。

### 配置要求
- **確保PM2指向外掛盤**：專案根目錄（cwd）必須設為`/mnt/volume_sgp1_01/oece-tech`。
- **設計原理**：透過**ecosystem.config.js**定義工作目錄，實現配置驅動部署。

### 配置範例
```javascript
// ecosystem.config.js（置於專案根目錄）
module.exports = {
  apps: [{
    name: 'oece-tech',
    script: './server.js',  // 入口檔案
    cwd: '/mnt/volume_sgp1_01/oece-tech',  // 關鍵：指向外掛盤
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### 部署流程
1. **移動專案**：`mv /舊路徑/oece-tech /mnt/volume_sgp1_01/oece-tech`
2. **重新載入PM2**：`pm2 reload ecosystem.config.js --update-env`
3. **驗證**：`pm2 status` 確認cwd與進程狀態。

## 4. 當前配置驗證（4.2）

### 驗證狀態
- **目前狀態**：專案已正確置於外掛盤，Nginx成功指向`/mnt/volume_sgp1_01/oece-tech`。

### 驗證方法
- **Nginx配置檢查**：`sudo nginx -t` 測試語法正確性。
- **設計原理**：**符號一致性（Symbolic Consistency）**，確保URL路徑、檔案系統與服務配置同步。

### Nginx配置範例
```
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /mnt/volume_sgp1_01/oece-tech;  # 指向外掛盤
        try_files $uri $uri/ /index.html;    # SPA路由支援
        index index.html;
    }

    # 靜態檔案快取
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```
- **重載**：`sudo nginx -s reload`
- **完整驗證**：
  ```
  curl -I http://your-domain.com  # 檢查200 OK
  pm2 logs oece-tech             # 查看應用日誌
  df -h /mnt/volume_sgp1_01      # 確認磁碟空間
  ```

## 5. 完整檢查清單

| 項目 | 命令/檢查點 | 預期結果 |
|------|-------------|----------|
| 專案位置 | `ls -la /mnt/volume_sgp1_01/oece-tech` | 檔案存在 |
| PM2狀態 | `pm2 status` | cwd正確，進程運行 |
| Nginx測試 | `nginx -t` | syntax is ok |
| 備份驗證 | `ls /mnt/volume_sgp1_02/` | 最新備份目錄存在 |
| 磁碟使用 | `df -h /mnt/` | 空間充足（>20%） |

## 6. 故障排除

- **PM2路徑錯誤**：`pm2 kill; pm2 start ecosystem.config.js`
- **Nginx 404**：確認`root`路徑與權限`chmod 755 /mnt/volume_sgp1_01/oece-tech`
- **備份失敗**：檢查磁碟掛載`mount | grep volume`與權限。

本文檔確保系統穩定性與資料安全，定期審核配置以符合ITIL標準。更新日期：基於最新事實清單。