#!/usr/bin/env node

/**
 * 🔍 Notion 數據掃描去重系統
 * 
 * 第一階段：掃描、去重、統計
 * - 檢測重複頁面
 * - 統計內容類型
 * - 識別核心頁面
 * - 生成掃描報告
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const EXPORT_DIR = path.join(__dirname, '../notion_export/pages');
const OUTPUT_FILE = path.join(__dirname, '../notion_export/scan_report.json');

// ==================== 掃描統計 ====================

const stats = {
  totalPages: 0,
  duplicates: [],
  emptyPages: [],
  corePagescore: [],
  categories: {
    architecture: [],
    technical: [],
    strategy: [],
    deployment: [],
    other: []
  },
  contentStats: {
    totalBlocks: 0,
    avgBlocksPerPage: 0,
    largestPage: { id: null, blocks: 0 },
    smallestPage: { id: null, blocks: Infinity }
  }
};

/**
 * 計算內容哈希（用於去重）
 */
function calculateHash(content) {
  return crypto.createHash('md5').update(JSON.stringify(content)).digest('hex');
}

/**
 * 提取頁面標題
 */
function extractTitle(page) {
  if (!page || !page.metadata) return '無標題';
  
  const props = page.metadata.properties;
  if (!props) return '無標題';
  
  // 嘗試多種標題字段
  const titleField = props.title || props.Title || props.Name || props.name;
  if (!titleField) return '無標題';
  
  const titleArray = titleField.title || titleField.rich_text || [];
  if (!titleArray || titleArray.length === 0) return '無標題';
  
  return titleArray.map(t => t.plain_text || '').join('');
}

/**
 * 分類頁面
 */
function categorize(title, blocks) {
  const titleLower = title.toLowerCase();
  const content = JSON.stringify(blocks).toLowerCase();
  
  // 架構相關關鍵詞
  if (/架構|architecture|系統設計|記憶向量|宇宙/.test(titleLower)) {
    return 'architecture';
  }
  
  // 技術相關
  if (/技術|technical|api|mcp|代碼|code|cli/.test(titleLower)) {
    return 'technical';
  }
  
  // 策略相關
  if (/策略|strategy|榨取|免費層|諸葛亮|軍團/.test(titleLower)) {
    return 'strategy';
  }
  
  // 部署相關
  if (/部署|deploy|gcp|docker|cicd/.test(titleLower)) {
    return 'deployment';
  }
  
  return 'other';
}

/**
 * 計算頁面分數（用於識別核心頁面）
 */
