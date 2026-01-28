const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 限流配置
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制100个请求
  message: '请求过于频繁，请稍后再试'
});

app.use('/api', limiter);

// 数据库连接
const { sequelize, redisClient } = require('./config/database');

// 路由
const authRoutes = require('./routes/auth');
const tenantRoutes = require('./routes/tenants');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const customerRoutes = require('./routes/customers');

app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/customers', customerRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 错误处理
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 启动服务器
async function startServer() {
  try {
    // 先启动服务器
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 服务器运行在端口 ${PORT}`);
    });

    // 然后尝试连接数据库（重试机制）
    let retries = 10;
    while (retries > 0) {
      try {
        await sequelize.authenticate();
        // eslint-disable-next-line no-console
        console.log('✅ 数据库连接成功');
        break;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`⏳ 数据库连接失败，${retries}秒后重试...`, error.message);
        retries--;
        if (retries === 0) {
          // eslint-disable-next-line no-console
          console.error('❌ 无法连接数据库，服务器将继续运行但数据库功能不可用');
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // 尝试连接Redis
    try {
      await redisClient.connect();
      // eslint-disable-next-line no-console
      console.log('✅ Redis连接成功');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('⚠️ Redis连接失败，缓存功能不可用:', error.message);
    }

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

startServer();
