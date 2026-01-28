#!/usr/bin/env node
/**
 * 🔥 SMS-Key 向量噴射引擎 API 服務器 - 增強版
 * 支持: MongoDB + Supabase + Firebase + 精準調溫
 */

const express = require('express');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();

// 中間件
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));

// 環境變量
const PORT = process.env.PORT || 8080;
const GEMINI_FREE_KEY = process.env.GEMINI_FREE_KEY;
const GEMINI_FREE_MODEL = process.env.GEMINI_FREE_MODEL || 'gemini-2.5-flash-lite';

// MongoDB 連接
let mongoClient;
let db;

async function connectMongoDB() {
  try {
    mongoClient = new MongoClient(process.env.MONGODB_URI);
    await mongoClient.connect();
    db = mongoClient.db(process.env.MONGODB_DB_NAME);
    console.log('✅ MongoDB 連接成功');
  } catch (error) {
    console.error('❌ MongoDB 連接失敗:', error);
  }
}

// Supabase 客戶端
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

// 顏色（日誌用）
const c = {
  g: '\x1b[32m', y: '\x1b[33m', r: '\x1b[0m', red: '\x1b[31m', c: '\x1b[36m'
};

// 統計
const stats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalTokens: 0,
  mongodbOperations: 0,
  supabaseOperations: 0,
  startTime: Date.now()
};

// ===== 核心函數: 向量生成 =====
async function generateEmbedding(text) {
  try {
    // 使用 text-embedding-004 模型
    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_FREE_KEY}`;
    const response = await axios.post(url, {
      model: 'text-embedding-004',
      content: { parts: [{ text }] }
    });
    
    return response.data.embedding.values;
  } catch (error) {
    console.error('向量生成失敗:', error.message);
    return null;
  }
}

// ===== 核心函數: 向量噴射引擎 =====
async function vectorJet(prompt, mode = 'vector', temperature = null) {
  const tempMap = {
    cold: parseFloat(process.env.TEMP_COLD) || 0.1,
    vector: parseFloat(process.env.TEMP_VECTOR) || 0.7,
    hot: parseFloat(process.env.TEMP_HOT) || 1.2,
    distill: parseFloat(process.env.TEMP_DISTILL) || 0.5
  };
  
  const temp = temperature || tempMap[mode] || 0.7;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_FREE_MODEL}:generateContent?key=${GEMINI_FREE_KEY}`;
  
  try {
    const start = Date.now();
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: temp,
        maxOutputTokens: 2048
      }
    }, { timeout: 30000 });
    
    const latency = Date.now() - start;
    const text = response.data.candidates[0].content.parts[0].text;
    const tokens = response.data.usageMetadata;
    
    stats.totalRequests++;
    stats.successfulRequests++;
    stats.totalTokens += (tokens.totalTokenCount || 0);
    
    // 保存到 MongoDB
    if (db) {
      try {
        await db.collection('requests').insertOne({
          prompt,
          response: text,
          mode,
          temperature: temp,
          tokens: tokens.totalTokenCount,
          latency,
          timestamp: new Date()
        });
        stats.mongodbOperations++;
      } catch (error) {
        console.error('MongoDB 保存失敗:', error.message);
      }
    }
    
    return {
      success: true,
      text,
      mode,
      temperature: temp,
      latency,
      tokens: {
        input: tokens.promptTokenCount,
        output: tokens.candidatesTokenCount,
        total: tokens.totalTokenCount
      }
    };
  } catch (error) {
    stats.totalRequests++;
    stats.failedRequests++;
    
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
      mode,
      temperature: temp
    };
  }
}

// ===== 向量數據庫操作 =====

// 保存向量到 Supabase
async function saveVector(content, metadata, embedding) {
  try {
    const { data, error } = await supabase
      .from('vectors')
      .insert({
        content,
        metadata,
        embedding
      });
    
    if (error) throw error;
    stats.supabaseOperations++;
    return data;
  } catch (error) {
    console.error('Supabase 保存失敗:', error.message);
    return null;
  }
}

