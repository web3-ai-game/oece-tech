# 🚀 GeekSEA 项目升级路线图

## 📋 升级任务清单

### ✅ Phase 1: UI 优化（已完成）
- [x] 边框钝化处理（border-4 → border-2）
- [x] 添加圆角（rounded, rounded-sm, rounded-md）
- [x] 羽化阴影效果（shadow-lg, shadow-xl）
- [x] 按钮圆润化（rounded-full for badges）
- [x] 增强hover效果

### 🔄 Phase 2: 新功能页面（进行中）

#### 1. 工具库页面 `/tools`
**功能**:
- VPN 速度测试工具
- 在线代码编辑器
- 加密/解密工具
- API 测试工具
- JSON 格式化

**API 需求**:
- Cloudflare Speed Test API（免费）
- IPinfo API（免费tier：50k/月）

#### 2. 价格页面 `/pricing`
**计划**:
- 3档价格套餐
- 东南亚支付：Stripe（支持Alipay, GrabPay等）
- 大陆支付：支付宝/微信（备用接口）
- 加密货币支付（USDT）

#### 3. 论坛页面 `/forum`
**功能**:
- 匿名发帖
- 分类讨论区
- 评论系统
- 点赞/收藏
- Admin 后台

### 📱 Phase 3: 移动端优化
- 减少矩阵雨密度（移动端）
- 优化动画性能
- 触摸手势支持
- 响应式菜单

### 🔐 Phase 4: 简化注册
- 邮箱 + 密码注册
- 无需验证码（开发阶段）
- Admin 账号预设

### 🚢 Phase 5: GitHub 部署
- GitHub Actions CI/CD
- Vercel/Netlify 部署
- 环境变量管理
- 数据库迁移方案

---

## 🛠️ 工具库技术方案

### VPN 速度测试

#### 方案 1: Cloudflare Speed Test（推荐）
```typescript
// lib/speedtest.ts
export async function testSpeed() {
  const response = await fetch('https://speed.cloudflare.com/__down?bytes=10000000')
  const startTime = Date.now()
  await response.arrayBuffer()
  const endTime = Date.now()
  
  const duration = (endTime - startTime) / 1000
  const sizeMB = 10
  const speedMbps = (sizeMB * 8) / duration
  
  return {
    download: speedMbps.toFixed(2),
    latency: await testLatency(),
  }
}

async function testLatency() {
  const start = Date.now()
  await fetch('https://1.1.1.1/cdn-cgi/trace')
  return Date.now() - start
}
```

#### 方案 2: Fast.com API
- 免费，Netflix 提供
- 无需 API Key
- 支持全球测试节点

### IP 信息查询

使用 IPinfo.io（免费）:
```bash
# 注册获取 token
# https://ipinfo.io/signup

# .env.local
IPINFO_TOKEN=your_token_here
```

---

## 💳 支付集成方案

### Stripe（推荐 - 东南亚）

**支持支付方式**:
- 信用卡（Visa, Mastercard）
- Alipay（支付宝）
- GrabPay（东南亚）
- PayNow（新加坡）
- PromptPay（泰国）

```typescript
// lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createPaymentSession(priceId: string) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'alipay', 'grabpay'],
    line_items: [{
      price: priceId,
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
  })
  
  return session
}
```

### 大陆支付（备用）

**方案**:
- 使用第三方聚合支付（如：Ping++, BeeCloud）
- 或直接对接支付宝/微信企业接口

**接口预留**:
```typescript
// lib/payment-cn.ts
export interface PaymentProvider {
  createOrder(amount: number, orderId: string): Promise<string>
  verifyPayment(transactionId: string): Promise<boolean>
}

export class AlipayProvider implements PaymentProvider {
  async createOrder(amount: number, orderId: string) {
    // 支付宝接口
    return 'payment_url'
  }
  
  async verifyPayment(transactionId: string) {
    // 验证支付
    return true
  }
}
```

---

## 💬 论坛系统设计

### 数据库表结构

```sql
-- 帖子表
CREATE TABLE forum_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER,
  is_anonymous BOOLEAN DEFAULT 0,
  category TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 评论表
CREATE TABLE forum_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER,
  is_anonymous BOOLEAN DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES forum_posts(id),
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 分类表
CREATE TABLE forum_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  post_count INTEGER DEFAULT 0
);
```

