---
distilled_by: grok-4-0709
mode: B
---
part: 5
---

## 5. 賽博朋克關鍵詞庫

### 5.1 詞庫結構
結構化為目錄系統。背景：用於多語言支持與一致性。原理：JSON檔案允許動態加載。

### 5.2 核心關鍵詞庫
包含identity系統的中英翻譯。實例：使用"soul_vector"統一平台術語。

代碼範例6（JavaScript - 加載詞庫）：
```javascript
// 加載JSON詞庫
async function loadKeywords(file) {
  const response = await fetch(`/keywords/core/${file}.json`);  // 獲取檔案
  return await response.json();  // 解析
}
const identity = await loadKeywords('identity');  // 使用範例
```
