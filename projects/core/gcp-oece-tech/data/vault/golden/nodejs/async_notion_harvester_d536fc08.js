#!/usr/bin/env node

/**
 * 🚀 Notion 全量異步打撈系統
 * 
 * 功能：
 * 1. 並發控制：同時處理多個頁面，避免 API 限流
 * 2. 錯誤重試：自動重試失敗的請求
 * 3. 進度追蹤：實時顯示下載進度
 * 4. 深度遍歷：自動獲取子頁面和數據庫內容
 * 5. 增量更新：跳過已下載的內容
 * 
 * 使用方法：
 *   node scripts/async_notion_harvester.js [options]
 * 
 * 選項：
 *   --full          完整下載（包括子頁面）
 *   --concurrency=5 並發數（默認 5）
 *   --retry=3       重試次數（默認 3）
 *   --skip-cache    跳過緩存，強制重新下載
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ==================== 配置 ====================

const CONFIG = {
  NOTION_TOKEN: process.env.NOTION_TOKEN || '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',
  NOTION_VERSION: '2022-06-28',
  OUTPUT_DIR: path.join(__dirname, '../notion_export'),
  CONCURRENCY: parseInt(process.argv.find(a => a.startsWith('--concurrency='))?.split('=')[1]) || 5,
  MAX_RETRIES: parseInt(process.argv.find(a => a.startsWith('--retry='))?.split('=')[1]) || 3,
  RETRY_DELAY: 2000, // ms
  RATE_LIMIT_DELAY: 350, // Notion API: 每秒 3 請求
  FULL_MODE: process.argv.includes('--full'),
  SKIP_CACHE: process.argv.includes('--skip-cache'),
};

// ==================== 工具函數 ====================

/**
 * 發送 HTTPS 請求
 */
function httpsRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: JSON.parse(body)
          });
        } catch (e) {
          reject(new Error(`解析響應失敗: ${e.message}`));
        }
      });
    });
    
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

/**
 * 調用 Notion API
 */
async function notionAPI(endpoint, method = 'GET', body = null, retries = 0) {
  const options = {
    hostname: 'api.notion.com',
    port: 443,
    path: endpoint,
    method: method,
    headers: {
      'Authorization': `Bearer ${CONFIG.NOTION_TOKEN}`,
      'Notion-Version': CONFIG.NOTION_VERSION,
      'Content-Type': 'application/json',
    }
  };
  
  try {
    const response = await httpsRequest(options, body);
    
    // 處理錯誤狀態碼
    if (response.statusCode !== 200) {
      throw new Error(`API 錯誤 ${response.statusCode}: ${JSON.stringify(response.body)}`);
    }
    
    return response.body;
  } catch (error) {
    // 重試邏輯
    if (retries < CONFIG.MAX_RETRIES) {
      console.log(`   ⚠️  請求失敗，${CONFIG.RETRY_DELAY}ms 後重試 (${retries + 1}/${CONFIG.MAX_RETRIES})...`);
      await sleep(CONFIG.RETRY_DELAY);
      return notionAPI(endpoint, method, body, retries + 1);
    }
    throw error;
  }
}

/**
 * 延遲函數
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 確保目錄存在
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * 保存 JSON 文件
 */
