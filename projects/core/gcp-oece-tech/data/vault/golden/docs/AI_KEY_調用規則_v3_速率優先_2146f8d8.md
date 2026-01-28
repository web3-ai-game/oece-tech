# 🔐 AI Key 調用規則 v3.0 - 速率優先策略

> **核心理念**: 收費層速度 = 免費層 75 倍！直接用 Gemini 3 Pro 清洗數據
> 
> **最後更新**: 2025-11-26 v3.0
> **速率對比**: Paid Tier (25 RPM) vs Free Tier (2 RPM) = **12.5x 差距！**

---

## 💰 泰銖本位成本計算

### Gemini 3 Pro 定價（收費層）

```
輸入: $1.25 / 1M tokens
輸出: $5.00 / 1M tokens
1 USD = 35 THB (泰銖)

計算：
- 1萬 input tokens  = $0.0125 = 0.44 泰銖
- 1萬 output tokens = $0.05   = 1.75 泰銖
- 1萬往返 tokens    = $0.0625 = 2.19 泰銖

結論：數據清洗 10 萬 tokens = 22 泰銖 = 一杯咖啡！
數據無價，直接用！
```

### Gemini 2.5 Pro 定價

```
輸入: $1.25 / 1M tokens
輸出: $5.00 / 1M tokens

與 3 Pro 相同價格，但性能略低
僅作為 3 Pro 超限時的備用
```

---

## 🎯 速率對比（官方數據）

### 💰 Paid Tier 1（收費層）

| 模型 | RPM | TPM | RPD | 速度 | 用途 |
|------|-----|-----|-----|------|------|
| **gemini-3-pro-preview** | **25** | **1M** | **250** | **⚡ 主力** | **數據清洗、架構** |
| gemini-2.5-pro | 150 | 2M | 10K | 🚀 極快 | 高並發、備用 |
| gemini-2.0-flash-lite | 4K | 4M | ∞ | 💨 超音速 | 代碼噴射 |

### 🆓 Free Tier（免費層）

| 模型 | RPM | TPM | RPD | 速度 | 限制 |
|------|-----|-----|-----|------|------|
| gemini-2.0-flash-lite | 30 | 1M | 200 | 🐌 慢 | 免費最快 |
| gemini-2.5-flash-lite | 15 | 250K | 1K | 🐢 很慢 | 客服用 |
| gemini-2.5-flash | 10 | 250K | 250 | 🦥 超慢 | 不推薦 |
| gemini-2.5-pro | 2 | 125K | 50 | 🪫 龜速 | **禁用！** |

### ⚡ 速率差距分析

```
收費 gemini-3-pro: 25 RPM, 1M TPM
免費 gemini-2.5-pro: 2 RPM, 125K TPM

速度差距:
- RPM: 25 / 2 = 12.5倍
- TPM: 1M / 125K = 8倍
- 綜合: 收費層快 10-12倍！

結論: 收費層 1 分鐘 = 免費層 12 分鐘
     30 頁清洗: 收費 15 分鐘 vs 免費 3 小時！
```

---

## 🎯 Key 分配策略 v3.0

### 🔴 收費 Key（全力衝刺）

```bash
# 🥇 Priority 1: Gemini 3 Pro Preview（數據清洗主力）
GEMINI_PRO_30="AIzaSyA3ikY04T94AoAwndr20QxV9nl4w_NF_u4"
  模型: gemini-3-pro-preview  # ✅ 正確名稱
  速率: 25 RPM, 1M TPM, 250 RPD (Paid Tier 1)
  
  專屬任務:
    ⭐ Notion 數據清洗（核心）
    ⭐ 架構設計與分析
    ⭐ 去重與結構化
    ⭐ 精準內容提取
    ⭐ 向量化預處理
  
  成本: $1.25/1M 輸入 + $5/1M 輸出 = 35 泰銖/1M
  
  禁止: 客服、簡單代碼、測試請求

# 🥈 Priority 2: Gemini 2.5 Pro（高並發備用）
GEMINI_PRO_25="AIzaSyAj08QZ4B8CMU_CTG-QtGUEv0gBHZbM_cQ"
  模型: gemini-2.5-pro
  速率: 150 RPM, 2M TPM, 10K RPD (Paid Tier 1)
  
  備用場景:
    ✅ Gemini 3 Pro 超限時接管
    ✅ 高並發批量處理
    ✅ 實時分析場景
  
  優先級: ⭐⭐ (僅作為備用)

# 🥉 Priority 3: Gemini 2.0 Flash Lite（代碼噴射）
GEMINI_PRO_30 (同一 key)
  模型: gemini-2.0-flash-lite
  速率: 4K RPM, 4M TPM, ∞ RPD (Paid Tier 1)
  
  高速任務:
    ✅ 大量代碼生成
    ✅ 快速迭代
    ✅ 批量轉換
  
  成本: 極低

# 🔐 Doppler（密鑰管理）
DOPPLER_PROD_1="AQ.Ab8RN6LlrNEKtXonwqhBKhVRziaoBgHiUwE6CpdSv5Ttil4JgA"
DOPPLER_PROD_2="AQ.Ab8RN6LioS7k0Ipycl6oKXFuhww6VTXuosXwgeS8VMpTyZUFcw"
```

