#!/usr/bin/env node
/**
 * 🔥🔥 雙群聊定時噴射系統 
 * 功能: 每小時自動噴射 - 4個收費Gemini Pro key，3分鐘大噴射
 * 策略: 向量0.1精度切割 + Debug迭代 + 上下文優化
 */

const axios = require('axios');
const fs = require('fs').promises;

// ===== 配置 =====
const CONFIG = {
  // 4個收費Gemini Pro keys (從環境變量或直接配置)
  PAID_KEYS: [
    process.env.GEMINI_PRO_30 || 'AIzaSyA3ikY04T94AoAwndr20QxV9nl4w_NF_u4',
    process.env.GEMINI_PRO_31 || '',
    process.env.GEMINI_PRO_32 || '',
    process.env.GEMINI_PRO_33 || ''
  ].filter(k => k),
  
  MODEL: 'gemini-3-pro-preview',
  MAX_TOKENS_PER_KEY: 30000,  // 每個key限制3萬token
  JET_DURATION: 180000,        // 噴射3分鐘 (180秒)
  VECTOR_PRECISION: 0.1,       // 向量精度
  DEBUG_INTERVAL: 3600000,     // 每小時執行一次 (3600秒)
  
  // 雙群聊配置
  CHAT_GROUPS: [
    { id: 'group_1', name: '主戰場群聊' },
    { id: 'group_2', name: '副戰場群聊' }
  ]
};

// ===== 顏色輸出 =====
const c = {
  r: '\x1b[0m',
  red: '\x1b[31m',
  g: '\x1b[32m',
  y: '\x1b[33m',
  b: '\x1b[34m',
  m: '\x1b[35m',
  c: '\x1b[36m',
  w: '\x1b[37m'
};

// ===== 統計數據 =====
const stats = {
  totalRounds: 0,
  totalTokens: 0,
  totalCost: 0,
  keyUsage: {},
  startTime: Date.now(),
  lastJetTime: null
};

// 初始化key統計
CONFIG.PAID_KEYS.forEach((key, idx) => {
  stats.keyUsage[`key_${idx + 1}`] = { tokens: 0, requests: 0, errors: 0 };
});

/**
 * 🎯 向量精度切割函數
 * 將思維以0.1精度切割，進行細緻的debug和迭代
 */
function vectorPrecisionCut(context, precision = 0.1) {
  const chunks = [];
  const lines = context.split('\n');
  const totalLines = lines.length;
  const chunkSize = Math.ceil(totalLines * precision);
  
  for (let i = 0; i < totalLines; i += chunkSize) {
    chunks.push(lines.slice(i, i + chunkSize).join('\n'));
  }
  
  console.log(`${c.c}📐 向量切割:${c.r} ${chunks.length}個片段 (精度: ${precision})`);
  return chunks;
}

/**
 * 🔥 核心噴射函數 - 調用單個Gemini Pro key
 */
