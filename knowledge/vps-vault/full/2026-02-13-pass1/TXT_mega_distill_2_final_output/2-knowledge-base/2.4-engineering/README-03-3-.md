---
distilled_by: grok-4-0709
mode: B
---
part: 3
---

## 3. Fast-burn Idea：快速原型開發

### 3.1 步驟分解與時間管理
Fast-burn idea設計為3小時/$30預算，涵蓋從選書到打包。背景是敏捷開發，強調快速迭代。原理是時間盒定（time-boxing），確保每個階段聚焦。

3.1.1 步驟1：選書與提取（0:00-0:30）
選擇2-3本每類別書籍，提取章節列表和頂級propositions。實例：對於科幻類，選《沙丘》，提取{"chapters": [1,2,...], "propositions": ["spice is key"] }。

3.1.2 步驟2：構建Story Bible（0:30-1:30）
調用xAI生成人物、關係、規則、語調和事件模板。原理基於prompt engineering，輸入結構化數據以獲得精準輸出。

代碼範例4：生成Story Bible（Python）
```python
# 使用xAI API生成story bible
import requests
api_key = "YOUR_XAI_API_KEY"  # 從.env載入
payload = {"prompt": "Build story bible from JSON", "data": json_data}
response = requests.post("https://api.x.ai/story", headers={"Authorization": api_key}, json=payload)
print(response.json())  # 輸出生成的bible
```

3.1.3 步驟3：多角色模擬循環（1:30-2:30）
運行director -> writer -> continuity -> critic循環。背景是模擬電影製作流程。原理是反饋迴圈（feedback loops），提升生成品質。實例：director提出"what-if"，writer寫場景，continuity驗證，critic改進。

3.1.4 步驟4：打包成果（2:30-3:00）
轉為JSON + HTML snippets，適合web部署。實例：生成互動頁面，允許用戶選擇變體。

| 步驟 | 時間 | 成本估計 | 輸出 |
|------|------|----------|------|
| 1    | 30分 | $5      | 章節+propositions |
| 2    | 60分 | $10     | Story bible |
| 3    | 60分 | $10     | 模擬結果 |
| 4    | 30分 | $5      | Web bundle |

### 3.2 成本控制策略
使用MD/data/structures/作為廉價上下文，僅在最終場景拋光時拉取全文。原理是token economy，減少API調用量。實例：結構化JSON約100 tokens，全文可能上萬。
