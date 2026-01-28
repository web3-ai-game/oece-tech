/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // 國際化配置
  i18n: {
    locales: ['zh-TW', 'en'],
    defaultLocale: 'zh-TW',
  },
  
  // 圖片優化
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Webpack 配置
  webpack: (config, { isServer }) => {
    // 處理 SQLite
    if (isServer) {
      config.externals.push({
        'better-sqlite3': 'commonjs better-sqlite3'
      });
    }
    return config;
  },
}

module.exports = nextConfig
