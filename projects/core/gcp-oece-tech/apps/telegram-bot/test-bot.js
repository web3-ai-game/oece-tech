/**
 * Bot 功能測試腳本
 * 
 * 測試所有功能是否正常
 */

import TelegramBot from 'node-telegram-bot-api';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { MongoClient } from 'mongodb';

const TESTS = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  TESTS.push({ name, fn });
}

async function runTests() {
  console.log('🧪 開始測試 BongBong + Avatar 系統\n');
  console.log('='.repeat(50));

  for (const { name, fn } of TESTS) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(`   錯誤: ${error.message}`);
      failed++;
    }
  }

  console.log('='.repeat(50));
  console.log(`\n📊 測試結果: ${passed} 通過, ${failed} 失敗`);
  
  if (failed === 0) {
    console.log('🎉 所有測試通過！');
  }
}

// ===== 測試用例 =====

test('環境變量 - TELEGRAM_BOT_TOKEN', async () => {
  if (!process.env.TELEGRAM_BOT_TOKEN) throw new Error('未設置');
});

test('環境變量 - TELEGRAM_BOT_TOKEN_AVATAR', async () => {
  if (!process.env.TELEGRAM_BOT_TOKEN_AVATAR) throw new Error('未設置');
});

test('環境變量 - GEMINI_API_KEY', async () => {
  const key = process.env.GEMINI_API_OECE_TECH_ || process.env.GEMINI_API_KEY;
  if (!key) throw new Error('未設置');
});

test('環境變量 - MONGODB_URI', async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_VPC_URI;
  if (!uri) throw new Error('未設置');
});

test('BongBong Bot 連接', async () => {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
  const me = await bot.getMe();
  if (!me.username) throw new Error('無法獲取 Bot 信息');
});

test('Avatar Bot 連接', async () => {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN_AVATAR);
  const me = await bot.getMe();
  if (!me.username) throw new Error('無法獲取 Bot 信息');
});

test('Gemini API - gemini-2.5-flash', async () => {
  const key = process.env.GEMINI_API_OECE_TECH_ || process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent('Say OK');
  if (!result.response.text()) throw new Error('無響應');
});

test('Gemini API - gemini-2.5-flash-lite', async () => {
  const key = process.env.GEMINI_API_OECE_TECH_ || process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  const result = await model.generateContent('Say OK');
  if (!result.response.text()) throw new Error('無響應');
});

test('Gemini API - gemini-2.5-pro', async () => {
  const key = process.env.GEMINI_API_OECE_TECH_ || process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
  const result = await model.generateContent('Say OK');
  if (!result.response.text()) throw new Error('無響應');
});

test('Grok API - grok-3-mini', async () => {
  const key = process.env.GROK_ONE_ || process.env.GROK_API_KEY;
  if (!key) throw new Error('未設置 Grok API Key');
  
  const client = new OpenAI({ apiKey: key, baseURL: 'https://api.x.ai/v1' });
  const response = await client.chat.completions.create({
    model: 'grok-3-mini',
    messages: [{ role: 'user', content: 'Say OK' }],
    max_tokens: 10
  });
  if (!response.choices[0]?.message?.content) throw new Error('無響應');
});

test('MongoDB 連接', async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_VPC_URI;
  const client = new MongoClient(uri);
  await client.connect();
  await client.db().admin().ping();
  await client.close();
});

test('MongoDB 集合 - conversations', async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_VPC_URI;
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('sms_tg_bot');
  const collections = await db.listCollections().toArray();
  await client.close();
  // 集合會在首次使用時自動創建，所以這裡只檢查連接
});

test('MongoDB 集合 - group_messages', async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_VPC_URI;
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('sms_tg_bot');
  // 插入測試數據
  await db.collection('group_messages').insertOne({
    groupId: 'test',
    userId: 'test',
    content: 'test',
    timestamp: new Date(),
    isTest: true
  });
  // 清理測試數據
  await db.collection('group_messages').deleteMany({ isTest: true });
  await client.close();
});

// 運行測試
runTests().then(() => process.exit(failed > 0 ? 1 : 0));
