# 多階段構建，優化鏡像大小和內存使用
FROM node:18-alpine AS deps
WORKDIR /app

# 只複製 package 文件，利用 Docker 緩存
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# 構建階段
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# 運行階段 - 最小化鏡像
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 創建非 root 用戶
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 複製必要文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/content ./content

# 設置權限
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 限制 Node.js 內存使用 (適合 2GB RAM VPS)
ENV NODE_OPTIONS="--max-old-space-size=768"

CMD ["node", "server.js"]
