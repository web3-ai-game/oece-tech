// PM2 配置文件
// 用法: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'oece-tech',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/oece-tech',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/oece-tech-error.log',
      out_file: '/var/log/pm2/oece-tech-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};
