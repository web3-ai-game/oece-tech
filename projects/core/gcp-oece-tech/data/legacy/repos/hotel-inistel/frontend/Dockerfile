# Frontend Dockerfile (Multi-stage build)
FROM node:18-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Development stage
FROM base AS development

EXPOSE 3000
CMD ["npm", "start"]

# Production stage
FROM nginx:alpine AS production

# Copy built assets from base stage
COPY --from=base /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
