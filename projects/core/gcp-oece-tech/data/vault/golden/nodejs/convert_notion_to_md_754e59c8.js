#!/usr/bin/env node

/**
 * Notion Blocks 轉 Markdown 轉換器
 * 用於將 Notion API 返回的 blocks 轉換為可讀的 Markdown 文檔
 */

const fs = require('fs');
const path = require('path');

// Notion 頁面映射
const PAGE_MAPPING = {
  '2b791acc-4dd5-8123-abaf-e562b226df7c': {
    name: '架構設計',
    zhFile: 'docs/zh/01-架構設計.md',
    enFile: 'docs/en/01-architecture.md',
    title: '🌍 地球 Online·記憶向量宇宙 | 完整架構文檔'
  },
  '2b791acc-4dd5-8158-aaab-f69cefef61a4': {
    name: '戰鬥包配置',
    zhFile: 'docs/zh/02-戰鬥包配置.md',
    enFile: 'docs/en/02-battle-pack.md',
    title: '🚀 DEEPWEAY-SMS 戰鬥包 v2.0'
  },
  '187576b9-5ff3-4fba-b6e4-d120d82c5aea': {
    name: 'Gemini榨取策略',
    zhFile: 'docs/zh/03-Gemini榨取策略.md',
    enFile: 'docs/en/03-gemini-strategy.md',
    title: '⚡ Gemini 免費層終極榨取策略'
  },
  '9cd4ab6b-855f-4ec1-b203-bd8990d7ad02': {
    name: '諸葛亮軍團',
    zhFile: 'docs/zh/04-諸葛亮軍團.md',
    enFile: 'docs/en/04-zhuge-liang-legion.md',
    title: '🧠 Gemini 諸葛亮軍團 - 壓縮蒸餾黑科技'
  },
  'a8125e63-33e1-40a4-8cb3-58c9bb07cfe3': {
    name: '技術架構',
    zhFile: 'docs/zh/05-技術架構.md',
    enFile: 'docs/en/05-technical-architecture.md',
    title: '⚡ 諸葛亮軍團系統 - 完整技術架構文檔'
  },
  '7a52f442-8e57-4438-93c7-a800de896b28': {
    name: '知識蒸餾',
    zhFile: 'docs/zh/06-知識蒸餾方案.md',
    enFile: 'docs/en/06-knowledge-distillation.md',
    title: '🧪 低成本 AI 知識蒸餾方案'
  },
  'f9efd963-0b7b-4635-a95d-9418c80fd27a': {
    name: 'GCP部署',
    zhFile: 'docs/zh/07-GCP部署方案.md',
    enFile: 'docs/en/07-gcp-deployment.md',
    title: '☁️ GCP 贈金黑科技部署方案'
  },
  'c490749e-6dac-4207-b0b2-23d021d4a2c3': {
    name: 'Notion入門',
    zhFile: 'docs/zh/08-Notion使用指南.md',
    enFile: 'docs/en/08-notion-guide.md',
    title: '🤖 Notion 傻瓜式入門 - 5分鐘學會用 AI 自動化'
  }
};

/**
 * 從 Notion block 提取純文本
 */
function extractText(richText) {
  if (!richText || !Array.isArray(richText)) return '';
  return richText.map(rt => rt.plain_text || '').join('');
}

/**
 * 處理富文本格式
 */
function formatRichText(richText) {
  if (!richText || !Array.isArray(richText)) return '';
  
  return richText.map(rt => {
    let text = rt.plain_text || '';
    const anno = rt.annotations || {};
    
    if (anno.bold) text = `**${text}**`;
    if (anno.italic) text = `*${text}*`;
    if (anno.code) text = `\`${text}\``;
    if (anno.strikethrough) text = `~~${text}~~`;
    
    if (rt.href) text = `[${text}](${rt.href})`;
    
    return text;
  }).join('');
}

/**
 * 將 Notion block 轉換為 Markdown
 */
