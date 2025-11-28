# 🤖 Onion-Mcp Telegram Bot - Google Cloud Run 部署

FROM node:20-alpine

WORKDIR /app

# 安裝依賴
COPY package*.json ./
RUN npm ci --only=production

# 複製代碼
COPY . .

# 暴露端口
EXPOSE 8080

# 啟動 Bot
CMD ["node", "bot.js"]
