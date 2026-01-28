#!/usr/bin/env node
/**
 * 🧪 雙群聊噴射系統測試腳本
 * 用於驗證配置和功能是否正常
 */

const fs = require('fs');
const path = require('path');

const c = {
  r: '\x1b[0m',
  red: '\x1b[31m',
  g: '\x1b[32m',
  y: '\x1b[33m',
  c: '\x1b[36m',
  m: '\x1b[35m'
};

console.log(`${c.m}${'='.repeat(60)}${c.r}`);
console.log(`${c.m}🧪 雙群聊噴射系統 - 預檢測試${c.r}`);
console.log(`${c.m}${'='.repeat(60)}${c.r}\n`);

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    const result = fn();
    if (result) {
      console.log(`${c.g}✓${c.r} ${name}`);
      passed++;
    } else {
      console.log(`${c.red}✗${c.r} ${name}`);
      failed++;
    }
  } catch (error) {
    console.log(`${c.red}✗${c.r} ${name}: ${error.message}`);
    failed++;
  }
}

// ===== 測試項目 =====

console.log(`${c.y}1. 文件檢查${c.r}\n`);

test('核心文件存在: dual-chat-jet-system.js', () => {
  return fs.existsSync('./dual-chat-jet-system.js');
});

test('配置文件存在: ecosystem.dual-jet.json', () => {
  return fs.existsSync('./ecosystem.dual-jet.json');
});

test('啟動腳本存在: start-dual-jet.sh', () => {
  return fs.existsSync('./start-dual-jet.sh');
});

test('Cron配置存在: crontab-dual-jet.txt', () => {
  return fs.existsSync('./crontab-dual-jet.txt');
});

console.log(`\n${c.y}2. 權限檢查${c.r}\n`);

test('dual-chat-jet-system.js 可執行', () => {
  const stats = fs.statSync('./dual-chat-jet-system.js');
  return (stats.mode & 0o111) !== 0;
});

test('start-dual-jet.sh 可執行', () => {
  const stats = fs.statSync('./start-dual-jet.sh');
  return (stats.mode & 0o111) !== 0;
});

console.log(`\n${c.y}3. 目錄檢查${c.r}\n`);

test('日誌目錄存在', () => {
  if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs', { recursive: true });
  }
  return fs.existsSync('./logs');
});

test('node_modules 已安裝', () => {
  return fs.existsSync('./node_modules');
});

console.log(`\n${c.y}4. 依賴檢查${c.r}\n`);

test('axios 已安裝', () => {
  try {
    require('axios');
    return true;
  } catch (e) {
    return false;
  }
});

test('express 已安裝', () => {
  try {
    require('express');
    return true;
  } catch (e) {
    return false;
  }
});

console.log(`\n${c.y}5. Node.js 環境${c.r}\n`);

test('Node.js 版本 >= 14', () => {
  const version = process.version.match(/v(\d+)/);
  return version && parseInt(version[1]) >= 14;
});

test('當前工作目錄正確', () => {
  return process.cwd().includes('GCP');
});

console.log(`\n${c.y}6. 配置文件檢查${c.r}\n`);

test('ecosystem.dual-jet.json 格式正確', () => {
  const config = JSON.parse(fs.readFileSync('./ecosystem.dual-jet.json', 'utf8'));
  return config.apps && Array.isArray(config.apps) && config.apps.length > 0;
});

test('package.json 存在', () => {
  return fs.existsSync('./package.json');
});

console.log(`\n${c.y}7. 環境變量（可選）${c.r}\n`);

const hasKey1 = !!process.env.GEMINI_PRO_30;
const hasKey2 = !!process.env.GEMINI_PRO_31;
const hasKey3 = !!process.env.GEMINI_PRO_32;
const hasKey4 = !!process.env.GEMINI_PRO_33;

console.log(`${hasKey1 ? c.g + '✓' : c.y + '⚠'}${c.r} GEMINI_PRO_30 ${hasKey1 ? '已配置' : '未配置'}`);
console.log(`${hasKey2 ? c.g + '✓' : c.y + '⚠'}${c.r} GEMINI_PRO_31 ${hasKey2 ? '已配置' : '未配置'}`);
console.log(`${hasKey3 ? c.g + '✓' : c.y + '⚠'}${c.r} GEMINI_PRO_32 ${hasKey3 ? '已配置' : '未配置'}`);
console.log(`${hasKey4 ? c.g + '✓' : c.y + '⚠'}${c.r} GEMINI_PRO_33 ${hasKey4 ? '已配置' : '未配置'}`);

const keyCount = [hasKey1, hasKey2, hasKey3, hasKey4].filter(k => k).length;
if (keyCount === 0) {
  console.log(`\n${c.red}⚠️  警告: 未配置任何Gemini Pro key${c.r}`);
  console.log(`${c.y}提示: 在 dual-chat-jet-system.js 中配置key或設置環境變量${c.r}`);
} else {
  console.log(`\n${c.g}✓ 已配置 ${keyCount} 個Key${c.r}`);
}

// ===== 總結 =====

console.log(`\n${c.m}${'='.repeat(60)}${c.r}`);
console.log(`${c.m}測試結果${c.r}`);
console.log(`${c.m}${'='.repeat(60)}${c.r}\n`);

const total = passed + failed;
const passRate = ((passed / total) * 100).toFixed(1);

console.log(`${c.g}通過: ${passed}${c.r} | ${c.red}失敗: ${failed}${c.r} | 總計: ${total}`);
console.log(`通過率: ${passRate >= 80 ? c.g : c.red}${passRate}%${c.r}\n`);

if (failed === 0) {
  console.log(`${c.g}🎉 所有測試通過！系統已就緒。${c.r}\n`);
  console.log(`${c.c}下一步:${c.r}`);
  console.log(`  1. 配置Gemini Pro keys（如果還沒有）`);
  console.log(`  2. 運行: ./start-dual-jet.sh`);
  console.log(`  3. 選擇啟動模式\n`);
  process.exit(0);
} else if (passRate >= 80) {
  console.log(`${c.y}⚠️  部分測試失敗，但系統可能仍可運行。${c.r}\n`);
  console.log(`${c.c}建議:${c.r}`);
  console.log(`  - 檢查失敗項目`);
  console.log(`  - 修復問題後重新測試`);
  console.log(`  - 或嘗試運行系統\n`);
  process.exit(1);
} else {
  console.log(`${c.red}❌ 測試失敗過多，請修復問題後再試。${c.r}\n`);
  console.log(`${c.c}常見問題:${c.r}`);
  console.log(`  - 確保在正確的目錄中`);
  console.log(`  - 運行 npm install 安裝依賴`);
  console.log(`  - 檢查文件權限: chmod +x *.sh *.js`);
  console.log(`  - 確認Node.js版本 >= 14\n`);
  process.exit(1);
}
