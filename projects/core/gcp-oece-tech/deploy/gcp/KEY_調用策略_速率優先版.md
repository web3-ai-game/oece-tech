# 🚀 KEY 調用策略 - 速率優先版

> **原則: 時間就是金錢我的朋友!**  
> 付費 Key 優先爆射 → 免費 Key 兜底高頻噴射

---

## 📊 模型速率對照表 (最新 2025-11-26)

### 💎 付費層 (Paid Tier 1) - 時間就是金錢!

| 模型 | RPM | TPM | RPD | 單價 ($/1M tokens) | 用途 |
|------|-----|-----|-----|-------------------|------|
| **gemini-3-pro-preview** | **25** | **1M** | **250** | In:$1.25 Out:$5 | 🎯 深度思考/向量精確噴代碼/Notion清洗 |
| gemini-2.5-pro | 150 | 2M | 10K | In:$1.25 Out:$5 | 備用高並發 |
| gemini-2.5-flash | 15 | 4M | 1500 | In:$0.075 Out:$0.30 | 快速代碼生成 |

### 🆓 免費層 (Free Tier) - 瘋狂噴射!

| 模型 | RPM | TPM | RPD | 單價 | 用途 |
|------|-----|-----|-----|------|------|
| **gemini-2.5-flash-lite** | **15** | **250K** | **1500** | **FREE** | ✅ TG群聊垃圾話向量噴射 |
| gemini-2.0-flash-lite | 15 | 4M | 1500 | FREE | 備用高頻噴射 |
| gemini-2.0-flash | 10 | 2M | 1500 | FREE | 備用穩定噴射 |

---

## 🎯 調用優先級策略

### Tier 1: 付費優先爆射 💰

```javascript
const PAID_KEYS_PRIORITY = [
  {
    name: 'GEMINI_PRO_30_3PRO',
    model: 'gemini-3-pro-preview',
    key: 'AIzaSyA3ikY04T94AoAwndr20QxV9nl4w_NF_u4',
    rpm: 25,
    tpm: 1000000,
    cost: 'high',
    use: ['深度思考', '向量代碼生成', 'Notion數據清洗']
  },
  {
    name: 'GEMINI_PRO_25_FLASH',
    model: 'gemini-2.5-flash',
    key: 'AIzaSyBDXNZ-n19FGXWwwAQxtYB2H-Cs20bjkeU',
    rpm: 15,
    tpm: 4000000,
    cost: 'low',
    use: ['大量代碼生成', '快速分析']
  }
];
```

### Tier 2: 免費兜底高頻噴 🎉

```javascript
const FREE_KEYS_BLAST = [
  {
    name: 'GEMINI_FREE_LITE_01',
    model: 'gemini-2.5-flash-lite', // ⚡ 絕對能用!!!
    key: 'AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ',
    rpm: 15,
    tpm: 250000,
    cost: 'free',
    use: ['TG群聊', '垃圾話生成', '多人格噴射']
  },
  {
    name: 'GEMINI_FREE_20LITE',
    model: 'gemini-2.0-flash-lite',
    key: 'AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ',
    rpm: 15,
    tpm: 4000000,
    cost: 'free',
    use: ['備用高頻']
  },
  {
    name: 'GEMINI_FREE_20FLASH',
    model: 'gemini-2.0-flash',
    key: 'AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ',
    rpm: 10,
    tpm: 2000000,
    cost: 'free',
    use: ['備用穩定']
  }
];
```

---

## 🔄 智能調用邏輯

