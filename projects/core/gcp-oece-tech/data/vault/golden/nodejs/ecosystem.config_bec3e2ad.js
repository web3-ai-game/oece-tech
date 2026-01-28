module.exports = {
  apps: [
    // 蒸餾容器 1
    {
      name: 'distiller-1',
      script: './distiller_v2.py',
      interpreter: 'python3',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        API_KEY_INDEX: '0',
        NODE_ENV: 'production'
      }
    },
    // 蒸餾容器 2
    {
      name: 'distiller-2',
      script: './distiller_v2.py',
      interpreter: 'python3',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        API_KEY_INDEX: '1',
        NODE_ENV: 'production'
      }
    },
    // 蒸餾容器 3
    {
      name: 'distiller-3',
      script: './distiller_v2.py',
      interpreter: 'python3',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        API_KEY_INDEX: '2',
        NODE_ENV: 'production'
      }
    },
    // PM2 監控
    {
      name: 'monitor',
      script: './pm2-monitor.js',
      interpreter: 'node',
      instances: 1,
      autorestart: true,
      watch: false
    }
  ]
};
