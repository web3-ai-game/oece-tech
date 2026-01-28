/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  compress: true,

  // 图片优化
  images: {
    unoptimized: true,
  },

  // 尾部斜杠处理
  trailingSlash: false,
}

module.exports = nextConfig