// 向量相似度搜索
async function searchSimilarVectors(queryEmbedding, limit = 5) {
  try {
    const { data, error } = await supabase.rpc('match_vectors', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: limit
    });
    
    if (error) throw error;
    stats.supabaseOperations++;
    return data;
  } catch (error) {
    console.error('向量搜索失敗:', error.message);
    return [];
  }
}

// ===== API 路由 =====

// 健康檢查
app.get('/health', async (req, res) => {
  const uptime = Math.floor((Date.now() - stats.startTime) / 1000);
  const mongoStatus = mongoClient?.topology?.isConnected() ? 'connected' : 'disconnected';
  
  res.json({
    status: 'ok',
    uptime: `${uptime}s`,
    mongodb: mongoStatus,
    supabase: 'connected',
    stats: {
      total: stats.totalRequests,
      success: stats.successfulRequests,
      failed: stats.failedRequests,
      tokens: stats.totalTokens,
      mongoOps: stats.mongodbOperations,
      supabaseOps: stats.supabaseOperations
    }
  });
});

// 向量噴射 - 通用接口
app.post('/api/jet', async (req, res) => {
  const { prompt, mode, temperature, saveToDb } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  console.log(`${c.c}🔥 向量噴射:${c.r} mode=${mode || 'vector'}, temp=${temperature || 'auto'}`);
  
  const result = await vectorJet(prompt, mode, temperature);
  
  // 生成並保存向量（如果需要）
  if (saveToDb && result.success) {
    const embedding = await generateEmbedding(result.text);
    if (embedding) {
      await saveVector(prompt, { mode, temperature }, embedding);
    }
  }
  
  if (result.success) {
    console.log(`${c.g}✓${c.r} 成功 ${result.latency}ms | ${result.tokens.total} tokens`);
    res.json(result);
  } else {
    console.log(`${c.red}✗${c.r} 失敗: ${result.error}`);
    res.status(500).json(result);
  }
});

// 向量搜索
app.post('/api/vectors/search', async (req, res) => {
  const { query, limit = 5 } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }
  
  console.log(`${c.y}🔍 向量搜索:${c.r} "${query}"`);
  
  // 生成查詢向量
  const embedding = await generateEmbedding(query);
  if (!embedding) {
    return res.status(500).json({ error: 'Failed to generate embedding' });
  }
  
  // 搜索相似向量
  const results = await searchSimilarVectors(embedding, limit);
  
  res.json({
    query,
    results,
    count: results.length
  });
});

// 保存向量
app.post('/api/vectors/save', async (req, res) => {
  const { content, metadata } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  console.log(`${c.g}💾 保存向量:${c.r} ${content.substring(0, 50)}...`);
  
  // 生成向量
  const embedding = await generateEmbedding(content);
  if (!embedding) {
    return res.status(500).json({ error: 'Failed to generate embedding' });
  }
  
  // 保存到 Supabase
  const result = await saveVector(content, metadata || {}, embedding);
  
  res.json({
    success: !!result,
    message: result ? 'Vector saved successfully' : 'Failed to save vector'
  });
});

