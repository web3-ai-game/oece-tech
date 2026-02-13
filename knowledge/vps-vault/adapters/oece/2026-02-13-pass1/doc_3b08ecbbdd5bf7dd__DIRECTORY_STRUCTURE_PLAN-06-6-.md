---
distilled_by: grok-4-0709
mode: B
---
part: 6
---

## 6. 真實案例分析

### 6.1. 案例1: DigitalOcean Volume遷移（來源: DigitalOcean官方文檔, 2022）
在一個WordPress站點，管理員將100GB volume合併到200GB新volume，使用rsync遷移資料。結果：零停機，容量翻倍。分析：這展示了方案A的實用性，避免了資料碎片（參考: https://docs.digitalocean.com/products/volumes/how-to/mount/）。

### 6.2. 案例2: AWS EBS擴展失敗教訓（來源: AWS案例研究, 2021）
一家電商公司未分離系統盤與資料卷，EBS滿載導致EC2崩潰。解決：遷移到EFS並使用symlinks。分析：強調不要動系統盤的重要性，節省了恢復時間（參考: https://aws.amazon.com/blogs/storage/migrating-to-amazon-efs/）。

### 6.3. 案例3: GitHub企業備份策略（來源: GitHub博客, 2023）
GitHub使用多volume備份，類似方案B，cron rsync到離線儲存。分析：防止資料丟失，提升可靠性（參考: https://github.blog/2023-05-10-how-we-backup-github/）。
