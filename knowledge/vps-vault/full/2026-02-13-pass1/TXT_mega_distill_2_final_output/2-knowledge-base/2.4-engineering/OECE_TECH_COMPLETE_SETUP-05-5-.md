---
distilled_by: grok-4-0709
mode: B
---
part: 5
---

## 5. 應用部署與管理

### 5.1 部署狀態與訪問
應用運行於 PM2，端口 3000。背景是 PM2 的集群模式支持多核利用。原理是進程管理確保高可用。

實例：一個 API 服務使用 PM2 後，處理了 5000 QPS 而不崩潰。

#### 5.11 SSL 配置
DNS 修復後使用 Certbot 配置 HTTPS。背景是 Let's Encrypt 提供免費證書。原理是 TLS 握手確保加密傳輸。

代碼範例 6：Certbot 安裝與配置（bash）
```bash
# 安裝 Certbot
sudo apt update && sudo apt install certbot python3-certbot-nginx

# 自動配置
sudo certbot --nginx -d oece.tech -d www.oece.tech --non-interactive --agree-tos --email vip@oece.tech

# 驗證
curl -I https://oece.tech  # 檢查 HTTP/2 和 200 OK
```

### 5.2 常用命令與優化
包括 PM2、Nginx 和磁盤管理命令。背景是自動化腳本提升效率。原理是 shell 腳本的模塊化。

代碼範例 7：項目更新腳本（bash）
```bash
#!/bin/bash
# 更新項目
cd /mnt/volume_sgp1_01/oece-tech
git pull origin main  # 拉取最新代碼
npm install           # 安裝依賴
npm run build         # 構建
pm2 restart oece-tech # 重啟
```

代碼範例 8：磁盤監控腳本（bash）
```bash
#!/bin/bash
# 檢查磁盤使用
df -h | grep '/mnt/volume_sgp1_01'  # 過濾外掛盤
if [ $(df -h | grep '/mnt/volume_sgp1_01' | awk '{print $5}' | sed 's/%//') -gt 80 ]; then
  echo "Disk usage >80%, alert!" | mail -s "Disk Alert" vip@oece.tech
fi
```

真實案例分析 3：Netflix 的微服務部署（來源：Netflix Tech Blog, 2021）。Netflix 使用類似 PM2 的工具管理數千進程，在 VPS-like 環境中實現零宕機部署，處理全球 2 億用戶，證明自動化命令的重要性。