### API 端点

```typescript
// app/api/forum/posts/route.ts
export async function GET() {
  // 获取帖子列表
}

export async function POST(req: Request) {
  const { title, content, category, anonymous } = await req.json()
  // 创建新帖子（支持匿名）
}

// app/api/forum/posts/[id]/route.ts
export async function GET(req: Request, { params }: { params: { id: string } }) {
  // 获取帖子详情
}

// app/api/forum/comments/route.ts
export async function POST(req: Request) {
  const { postId, content, anonymous } = await req.json()
  // 发表评论（支持匿名）
}
```

---

## 🎨 移动端优化策略

### 性能优化

```typescript
// hooks/useIsMobile.ts
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])
  
  return isMobile
}

// app/page.tsx
export default function HomePage() {
  const isMobile = useIsMobile()
  
  return (
    <div className="relative">
      {/* 移动端减少矩阵雨密度 */}
      <MatrixRain density={isMobile ? 10 : 20} />
      {/* ... */}
    </div>
  )
}
```

### CSS 优化

```css
/* 移动端减少动画 */
@media (max-width: 768px) {
  .animate-scan,
  .pixel-float,
  .animate-glitch {
    animation: none !important;
  }
  
  .card-pixel-glow {
    box-shadow: none !important;
  }
}

/* 性能优化 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

---

## 📦 GitHub 迁移计划

### 步骤 1: 仓库准备

```bash
# 1. 创建 GitHub 仓库
# https://github.com/new

# 2. 初始化并推送
cd /Users/svs.loline/Documents/xiangmu/tech-room
git add .
git commit -m "🎉 Initial commit: GeekSEA Platform"
git remote add origin https://github.com/YOUR_USERNAME/geeksea.git
git push -u origin main
```

### 步骤 2: 环境变量设置

在 GitHub Secrets 添加:
```
NOTION_API_KEY=secret_xxx
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_xxx
IPINFO_TOKEN=your_token
```

### 步骤 3: GitHub Actions 配置

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
        env:
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          NOTION_API_KEY: ${{ secrets.NOTION_API_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 步骤 4: Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

---

## 🔑 Admin 账号设置

### 数据库初始化脚本

```typescript
// scripts/create-admin.ts
import { db } from '../lib/db'
import { hashPassword } from '../lib/auth'

async function createAdmin() {
  const hashedPassword = await hashPassword('AdminPassword123')
  
  db.prepare(`
    INSERT INTO users (username, email, password_hash, role, display_name)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    'admin',
    'admin@geeksea.com',
    hashedPassword,
    'admin',
    'Administrator'
  )
  
  console.log('✅ Admin account created')
  console.log('Email: admin@geeksea.com')
  console.log('Password: AdminPassword123')
}

createAdmin()
```

```bash
# 运行脚本
npm run create-admin
```

---

## 📅 开发时间表

### Week 1-2
- ✅ UI 优化（完成）
- 🔄 工具库页面（3天）
- 🔄 价格页面（2天）

### Week 3-4
- 论坛基础功能（5天）
- 移动端优化（2天）
- 测试和修复（3天）

### Week 5
- GitHub Actions 配置
- Vercel 部署
- 生产环境测试

---

## 🎯 优先级

### P0（必须）- 1周内
1. ✅ 简化注册系统
2. Admin 账号创建脚本
3. 基础论坛功能
4. 移动端性能优化
5. **积分系统核心功能** ← 新增

### P1（重要）- 2周内
1. ✅ 工具库页面
2. ✅ 价格页面
3. 支付集成（Stripe）
4. **广告集成（Google AdSense）** ← 新增
5. **积分赚取/消费功能** ← 新增
6. **防刷机制** ← 新增

### P2（可选）- 1月内
1. 高级论坛功能
2. 数据分析面板
3. SEO 优化
4. **积分商城** ← 新增
5. **积分抵扣订阅** ← 新增

---

## 🚀 立即开始

**下一步行动**:
1. 创建工具库页面基础结构
2. 集成 VPN 速度测试 API
3. 设计价格页面 UI
4. 搭建论坛数据库表

**预计完成**: 2-4周

**当前进度**: 25% ████░░░░░░░░░░░░
