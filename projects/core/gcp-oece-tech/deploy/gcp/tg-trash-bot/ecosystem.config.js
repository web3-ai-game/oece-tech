/**
 * PM2 配置 - 向量垃圾話噴射器
 */

module.exports = {
  apps: [{
    name: 'tg-trash-bot',
    script: './index.js',
    instances: 1,
    exec_mode: 'fork',
    
    // 環境變量 (從 Doppler 讀取)
    env: {
      NODE_ENV: 'production',
      TELEGRAM_BOT_SVSKILO_TOKEN: process.env.TELEGRAM_BOT_SVSKILO_TOKEN,
      GEMINI_FREE_KEY: process.env.GEMINI_FREE_KEY
    },
    
    // 重啟策略
    watch: false,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 5000,
    
    // 日誌
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    merge_logs: true,
    
    // 性能監控
    max_memory_restart: '200M',
    
    // 優雅關閉
    kill_timeout: 5000,
    listen_timeout: 10000,
    shutdown_with_message: true
  }]
};
