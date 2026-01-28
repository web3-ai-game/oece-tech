FROM node:18-alpine

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装所有依赖（开发模式需要 nodemon 等 devDependencies）
RUN npm ci

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 5000

# 启动应用（开发模式）
CMD ["npm", "run", "dev"]
