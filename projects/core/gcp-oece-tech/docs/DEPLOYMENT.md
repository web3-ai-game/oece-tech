# oece.tech 部署指南

## 环境配置

### Doppler 配置

\`\`\`bash
# 开发环境
doppler run --project oece-tech-prod --config dev -- npm run dev

# 生产部署
doppler run --project oece-tech-prod --config prod -- npm run build
\`\`\`

### 环境变量

必需的环境变量:
- `MONGODB_URI`: MongoDB 连接字符串
- `ALGOLIA_APP_ID`: Algolia 应用 ID
- `ALGOLIA_ADMIN_API_KEY`: Algolia 管理密钥
- `TELEGRAM_BOT_TOKEN`: Telegram Bot 令牌
- `NEXT_PUBLIC_SENTRY_DSN`: Sentry DSN
- `UPSTASH_REDIS_URL`: Redis 缓存 URL

## 部署步骤

### 1. Firebase 部署

\`\`\`bash
cd apps/web
npm run build
firebase deploy --project oece-tech-firebase
\`\`\`

### 2. GCP 部署

\`\`\`bash
./scripts/deploy.sh prod
\`\`\`

更多详情请参考 deploy/ 目录中的配置文件。