async function jetWithKey(prompt, keyIndex, maxTokens = 8000) {
  const key = CONFIG.PAID_KEYS[keyIndex];
  const keyName = `key_${keyIndex + 1}`;
  
  if (!key) {
    console.log(`${c.red}✗ Key ${keyIndex + 1} 未配置${c.r}`);
    return null;
  }
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.MODEL}:generateContent?key=${key}`;
  
  try {
    const start = Date.now();
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: CONFIG.VECTOR_PRECISION,  // 使用0.1精度
        maxOutputTokens: maxTokens,
        topP: 0.95,
        topK: 40
      }
    }, { 
      timeout: 60000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    const latency = Date.now() - start;
    const result = response.data.candidates[0].content.parts[0].text;
    const tokens = response.data.usageMetadata;
    
    // 更新統計
    stats.keyUsage[keyName].tokens += tokens.totalTokenCount;
    stats.keyUsage[keyName].requests += 1;
    stats.totalTokens += tokens.totalTokenCount;
    
    console.log(`${c.g}✓ ${keyName}${c.r} ${latency}ms | ${tokens.totalTokenCount} tokens`);
    
    return {
      success: true,
      keyIndex,
      result,
      tokens: tokens.totalTokenCount,
      latency
    };
  } catch (error) {
    stats.keyUsage[keyName].errors += 1;
    console.log(`${c.red}✗ ${keyName} 失敗:${c.r} ${error.message}`);
    
    return {
      success: false,
      keyIndex,
      error: error.response?.data?.error?.message || error.message
    };
  }
}

/**
 * 🚀 大噴射函數 - 3分鐘瘋狂迭代
 */
async function massiveJet(chatGroup) {
  console.log(`\n${c.m}${'='.repeat(60)}${c.r}`);
  console.log(`${c.m}🔥🔥 開始大噴射: ${chatGroup.name}${c.r}`);
  console.log(`${c.m}${'='.repeat(60)}${c.r}\n`);
  
  const startTime = Date.now();
  const endTime = startTime + CONFIG.JET_DURATION;
  let roundCount = 0;
  
  // Debug上下文模板
  const debugPrompt = `
🎯 任務: Debug分析 + 思維迭代 + 上下文優化

## 當前輪次: ${roundCount + 1}
## 群聊: ${chatGroup.name}

請以0.1精度思維模式執行以下任務:

1. **Debug模式分析**
   - 掃描當前代碼庫的潛在問題
   - 識別性能瓶頸和優化點
   - 提供具體的修復建議

2. **思維迭代**
   - 分析當前架構的合理性
   - 提出改進方案
   - 預測可能的技術債務

3. **上下文優化**
   - 壓縮冗餘信息
   - 提取核心概念
   - 建立知識圖譜連接

請輸出簡潔、可執行的分析結果。
`;
  
  while (Date.now() < endTime) {
    roundCount++;
    console.log(`${c.y}⚡ 輪次 ${roundCount}${c.r}`);
    
    // 向量切割prompt
    const chunks = vectorPrecisionCut(debugPrompt, CONFIG.VECTOR_PRECISION);
    
    // 並發調用4個key
    const jetPromises = CONFIG.PAID_KEYS.map((_, idx) => 
      jetWithKey(chunks[idx % chunks.length] || debugPrompt, idx, 
                 Math.floor(CONFIG.MAX_TOKENS_PER_KEY / (CONFIG.JET_DURATION / 10000)))
    );
    
    const results = await Promise.all(jetPromises);
    
    // 檢查是否超過token限制
    let totalRoundTokens = 0;
    results.forEach(r => {
      if (r && r.success) totalRoundTokens += r.tokens;
    });
    
    console.log(`${c.c}📊 本輪消耗: ${totalRoundTokens} tokens${c.r}`);
    
    // 檢查每個key是否接近限制
    let shouldStop = false;
    Object.entries(stats.keyUsage).forEach(([keyName, usage]) => {
      if (usage.tokens >= CONFIG.MAX_TOKENS_PER_KEY) {
        console.log(`${c.red}⚠ ${keyName} 已達token限制 (${usage.tokens}/${CONFIG.MAX_TOKENS_PER_KEY})${c.r}`);
        shouldStop = true;
      }
    });
    
    if (shouldStop) {
      console.log(`${c.red}🛑 達到token限制，提前結束噴射${c.r}`);
      break;
    }
    
    // 短暫延遲避免rate limit
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  stats.totalRounds += roundCount;
  stats.lastJetTime = new Date().toISOString();
  
  console.log(`\n${c.g}✓ 噴射完成${c.r}`);
  console.log(`${c.c}  時長: ${duration}s${c.r}`);
  console.log(`${c.c}  輪次: ${roundCount}${c.r}`);
  console.log(`${c.c}  群聊: ${chatGroup.name}${c.r}\n`);
}

/**
 * 📊 生成統計報告
 */
async function generateReport() {
  const uptime = ((Date.now() - stats.startTime) / 1000 / 60).toFixed(2);
  
  const report = `
