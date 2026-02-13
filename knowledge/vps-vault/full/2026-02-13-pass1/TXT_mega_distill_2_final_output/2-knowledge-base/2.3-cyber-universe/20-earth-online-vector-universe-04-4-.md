---
distilled_by: grok-4-0709
mode: B
---
part: 4
---

## 4. 地球Online收費系統

### 4.1 三層權限體系
分為遊客、居民與公民。背景：訂閱模式如Patreon，但AI化。原理：精度隨價格提升。

| 等級 | 價格 | 解鎖內容 | 向量精度 |
|------|------|---------|---------|
| 遊客 | $0 | 3個免費實驗 | 低精度(128維) |
| 居民 | $9.99/月 | 所有實驗、論壇 | 中精度(384維) |
| 公民 | $29.99/月 | 定制實驗、預測 | 高精度(768維) |

### 4.2 核心產品: 賽博身份檔案
檔案包含向量、光譜圖與預測。背景：靈感來自Cyberpunk 2077的角色面板。原理：AI合成數據生成綜合報告。

代碼範例4（TypeScript - 生成檔案）：
```typescript
// 生成賽博身份檔案
async function generateCyberProfile(userId: string): Promise<CyberProfile> {
  const experiments = await supabase.from('experiment_results').select('*').eq('user_id', userId);  // 查詢數據
  const vector = await gemini.embed_content({ model: 'text-embedding-004', content: JSON.stringify(experiments) });  // 生成向量
  return { /* 回傳物件 */ };  // 組合檔案
}
```

代碼範例5（Python - 計算人性光譜）：
```python
# 基於數據生成光譜
import json
spectrum_prompt = f"基於以下數據,生成人性光譜分數(JSON): {json.dumps(experiments)}"
spectrum = gemini.generateContent(spectrum_prompt)  # 調用API
parsed_spectrum = json.loads(spectrum.text())  # 解析JSON
```
