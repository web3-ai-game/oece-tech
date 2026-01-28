# 使用轻量级 Node.js 镜像
FROM node:18-slim

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装生产依赖
RUN npm ci --omit=dev && npm cache clean --force

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# 非 root 用户运行
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

# 启动命令
CMD ["node", "server.js"]
