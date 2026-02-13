---
distilled_by: grok-4-0709
mode: B
category: 2-knowledge-base/2.1-ai-strategy
source: gcp-distilled/FIRE_PLAN_ARCHITECTURE.md.distilled
---
part: 1
---

## 1. 項目概述與願景

火計劃（FIRE Plan）是 DeepWeay 賽博玄學社區的核心藍圖，旨在打造一個融合人工智慧（AI）、心理學、算命與元宇宙概念的創新平台。這個項目不僅僅是一個技術應用，而是試圖探索人類內心世界的數字化延伸，提供所謂「前後五百年」的AI內心元宇宙體驗。背景上，賽博玄學（Cyber Metaphysics）源自於現代科技與傳統玄學的交融，類似於如何將古老的占卜術與AI算法結合，讓用戶在虛擬空間中獲得深刻的自我洞察。原理在於利用AI的預測模型模擬人類命運軌跡，透過心理學原理如認知偏差（Cognitive Bias）來解讀用戶輸入，進而生成個性化的「命運渲染」。

例如，一個用戶輸入生日和個人經歷，系統可透過Gemini AI生成一個橫跨過去、現在與未來的敘事故事，幫助用戶反思人生選擇。這不僅是娛樂，更是療癒工具，類似於心理治療中的敘事療法（Narrative Therapy）。在實務上，DeepWeay 社區可視為一個元宇宙入口，用戶透過PWA（Progressive Web App）進入虛擬空間，與AI互動，分享體驗。

### 1.1. 核心技術棧的選擇與整合

火計劃的核心技術基石是Google Firebase，這是一個全方位的後端即服務（Backend-as-a-Service, BaaS）平台，提供無伺服器（Serverless）架構，允許開發者專注於前端邏輯而非基礎設施管理。背景上，Firebase 的興起可追溯到2011年被Google收購後的快速迭代，它解決了傳統後端開發的痛點，如伺服器維護和擴展性。原理在於其模塊化設計：Firebase Authentication（Auth）處理用戶身份驗證，Firestore 作為NoSQL資料庫存儲用戶數據，Cloud Functions 運行伺服器端邏輯，Hosting 部署網頁應用，Storage 管理文件上傳。

實例中，DeepWeay 使用Firestore 存儲用戶的「命運向量」（Fate Vectors），這些是AI生成的嵌入式數據，代表用戶的心理圖譜。為了補充，項目整合MongoDB Atlas作為輔助數據存儲，提供更靈活的查詢能力，以及Notion作為知識管理工具，用於內部文檔協作。

以下表格總結Firebase 各模塊的對比：

| 模塊          | 主要功能                  | 優勢                          | 潛在限制                  | DeepWeay 應用實例                  |
|---------------|---------------------------|-------------------------------|---------------------------|-----------------------------------|
| Auth         | 用戶身份驗證              | 支援多種提供者（如Google, Email） | 免費配額有限             | 用戶登入社區，綁定Telegram帳號    |
| Firestore    | 即時資料庫                | 實時同步，易擴展              | 查詢複雜度高              | 存儲AI算命結果和用戶互動歷史      |
| Functions    | 伺服器端邏輯執行          | 事件觸發，無需管理伺服器      | 冷啟動延遲               | 處理Gemini AI API調用和支付邏輯   |
| Hosting      | 靜態/動態網頁部署          | 全球CDN加速                   | 僅限簡單應用              | 部署PWA手機端UI                   |
| Storage      | 文件存儲與管理            | 安全規則控制                  | 儲存成本隨數據增長       | 上傳用戶自訂命運圖像或音頻        |

### 1.11. AI能力的深度整合

AI是火計劃的靈魂，利用Google Gemini（Free 和 Pro 版本）及Embedding模型，提供從基礎對話到深度向量渲染的服務。背景上，Gemini 是Google最新的多模態AI模型，繼承自PaLM系列，擅長處理文字、圖像和代碼。原理基於Transformer架構，透過注意力機制（Attention Mechanism）捕捉上下文，生成高品質回覆。在DeepWeay中，Embedding模型將用戶輸入轉換為向量空間，實現相似性搜索，如匹配類似命運軌跡的用戶。

實例包括：用戶查詢「我的職業未來」，Gemini Free提供簡單建議，而Pro版本生成「前後500年完整解讀」，整合心理學如Jungian Archetypes（榮格原型）來分析潛意識。

代碼範例1：使用Gemini API生成算命回覆（JavaScript, Cloud Functions）：

```javascript
// 註釋：這是Cloud Functions中調用Gemini API的範例，處理用戶輸入並生成命運預測
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateFatePrediction(userInput) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `基於賽博玄學，分析用戶輸入：${userInput}，生成前後500年命運敘事。`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// 註釋：調用此函數時，需確保API Key從環境變數載入，以防洩露
```

代碼範例2：Embedding用戶數據（Python, 使用Vertex AI）：

```python
# 註釋：這是生成用戶命運向量的Python範例，使用Google Vertex AI Embedding
from vertexai.preview.generative_models import GenerativeModel

model = GenerativeModel("gemini-1.0-pro-vision-001")

def embed_user_fate(text):
    embedding = model.generate_embeddings(content=text)
    return embedding.values  # 返回向量表示，用於相似性搜索

# 註釋：此向量可存入Firestore，用於推薦相似用戶或內容
```
