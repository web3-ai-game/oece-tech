FROM node:18-alpine

WORKDIR /app

# 複製 package 文件
COPY package*.json ./

# 安裝依賴
RUN npm ci --only=production

# 複製應用文件
COPY . .

# 創建非 root 用戶
RUN addgroup --system --gid 1001 botuser && \
    adduser --system --uid 1001 botuser

USER botuser

# 限制內存使用
ENV NODE_OPTIONS="--max-old-space-size=256"

CMD ["node", "bot.js"]
