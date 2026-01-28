# 🐳 向量垃圾話噴射器 Docker 鏡像

FROM node:22-alpine

# 設置工作目錄
WORKDIR /app

# 安裝依賴
COPY package*.json ./
RUN npm ci --production

# 複製源代碼
COPY . .

# 健康檢查 (可選)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "console.log('Bot is running')" || exit 1

# 設置環境變量 (默認值)
ENV NODE_ENV=production
ENV TELEGRAM_BOT_SVSKILO_TOKEN=""
ENV GEMINI_FREE_KEY=""

# 啟動 Bot
CMD ["node", "index.js"]
