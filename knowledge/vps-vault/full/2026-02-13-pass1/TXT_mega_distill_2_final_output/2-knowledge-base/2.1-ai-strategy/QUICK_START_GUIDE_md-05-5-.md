---
distilled_by: grok-4-0709
mode: B
target_category: 2-knowledge-base/2.1-ai-strategy
source: gcp-distilled/QUICK_START_GUIDE.md.distilled
---
part: 5
---

## 5. 成本控制與故障排除

### 5.1 成本優化原理

背景：雲成本管理自 AWS Cost Explorer 時代興起。原理基於資源監控和預算警報。

展開：利用免費層級，設定警報。實例：MongoDB M0 層級免費500MB。

| 服務 | 免費限額 | 成本控制技巧 |
|------|----------|--------------|
| MongoDB Atlas | 500MB 儲存 | 定期清理舊資料 |
| Supabase | 500MB 資料庫 | 使用查詢優化 |
| Cloud Run | 180,000 vCPU-秒 | 設定自動縮減 |

### 5.2 故障排除指南

背景：故障排除是 ITIL 框架的一部分。原理涉及根因分析 (root cause analysis)。

展開：檢查日誌、重新配置變量。實例：連接錯誤時驗證 URI。