// MongoDB 查詢
app.get('/api/mongodb/stats', async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: 'MongoDB not connected' });
  }
  
  try {
    const totalDocs = await db.collection('requests').countDocuments();
    const recentDocs = await db.collection('requests')
      .find()
      .sort({ timestamp: -1 })
      .limit(5)
      .toArray();
    
    res.json({
      totalDocuments: totalDocs,
      recentRequests: recentDocs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 低温切割
app.post('/api/jet/cold', async (req, res) => {
  const result = await vectorJet(req.body.prompt, 'cold');
  res.json(result);
});

// 向量噴射
app.post('/api/jet/vector', async (req, res) => {
  const result = await vectorJet(req.body.prompt, 'vector');
  res.json(result);
});

// 高温扩散
app.post('/api/jet/hot', async (req, res) => {
  const result = await vectorJet(req.body.prompt, 'hot');
  res.json(result);
});

// 蒸馏半截
app.post('/api/jet/distill', async (req, res) => {
  const result = await vectorJet(req.body.prompt, 'distill');
  res.json(result);
});

// 批量處理
app.post('/api/jet/batch', async (req, res) => {
  const { prompts, mode, saveToDb } = req.body;
  
  if (!Array.isArray(prompts)) {
    return res.status(400).json({ error: 'Prompts must be an array' });
  }
  
  console.log(`${c.y}📦 批量處理:${c.r} ${prompts.length} 個任務`);
  
  const results = [];
  for (const prompt of prompts) {
    const result = await vectorJet(prompt, mode);
    
    // 保存向量（如果需要）
    if (saveToDb && result.success) {
      const embedding = await generateEmbedding(result.text);
      if (embedding) {
        await saveVector(prompt, { mode, batch: true }, embedding);
      }
    }
    
    results.push(result);
    // 避免速率限制
    await new Promise(resolve => setTimeout(resolve, 4000));
  }
  
  res.json({ results, total: results.length });
});

// 統計信息
app.get('/api/stats', (req, res) => {
  const uptime = Math.floor((Date.now() - stats.startTime) / 1000);
  const successRate = stats.totalRequests > 0 
    ? ((stats.successfulRequests / stats.totalRequests) * 100).toFixed(2)
    : 0;
  
  res.json({
    uptime: `${uptime}s`,
    requests: {
      total: stats.totalRequests,
      successful: stats.successfulRequests,
      failed: stats.failedRequests,
      successRate: `${successRate}%`
    },
    tokens: {
      total: stats.totalTokens,
      avgPerRequest: stats.totalRequests > 0 
        ? Math.floor(stats.totalTokens / stats.totalRequests)
        : 0
    },
    database: {
      mongodb: stats.mongodbOperations,
      supabase: stats.supabaseOperations
    },
    cost: {
      total: 0, // 免費層
      currency: 'THB'
    }
  });
});

// 根路由
app.get('/', (req, res) => {
  res.json({
    name: 'SMS-Key 向量噴射引擎 API - 增強版',
    version: '2.0.0',
    features: [
      'MongoDB 集成',
      'Supabase 向量數據庫',
      '向量相似度搜索',
      '4種精準調溫模式'
    ],
    endpoints: {
      health: 'GET /health',
      jet: 'POST /api/jet',
      cold: 'POST /api/jet/cold',
      vector: 'POST /api/jet/vector',
      hot: 'POST /api/jet/hot',
      distill: 'POST /api/jet/distill',
      batch: 'POST /api/jet/batch',
      vectorSearch: 'POST /api/vectors/search',
      vectorSave: 'POST /api/vectors/save',
      mongoStats: 'GET /api/mongodb/stats',
      stats: 'GET /api/stats'
    },
    docs: 'https://github.com/web3-ai-game/gcp-dev-environment'
  });
});

// 優雅關閉
process.on('SIGINT', async () => {
  console.log('\n正在關閉服務...');
  if (mongoClient) {
    await mongoClient.close();
    console.log('MongoDB 連接已關閉');
  }
  process.exit(0);
});

// 啟動服務器
async function startServer() {
  // 連接 MongoDB
  await connectMongoDB();
  
  // 啟動 Express
  app.listen(PORT, () => {
    console.log(`${c.g}🔥 向量噴射引擎啟動成功 (增強版)${c.r}`);
    console.log(`${c.c}端口:${c.r} ${PORT}`);
    console.log(`${c.c}模型:${c.r} ${GEMINI_FREE_MODEL}`);
    console.log(`${c.c}MongoDB:${c.r} ${mongoClient ? '已連接' : '未連接'}`);
    console.log(`${c.c}Supabase:${c.r} ${process.env.SUPABASE_URL ? '已配置' : '未配置'}`);
    console.log(`${c.y}健康檢查:${c.r} http://localhost:${PORT}/health`);
    console.log(`${c.y}API 文檔:${c.r} http://localhost:${PORT}/\n`);
  });
}

startServer().catch(console.error);
