---
distilled_by: grok-4-0709
mode: B
category: 2-knowledge-base/2.1-ai-strategy
source: gcp-distilled/FIRE_PLAN_ARCHITECTURE.md.distilled
---
part: 2
---

## 2. 商業模式與會員體系

火計劃的商業模式設計了三種訂閱層級：免費、Pro ($9.9/月) 和至尊 ($29.9/月)，並提供按需向量存檔服務。背景上，這種分層訂閱模式源自SaaS（Software as a Service）模型，如Spotify或Netflix，目的是透過增值服務吸引付費用戶。原理在於價值梯度：免費層提供基礎體驗，Pro層提升品質，至尊層解鎖獨家功能，從而實現用戶留存和轉化。

實例中，Pro用戶可獲得「高質量AI回覆」，如更詳細的心理分析；至尊用戶享有「深度向量渲染」，生成可視化的命運圖譜。按需服務則允許用戶支付額外費用存檔個人數據。

### 2.1. 會員層級對比

以下表格對比各層級：

| 層級      | 價格           | 核心功能                          | 目標用戶群                  | 預期轉化策略                  |
|-----------|----------------|-----------------------------------|-----------------------------|-------------------------------|
| 免費     | $0            | 基礎AI對話、社區瀏覽              | 初次體驗者                  | 透過水印或限制鼓勵升級        |
| Pro      | $9.9/月       | 高質量回覆、有限向量渲染          | 常規用戶                    | 提供試用期，展示Pro獨家內容   |
| 至尊     | $29.9/月      | 完整500年解讀、無限存檔           | 高端追求者                  | 獨家事件邀請，提升忠誠度      |
| 按需     | 依服務計費    | 自訂向量存檔                      | 所有用戶                    | 整合支付閘道，如Stripe       |

### 2.11. MVP路線圖的階段規劃

MVP（Minimum Viable Product）路線圖分為三階段：火種（Seed）、燎原（Spread）和燃燒（Burn）。背景上，這借鑒敏捷開發方法，如Scrum，強調迭代交付。原理在於快速驗證假設，從核心功能起步，逐步擴展。火種階段聚焦用戶註冊和基礎AI工具；燎原階段整合支付和社區互動；燃燒階段優化擴展性。

實例：一個月內實現核心社區，透過Telegram Bot收集反饋。

代碼範例3：Firebase Auth用戶註冊（JavaScript, Frontend）：

```javascript
// 註釋：前端用戶註冊範例，使用Firebase Auth
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User registered:", userCredential.user);
    // 註釋：註冊後，可觸發Cloud Function存儲用戶數據到Firestore
  } catch (error) {
    console.error("Error registering:", error);
  }
}
```

代碼範例4：支付整合範例（Node.js, 使用Stripe）：

```javascript
// 註釋：Cloud Functions中處理Stripe支付的範例
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createSubscription(userId, plan) {
  const customer = await stripe.customers.create({ metadata: { userId } });
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: plan === 'pro' ? 'price_pro' : 'price_ultimate' }]
  });
  // 註釋：成功後更新Firestore用戶層級
  return subscription;
}
```
