# ========================================
# Telegram Bot Dockerfile
# ========================================

FROM node:20-alpine

WORKDIR /app

# 安装依赖工具
RUN apk add --no-cache \
    ca-certificates \
    wget

# 复制package文件
COPY package.json package-lock.json* ./

# 安装生产依赖
RUN npm ci --production --ignore-scripts

# 复制源码
COPY src ./src

# 创建用户
RUN addgroup --system --gid 1001 botuser && \
    adduser --system --uid 1001 botuser && \
    chown -R botuser:botuser /app

# 切换用户
USER botuser

# 环境变量
ENV NODE_ENV=production

# 健康检查（Bot没有HTTP端口，检查进程）
HEALTHCHECK --interval=60s --timeout=10s --start-period=30s --retries=3 \
  CMD pgrep -f "node" || exit 1

# 启动Bot
CMD ["node", "src/index.js"]
