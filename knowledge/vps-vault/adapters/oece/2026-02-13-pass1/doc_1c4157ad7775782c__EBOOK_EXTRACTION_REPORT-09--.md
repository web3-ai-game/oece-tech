---
distilled_by: grok-4-0709
mode: B
---
part: 9
---

## ⚡ 實戰要點
1. 總是使用find或rsync處理批量文件，避免mv *的shell限制。
2. 在解壓前運行tar -tf驗證內容，防止意外。
3. 監控內存使用，當<10%可用時立即添加swap。
4. 對特殊字符文件名使用引號或轉義，測試邊緣案例。
5. 保留20%磁盤冗餘，定期運行du -sh清理大文件。
6. 記錄所有操作，使用--verbose或log文件追蹤。
7. 在容器環境檢查selinux或apparmor配置。
8. 整合md5sum驗證文件完整性，防損壞。
