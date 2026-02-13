---
distilled_by: grok-4-0709
mode: B
---
part: 3
---

## 3. 人性碰撞實驗矩陣

### 3.1 實驗分類體系
實驗分為道德、社交等類別，每個有權重與開發時間。背景：源自心理學測試如Milgram實驗，但數字化。原理：權重決定向量貢獻度。

| 類別 | 實驗名稱 | 核心機制 | 向量權重 | 開發時間 |
|------|---------|---------|---------|---------|
| 道德測試 | 真理與謊言驗證裝置 | AI分析語言模式 | 0.3 | 3天 |
| 社交測試 | 你朋友真的懂你嗎? | 朋友回答對比 | 0.25 | 4天 |
| 決策測試 | 電車難題2077版 | 記錄選擇時間 | 0.2 | 2天 |
| 信任測試 | 囚徒困境在線版 | 匹配陌生人 | 0.15 | 5天 |
| 預測測試 | 命運齒輪預言機 | AI預測未來 | 0.1 | 3天 |

### 3.2 MVP #1: 真理與謊言驗證裝置
遊戲流程包括生成問題、用戶選擇與AI分析。背景：基於lie detection技術，如聚變圖但用NLP。原理：分析語言模式與時間。實例：用戶謊稱「我很開心」，AI檢測情感不一致。

代碼範例2（TypeScript - 生成問題）：
```typescript
// app/experiments/truth-lie/page.tsx
import { useState, useEffect } from 'react';
import gemini from 'gemini-api';  // 假設的Gemini客戶端

const TruthLieGame = () => {
  const [questions, setQuestions] = useState<string[]>([]);  // 儲存問題陣列

  useEffect(() => {
    async function generateQuestions() {
      const prompt = `生成10個深刻的人性問題,適合測試真實性。格式:JSON陣列`;  // 提示詞
      const result = await gemini.generateContent(prompt);  // 調用API
      setQuestions(JSON.parse(result.text()));  // 解析並設定
    }
    generateQuestions();
  }, []);

  return (/* UI 組件 */);
};
```

### 3.3 MVP #2: 你朋友真的懂你嗎?
機制包括自測、邀請朋友與對比。背景：類似社交心理學的親密度測試。原理：計算匹配度分數。實例：朋友猜中80%喜好，生成高友誼向量。

代碼範例3（TypeScript - 對比結果）：
```typescript
// 計算匹配度
async function calculateMatch(userAnswers: string[], friendAnswers: string[]) {
  let matchScore = 0;
  for (let i = 0; i < userAnswers.length; i++) {
    if (userAnswers[i] === friendAnswers[i]) matchScore++;  // 簡單匹配計分
  }
  return (matchScore / userAnswers.length) * 100;  // 百分比分數
}
```

### 3.4 其他MVP擴展
決策測試如電車難題，記錄時間反映猶豫。信任測試匹配用戶玩遊戲理論。預測測試用向量預言未來。
