# 🧬 Gemini 免費層終極榨取策略 v2.0

> **來源**: Notion sms-sms 整合  
> **蒸餾時間**: 2025-11-27  
> **頁面ID**: 187576b95ff34fbab6e4d120d82c5aea  
> **密度等級**: ⭐⭐⭐⭐⭐ (100% 戰術精華)

---

## 📊 Gemini API 限流策略

### 免費層配額 (截至 2025-11-26)

| 模型 | RPM | RPD | TPM | 最佳用途 |
|------|-----|-----|-----|----------|
| **gemini-2.0-flash-lite** | 15 | 1500 | 1M | 實時翻譯、簡單對話 |
| **gemini-2.5-flash** | 15 | 2500 | 4M | 論壇內容生成、遊戲 |
| **gemini-2.5-pro** | 2 | 100 | 32K | 複雜推理、代碼生成 |

**核心數據**:
- RPM = Requests Per Minute (每分鐘請求)
- RPD = Requests Per Day (每日請求)
- TPM = Tokens Per Minute (每分鐘 Token 數)

---

## 🔑 密鑰管理策略

### 28 個免費集群 + 1 個收費 Key

#### 免費 Key 池 (28 個)

**分組策略**:
```
🟢 A 組 (10個): Flash Lite 專用 - 論壇翻譯、用戶對話
🟠 B 組 (10個): Flash 專用 - 內容生成、遊戲邏輯
🔵 C 組 (8個): Pro 專用 - 複雜推理、代碼生成
```

**輪換算法 (Round Robin)**:
```typescript
// 簡化版密鑰池
class GeminiKeyPool {
  private keys: string[] = [
    // A組: Flash Lite (10個)
    'AIza...001', 'AIza...002', ..., 'AIza...010',
    // B組: Flash (10個)  
    'AIza...011', 'AIza...012', ..., 'AIza...020',
    // C組: Pro (8個)
    'AIza...021', 'AIza...022', ..., 'AIza...028'
  ];
  
  private currentIndex = 0;
  
  getNextKey(model: 'lite' | 'flash' | 'pro'): string {
    const ranges = {
      lite: [0, 9],
      flash: [10, 19],
      pro: [20, 27]
    };
    
    const [start, end] = ranges[model];
    const key = this.keys[start + (this.currentIndex % (end - start + 1))];
    this.currentIndex++;
    return key;
  }
}
```

#### 收費 Key (1 個) - $100 預算

**專用場景**:
- 高優先級用戶請求
- 免費配額耗盡時的備用
- 複雜的多模態任務 (圖片 + 文本)

**保護策略**:
```typescript
const PAID_KEY_BUDGET = 100; // USD
let paidKeySpent = 0;

function shouldUsePaidKey(taskComplexity: number): boolean {
  if (paidKeySpent >= PAID_KEY_BUDGET) return false;
  if (taskComplexity > 8) return true; // 複雜度 > 8
  if (Math.random() > 0.95) return true; // 5% 概率用於測試
  return false;
}
```

---

## 🚀 AI 工具開發優先級

### Tier 1: 免費用戶 (Flash Lite)

#### 1. 旅行規劃器
- **輸入**: 目的地、天數、預算
- **輸出**: 行程 + 住宿 + 交通方案
- **Token 估算**: ~500 tokens/次
- **配額消耗**: 1500 次/天 ÷ 500 次實際使用 = **3 次/用戶/天**

#### 2. 論壇自動翻譯
- **功能**: 中文 ↔ 英文 / 泰文
- **Token 估算**: ~200 tokens/次
- **配額消耗**: 1500 次/天 = **7500 條帖子/天**

### Tier 2: 進階功能 (Flash)

#### 3. 20Q 心理測試遊戲
- **流程**: 20 個問題 + 結果分析
- **Token 估算**: ~1000 tokens/次
- **配額消耗**: 2500 次/天 ÷ 1000 = **2.5 次/用戶/天**

#### 4. Telegram Bot 對話
- **功能**: 多輪對話 + 上下文記憶
- **Token 估算**: ~300 tokens/次
- **配額消耗**: 2500 次/天 = **8000 條對話/天**

### Tier 3: 付費用戶 (Pro + 收費 Key)

#### 5. 代碼生成助手
- **功能**: 全棧代碼生成 + Debug
- **Token 估算**: ~2000 tokens/次
- **收費**: $0.01/次

#### 6. 多模態內容生成
- **功能**: 圖片 + 文本 → 創意內容
- **Token 估算**: ~3000 tokens/次
- **收費**: $0.02/次

---

## 💸 定價策略

