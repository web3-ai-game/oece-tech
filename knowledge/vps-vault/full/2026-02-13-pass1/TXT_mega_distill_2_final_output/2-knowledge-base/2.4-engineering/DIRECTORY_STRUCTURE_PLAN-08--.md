---
distilled_by: grok-4-0709
mode: B
---
part: 8
---

## ⚡ 實戰要點

1. 始終使用`df -h`監控磁碟使用，避免意外滿載。
2. 修改fstab前備份原檔，測試`mount -a`以防boot失敗。
3. 遷移時使用rsync而非mv，保留權限並允許中斷恢復。
4. 為PM2和Nginx設定絕對路徑，防止相對路徑錯誤。
5. 實施3-2-1備份規則，利用volume-02作為離線拷貝。
6. 定期審核symlinks，使用`ls -l`檢查斷鏈。
7. 在雲端環境，考慮快照（snapshots）作為額外備份層。
8. 測試災難恢復：模擬volume故障，練習從備份還原。
