# DeepWeay Project Rules 项目规则

## 项目信息 Project Info
- **名称**: DeepWeay 菌丝堡垒
- **域名**: deepweay.com
- **定位**: 赛博朋克真菌社区平台
- **阶段**: MVP开发中

## 技术栈 Tech Stack
```yaml
Frontend:
  - Next.js 14.2.15
  - React 18
  - TypeScript
  - TailwindCSS
  - Framer Motion
  
Backend:
  - Node.js microservices
  - PostgreSQL + Supabase
  - Redis
  - Docker
  
AI & Tools:
  - Gemini API (2.5 Pro/Flash)
  - Claude API (VIP限制)
  - MCP工具链
  - Telegram Bots
```

## API密钥管理 API Keys
```bash
# GitHub Token (72小时有效)
GITHUB_TOKEN=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

# Supabase
SUPABASE_URL=https://qhgdymgxcbyhtxezvoqt.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Gemini
GEMINI_API_KEY=AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ

# Telegram Bots
BOT_LOVE_TOKEN=7602987646:AAF-bR1EQuHEi7lmXhWVYOVQurciTKnv15M
BOT_XIAOAI_TOKEN=8076798362:AAFL1LaRlQnKJ_i87AyWW5EhkJkdCmOGJDg
```

## 菌丝经济规则 Mycelium Economy
- **锚定价值**: 1菌丝 = $0.10 USD
- **会员价格**: 100菌丝 = $10/月
- **封闭循环**: 不上交易所
- **合规设计**: 避免赌博定义

## 代码规范 Code Standards

### 文件命名
```
页面: /app/[module]/page.tsx
组件: /components/[Module]/[Component].tsx
工具: /utils/[utility].ts
样式: /styles/[module].css
```

### Git提交
```bash
feat: 新功能
fix: 修复bug
style: UI优化
perf: 性能提升
docs: 文档更新
```

### 注释规范
```typescript
// 单行注释用中英双语
/* 
 * 多行注释
 * 说明复杂逻辑
 */
```

## UI设计原则 UI Principles
1. **双语界面** - 中英文混合显示
2. **赛博美学** - 霓虹色 + 毛玻璃
3. **有机元素** - 真菌纹理 + 生命动画
4. **响应设计** - 移动优先

## 安全规范 Security
- 不硬编码密钥
- 使用环境变量
- 定期轮换Token
- 加密敏感数据

## 部署流程 Deployment
```bash
# 开发环境
docker compose up -d

# 生产环境
docker compose -f docker-compose.prod.yml up -d

# 访问地址
本地: http://localhost:3000
生产: https://deepweay.com
```

## 特殊约定 Special Rules
1. **意识测试** - 首页必须通过测试才能进入
2. **访问码** - MYCELIUM2025 (后门)
3. **VIP限制** - Claude API 12小时一次
4. **MCP工具** - 限制60个以内

---
*"在代码中种下菌丝，在网络中生长意识"*