# 🔥 雙群聊噴射系統 - 統計報告

生成時間: ${new Date().toISOString()}
運行時長: ${uptime} 分鐘

## 總體統計
- 總輪次: ${stats.totalRounds}
- 總Token: ${stats.totalTokens.toLocaleString()}
- 上次噴射: ${stats.lastJetTime || '尚未執行'}

## Key使用情況
${Object.entries(stats.keyUsage).map(([key, usage]) => `
### ${key}
- 請求次數: ${usage.requests}
- Token消耗: ${usage.tokens.toLocaleString()} / ${CONFIG.MAX_TOKENS_PER_KEY.toLocaleString()}
- 錯誤次數: ${usage.errors}
- 使用率: ${((usage.tokens / CONFIG.MAX_TOKENS_PER_KEY) * 100).toFixed(2)}%
`).join('\n')}

## 配置信息
- 模型: ${CONFIG.MODEL}
- 向量精度: ${CONFIG.VECTOR_PRECISION}
- 噴射時長: ${CONFIG.JET_DURATION / 1000}秒
- Key數量: ${CONFIG.PAID_KEYS.length}
- 群聊數量: ${CONFIG.CHAT_GROUPS.length}

---
Generated by 雙群聊噴射系統 v1.0
`;
  
  await fs.writeFile('/home/svs-main-key/GCP/logs/dual-chat-jet-report.md', report);
  console.log(`${c.g}📄 報告已生成: logs/dual-chat-jet-report.md${c.r}`);
}

/**
 * 🎯 主執行函數
 */
async function main() {
  console.log(`${c.b}${'='.repeat(70)}${c.r}`);
  console.log(`${c.b}🔥🔥 雙群聊定時噴射系統 v1.0${c.r}`);
  console.log(`${c.b}${'='.repeat(70)}${c.r}\n`);
  
  console.log(`${c.y}配置信息:${c.r}`);
  console.log(`  模型: ${CONFIG.MODEL}`);
  console.log(`  Key數量: ${CONFIG.PAID_KEYS.length}`);
  console.log(`  每Key限制: ${CONFIG.MAX_TOKENS_PER_KEY.toLocaleString()} tokens`);
  console.log(`  噴射時長: ${CONFIG.JET_DURATION / 1000}秒`);
  console.log(`  向量精度: ${CONFIG.VECTOR_PRECISION}`);
  console.log(`  群聊數量: ${CONFIG.CHAT_GROUPS.length}\n`);
  
  // 檢查keys配置
  if (CONFIG.PAID_KEYS.length === 0) {
    console.log(`${c.red}❌ 錯誤: 未配置任何Gemini Pro key${c.r}`);
    process.exit(1);
  }
  
  // 執行雙群聊噴射
  for (const chatGroup of CONFIG.CHAT_GROUPS) {
    await massiveJet(chatGroup);
  }
  
  // 生成報告
  await generateReport();
  
  console.log(`${c.g}${'='.repeat(70)}${c.r}`);
  console.log(`${c.g}✓ 所有任務完成！${c.r}`);
  console.log(`${c.g}${'='.repeat(70)}${c.r}\n`);
}

// ===== 定時任務模式 =====
if (process.argv.includes('--daemon')) {
  console.log(`${c.c}🤖 守護進程模式啟動${c.r}`);
  console.log(`${c.c}   每小時自動執行一次${c.r}\n`);
  
  // 立即執行一次
  main().catch(console.error);
  
  // 每小時執行
  setInterval(() => {
    console.log(`\n${c.y}⏰ 定時任務觸發 [${new Date().toISOString()}]${c.r}\n`);
    main().catch(console.error);
  }, CONFIG.DEBUG_INTERVAL);
  
} else {
  // 單次執行
  main().catch(console.error);
}
