import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 核心魔法：Rewrites 路由重寫
  // 讓用戶訪問 deepway.me/game 時，實際看到的是 another-project.vercel.app 的內容
  // 而瀏覽器地址欄依然顯示 deepway.me/game
  async rewrites() {
    return [
      {
        source: '/earth-online/:path*', // 本地路由
        destination: 'https://your-game-project-url.vercel.app/:path*', // 目標子站鏈接 (請替換為真實鏈接)
      },
      {
        source: '/knowledge-base/:path*',
        destination: 'https://your-knowledge-base-url.vercel.app/:path*',
      },
      // 這裡可以無限加，把你的艦隊都掛載過來
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,
  org: "deepway", 
  project: "deepway-os", 

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
});
