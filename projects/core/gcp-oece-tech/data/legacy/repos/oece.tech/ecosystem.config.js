module.exports = {
  apps: [
    {
      name: 'oece-web',
      script: 'server.js',
      cwd: '/home/nomad/oece.tech/.next/standalone',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
      },
      error_file: '/home/nomad/oece.tech/logs/pm2-error.log',
      out_file: '/home/nomad/oece.tech/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
}
