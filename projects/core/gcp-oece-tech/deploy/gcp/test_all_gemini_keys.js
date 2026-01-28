#!/usr/bin/env node
/**
 * 🔥 Gemini API Keys 全方位测试器
 * 基于 2025-11-25 最新官方文档
 * 支持: Gemini 2.5 Flash-Lite (免费), Gemini 2.5 Flash, Gemini 2.5 Pro
 */

const axios = require('axios');

// 颜色
const c = {
  r: '\x1b[0m', g: '\x1b[32m', y: '\x1b[33m', b: '\x1b[34m',
  m: '\x1b[35m', c: '\x1b[36m', red: '\x1b[31m', dim: '\x1b[2m'
};

// 最新模型配置 (2025-11-25)
const MODELS = {
  // 免费层级 - 最高速率
  'gemini-2.5-flash-lite': {
    name: '2.5 Flash-Lite',
    tier: 'FREE',
    rpm: 15,
    tpm: 250000,
    cost: '免费',
    desc: '最快最省，大规模使用'
  },
  'gemini-2.0-flash-lite': {
    name: '2.0 Flash-Lite',
    tier: 'FREE',
    rpm: 30,
    tpm: 1000000,
    cost: '免费',
    desc: '第二代轻量模型'
  },
  // 付费层级
  'gemini-2.5-flash': {
    name: '2.5 Flash',
    tier: 'PAID',
    rpm: 10,
    tpm: 250000,
    cost: '$0.10/1M输入, $0.40/1M输出',
    desc: '性价比之王，支持思考'
  },
  'gemini-2.5-pro': {
    name: '2.5 Pro',
    tier: 'PAID',
    rpm: 2,
    tpm: 125000,
    cost: '$1.25/1M输入, $10.00/1M输出',
    desc: '最强推理，适合复杂任务'
  },
  'gemini-2.0-flash': {
    name: '2.0 Flash',
    tier: 'PAID',
    rpm: 15,
    tpm: 1000000,
    cost: '$0.15/1M输入, $0.60/1M输出',
    desc: '第二代主力，100万token窗口'
  }
};

// API Keys 配置
const KEYS = [
  {
    name: '免费Key-1',
    key: 'AIzaSyD_cNll0AKAmKZgO6pOJzMRosKiBJxuUNM',
    type: 'FREE',
    desc: '未绑定结算账户'
  },
  {
    name: '临时Key-1',
    key: 'AQ.Ab8RN6LlrNEKtXonwqhBKhVRziaoBgHiUwE6CpdSv5Ttil4JgA',
    type: 'PAID',
    desc: '临时收费key'
  },
  {
    name: '临时Key-2',
    key: 'AQ.Ab8RN6LioS7k0Ipycl6oKXFuhww6VTXuosXwgeS8VMpTyZUFcw',
    type: 'PAID',
    desc: '临时收费key'
  },
  {
    name: 'Gemini-Pro-Key-1',
    key: 'AIzaSyAj08QZ4B8CMU_CTG-QtGUEv0gBHZbM_cQ',
    type: 'PAID',
    desc: '收费Pro key'
  },
  {
    name: 'Gemini-Pro-Key-2',
    key: 'AIzaSyA3ikY04T94AoAwndr20QxV9nl4w_NF_u4',
    type: 'PAID',
    desc: '收费Pro key (泄露)'
  }
];

// 测试提示词 - 精准向量噴射
const PROMPTS = {
  hot: '请用100字描述量子计算的基本原理。使用高温采样，发散思维。', // 高温擴散
  cold: '1+1=?', // 低溫切割
  vector: '分析这段代码的时间复杂度: for(i=0;i<n;i++) for(j=0;j<n;j++) sum++', // 向量噴射
  distill: '将以下内容蒸馏为核心要点：人工智能是计算机科学的一个分支，致力于创建能够执行通常需要人类智能的任务的系统。' // 蒸餾工程
};

// API 调用函数
async function callGemini(apiKey, model, prompt, temperature = 0.7) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  try {
    const start = Date.now();
    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: 200
      }
    }, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    const latency = Date.now() - start;
    const text = response.data.candidates[0].content.parts[0].text;
    const inputTokens = response.data.usageMetadata?.promptTokenCount || 0;
    const outputTokens = response.data.usageMetadata?.candidatesTokenCount || 0;
    
    return {
      success: true,
      latency,
      text: text.slice(0, 50) + '...',
      tokens: { input: inputTokens, output: outputTokens, total: inputTokens + outputTokens }
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message
    };
  }
}

