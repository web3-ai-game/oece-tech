#!/usr/bin/env node
/**
 * 🔥 SMS-Key 向量噴射引擎 API 服务器
 * 支持: 精准调温 + 蒸馏半截 + 自动路由
 */

const express = require('express');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const app = express();

app.use(express.json());

// MongoDB 連接
let mongoDb = null;
async function getDb() {
  if (!mongoDb && process.env.MONGODB_URI) {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    mongoDb = client.db('sms-vectors');
  }
  return mongoDb;
}

// 环境变量
const PORT = process.env.PORT || 8080;
const GEMINI_FREE_KEY = process.env.GEMINI_FREE_KEY;
const GEMINI_FREE_MODEL = process.env.GEMINI_FREE_MODEL || 'gemini-2.5-flash-lite';

// 颜色（日志用）
const c = {
  g: '\x1b[32m', y: '\x1b[33m', r: '\x1b[0m', red: '\x1b[31m', c: '\x1b[36m'
};

// 统计
const stats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalTokens: 0,
  startTime: Date.now()
};

// ===== 核心函数: 向量噴射引擎 =====
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

// ===== API 路由 =====

// 健康检查
app.get('/health', (req, res) => {
  const uptime = Math.floor((Date.now() - stats.startTime) / 1000);
  res.json({
    status: 'ok',
    uptime: `${uptime}s`,
    stats: {
      total: stats.totalRequests,
      success: stats.successfulRequests,
      failed: stats.failedRequests,
      tokens: stats.totalTokens
    }
  });
});

// 向量噴射 - 通用接口
app.post('/api/jet', async (req, res) => {
  const { prompt, mode, temperature } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  console.log(`${c.c}🔥 向量噴射:${c.r} mode=${mode || 'vector'}, temp=${temperature || 'auto'}`);
  
  const result = await vectorJet(prompt, mode, temperature);
  
  if (result.success) {
    console.log(`${c.g}✓${c.r} 成功 ${result.latency}ms | ${result.tokens.total} tokens`);
    res.json(result);
  } else {
    console.log(`${c.red}✗${c.r} 失败: ${result.error}`);
    res.status(500).json(result);
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

// 批量处理
app.post('/api/jet/batch', async (req, res) => {
  const { prompts, mode } = req.body;
  
  if (!Array.isArray(prompts)) {
    return res.status(400).json({ error: 'Prompts must be an array' });
  }
  
  console.log(`${c.y}📦 批量处理:${c.r} ${prompts.length} 个任务`);
  
  const results = [];
  for (const prompt of prompts) {
    const result = await vectorJet(prompt, mode);
    results.push(result);
    // 避免速率限制
    await new Promise(resolve => setTimeout(resolve, 4000));
  }
  
  res.json({ results, total: results.length });
});

// 统计信息
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
    cost: {
      total: 0, // 免费层
      currency: 'THB'
    }
  });
});

// ===== 向量搜索 API =====
// 生成嵌入向量
async function generateEmbedding(text) {
  const resp = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_FREE_KEY}`,
    { model: 'models/text-embedding-004', content: { parts: [{ text }] } }
  );
  return resp.data.embedding?.values || [];
}

// 向量狀態
app.get('/api/vector', async (req, res) => {
  try {
    const db = await getDb();
    const count = db ? await db.collection('documents').countDocuments() : 0;
    res.json({
      name: '向量搜索 API (MongoDB Atlas)',
      storage: db ? 'mongodb' : 'not_configured',
      documents: count,
    });
  } catch (e) {
    res.json({ name: '向量搜索 API', storage: 'error', error: e.message });
  }
});

// 向量搜索
app.post('/api/vector', async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;
    if (!query) return res.status(400).json({ error: 'Query required' });
    
    const embedding = await generateEmbedding(query);
    if (!embedding.length) return res.status(500).json({ error: 'Embedding failed' });
    
    const db = await getDb();
    if (!db) return res.json({ ok: true, results: [], note: 'MongoDB not configured' });
    
    let results;
    try {
      results = await db.collection('documents').aggregate([
        { $vectorSearch: { index: 'vector_index', path: 'embedding', queryVector: embedding, numCandidates: limit * 10, limit } },
        { $project: { _id: 1, content: 1, metadata: 1, score: { $meta: 'vectorSearchScore' } } }
      ]).toArray();
    } catch {
      results = await db.collection('documents').find({}).sort({ createdAt: -1 }).limit(limit).toArray();
    }
    
    res.json({ ok: true, results, query, count: results.length });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 向量插入
app.put('/api/vector', async (req, res) => {
  try {
    const { content, metadata = {} } = req.body;
    if (!content) return res.status(400).json({ error: 'Content required' });
    
    const embedding = await generateEmbedding(content);
    if (!embedding.length) return res.status(500).json({ error: 'Embedding failed' });
    
    const db = await getDb();
    if (!db) return res.status(500).json({ error: 'MongoDB not configured' });
    
    const result = await db.collection('documents').insertOne({
      content, embedding, metadata, createdAt: new Date()
    });
    
    res.json({ ok: true, id: result.insertedId.toString(), message: '向量已插入' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 根路由
app.get('/', (req, res) => {
  res.json({
    name: 'SMS-Key 向量噴射引擎 API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      jet: 'POST /api/jet',
      cold: 'POST /api/jet/cold',
      'jet-vector': 'POST /api/jet/vector',
      hot: 'POST /api/jet/hot',
      distill: 'POST /api/jet/distill',
      batch: 'POST /api/jet/batch',
      stats: 'GET /api/stats',
      'vector-status': 'GET /api/vector',
      'vector-search': 'POST /api/vector { query }',
      'vector-insert': 'PUT /api/vector { content, metadata }'
    },
    docs: 'https://github.com/web3-ai-game/gcp-dev-environment'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`${c.g}🔥 向量噴射引擎启动成功${c.r}`);
  console.log(`${c.c}端口:${c.r} ${PORT}`);
  console.log(`${c.c}模型:${c.r} ${GEMINI_FREE_MODEL}`);
  console.log(`${c.y}健康检查:${c.r} http://localhost:${PORT}/health`);
  console.log(`${c.y}API 文档:${c.r} http://localhost:${PORT}/\n`);
});
