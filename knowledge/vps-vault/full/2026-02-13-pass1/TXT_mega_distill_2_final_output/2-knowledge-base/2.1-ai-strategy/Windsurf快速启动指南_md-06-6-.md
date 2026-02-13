---
distilled_by: grok-4-0709
mode: B
---
part: 6
---

## 6. 高級自定義與擴展

用戶可編輯配置文件添加人格。原理：基於 YAML 的配置驅動開發（Configuration-Driven Development）。

代碼範例 8：擴展自動化規則（JSON，帶註釋）

```json
{
  "rules": [
    {
      "trigger": "deploy",  // 觸發詞
      "action": "run_cloud_deploy",  // 執行部署
      "persona": "DevOpsEngineer"  // 指定人格
    }
  ]
}
```
