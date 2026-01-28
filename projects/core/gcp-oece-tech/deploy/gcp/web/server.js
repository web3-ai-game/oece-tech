const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 健康检查
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: os.uptime(),
    hostname: os.hostname(),
    platform: os.platform(),
    memory: {
      total: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      free: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + ' GB'
    },
    cpu: {
      cores: os.cpus().length,
      model: os.cpus()[0].model
    }
  });
});

// 系统信息
app.get('/api/info', (req, res) => {
  res.json({
    project: 'SMS Data Cleaning',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    domain: 'deepweay.me',
    location: 'Bangkok, Thailand',
    timezone: 'Asia/Bangkok'
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌊 DeepWeay Labs Web Server`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🌐 域名: deepweay.me`);
  console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Bangkok' })}`);
  console.log(`✅ 服务器运行中...`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n\n👋 正在关闭服务器...');
  process.exit(0);
});
