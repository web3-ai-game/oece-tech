module.exports = {
  apps: [
    {
      name: 'distiller-monitor',
      script: 'scripts/monitor.py',
      interpreter: 'python3',
      cwd: '/mnt/sms/kill-old/digital-assets-distiller-v2',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      },
      error_file: 'logs/monitor-error.log',
      out_file: 'logs/monitor-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
