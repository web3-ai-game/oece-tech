# 部署指南 - OECE.TECH

## 项目概述

这是一个多站点嵌套架构的匿名知识库平台，包含：
- 落地页系统（邀请码机制）
- 论坛教程系统（游戏化黑话）
- 实时VPN监控评测
- 广告积分系统

---

## 部署前准备

### 1. 环境变量配置

创建 `.env.production` 文件：

```env
# 数据库配置
DATABASE_URL="postgresql://user:password@host:5432/dbname"
# 或使用Supabase免费版
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# JWT认证
JWT_SECRET="your-secure-random-string-change-this"

# Google AI (免费版)
GEMINI_FREE_KEY="your-gemini-api-key"

# 广告系统（可选）
NEXT_PUBLIC_GOOGLE_ADS_ID="ca-pub-xxxxx"

# WebSocket实时监控
NEXT_PUBLIC_WS_URL="wss://your-websocket-server"

# 站点配置
NEXT_PUBLIC_SITE_URL="https://oece.tech"
NEXT_PUBLIC_SITE_NAME="OECE"

# 环境
NODE_ENV="production"
```

### 2. 数据库准备

```sql
-- 创建必要的表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invite_codes (
  code TEXT PRIMARY KEY,
  used BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tutorials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE speed_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  node_id TEXT,
  ping INTEGER,
  download FLOAT,
  upload FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 部署选项

### 选项1: Vercel (推荐)

```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel --prod

# 4. 设置环境变量
vercel env add JWT_SECRET production
vercel env add DATABASE_URL production
# ... 其他环境变量
```

**优点**:
- 免费套餐够用
- 自动HTTPS
- 全球CDN
- 自动CI/CD

### 选项2: Cloudflare Pages + Workers

```bash
# 1. 安装Wrangler
npm install -g wrangler

# 2. 配置
wrangler init

# 3. 部署
npm run build
wrangler pages publish ./out
```

**优点**:
- 完全免费
- 边缘计算
- DDoS防护
- 支持Workers KV存储

### 选项3: VPS自托管

```bash
# 1. SSH到服务器
ssh root@your-server-ip

# 2. 安装Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 3. 安装PM2
npm install pm2 -g

# 4. 克隆项目
git clone https://github.com/your-username/tech-room.git
cd tech-room

# 5. 安装依赖
npm install

# 6. 构建
npm run build

# 7. 使用PM2启动
pm2 start npm --name "oece-tech" -- start
pm2 save
pm2 startup
```

**配置Nginx**:

```nginx
server {
    listen 80;
    server_name oece.tech;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 安全配置

### 1. 内容过滤

确保黑话系统正常工作：

```typescript
// 检查转换器
import { BlackhatConverter } from '@/lib/blackhat-converter'

// 测试
const text = "如何搭建VPN服务器"
const converted = BlackhatConverter.convert(text)
console.log(converted) // "如何搭建量子隧道基地"
```

### 2. 访问控制

```javascript
// middleware.ts
export function middleware(request: NextRequest) {
  // IP白名单（可选）
  const allowedIPs = process.env.ALLOWED_IPS?.split(',') || []
  
  // 地区限制（可选）
  const country = request.geo?.country
  const blockedCountries = ['CN'] // 根据需要配置
  
  if (blockedCountries.includes(country || '')) {
    // 重定向到其他页面
    return NextResponse.redirect(new URL('/blocked', request.url))
  }
  
  return NextResponse.next()
}
```

### 3. DDoS防护

使用Cloudflare：

1. 添加站点到Cloudflare
2. 启用"Under Attack Mode"（如需要）
3. 配置Rate Limiting规则
4. 启用WAF规则

---

## 监控和维护

### 1. 性能监控

```bash
# 使用PM2监控
pm2 monit

# 查看日志
pm2 logs oece-tech

# 查看状态
pm2 status
```

### 2. 数据库备份

```bash
# PostgreSQL备份
pg_dump -U username -h localhost dbname > backup_$(date +%Y%m%d).sql

# 自动备份脚本
crontab -e
# 添加：每天凌晨3点备份
0 3 * * * /home/backup/backup.sh
```

### 3. 日志管理

```typescript
// lib/logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

export default logger
```

---

## 测速节点配置

### 添加测试服务器

```javascript
// config/speed-test-servers.js
export const TEST_SERVERS = [
  {
    id: 'tokyo-1',
    name: '樱花岛传送点',
    url: 'https://speed-tokyo.oece.tech',
    location: '日本东京',
    provider: 'Vultr'
  },
  {
    id: 'singapore-1', 
    name: '狮城传送点',
    url: 'https://speed-sg.oece.tech',
    location: '新加坡',
    provider: 'DigitalOcean'
  },
  // 更多节点...
]
```

### WebSocket服务器

```javascript
// ws-server.js
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws) => {
  // 发送实时节点状态
  setInterval(() => {
    ws.send(JSON.stringify({
      type: 'nodeUpdate',
      nodes: getLatestNodeStatus()
    }))
  }, 5000)
})
```

---

## 故障排除

### 常见问题

1. **数据库连接失败**
   ```bash
   # 检查连接字符串
   echo $DATABASE_URL
   
   # 测试连接
   psql $DATABASE_URL
   ```

2. **构建失败**
   ```bash
   # 清理缓存
   rm -rf .next node_modules
   npm install
   npm run build
   ```

3. **端口占用**
   ```bash
   # 查找占用3000端口的进程
   lsof -i :3000
   
   # 杀死进程
   kill -9 <PID>
   ```

---

## 性能优化

### 1. CDN配置

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['cdn.oece.tech'],
  },
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.oece.tech' 
    : '',
}
```

### 2. 缓存策略

```javascript
// 页面缓存
export const revalidate = 3600 // 1小时

// API缓存
res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
```

### 3. 图片优化

```jsx
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="OECE"
  width={100}
  height={100}
  loading="lazy"
  placeholder="blur"
/>
```

---

## 发布清单

```
□ 环境变量配置完成
□ 数据库已创建并初始化
□ 域名DNS已配置
□ SSL证书已安装
□ 黑话系统测试通过
□ 广告系统配置完成
□ WebSocket服务器运行正常
□ 备份策略已设置
□ 监控系统已启用
□ 安全规则已配置
```

---

## 更新部署

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 安装新依赖
npm install

# 3. 构建
npm run build

# 4. 重启服务
pm2 restart oece-tech

# 或使用零停机部署
pm2 reload oece-tech
```

---

## 联系支持

如遇到部署问题，请查看：
- 项目Wiki: https://github.com/your-username/tech-room/wiki
- Issues: https://github.com/your-username/tech-room/issues
- 文档: `/docs`目录

---

**部署指南完成！** 

确保所有敏感信息已脱敏，黑话系统正常工作，然后即可安全部署。🚀
