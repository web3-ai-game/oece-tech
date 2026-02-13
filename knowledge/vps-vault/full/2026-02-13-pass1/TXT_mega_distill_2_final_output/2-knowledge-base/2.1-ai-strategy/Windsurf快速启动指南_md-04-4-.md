---
distilled_by: grok-4-0709
mode: B
---
part: 4
---

## 4. 自動化工作流與監控

Windsurf 提供自動化工作流，如一鍵部署到 Cloud Run。

### 4.1 工作流原理與實例

原理：基於 CI/CD 管道，集成 GitHub Actions。實例：自動代碼審查後部署應用。

代碼範例 5：部署腳本（帶註釋）

```bash
# deploy_to_cloudrun.sh
gcloud builds submit --tag gcr.io/$GCP_PROJECT_ID/my-app  # 構建鏡像
gcloud run deploy my-app --image gcr.io/$GCP_PROJECT_ID/my-app --platform managed  # 部署到 Cloud Run
```

### 4.11 使用統計與優化

內置監控追踪人格使用率。原理：基於 Prometheus 指標收集。實例：生成報告顯示“全棧工程師”佔 40% 使用。

| 指標 | 描述 | 示例值 |
|------|------|--------|
| 人格使用率 | 各人格佔比 | 技術架構師: 25% |
| 模型調用次數 | LLM 調用計數 | 500 次/小時 |
| 資源消耗 | CPU/內存 | 2 vCPU, 4GB |

代碼範例 6：統計查詢 API（JavaScript，帶註釋）

```javascript
// 使用 Windsurf SDK
const windsurf = require('windsurf-sdk');

async function getStats() {
  const stats = await windsurf.getUsageStats();  // 獲取使用統計
  console.log('人格使用:', stats.personas);  // 輸出如 { 'Architect': 100 }
  // 優化建議：如果某人格過載，切換模型
  if (stats.personas.Architect > 200) {
    console.log('建議切換到更高效模型');
  }
}
```
