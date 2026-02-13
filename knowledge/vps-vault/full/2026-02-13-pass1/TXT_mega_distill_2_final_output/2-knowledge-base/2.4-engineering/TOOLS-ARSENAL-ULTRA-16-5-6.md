---
title: 🛠️ 工具武器庫 | TOOL ARSENAL
category: 2-knowledge-base/2.4-engineering
source: docs/05-資源與工具/TOOLS-ARSENAL-ULTRA.md
distilled_by: grok-4-0709
mode: B
---
part: 16
---

## 5.6 Figma插件開發片段

```javascript
// Figma插件代碼
figma.ui.onmessage = msg => {
  if (msg.type === 'create-rect') {
    const rect = figma.createRectangle();  // 創建矩形
    rect.x = 150;
    rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
    figma.currentPage.appendChild(rect);  // 添加到頁面
  }
};
```
