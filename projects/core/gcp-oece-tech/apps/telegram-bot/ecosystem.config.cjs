/**
 * PM2 配置文件
 * 管理 BongBong Bot 和 WebApp 服務
 */

module.exports = {
  apps: [
    // ===== 主 Bot 進程 =====
    {
      name: 'bongbong-bot',
      script: 'src/index.js',
      cwd: '/mnt/volume_sgp1_01/sms-tg-bot',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production'
      },
      // 使用 Doppler 注入環境變量
      // 啟動命令: doppler run -p all-in -c dev -- pm2 start ecosystem.config.cjs
      
      // 進程管理
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      
      // 日誌配置
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/bot-error.log',
      out_file: 'logs/bot-out.log',
      merge_logs: true,
      
      // 重啟策略
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      restart_delay: 3000
    },

    // ===== WebApp 進程 =====
    {
      name: 'bongbong-webapp',
      script: 'webapp/server.js',
      cwd: '/mnt/volume_sgp1_01/sms-tg-bot',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/webapp-error.log',
      out_file: 'logs/webapp-out.log',
      merge_logs: true
    },

    // ===== 聊天記錄備份 (每8小時) =====
    {
      name: 'chat-backup',
      script: 'scripts/backup-chat.js',
      cwd: '/mnt/volume_sgp1_01/sms-tg-bot',
      interpreter: 'node',
      cron_restart: '0 */8 * * *',  // 每8小時執行一次 (0:00, 8:00, 16:00)
      autorestart: false,
      watch: false,
      
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/backup-error.log',
      out_file: 'logs/backup-out.log',
      merge_logs: true
    }
  ]
};