```javascript
class SmartKeyRouter {
  constructor() {
    this.paidKeys = PAID_KEYS_PRIORITY;
    this.freeKeys = FREE_KEYS_BLAST;
    this.callCounts = {};
  }

  // 根據任務類型選擇 key
  async selectKey(taskType, priority = 'speed') {
    // 高價值任務 → 付費 key 爆射
    if (taskType === 'notion_clean' || taskType === 'vector_code') {
      return this.paidKeys[0]; // Gemini 3 Pro 深度思考
    }

    // TG 垃圾話 → 免費 key 瘋狂噴
    if (taskType === 'tg_trash_talk' || taskType === 'forum_spam') {
      return this.selectFreeLite(); // 2.5 Flash-Lite 免費噴射
    }

    // 默認: 付費優先,免費兜底
    return priority === 'cost' 
      ? this.selectFreeLite() 
      : this.paidKeys[1]; // 2.5 Flash 快速生成
  }

  // 選擇免費 Lite 模型 (絕對能用!)
  selectFreeLite() {
    const freeLite = this.freeKeys.find(k => k.model === 'gemini-2.5-flash-lite');
    console.log('🎉 使用免費 Lite 模型:', freeLite.name);
    return freeLite;
  }

  // 速率限制檢查 (簡單令牌桶)
  async checkRateLimit(keyName, rpm) {
    const now = Date.now();
    if (!this.callCounts[keyName]) {
      this.callCounts[keyName] = { count: 0, resetTime: now + 60000 };
    }

    if (now > this.callCounts[keyName].resetTime) {
      this.callCounts[keyName] = { count: 0, resetTime: now + 60000 };
    }

    if (this.callCounts[keyName].count >= rpm) {
      throw new Error(`Rate limit exceeded for ${keyName}`);
    }

    this.callCounts[keyName].count++;
    return true;
  }
}
```

---

## 🎭 使用場景示例

### 場景 1: Notion 數據清洗 (付費爆射)

```javascript
const router = new SmartKeyRouter();
const key = await router.selectKey('notion_clean', 'speed');
// → 使用 Gemini 3 Pro Preview (25 RPM, 深度思考)

await callGemini({
  model: key.model,
  apiKey: key.key,
  prompt: '清洗並去重 Notion 頁面數據...',
  temperature: 0.2
});
```

### 場景 2: TG 群聊垃圾話 (免費狂噴)

```javascript
const router = new SmartKeyRouter();
const key = await router.selectKey('tg_trash_talk', 'cost');
// → 使用 Gemini 2.5 Flash-Lite (15 RPM, 免費)

await callGemini({
  model: key.model,
  apiKey: key.key,
  prompt: '生成瘋狂垃圾話回覆群友...',
  temperature: 0.9 // 高隨機性
});
```

### 場景 3: 向量代碼生成 (付費精確)

```javascript
const router = new SmartKeyRouter();
const key = await router.selectKey('vector_code', 'speed');
// → 使用 Gemini 3 Pro Preview (向量精確噴代碼)

await callGemini({
  model: key.model,
  apiKey: key.key,
  prompt: '生成 Go 併發向量調用代碼...',
  temperature: 0.3
});
```

---

## 📦 環境變量配置

```bash
# 付費 Keys (優先爆射)
export GEMINI_PRO_30_KEY="AIzaSyA3ikY04T94AoAwndr20QxV9nl4w_NF_u4"
export GEMINI_PRO_25_KEY="AIzaSyBDXNZ-n19FGXWwwAQxtYB2H-Cs20bjkeU"

# 免費 Keys (兜底高頻噴)
export GEMINI_FREE_KEY="AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ"

# TG Bot Token
export TELEGRAM_BOT_SVSKILO_TOKEN="8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg"

# Doppler Production Key
export DOPPLER_PROD_KEY="AQ.Ab8RN6LioS7k0Ipycl6oKXFuhww6VTXuosXwgeS8VMpTyZUFcw"
```

---

## 🚀 性能對比

| 任務類型 | 使用模型 | RPM | 成本/100萬次 | 速度 |
|---------|---------|-----|------------|------|
| 深度思考 | 3 Pro | 25 | $6.25 | ⭐⭐⭐⭐⭐ |
| 代碼生成 | 2.5 Flash | 15 | $0.375 | ⭐⭐⭐⭐ |
| TG垃圾話 | 2.5 Flash-Lite | 15 | **FREE** | ⭐⭐⭐⭐⭐ |

---

## ⚡ 核心原則

1. **時間就是金錢** → 付費 key 優先爆射深度任務
2. **免費兜底** → 免費 key 專注高頻低價值任務 (TG 群聊)
3. **向量精確噴** → Gemini 3 Pro 專門處理代碼/Notion
4. **瘋狂噴射** → 2.5 Flash-Lite 在 TG 群裡無限噴垃圾話
5. **速率鎖定** → 15 RPM 免費層,絕對夠用!

---

**更新時間**: 2025-11-26  
**維護者**: SMS-Key Team  
**狀態**: ✅ **VERIFIED** (2.5 Flash-Lite 絕對能用!!!)