### 三層定價模型

| 等級 | 月費 | 權益 |
|------|------|------|
| **Free** | $0 | 旅行規劃 (3次/天) + 論壇翻譯 |
| **Plus** | $0 | 20Q 遊戲 (無限) + Telegram Bot |
| **Pro** | $9.99 | 代碼生成 + 多模態內容 |

**設計理念**:
- Free 和 Plus 都是 **$0**,用來積累用戶
- Pro 用戶支付的 $9.99 用於覆蓋收費 Key 成本
- 前期目標: **1000 Free 用戶 + 100 Plus 用戶 + 10 Pro 用戶**

---

## 🛡️ 限流與熔斷策略

### 用戶級別限流

```typescript
interface UserQuota {
  tier: 'free' | 'plus' | 'pro';
  dailyLimit: number;
  currentUsage: number;
  resetAt: Date;
}

class RateLimiter {
  async checkQuota(userId: string, feature: string): Promise<boolean> {
    const user = await db.getUserQuota(userId);
    
    // 檢查是否超過限制
    if (user.currentUsage >= user.dailyLimit) {
      return false;
    }
    
    // 更新使用量
    await db.incrementUsage(userId);
    return true;
  }
}
```

### API 級別熔斷

```typescript
const CIRCUIT_BREAKER_THRESHOLD = 0.8; // 80% 配額時觸發

async function callGeminiWithCircuitBreaker(prompt: string) {
  const quotaUsage = await getQuotaUsage();
  
  // 配額使用超過 80% 時,降級到更便宜的模型
  if (quotaUsage > CIRCUIT_BREAKER_THRESHOLD) {
    console.warn('⚠️ Quota near limit, switching to Flash Lite');
    return await callGemini(prompt, 'flash-lite');
  }
  
  return await callGemini(prompt, 'flash');
}
```

---

## 📈 配額監控儀表板

### 實時監控指標

```typescript
// Gemini 配額使用情況 (每小時更新)
interface QuotaStats {
  flashLite: {
    used: number;      // 已使用
    total: number;     // 總配額
    percentage: number; // 使用率
  };
  flash: {
    used: number;
    total: number;
    percentage: number;
  };
  pro: {
    used: number;
    total: number;
    percentage: number;
  };
  paidKeySpent: number; // 收費 Key 花費 (USD)
}
```

### 警報策略

```typescript
// 配額使用警報
const ALERTS = {
  warning: 0.7,  // 70% 使用時發送警告
  critical: 0.9, // 90% 使用時發送緊急通知
};

async function checkQuotaAlerts() {
  const stats = await getQuotaStats();
  
  Object.entries(stats).forEach(([model, data]) => {
    if (data.percentage >= ALERTS.critical) {
      sendAlert(`🚨 ${model} 配額已用 ${data.percentage * 100}%!`);
    } else if (data.percentage >= ALERTS.warning) {
      sendAlert(`⚠️ ${model} 配額已用 ${data.percentage * 100}%`);
    }
  });
}
```

---

## 🎯 Prompt 工程最佳實踐

### 省 Token 技巧

#### 1. 使用簡潔的系統提示
```typescript
// ❌ 冗長版 (200 tokens)
const systemPrompt = `你是一個專業的旅行規劃助手,你需要根據用戶提供的信息,包括目的地、旅行天數、預算等,為用戶制定一個詳細的旅行計劃...`;

// ✅ 簡潔版 (50 tokens)
const systemPrompt = `Travel planner. Input: destination, days, budget. Output: itinerary + lodging + transport.`;
```

#### 2. 批量請求
```typescript
// ❌ 低效: 10 次請求
for (const post of posts) {
  await translatePost(post);
}

// ✅ 高效: 1 次請求
const translatedPosts = await translateBatch(posts);
```

#### 3. 緩存常見回答
```typescript
// Redis 緩存熱門查詢
const cachedResult = await redis.get(`travel:${destination}:${days}:${budget}`);
if (cachedResult) return cachedResult;

const result = await gemini.generate(prompt);
await redis.set(`travel:${destination}:${days}:${budget}`, result, 3600); // 緩存 1 小時
```

---

## 🔄 自動化腳本

### 每日配額重置提醒

```bash
#!/bin/bash
# quota_reset_reminder.sh

# 每天 00:00 UTC 運行

echo "🔄 Gemini 配額已重置!"
echo "Flash Lite: 0/1500"
echo "Flash: 0/2500"
echo "Pro: 0/100"

# 發送到 Telegram
curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -d "chat_id=${CHAT_ID}" \
  -d "text=🔄 Gemini 配額已重置!"
```