// 主测试函数
async function testAll() {
  console.log(`${c.c}${'═'.repeat(80)}${c.r}`);
  console.log(`${c.b}🔥 Gemini API 向量噴射测试器 v2.0${c.r}`);
  console.log(`${c.dim}基于 Google 官方文档 2025-11-25 | 支持精准调温 + 蒸馏半截${c.r}`);
  console.log(`${c.c}${'═'.repeat(80)}${c.r}\n`);
  
  // 显示模型信息
  console.log(`${c.y}📊 支持的最新模型:${c.r}`);
  for (const [modelId, info] of Object.entries(MODELS)) {
    const tierColor = info.tier === 'FREE' ? c.g : c.m;
    console.log(`  ${tierColor}[${info.tier}]${c.r} ${c.b}${info.name}${c.r} - ${info.desc}`);
    console.log(`      ${c.dim}限制: ${info.rpm} RPM, ${(info.tpm/1000).toFixed(0)}K TPM | 价格: ${info.cost}${c.r}`);
  }
  console.log();
  
  // 测试每个 Key
  const results = [];
  
  for (const [i, keyConfig] of KEYS.entries()) {
    console.log(`${c.c}${'─'.repeat(80)}${c.r}`);
    console.log(`${c.y}🔑 [${i+1}/${KEYS.length}] 测试: ${keyConfig.name}${c.r}`);
    console.log(`   ${c.dim}类型: ${keyConfig.type} | 描述: ${keyConfig.desc}${c.r}`);
    console.log(`   ${c.dim}Key: ${keyConfig.key.slice(0, 20)}...${c.r}\n`);
    
    const keyResults = { name: keyConfig.name, type: keyConfig.type, tests: [] };
    
    // 测试策略：免费key测免费模型，付费key测所有
    const modelsToTest = keyConfig.type === 'FREE' 
      ? ['gemini-2.5-flash-lite', 'gemini-2.0-flash-lite']
      : Object.keys(MODELS);
    
    for (const modelId of modelsToTest) {
      const modelInfo = MODELS[modelId];
      
      // 🔥 精准调温策略
      const testCases = [
        { name: '低温切割', prompt: PROMPTS.cold, temp: 0.1 },
        { name: '向量噴射', prompt: PROMPTS.vector, temp: 0.7 },
        { name: '高温扩散', prompt: PROMPTS.hot, temp: 1.2 },
        { name: '蒸馏半截', prompt: PROMPTS.distill, temp: 0.5 }
      ];
      
      console.log(`  ${c.b}📡 模型: ${modelInfo.name}${c.r}`);
      
      for (const test of testCases) {
        const result = await callGemini(keyConfig.key, modelId, test.prompt, test.temp);
        
        if (result.success) {
          console.log(`    ${c.g}✓${c.r} ${test.name} (T=${test.temp}) - ${c.g}${result.latency}ms${c.r} | ${result.tokens.total} tokens`);
          console.log(`      ${c.dim}${result.text}${c.r}`);
          keyResults.tests.push({ model: modelId, test: test.name, status: 'SUCCESS', latency: result.latency, tokens: result.tokens });
        } else {
          console.log(`    ${c.red}✗${c.r} ${test.name} - ${c.red}${result.error}${c.r}`);
          keyResults.tests.push({ model: modelId, test: test.name, status: 'FAILED', error: result.error });
          break; // 一个失败就跳过该模型其他测试
        }
        
        // 避免触发速率限制
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log();
    }
    
    results.push(keyResults);
  }
  
  // 总结报告
  console.log(`${c.c}${'═'.repeat(80)}${c.r}`);
  console.log(`${c.b}📊 测试总结报告${c.r}\n`);
  
  for (const keyResult of results) {
    const successCount = keyResult.tests.filter(t => t.status === 'SUCCESS').length;
    const totalTests = keyResult.tests.length;
    const successRate = ((successCount / totalTests) * 100).toFixed(1);
    
    const statusColor = successRate > 80 ? c.g : successRate > 50 ? c.y : c.red;
    console.log(`${statusColor}🔑 ${keyResult.name}${c.r} [${keyResult.type}]`);
    console.log(`   成功率: ${statusColor}${successRate}%${c.r} (${successCount}/${totalTests})`);
    
    if (successCount > 0) {
      const avgLatency = keyResult.tests
        .filter(t => t.status === 'SUCCESS')
        .reduce((sum, t) => sum + t.latency, 0) / successCount;
      const totalTokens = keyResult.tests
        .filter(t => t.status === 'SUCCESS')
        .reduce((sum, t) => sum + (t.tokens?.total || 0), 0);
      
      console.log(`   平均延迟: ${c.g}${avgLatency.toFixed(0)}ms${c.r} | 总消耗: ${totalTokens} tokens`);
    }
    
    // 显示失败的测试
    const failures = keyResult.tests.filter(t => t.status === 'FAILED');
    if (failures.length > 0) {
      console.log(`   ${c.red}失败原因:${c.r}`);
      failures.slice(0, 2).forEach(f => {
        console.log(`     - ${f.model}: ${f.error}`);
      });
    }
    console.log();
  }
  
  // 推荐策略
  console.log(`${c.c}${'═'.repeat(80)}${c.r}`);
  console.log(`${c.y}💡 向量噴射推荐策略:${c.r}\n`);
  console.log(`${c.g}1. 免费开发${c.r}: 使用 gemini-2.5-flash-lite (15 RPM, 免费)`);
  console.log(`${c.m}2. 生产环境${c.r}: 使用 gemini-2.5-flash (10 RPM, $0.10/1M输入)`);
  console.log(`${c.b}3. 复杂推理${c.r}: 使用 gemini-2.5-pro (2 RPM, $1.25/1M输入)`);
  console.log(`${c.y}4. 大规模批处理${c.r}: 使用 gemini-2.0-flash-lite (30 RPM, 免费)\n`);
  
  console.log(`${c.dim}温度策略:${c.r}`);
  console.log(`  ${c.c}• 低温切割 (0.1-0.3)${c.r}: 精确答案、代码生成`);
  console.log(`  ${c.g}• 向量噴射 (0.5-0.7)${c.r}: 平衡创造力和准确性`);
  console.log(`  ${c.y}• 高温扩散 (1.0-1.5)${c.r}: 头脑风暴、创意写作`);
  console.log(`  ${c.m}• 蒸馏半截 (0.4-0.6)${c.r}: 总结提炼核心信息\n`);
  
  console.log(`${c.c}${'═'.repeat(80)}${c.r}`);
}

// 执行
testAll().catch(err => {
  console.error(`${c.red}致命错误:${c.r}`, err.message);
  process.exit(1);
});
