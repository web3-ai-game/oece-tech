const { Sequelize } = require('sequelize');
const redis = require('redis');

// PostgreSQL连接
const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'hotel_management',
  username: process.env.DB_USER || 'hotel_admin',
  password: process.env.DB_PASSWORD || 'hotel_secure_2024',
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Redis连接
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

redisClient.on('error', (err) => {
  console.error('Redis连接错误:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis连接成功');
});

// 连接Redis
(async () => {
  await redisClient.connect();
})();

module.exports = {
  sequelize,
  redisClient
};