function blockToMarkdown(block, level = 0) {
  const type = block.type;
  const content = block[type];
  
  if (!content) return '';
  
  let md = '';
  const indent = '  '.repeat(level);
  
  switch (type) {
    case 'paragraph':
      md = formatRichText(content.rich_text) + '\n\n';
      break;
      
    case 'heading_1':
      md = `# ${formatRichText(content.rich_text)}\n\n`;
      break;
      
    case 'heading_2':
      md = `## ${formatRichText(content.rich_text)}\n\n`;
      break;
      
    case 'heading_3':
      md = `### ${formatRichText(content.rich_text)}\n\n`;
      break;
      
    case 'bulleted_list_item':
      md = `${indent}- ${formatRichText(content.rich_text)}\n`;
      break;
      
    case 'numbered_list_item':
      md = `${indent}1. ${formatRichText(content.rich_text)}\n`;
      break;
      
    case 'to_do':
      const checked = content.checked ? 'x' : ' ';
      md = `${indent}- [${checked}] ${formatRichText(content.rich_text)}\n`;
      break;
      
    case 'toggle':
      md = `<details>\n<summary>${formatRichText(content.rich_text)}</summary>\n\n`;
      break;
      
    case 'code':
      const lang = content.language || '';
      const code = extractText(content.rich_text);
      md = `\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
      break;
      
    case 'quote':
      md = `> ${formatRichText(content.rich_text)}\n\n`;
      break;
      
    case 'divider':
      md = '---\n\n';
      break;
      
    case 'callout':
      const icon = content.icon?.emoji || '💡';
      md = `> ${icon} **注意**\n>\n> ${formatRichText(content.rich_text)}\n\n`;
      break;
      
    case 'table':
      // 表格需要特殊處理，暫時跳過
      md = '_[表格內容]_\n\n';
      break;
      
    default:
      // 未知類型，輸出純文本
      if (content.rich_text) {
        md = formatRichText(content.rich_text) + '\n\n';
      }
  }
  
  return md;
}

/**
 * 轉換整個頁面
 */
function convertPage(pageId) {
  const mapping = PAGE_MAPPING[pageId];
  if (!mapping) {
    console.log(`⚠️  跳過未映射的頁面: ${pageId}`);
    return;
  }
  
  console.log(`\n📄 處理: ${mapping.title}`);
  
  // 讀取 JSON 文件
  const jsonPath = path.join(__dirname, '../notion_export/pages', `${pageId}.json`);
  if (!fs.existsSync(jsonPath)) {
    console.log(`   ❌ 文件不存在: ${jsonPath}`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const blocks = data.results || [];
  
  console.log(`   📦 共 ${blocks.length} 個區塊`);
  
  // 生成 Markdown
  let markdown = `# ${mapping.title}\n\n`;
  markdown += `> 本文檔由 Notion 自動生成\n`;
  markdown += `> 最後更新: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n\n`;
  markdown += `---\n\n`;
  
  blocks.forEach(block => {
    markdown += blockToMarkdown(block);
  });
  
  // 保存中文版
  const zhPath = path.join(__dirname, '..', mapping.zhFile);
  fs.mkdirSync(path.dirname(zhPath), { recursive: true });
  fs.writeFileSync(zhPath, markdown);
  console.log(`   ✅ 中文版: ${mapping.zhFile}`);
  
  // TODO: 英文版需要翻譯，暫時創建佔位符
  const enPath = path.join(__dirname, '..', mapping.enFile);
  fs.mkdirSync(path.dirname(enPath), { recursive: true });
  const enPlaceholder = `# ${mapping.title}\n\n> English translation in progress...\n> Generated: ${new Date().toISOString()}\n\n---\n\n_Translation coming soon._\n`;
  fs.writeFileSync(enPath, enPlaceholder);
  console.log(`   📝 英文版: ${mapping.enFile} (待翻譯)`);
}

// 主程序
console.log('🚀 開始轉換 Notion 頁面到 Markdown...');
console.log('=' .repeat(50));

const pageIds = Object.keys(PAGE_MAPPING);
pageIds.forEach(convertPage);

console.log('\n' + '='.repeat(50));
console.log(`✨ 完成！共處理 ${pageIds.length} 個頁面`);
console.log('');
