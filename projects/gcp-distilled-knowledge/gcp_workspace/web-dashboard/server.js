#!/usr/bin/env node
/**
 * 🌌 魔幻向量引擎可視化工廠
 * 
 * Web 面板：實時監控所有向量引擎 + THB 燒錢進度 + PM2 狀態
 * 綁定：35.198.200.211:8888
 */

const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0'; // 綁定所有介面，讓外部 IP 可訪問

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 讀取 token usage
function getTokenUsage() {
  const usagePath = '/mnt/data/BOOM/.token-usage.json';
  try {
    return JSON.parse(fs.readFileSync(usagePath, 'utf-8'));
  } catch {
    return { models: {}, totalCost: { usd: 0, thb: 0 } };
  }
}

// 獲取 PM2 狀態
function getPM2Status() {
  return new Promise((resolve) => {
    exec('pm2 jlist', (err, stdout) => {
      if (err) return resolve([]);
      try {
        resolve(JSON.parse(stdout));
      } catch {
        resolve([]);
      }
    });
  });
}

// API: 獲取最新向量化文件（帶預覽）
app.get('/api/recent-vectors', async (req, res) => {
  const { MongoClient } = require('mongodb');
  const DEFAULT_MONGO_URI = 'mongodb+srv://root:UeGJpOmsy0SYXnny@svs-svs.yzl7bqo.mongodb.net/?appName=svs-svs';
  let MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGO_URI;
  if (/svs-mcp\.6nddk\.mongodb\.net/.test(MONGODB_URI)) {
    MONGODB_URI = DEFAULT_MONGO_URI;
  }
  
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('sms-vectors');
    const docs = await db.collection('boom-memories')
      .find({})
      .sort({ vectorizedAt: -1 })
      .limit(20)
      .toArray();
    await client.close();
    
    const items = docs.map(d => ({
      filename: d.filename || '',
      relativePath: d.relativePath || '',
      summary: d.summary || '',
      keywords: d.keywords || [],
      emotion: d.emotion || '',
      preview: (d.rawPreview || '').slice(0, 300),
      time: d.vectorizedAt,
    }));
    
    res.json({ ok: true, items });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// API: 獲取生成的圖片列表
app.get('/api/dream-images', (req, res) => {
  const imgDir = '/mnt/data/BOOM/dream_images';
  if (!fs.existsSync(imgDir)) {
    return res.json({ ok: true, images: [] });
  }
  const files = fs.readdirSync(imgDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
  res.json({ ok: true, images: files });
});

// API: 獲取儀表盤數據
app.get('/api/dashboard', async (req, res) => {
  const usage = getTokenUsage();
  const pm2List = await getPM2Status();
  
  const engines = pm2List.filter(p => 
    ['boom-vector-engine', 'vector-jet-engine', 'fast-text-burner', 'dream-image-gen', 'kilo-hot-distill'].includes(p.name)
  ).map(p => ({
    name: p.name,
    status: p.pm2_env.status,
    cpu: p.monit.cpu,
    memory: Math.round(p.monit.memory / 1024 / 1024),
    restarts: p.pm2_env.restart_time,
    uptime: p.pm2_env.pm_uptime,
  }));

  const budget = 30; // USD
  const used = usage.totalCost?.usd || 0;
  const remaining = budget - used;
  const percentage = Math.min((used / budget) * 100, 100);

  res.json({
    budget: { usd: budget, thb: budget * 35 },
    used: { usd: used.toFixed(2), thb: (used * 35).toFixed(2) },
    remaining: { usd: remaining.toFixed(2), thb: (remaining * 35).toFixed(2) },
    percentage: percentage.toFixed(1),
    models: usage.models || {},
    engines,
  });
});

// API: 控制引擎（暫停/恢復/停止）
app.post('/api/control', (req, res) => {
  const { action, target } = req.body; // action: stop/restart/pause, target: 'all' or engine name
  
  let cmd = '';
  if (target === 'all') {
    if (action === 'stop') {
      cmd = 'pm2 stop boom-vector-engine fast-text-burner dream-image-gen vector-jet-engine kilo-hot-distill';
    } else if (action === 'restart') {
      cmd = 'pm2 restart boom-vector-engine fast-text-burner dream-image-gen vector-jet-engine kilo-hot-distill';
    }
  } else {
    cmd = `pm2 ${action} ${target}`;
  }

  exec(cmd, (err) => {
    if (err) return res.json({ ok: false, error: err.message });
    res.json({ ok: true });
  });
});

// 首頁
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`🌌 魔幻向量引擎可視化工廠 @ http://${HOST}:${PORT}`);
  console.log(`   外部訪問: http://35.198.200.211:${PORT}`);
  console.log(`   本地訪問: http://localhost:${PORT}`);
});