function calculateScore(title, blocks) {
  let score = 0;
  
  // 基礎分數：區塊數量
  score += Math.min(blocks.length, 100);
  
  // 標題加分
  if (/地球.*online|deepweay|gemini.*軍團|架構/i.test(title)) {
    score += 50;
  }
  
  // 內容豐富度
  const content = JSON.stringify(blocks);
  if (content.length > 10000) score += 30;
  if (content.length > 50000) score += 50;
  
  // 包含代碼塊
  if (/"type":"code"/.test(content)) score += 20;
  
  // 包含標題結構
  if (/"type":"heading_/.test(content)) score += 10;
  
  return score;
}

/**
 * 掃描單個頁面
 */
function scanPage(filename) {
  const filePath = path.join(EXPORT_DIR, filename);
  const pageData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  const pageId = filename.replace('.json', '');
  const title = extractTitle(pageData);
  const blocks = pageData.blocks || [];
  const blockCount = blocks.length;
  
  // 統計
  stats.totalPages++;
  stats.contentStats.totalBlocks += blockCount;
  
  // 更新最大/最小頁面
  if (blockCount > stats.contentStats.largestPage.blocks) {
    stats.contentStats.largestPage = { id: pageId, title, blocks: blockCount };
  }
  if (blockCount < stats.contentStats.smallestPage.blocks) {
    stats.contentStats.smallestPage = { id: pageId, title, blocks: blockCount };
  }
  
  // 檢測空頁面
  if (blockCount === 0) {
    stats.emptyPages.push({ id: pageId, title });
    return null;
  }
  
  // 計算哈希（去重）
  const hash = calculateHash(blocks);
  
  // 分類
  const category = categorize(title, blocks);
  
  // 計算分數
  const score = calculateScore(title, blocks);
  
  const pageInfo = {
    id: pageId,
    title,
    category,
    blockCount,
    score,
    hash,
    filePath
  };
  
  // 加入分類
  stats.categories[category].push(pageInfo);
  
  return pageInfo;
}

/**
 * 檢測重複頁面
 */
function detectDuplicates(pages) {
  const hashMap = {};
  
  pages.forEach(page => {
    if (!page) return;
    
    if (hashMap[page.hash]) {
      stats.duplicates.push({
        original: hashMap[page.hash],
        duplicate: page
      });
    } else {
      hashMap[page.hash] = page;
    }
  });
}

/**
 * 識別核心頁面（Top 10）
 */
function identifyCorePges(pages) {
  const validPages = pages.filter(p => p !== null);
  const sorted = validPages.sort((a, b) => b.score - a.score);
  
  stats.corePages = sorted.slice(0, 10).map(p => ({
    id: p.id,
    title: p.title,
    category: p.category,
    blocks: p.blockCount,
    score: p.score
  }));
}

/**
 * 主掃描流程
 */
function main() {
  console.log('🔍 開始掃描 Notion 數據...\n');
  
  const files = fs.readdirSync(EXPORT_DIR).filter(f => f.endsWith('.json'));
  console.log(`📦 找到 ${files.length} 個頁面文件\n`);
  
  // 掃描所有頁面
  const pages = files.map(scanPage);
  
  // 計算平均值
  stats.contentStats.avgBlocksPerPage = Math.round(
    stats.contentStats.totalBlocks / stats.totalPages
  );
  
  // 檢測重複
  detectDuplicates(pages);
  
  // 識別核心頁面
  identifyCorePges(pages);
  
  // 生成報告
  const report = {
    scanTime: new Date().toISOString(),
    summary: {
      totalPages: stats.totalPages,
      totalBlocks: stats.contentStats.totalBlocks,
      avgBlocksPerPage: stats.contentStats.avgBlocksPerPage,
      emptyPages: stats.emptyPages.length,
      duplicates: stats.duplicates.length
    },
    largestPage: stats.contentStats.largestPage,
    smallestPage: stats.contentStats.smallestPage,
    categories: Object.keys(stats.categories).map(cat => ({
      name: cat,
      count: stats.categories[cat].length,
      pages: stats.categories[cat].map(p => ({
        id: p.id,
        title: p.title,
        blocks: p.blockCount
      }))
    })),
    corePages: stats.corePages,
    emptyPages: stats.emptyPages,
    duplicates: stats.duplicates
  };
  
  // 保存報告
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
  
  // 打印報告
  console.log('═'.repeat(60));
  console.log('📊 掃描報告');
  console.log('═'.repeat(60));
  console.log(`\n✅ 總頁面數: ${report.summary.totalPages}`);
  console.log(`📦 總區塊數: ${report.summary.totalBlocks}`);
  console.log(`📊 平均區塊/頁: ${report.summary.avgBlocksPerPage}`);
  console.log(`⚠️  空頁面: ${report.summary.emptyPages}`);
  console.log(`🔄 重複頁面: ${report.summary.duplicates}`);
  
  console.log(`\n📈 最大頁面: ${report.largestPage.title} (${report.largestPage.blocks} 區塊)`);
  console.log(`📉 最小頁面: ${report.smallestPage.title} (${report.smallestPage.blocks} 區塊)`);
  
  console.log('\n📂 分類統計:');
  report.categories.forEach(cat => {
    console.log(`   ${cat.name}: ${cat.count} 個頁面`);
  });
  
  console.log('\n🌟 核心頁面 (Top 10):');
  report.corePages.forEach((page, i) => {
    console.log(`   ${i + 1}. ${page.title}`);
    console.log(`      類別: ${page.category} | 區塊: ${page.blocks} | 分數: ${page.score}`);
  });
  
  if (report.emptyPages.length > 0) {
    console.log('\n⚠️  空頁面列表:');
    report.emptyPages.forEach(p => {
      console.log(`   - ${p.title} (${p.id})`);
    });
  }
  
  if (report.duplicates.length > 0) {
    console.log('\n🔄 重複頁面:');
    report.duplicates.forEach(d => {
      console.log(`   - ${d.duplicate.title} 與 ${d.original.title} 重複`);
    });
  }
  
  console.log(`\n💾 詳細報告已保存: ${OUTPUT_FILE}`);
  console.log('');
}

main();