### 配額使用報告

```python
# quota_report.py
import requests
from datetime import datetime

def get_quota_stats():
    # 從你的數據庫或日誌中獲取
    return {
        'flash_lite': {'used': 1200, 'total': 1500},
        'flash': {'used': 2000, 'total': 2500},
        'pro': {'used': 80, 'total': 100}
    }

def send_daily_report():
    stats = get_quota_stats()
    
    report = f"""
📊 Gemini 配額使用報告 ({datetime.now().date()})

Flash Lite: {stats['flash_lite']['used']}/{stats['flash_lite']['total']} ({stats['flash_lite']['used']/stats['flash_lite']['total']*100:.1f}%)
Flash: {stats['flash']['used']}/{stats['flash']['total']} ({stats['flash']['used']/stats['flash']['total']*100:.1f}%)
Pro: {stats['pro']['used']}/{stats['pro']['total']} ({stats['pro']['used']/stats['pro']['total']*100:.1f}%)

收費 Key 花費: $2.34
    """
    
    # 發送到 Slack/Discord/Telegram
    print(report)

if __name__ == '__main__':
    send_daily_report()
```

---

## 🚨 故障恢復策略

### 多模型降級

```typescript
async function generateContent(prompt: string) {
  try {
    // 嘗試 Flash
    return await callGemini(prompt, 'flash');
  } catch (error) {
    if (error.status === 429) { // 配額用盡
      console.warn('Flash quota exceeded, fallback to Lite');
      return await callGemini(prompt, 'flash-lite');
    }
    
    // 如果免費配額都用完了,使用收費 Key
    if (shouldUsePaidKey(8)) {
      return await callGemini(prompt, 'pro', PAID_KEY);
    }
    
    throw new Error('所有配額已耗盡,請明天再試');
  }
}
```

### OpenRouter 作為終極備用

```typescript
const FALLBACK_CONFIG = {
  provider: 'openrouter',
  model: 'anthropic/claude-3.5-sonnet', // 你的 $1111 餘額
  budget: 100, // 每月限額 $100
};

async function generateWithFallback(prompt: string) {
  try {
    return await generateContent(prompt); // Gemini
  } catch (error) {
    console.warn('Gemini failed, switching to OpenRouter');
    return await openrouter.generate(prompt, FALLBACK_CONFIG);
  }
}
```

---

## 📚 實戰案例

### 案例 1: 論壇自動翻譯

**需求**: 用戶發帖時自動翻譯成 3 種語言 (中/英/泰)

**實現**:
```typescript
async function translatePost(content: string) {
  const prompt = `Translate to EN, TH:\n"${content}"`;
  
  const result = await callGemini(prompt, 'flash-lite');
  
  return {
    original: content,
    en: result.translations.en,
    th: result.translations.th
  };
}
```

**Token 消耗**: ~200 tokens/次  
**日均處理**: 1500 RPD ÷ 1 = **1500 篇帖子/天**

### 案例 2: 20Q 心理測試遊戲

**需求**: 根據用戶回答生成 "Soul Vector" (768 維)

**實現**:
```typescript
async function generate20QResult(answers: string[]) {
  const prompt = `
Based on these 20 answers, generate a personality profile:
${answers.join('\n')}

Output: JSON with traits and embedding.
  `;
  
  const result = await callGemini(prompt, 'flash');
  
  // 用 Gemini Embeddings API 生成向量
  const embedding = await gemini.embed(result.profile);
  
  return {
    profile: result.profile,
    soulVector: embedding // 768 維
  };
}
```

**Token 消耗**: ~1000 tokens/次  
**日均處理**: 2500 RPD ÷ 1 = **2500 個測試/天**

---

## 🎯 總結: Gemini 榨取三原則

### 1. 分層使用 (Tiered Usage)
- Flash Lite → 簡單任務 (翻譯、對話)
- Flash → 中等任務 (遊戲、內容生成)
- Pro → 複雜任務 (代碼生成、推理)

### 2. 輪換密鑰 (Key Rotation)
- 28 個免費 Key 輪換使用
- 收費 Key 僅用於高價值場景
- OpenRouter 作為終極備用

### 3. 主動降級 (Graceful Degradation)
- 配額 > 80% → 降級到更便宜的模型
- 免費配額耗盡 → 使用收費 Key
- 所有配額耗盡 → 提示用戶明天再試

---

**🏯 蒸餾評級**: ⭐⭐⭐⭐⭐ (100% 戰術精華)  
**諸葛亮曰**: "善戰者,無智名,無勇功。此乃免費之道,榨之不盡,用之不竭也。"
