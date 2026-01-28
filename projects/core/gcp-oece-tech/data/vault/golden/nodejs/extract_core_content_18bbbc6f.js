#!/usr/bin/env node

/**
 * 🎯 核心內容提取器 - 低溫精確模式
 * 
 * 使用 Gemini Pro 2.5 (Temperature: 0.3)
 * 從掃描報告中提取 Top 5 核心頁面的關鍵內容
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ==================== 配置 ====================

const CONFIG = {
  // 🔴 使用 Gemini 3 Pro Preview（收費 key，數據清洗主力）
  apiKey: process.env.GEMINI_PRO_30 || 'AIzaSyA3ikY04T94AoAwndr20QxV9nl4w_NF_u4',
  model: 'gemini-3-pro-preview',  // ✅ 正確模型名稱
  temperature: 0.3,  // 低溫精確提取
  maxInputTokens: 50000,   // 5萬 tokens 輸入（上下文壓縮）
  maxOutputTokens: 8000,   // 8千 tokens 輸出
  topPages: 5,
  rpmLimit: 25,  // 速率限制：25 請求/分鐘
  requestDelay: 3000,  // 每次請求延遲 3 秒（避免超限）
  scanReportPath: path.join(__dirname, '../notion_export/scan_report.json'),
  pagesDir: path.join(__dirname, '../notion_export/pages'),
  outputPath: path.join(__dirname, '../notion_export/core_extracted.json'),
  costLogPath: path.join(__dirname, '../notion_export/cost_log.txt')
};

// ==================== 工具函數 ====================

/**
 * 🗜️ 智能上下文壓縮
 * 策略：移除無用內容，提取關鍵段落，控制 token 數量
 */
function compressContext(text, maxTokens = 50000) {
  // 1. 清理無用字符
  text = text
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // 控制字符
    .replace(/\s+/g, ' ') // 多餘空格
    .replace(/\r\n/g, '\n'); // 統一換行
  
  // 2. 提取關鍵段落（包含技術關鍵詞）
  const paragraphs = text.split('\n');
  const important = paragraphs.filter(p => {
    if (p.length < 20) return false; // 過濾短行
    // 關鍵詞檢測
    return /架構|技術|策略|implementation|architecture|api|system|design|framework/i.test(p);
  });
  
  // 3. 控制 token 數量（粗略估算：1 token ≈ 4 字符）
  let compressed = important.join('\n');
  const estimatedTokens = compressed.length / 4;
  
  if (estimatedTokens > maxTokens) {
    compressed = compressed.slice(0, maxTokens * 4);
  }
  
  return compressed;
}

/**
 * 清理文本（去除特殊字符和控制字符）
 */