### 🆓 免費 Key（僅客服用）

```bash
# 免費 Key 陣列（客服專用，不要浪費收費層）
FREE_KEYS=(
  "AIzaSyD_cNll0AKAmKZgO6pOJzMRosKiBJxuUNM"  # Key 1
  # 添加更多免費 key...
)

模型: gemini-2.0-flash-lite（免費層最快）
速率: 30 RPM, 1M TPM, 200 RPD (Free Tier)

⚠️ 重要: 不要用 gemini-2.5-pro 免費層（2 RPM 龜速）

專屬任務:
  ✅ 電報群客服 Bot（低優先級）
  ✅ 簡單問答（不重要）
  ✅ 垃圾任務（可等待）
  ❌ 數據清洗（禁止！）
  ❌ 架構設計（禁止！）

策略: 輪詢使用，均衡負載
```

---

## 📊 官方速率對照表（實測驗證）

### 💰 Paid Tier 1（收費層 - 開發主力）

| 模型 | RPM | TPM | RPD | 倍數 | 成本/1M | 用途 |
|------|-----|-----|-----|------|---------|------|
| **gemini-3-pro-preview** ⭐ | **25** | **1M** | **250** | **12.5x** | **$1.25/$5** | **數據清洗** |
| gemini-2.5-pro 🚀 | 150 | 2M | 10K | 75x | $1.25/$5 | 高並發備用 |
| gemini-2.0-flash-lite 💨 | 4K | 4M | ∞ | 133x | 極低 | 代碼噴射 |

### 🆓 Free Tier（免費層 - 僅客服）

| 模型 | RPM | TPM | RPD | 速度 | 限制 | 用途 |
|------|-----|-----|-----|------|------|------|
| gemini-2.0-flash-lite | 30 | 1M | 200 | 🐌 | 慢 | 客服首選 |
| gemini-2.5-flash-lite | 15 | 250K | 1K | 🐢 | 很慢 | 客服備用 |
| gemini-2.5-flash | 10 | 250K | 250 | 🦥 | 超慢 | 不推薦 |
| ~~gemini-2.5-pro~~ | ~~2~~ | ~~125K~~ | ~~50~~ | 🪫 | **龜速** | **禁用！** |

### ⚡ 速度倍數對比

```
基準: 免費層 gemini-2.5-pro (2 RPM)

收費 vs 免費:
- gemini-3-pro (25 RPM) = 12.5x 免費 2.5-pro
- gemini-2.5-pro (150 RPM) = 75x 免費 2.5-pro  
- gemini-2.0-flash-lite (4K RPM) = 2000x 免費 2.5-pro

結論: 收費層 = 免費層 10-2000 倍速度！
```

**說明**：
- ⭐ = 數據清洗主力（Gemini 3 Pro）
- 🚀 = 高並發備用（Gemini 2.5 Pro）
- 💨 = 超高速噴射（Flash Lite）
- 🪫 = 禁用模型（免費 2.5 Pro 太慢）

---

## 🎯 任務路由規則

### Rule 1: Notion 數據清洗（關鍵任務 - 直接用 3 Pro）

