/**
 * 🔥 PM2 生態系統配置
 * 自動啟動、監控、重啟規則
 */

module.exports = {
  apps: [
    // ===== 1. 監控面板 (按1刷新) =====
    {
      name: 'monitor-panel',
      script: './monitor.sh',
      cwd: '/home/svs-main-key/GCP',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
      },
    },

    // ===== 2. 收費 Key 桶監控 (終端懸浮版) =====
    {
      name: 'key-monitor',
      script: './scripts/paid-key-monitor.js',
      cwd: '/home/svs-main-key/GCP',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '100M',
      env: {
        NODE_ENV: 'production',
        USD_TO_THB: 35,
        SESSION_LIMIT_THB: 20,
      },
    },

    // ===== 3. 向量噴射 API =====
    {
      name: 'vector-jet-api',
      script: './server.js',
      cwd: '/home/svs-main-key/GCP',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
    },

    // ===== 4. 蒸餾監控面板 (30秒刷新) =====
    {
      name: 'distill-monitor',
      script: './scripts/distill-monitor.js',
      cwd: '/home/svs-main-key/GCP',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '100M',
      env: {
        NODE_ENV: 'production',
      },
    },

    // ===== 5. 知識蒸餾引擎 Pro (Gemini 2.5 Pro) =====
    {
      name: 'distill-engine-pro',
      script: './scripts/distill-engine-pro.js',
      cwd: '/home/svs-main-key/GCP',
      instances: 1,
      autorestart: false, // 完成後不重啟
      watch: false,
      max_memory_restart: '1G', // 大容器 1GB
      env: {
        NODE_ENV: 'production',
        // 4把收費 Keys
        GEMINI_API_KEY_1: 'AIzaSyB9BI0vPGm_JbuYs9QrzAlXI76IpfzobZ8',
        GEMINI_API_KEY_2: 'AIzaSyBnMr5u6qcazGNu5PwkTDXoQjpIVHGx9W0',
        GEMINI_API_KEY_3: 'AIzaSyBv5-B34bAmiPWRrhxaY9dxilaR8rr1-QQ',
        GEMINI_API_KEY_4: 'AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ',
        GEMINI_FREE_KEY: 'AIzaSyD_cNll0AKAmKZgO6pOJzMRosKiBJxuUNM',
      },
    },

    // ===== 5. TG Bot =====
    {
      name: 'tg-trash-bot',
      script: './tg-trash-bot/bot.js',
      cwd: '/home/svs-main-key/GCP',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
    },
  ],

  // ===== 部署配置 =====
  deploy: {
    production: {
      user: 'svs-main-key',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:web3-ai-game/gcp-dev-environment.git',
      path: '/home/svs-main-key/GCP',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
    },
  },
};