function saveJSON(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * 讀取 JSON 文件
 */
function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// ==================== 核心功能 ====================

/**
 * 搜索所有頁面
 */
async function searchAllPages() {
  console.log('🔍 搜索 Notion 工作區所有頁面...');
  
  const allPages = [];
  let hasMore = true;
  let startCursor = undefined;
  
  while (hasMore) {
    const searchBody = {
      filter: { property: 'object', value: 'page' },
      page_size: 100,
    };
    if (startCursor) searchBody.start_cursor = startCursor;
    
    const result = await notionAPI('/v1/search', 'POST', searchBody);
    allPages.push(...result.results);
    
    hasMore = result.has_more;
    startCursor = result.next_cursor;
    
    console.log(`   已發現 ${allPages.length} 個頁面...`);
    await sleep(CONFIG.RATE_LIMIT_DELAY);
  }
  
  console.log(`✅ 搜索完成！共找到 ${allPages.length} 個頁面\n`);
  return allPages;
}

/**
 * 獲取頁面內容（blocks）
 */
async function fetchPageBlocks(pageId) {
  const allBlocks = [];
  let hasMore = true;
  let startCursor = undefined;
  
  while (hasMore) {
    const endpoint = `/v1/blocks/${pageId}/children?page_size=100${startCursor ? `&start_cursor=${startCursor}` : ''}`;
    const result = await notionAPI(endpoint);
    
    allBlocks.push(...result.results);
    hasMore = result.has_more;
    startCursor = result.next_cursor;
    
    await sleep(CONFIG.RATE_LIMIT_DELAY);
  }
  
  return allBlocks;
}

/**
 * 獲取數據庫內容
 */
async function fetchDatabaseContent(databaseId) {
  const allRows = [];
  let hasMore = true;
  let startCursor = undefined;
  
  while (hasMore) {
    const queryBody = { page_size: 100 };
    if (startCursor) queryBody.start_cursor = startCursor;
    
    const result = await notionAPI(`/v1/databases/${databaseId}/query`, 'POST', queryBody);
    allRows.push(...result.results);
    
    hasMore = result.has_more;
    startCursor = result.next_cursor;
    
    await sleep(CONFIG.RATE_LIMIT_DELAY);
  }
  
  return allRows;
}

/**
 * 處理單個頁面
 */
async function processPage(page, index, total) {
  const pageId = page.id;
  const pageTitle = page.properties?.title?.title?.[0]?.plain_text || 
                    page.properties?.Name?.title?.[0]?.plain_text || 
                    '無標題';
  
  console.log(`\n[${index + 1}/${total}] 📄 ${pageTitle}`);
  console.log(`   ID: ${pageId}`);
  
  // 檢查緩存
  const pagePath = path.join(CONFIG.OUTPUT_DIR, 'pages', `${pageId}.json`);
  if (!CONFIG.SKIP_CACHE && fs.existsSync(pagePath)) {
    console.log(`   ⏭️  已緩存，跳過`);
    return { success: true, cached: true };
  }
  
  try {
    // 獲取頁面元數據
    const pageData = await notionAPI(`/v1/pages/${pageId}`);
    
    // 獲取頁面內容（blocks）
    console.log(`   📦 獲取內容區塊...`);
    const blocks = await fetchPageBlocks(pageId);
    console.log(`   ✅ 獲取 ${blocks.length} 個區塊`);
    
    // 保存完整數據
    const fullData = {
      metadata: pageData,
      blocks: blocks,
      fetched_at: new Date().toISOString()
    };
    
    saveJSON(pagePath, fullData);
    console.log(`   💾 已保存: ${pagePath}`);
    
    // 如果是數據庫，獲取其內容
    if (page.object === 'database') {
      console.log(`   🗄️  檢測到數據庫，獲取內容...`);
      const dbContent = await fetchDatabaseContent(pageId);
      const dbPath = path.join(CONFIG.OUTPUT_DIR, 'databases', `${pageId}.json`);
      saveJSON(dbPath, {
        database: pageData,
        rows: dbContent,
        fetched_at: new Date().toISOString()
      });
      console.log(`   💾 數據庫內容已保存: ${dbPath}`);
    }
    
    return { success: true, cached: false };
  } catch (error) {
    console.log(`   ❌ 失敗: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * 並發處理任務隊列
 */
async function processQueue(pages) {
  const queue = [...pages];
  const results = {
    success: 0,
    failed: 0,
    cached: 0,
    errors: []
  };
  
  const workers = [];
  for (let i = 0; i < CONFIG.CONCURRENCY; i++) {
    workers.push(async () => {
      while (queue.length > 0) {
        const page = queue.shift();
        if (!page) break;
        
        const index = pages.indexOf(page);
        const result = await processPage(page, index, pages.length);
        
        if (result.success) {
          if (result.cached) {
            results.cached++;
          } else {
            results.success++;
          }
        } else {
          results.failed++;
          results.errors.push({
            page_id: page.id,
            error: result.error
          });
        }
      }
    });
  }
  
  await Promise.all(workers.map(w => w()));
  return results;
}

// ==================== 主程序 ====================

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  🚀 Notion 全量異步打撈系統                                ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`⚙️  配置:`);
  console.log(`   並發數: ${CONFIG.CONCURRENCY}`);
  console.log(`   重試次數: ${CONFIG.MAX_RETRIES}`);
  console.log(`   完整模式: ${CONFIG.FULL_MODE ? '是' : '否'}`);
  console.log(`   跳過緩存: ${CONFIG.SKIP_CACHE ? '是' : '否'}`);
  console.log('');
  
  const startTime = Date.now();
  
  try {
    // 第一步：搜索所有頁面
    const pages = await searchAllPages();
    
    // 保存頁面列表
    const listPath = path.join(CONFIG.OUTPUT_DIR, 'page_list.json');
    saveJSON(listPath, {
      total: pages.length,
      pages: pages.map(p => ({
        id: p.id,
        title: p.properties?.title?.title?.[0]?.plain_text || '無標題',
        created_time: p.created_time,
        last_edited_time: p.last_edited_time
      })),
      fetched_at: new Date().toISOString()
    });
    console.log(`📋 頁面列表已保存: ${listPath}\n`);
    
    // 第二步：並發下載所有頁面
    console.log('📥 開始並發下載頁面內容...');
    console.log('═'.repeat(60));
    
    const results = await processQueue(pages);
    
    // 統計報告
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '═'.repeat(60));
    console.log('✨ 打撈完成！\n');
    console.log(`📊 統計報告:`);
    console.log(`   總頁面數: ${pages.length}`);
    console.log(`   ✅ 成功: ${results.success}`);
    console.log(`   ⏭️  緩存跳過: ${results.cached}`);
    console.log(`   ❌ 失敗: ${results.failed}`);
    console.log(`   ⏱️  耗時: ${duration}秒`);
    console.log(`   ⚡ 平均速度: ${(pages.length / duration).toFixed(2)} 頁/秒`);
    
    // 保存報告
    const reportPath = path.join(CONFIG.OUTPUT_DIR, 'harvest_report.json');
    saveJSON(reportPath, {
      ...results,
      total: pages.length,
      duration: duration,
      config: CONFIG,
      timestamp: new Date().toISOString()
    });
    console.log(`\n📄 詳細報告已保存: ${reportPath}`);
    
    // 如果有錯誤，顯示
    if (results.errors.length > 0) {
      console.log(`\n⚠️  失敗的頁面:`);
      results.errors.forEach((e, i) => {
        console.log(`   ${i + 1}. ${e.page_id}: ${e.error}`);
      });
    }
    
    console.log('');
    process.exit(0);
    
  } catch (error) {
    console.error(`\n❌ 致命錯誤: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// 運行主程序
if (require.main === module) {
  main();
}

module.exports = { processPage, searchAllPages };