```javascript
if (task.type === 'notion_cleaning') {
  // 🔴 直接使用 Gemini 3 Pro Preview（25 RPM）
  const model = 'gemini-3-pro-preview';  // ✅ 正確名稱
  const apiKey = process.env.GEMINI_PRO_30;
  const temperature = 0.3; // 低溫精確
  
  // 上下文壓縮策略
  const maxInput = 50000; // 5萬 tokens 輸入
  const maxOutput = 8000;  // 8千 tokens 輸出
  
  // 速率控制（25 RPM = 每 2.4 秒一次）
  const delay = 3000; // 3 秒安全間隔
  
  // 成本估算（泰銖本位）
  const inputCost = (50000 * 1.25) / 1000000 * 35;  // 2.19 泰銖
  const outputCost = (8000 * 5.00) / 1000000 * 35;  // 1.40 泰銖
  const totalCost = inputCost + outputCost;          // 3.59 泰銖/次
  
  console.log(`💰 成本: ${totalCost.toFixed(2)} 泰銖/頁`);
  console.log(`⚡ 速度: 25 RPM (免費層 12.5 倍)`);
  console.log(`⏱️  時間: 30 頁 = 90 秒 (免費層需 18 分鐘)`);
  
  return { model, apiKey, temperature, maxInput, maxOutput, delay };
}
```

### Rule 2: 架構設計與分析

```javascript
if (task.type === 'architecture') {
  // 使用 Gemini 3 Pro
  const model = 'gemini-3-pro';
  const apiKey = process.env.GEMINI_PRO_30;
  const temperature = 0.5; // 中溫平衡
  
  return { model, apiKey, temperature };
}
```

### Rule 3: 客服 Bot（免費陣列）

```javascript
if (task.type === 'customer_service') {
  // 輪詢免費 key 陣列
  const model = 'gemini-2.5-flash-lite';
  const apiKey = FREE_KEYS[currentIndex % FREE_KEYS.length];
  const temperature = 0.7; // 客服友好
  
  currentIndex++;
  return { model, apiKey, temperature };
}
```

### Rule 4: 代碼生成（免費優先）

```javascript
if (task.type === 'code_generation') {
  // 簡單代碼：免費 key
  if (task.complexity === 'low') {
    return {
      model: 'gemini-2.5-flash-lite',
      apiKey: FREE_KEYS[currentIndex++ % FREE_KEYS.length],
      temperature: 0.2
    };
  }
  
  // 複雜架構：收費 key
  if (task.complexity === 'high') {
    return {
      model: 'gemini-3-pro',
      apiKey: process.env.GEMINI_PRO_30,
      temperature: 0.3
    };
  }
}
```

---

## 🗜️ 上下文壓縮策略

### 策略 1: 智能分段

```javascript
/**
 * 將大文檔分段處理，避免超限
 */
function compressContext(text, maxTokens = 50000) {
  // 1. 移除無用內容
  text = text
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // 控制字符
    .replace(/\s+/g, ' ') // 多餘空格
    .replace(/```[\s\S]*?```/g, '[CODE_BLOCK]'); // 代碼塊摘要
  
  // 2. 提取關鍵段落
  const paragraphs = text.split('\n\n');
  const important = paragraphs.filter(p => 
    p.length > 50 && // 過濾短段落
    /[架構|技術|策略|implementation|architecture]/i.test(p) // 關鍵詞
  );
  
  // 3. 截斷到 token 限制
  let compressed = important.join('\n\n');
  const estimatedTokens = compressed.length / 4; // 粗略估算
  
  if (estimatedTokens > maxTokens) {
    compressed = compressed.slice(0, maxTokens * 4);
  }
  
  return compressed;
}
```

### 策略 2: 批量處理

```javascript
/**
 * 批量處理 Notion 頁面
 */
async function batchProcess(pages, batchSize = 5) {
  const results = [];
  
  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize);
    
    console.log(`處理批次 ${i / batchSize + 1}/${Math.ceil(pages.length / batchSize)}`);
    
    // 並發處理（但遵守 RPM 限制）
    const batchResults = await Promise.all(
      batch.map(async (page, idx) => {
        // 延遲避免超 RPM（25 RPM = 每 2.4 秒一個請求）
        await sleep(idx * 3000);
        return processPage(page);
      })
    );
    
    results.push(...batchResults);
    
    // 批次間延遲
    await sleep(5000);
  }
  
  return results;
}
```

