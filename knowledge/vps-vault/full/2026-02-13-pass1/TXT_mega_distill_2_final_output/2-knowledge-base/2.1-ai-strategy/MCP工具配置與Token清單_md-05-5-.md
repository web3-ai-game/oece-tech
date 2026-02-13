---
distilled_by: grok-4-0709
mode: B
---
part: 5
---

## 5. 部署清單與驗證

### 5.1 清單概述
包含檢查 Token、工具優先級等。背景：部署前驗證避免運行時錯誤。原理：清單式檢查提升可靠性。實例：檢查 Doppler 是否注入所有 Token。

### 5.2 自動化驗證
整合至 CI/CD。背景：DevOps 實踐要求自動化。原理：腳本掃描配置缺漏。實例：GitHub Actions 運行清單檢查。

#### 5.21 代碼範例：驗證腳本
```javascript
// 範例7: Node.js 驗證腳本
function validateConfig() {
  if (!process.env.NOTION_API_KEY) return "Missing Notion Key";
  return "All configs valid";
}
// 註釋: 此函數在部署前檢查環境變量。
```

```bash
# 範例8: CI/CD 整合
doppler run --command="npm test"  # 在 CI 中運行測試
# 註釋: 確保部署前所有 Token 已注入。
```