function cleanText(text) {
  return text
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // 移除控制字符
    .replace(/\\+/g, '\\') // 規範化反斜線
    .replace(/\r\n/g, '\n') // 統一換行符
    .replace(/"/g, '\\"') // 轉義雙引號
    .replace(/\t/g, '  ') // 替換 tab
    .trim();
}

/**
 * 💰 記錄成本（泰銖本位）
 */
function logCost(inputTokens, outputTokens) {
  // Gemini 3 Pro 定價
  const inputCostUSD = (inputTokens * 1.25) / 1000000;
  const outputCostUSD = (outputTokens * 5.00) / 1000000;
  const totalCostUSD = inputCostUSD + outputCostUSD;
  const totalCostTHB = totalCostUSD * 35;
  
  // 記錄到文件
  const logEntry = `${new Date().toISOString()},${inputTokens},${outputTokens},${totalCostTHB.toFixed(4)}\n`;
  fs.appendFileSync(CONFIG.costLogPath, logEntry);
  
  console.log(`   💰 成本: ${totalCostTHB.toFixed(4)} 泰銖 (輸入: ${inputTokens}, 輸出: ${outputTokens})`);
  
  return totalCostTHB;
}

/**
 * 調用 Gemini API
 */
function callGeminiAPI(prompt) {
  return new Promise((resolve, reject) => {
    // 清理 prompt
    const cleanedPrompt = cleanText(prompt);
    
    const data = JSON.stringify({
      contents: [{
        parts: [{ text: cleanedPrompt }]
      }],
      generationConfig: {
        temperature: CONFIG.temperature,
        maxOutputTokens: CONFIG.maxOutputTokens,
        topK: 1,
        topP: 1
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${CONFIG.model}:generateContent?key=${CONFIG.apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          if (result.candidates && result.candidates[0]) {
            const text = result.candidates[0].content.parts[0].text;
            
            // 記錄成本
            if (result.usageMetadata) {
              const inputTokens = result.usageMetadata.promptTokenCount || 0;
              const outputTokens = result.usageMetadata.candidatesTokenCount || 0;
              logCost(inputTokens, outputTokens);
            }
            
            resolve(text);
          } else if (result.error) {
            reject(new Error(`API Error: ${result.error.message}`));
          } else {
            reject(new Error('No content generated'));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/**
 * 提取頁面內容
 */
function extractPageContent(pageId) {
  const filePath = path.join(CONFIG.pagesDir, `${pageId}.json`);
  const pageData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  // 提取文本內容
  const blocks = pageData.blocks || [];
  const textContent = blocks
    .map(block => {
      if (!block || !block.type) return '';
      
      const type = block.type;
      const content = block[type];
      
      if (!content) return '';
      
      // 提取 rich_text
      if (content.rich_text && Array.isArray(content.rich_text)) {
        return content.rich_text.map(t => t.plain_text || '').join('');
      }
      
      // 提取 code
      if (type === 'code' && content.code) {
        return `\`\`\`${content.language || ''}\n${content.code}\n\`\`\``;
      }
      
      return '';
    })
    .filter(text => text.trim().length > 0)
    .join('\n\n');
  
  return {
    metadata: pageData.metadata,
    textContent,
    blockCount: blocks.length
  };
}

/**
 * 分析單個頁面
 */
async function analyzePage(pageInfo, index) {
  console.log(`\n📄 [${index + 1}/${CONFIG.topPages}] 分析: ${pageInfo.title}`);
  console.log(`   區塊數: ${pageInfo.blocks} | 分數: ${pageInfo.score}`);
  
  try {
    // 提取頁面內容
    const pageContent = extractPageContent(pageInfo.id);
    
    // 🗜️ 智能壓縮上下文（控制在 5 萬 tokens 內）
    const compressedContent = compressContext(pageContent.textContent, CONFIG.maxInputTokens);
    
    console.log(`   📊 壓縮: ${pageContent.textContent.length} → ${compressedContent.length} 字符`);
    console.log(`   🔢 預估: ~${Math.round(compressedContent.length / 4)} tokens`);
    
    const prompt = `你是一個專業的技術內容分析專家。請分析以下 Notion 頁面內容，以低溫精確模式提取核心信息。

頁面標題: ${pageInfo.title}
頁面分類: ${pageInfo.category}
區塊數量: ${pageInfo.blocks}

頁面內容（已壓縮）:
${compressedContent}

請執行以下任務（Gemini 3 Pro | Temperature: 0.3 精確模式）：

1. **核心概念提取**（3-5個關鍵概念）
2. **技術要點識別**（主要技術棧、工具、方法）
3. **內容分類**（architecture/technical/strategy/deployment）
4. **價值評估**（1-10分，評估該頁面的技術價值）
5. **去噪處理**（識別並標記無用或重複的內容）

請以 JSON 格式返回：
\`\`\`json
{
  "coreConcepts": ["概念1", "概念2", "..."],
  "technicalPoints": ["技術點1", "技術點2", "..."],
  "category": "分類",
  "valueScore": 數字,
  "noiseIndicators": ["噪音1", "噪音2", "..."],
  "summary": "一句話總結（中文）"
}
\`\`\`

只返回 JSON，不要其他內容。`;

    // 調用 API
    console.log('   🤖 調用 Gemini Pro 2.5...');
    const response = await callGeminiAPI(prompt);
    
    // 解析響應
    const jsonMatch = response.match(/```json\n([\s\S]+?)\n```/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(response);
    
    console.log(`   ✅ 分析完成 | 價值分數: ${analysis.valueScore}/10`);
    console.log(`   💡 核心概念: ${analysis.coreConcepts.slice(0, 2).join(', ')}...`);
    
    // 延遲避免超 RPM（25 請求/分鐘 = 每 3 秒一次）
    console.log(`   ⏱️  延遲 ${CONFIG.requestDelay / 1000} 秒...`);
    await new Promise(resolve => setTimeout(resolve, CONFIG.requestDelay));
    
    return {
      pageId: pageInfo.id,
      title: pageInfo.title,
      originalCategory: pageInfo.category,
      blockCount: pageInfo.blocks,
      score: pageInfo.score,
      analysis,
      extractedAt: new Date().toISOString()
    };
    
  } catch (err) {
    console.error(`   ❌ 分析失敗: ${err.message}`);
    return {
      pageId: pageInfo.id,
      title: pageInfo.title,
      error: err.message
    };
  }
}

/**
 * 主流程
 */
async function main() {
  console.log('🎯 核心內容提取器 - Gemini 3 Pro Preview 數據清洗');
  console.log('═'.repeat(60));
  console.log(`📊 配置:`);
  console.log(`   模型: ${CONFIG.model} 💰 (收費 key)`);
  console.log(`   溫度: ${CONFIG.temperature} (精確提取)`);
  console.log(`   輸入限制: ${CONFIG.maxInputTokens} tokens (壓縮)`);
  console.log(`   輸出限制: ${CONFIG.maxOutputTokens} tokens`);
  console.log(`   提取數量: Top ${CONFIG.topPages} 頁面`);
  console.log(`   速率限制: ${CONFIG.rpmLimit} RPM (每 ${CONFIG.requestDelay / 1000}s 一次)`);
  console.log(`   成本預估: ~${((CONFIG.maxInputTokens * 1.25 + CONFIG.maxOutputTokens * 5) / 1000000 * 35 * CONFIG.topPages).toFixed(2)} 泰銖`);
  console.log('');
  
  // 讀取掃描報告
  console.log('📖 讀取掃描報告...');
  const scanReport = JSON.parse(fs.readFileSync(CONFIG.scanReportPath, 'utf-8'));
  const corePages = scanReport.corePages.slice(0, CONFIG.topPages);
  
  console.log(`✅ 找到 ${corePages.length} 個核心頁面\n`);
  
  // 分析每個頁面
  const results = [];
  for (let i = 0; i < corePages.length; i++) {
    const result = await analyzePage(corePages[i], i);
    results.push(result);
  }
  
  // 生成最終報告
  const finalReport = {
    extractedAt: new Date().toISOString(),
    config: {
      model: CONFIG.model,
      temperature: CONFIG.temperature,
      topPages: CONFIG.topPages
    },
    summary: {
      totalExtracted: results.filter(r => !r.error).length,
      failed: results.filter(r => r.error).length,
      avgValueScore: Math.round(
        results
          .filter(r => !r.error)
          .reduce((sum, r) => sum + (r.analysis?.valueScore || 0), 0) / results.length
      )
    },
    pages: results
  };
  
  // 保存結果
  fs.writeFileSync(CONFIG.outputPath, JSON.stringify(finalReport, null, 2));
  
  // 打印報告
  console.log('\n');
  console.log('═'.repeat(60));
  console.log('📊 提取完成報告');
  console.log('═'.repeat(60));
  console.log(`✅ 成功提取: ${finalReport.summary.totalExtracted} 個頁面`);
  console.log(`❌ 失敗: ${finalReport.summary.failed} 個頁面`);
  console.log(`📊 平均價值分數: ${finalReport.summary.avgValueScore}/10`);
  console.log('');
  
  // 列出成功的頁面
  results.filter(r => !r.error).forEach((r, i) => {
    console.log(`${i + 1}. ${r.title}`);
    console.log(`   分類: ${r.analysis.category} | 價值: ${r.analysis.valueScore}/10`);
    console.log(`   摘要: ${r.analysis.summary}`);
    console.log('');
  });
  
  console.log(`💾 完整報告已保存: ${CONFIG.outputPath}`);
  console.log('');
  
  // 計算總成本
  if (fs.existsSync(CONFIG.costLogPath)) {
    const costLines = fs.readFileSync(CONFIG.costLogPath, 'utf-8').split('\n').filter(l => l);
    const totalCost = costLines.reduce((sum, line) => {
      const cost = parseFloat(line.split(',')[3]);
      return sum + (isNaN(cost) ? 0 : cost);
    }, 0);
    
    console.log('💰 成本總結');
    console.log('═'.repeat(60));
    console.log(`總成本: ${totalCost.toFixed(2)} 泰銖`);
    console.log(`約合: ${(totalCost / 35).toFixed(4)} USD`);
    console.log(`比較: 約 ${(totalCost / 50).toFixed(1)} 杯咖啡`);
    console.log('');
  }
}

main().catch(err => {
  console.error('❌ 執行失敗:', err);
  process.exit(1);
});