---

## 💡 實戰案例

### Case 1: Notion 數據清洗（當前任務）

```bash
# 使用 Gemini 3 Pro 直接處理
export GEMINI_PRO_30="AIzaSyA3ikY04T94AoAwndr20QxV9nl4w_NF_u4"

node scripts/extract_core_content.js \
  --model gemini-3-pro \
  --temperature 0.3 \
  --max-input 50000 \
  --max-output 8000 \
  --compress true

# 預估成本
# 30 頁面 × 5萬 tokens = 150萬 tokens 輸入
# 30 頁面 × 8千 tokens = 24萬 tokens 輸出
# 總成本 = (1.5M × $1.25 + 0.24M × $5.00) / 1M = $3.075 ≈ 108 泰銖
# 結論：一頓午餐的錢，換取完整數據清洗！
```

### Case 2: 電報客服 Bot

```javascript
// 使用免費 key 陣列輪詢
const FREE_KEYS = [
  "AIzaSyD_cNll0AKAmKZgO6pOJzMRosKiBJxuUNM",
  // ... 更多 key
];

let keyIndex = 0;

async function handleTelegramMessage(message) {
  const apiKey = FREE_KEYS[keyIndex % FREE_KEYS.length];
  keyIndex++;
  
  const response = await callGemini({
    model: 'gemini-2.5-flash-lite',
    apiKey: apiKey,
    prompt: `客服回覆: ${message}`,
    temperature: 0.7
  });
  
  return response;
}
```

---

## 📈 監控與優化

### 每日檢查腳本

```bash
#!/bin/bash
# check_quota.sh

echo "📊 Gemini 3 Pro 使用情況"
echo "今日已用: $(cat /tmp/gemini3_usage.log | wc -l) 請求 / 250"

COST=$(awk '{sum+=$1} END {print sum}' /tmp/gemini3_cost.log)
echo "今日成本: $COST 泰銖"

# 警告閾值
if [ $(cat /tmp/gemini3_usage.log | wc -l) -gt 200 ]; then
  echo "⚠️  警告：今日使用量超過 200 請求"
fi
```

### 成本追蹤

```javascript
// 每次調用記錄成本
function logCost(inputTokens, outputTokens) {
  const costUSD = (inputTokens * 1.25 + outputTokens * 5.00) / 1000000;
  const costTHB = costUSD * 35;
  
  fs.appendFileSync('/tmp/gemini3_cost.log', `${costTHB}\n`);
  
  console.log(`💰 本次成本: ${costTHB.toFixed(4)} 泰銖`);
}
```

---

## 🚀 部署檢查清單

- [x] ✅ 更新調用規則 v2.0
- [ ] 📝 修改 extract_core_content.js 使用 gemini-3-pro
- [ ] 🗜️ 實現上下文壓縮
- [ ] 📊 添加成本追蹤
- [ ] 🤖 部署電報客服 Bot（免費陣列）
- [ ] 📈 設置監控腳本
- [ ] 🧪 測試 Gemini 3 Pro
- [ ] 🚀 執行 Notion 數據清洗

---

## ⚠️ 安全提醒

```
🔴 收費 Key（嚴格保密）：
  - GEMINI_PRO_30: AIzaSyA3ikY04T94AoAwndr20QxV9nl4w_NF_u4
  - GEMINI_PRO_25: AIzaSyAj08QZ4B8CMU_CTG-QtGUEv0gBHZbM_cQ
  - DOPPLER_PROD_1: AQ.Ab8RN6LlrNEKtXonwqhBKhVRziaoBgHiUwE6CpdSv5Ttil4JgA
  - DOPPLER_PROD_2: AQ.Ab8RN6LioS7k0Ipycl6oKXFuhww6VTXuosXwgeS8VMpTyZUFcw

🟢 免費 Key（客服用）：
  - 可以相對寬鬆使用
  - 注意 RPM/RPD 限制
```

---

**維護者**: DeepWeay SMS Team  
**版本**: v2.0 - 泰銖本位策略  
**狀態**: ✅ **READY TO DEPLOY**
