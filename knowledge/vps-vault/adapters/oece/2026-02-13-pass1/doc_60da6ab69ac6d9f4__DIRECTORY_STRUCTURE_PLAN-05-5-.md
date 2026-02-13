---
distilled_by: grok-4-0709
mode: B
---
part: 5
---

## 5. 代碼範例

以下提供5-8個帶註釋的Bash代碼範例，涵蓋掛載、遷移和備份。

### 5.1. 範例1: 檢查磁碟使用率
```bash
# 檢查所有掛載點的使用情況
df -h  # 顯示人類可讀格式，如Size, Used, Avail
```

### 5.2. 範例2: 創建掛載點並掛載
```bash
# 創建目錄並掛載volume
mkdir -p /mnt/sms  # -p 確保父目錄存在
mount /dev/sdb /mnt/sms  # 假設/dev/sdb是volume設備
```

### 5.3. 範例3: 修改fstab永久掛載
```bash
# 編輯fstab (使用vi或nano)
echo "UUID=your-uuid /mnt/sms ext4 defaults 0 2" >> /etc/fstab  # 添加一行
mount -a  # 測試fstab無誤
```

### 5.4. 範例4: 遷移資料
```bash
# 使用rsync安全遷移，保留權限
rsync -avz /mnt/volume_sgp1_01/* /mnt/sms/  # -a存檔模式, -v詳細, -z壓縮
```

### 5.5. 範例5: 創建符號連結
```bash
# 創建symlink簡化訪問
ln -s /mnt/volume_sgp1_01 /mnt/sms  # 現在/mnt/sms指向原路徑
```

### 5.6. 範例6: 設定cron備份
```bash
# 編輯crontab
crontab -e
# 添加每日備份: 0 2 * * * rsync -av /mnt/sms/ /mnt/volume_sgp1_02/backups/
```

### 5.7. 範例7: PM2配置範例 (ecosystem.config.js)
```javascript
// PM2 ecosystem file (though in JS, for illustration)
module.exports = {
  apps: [{
    name: 'oece-tech',
    script: 'server.js',
    cwd: '/mnt/volume_sgp1_01/oece-tech'  // 確保工作目錄在外掛盤
  }]
};
```

### 5.8. 範例8: Nginx配置片段
```nginx
# /etc/nginx/sites-available/default
server {
  listen 80;
  root /mnt/volume_sgp1_01/oece-tech/public;  # 指向外掛盤項目
  index index.html;
}
```
