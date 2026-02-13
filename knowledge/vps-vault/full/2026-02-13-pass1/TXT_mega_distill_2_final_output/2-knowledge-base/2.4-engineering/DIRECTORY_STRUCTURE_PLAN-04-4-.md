---
distilled_by: grok-4-0709
mode: B
---
part: 4
---

## 4. 注意事項與風險管理

注意事項強調不要動系統盤、資料在外掛盤等。背景：風險管理源自ITIL框架。原理：分離關注點（separation of concerns）。實例：備份策略使用rsync到volume-02，避免單點故障。

### 4.1. 備份策略的設計

volume-sgp1-02用於備份。背景：備份是災難恢復的核心。原理：3-2-1規則（3份拷貝、2種媒體、1份離線）。實例：cron job每日rsync。

#### 4.11. PM2 配置的整合

確保PM2指向外掛盤。背景：PM2是Node.js進程管理器。原理：ecosystem.config.js定義cwd。實例：若項目移動，pm2 reload更新路徑。

### 4.2. 當前配置的驗證

項目已正確在外掛盤，Nginx指向之。背景：配置驗證使用nginx -t。原理：符號一致性。實例：location / { root /mnt/volume_sgp1_01/oece-tech; }。
