# Admin管理面板系统 (2025.10最新)

## 技术栈更新

### 数据库选择

**主数据库 (实时)**:
```
Supabase Free Tier
- PostgreSQL 500MB
- 实时数据库
- 内置认证
- Row Level Security
- 免费额度充足
```

**备选方案**:
```
Turso (libSQL)
- 全球边缘数据库
- 免费9GB存储
- 无限读取
- 超低延迟

Neon
- Serverless PostgreSQL
- 免费3GB存储
- 自动休眠
- 分支功能
```

### Google AI集成 (2025.10新功能)

```typescript
// Gemini 2.0 Flash (2025年10月发布)
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)

// 使用最新Gemini 2.0 Flash
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-exp" 
})

// 新功能：实时流式响应
const result = await model.generateContentStream(prompt)

// 新功能：多模态理解（文本+图片+视频）
const multimodalResult = await model.generateContent([
  { text: prompt },
  { inlineData: { data: imageBase64, mimeType: "image/jpeg" }}
])

// 新功能：函数调用（Function Calling）
const chat = model.startChat({
  tools: [{
    functionDeclarations: [{
      name: "getUserStats",
      description: "获取用户统计数据",
      parameters: { type: "object", properties: {...} }
    }]
  }]
})
```

---

## Admin面板架构

### 路由结构

```
/admin
├── /dashboard          # 总览面板
├── /users             # 用户管理
│   ├── /list          # 用户列表
│   ├── /detail/:id    # 用户详情
│   └── /analytics     # 用户分析
├── /content           # 内容管理
│   ├── /tutorials     # 教程管理
│   ├── /notes         # 笔记审核
│   └── /mindmaps      # 思维导图
├── /invites           # 邀请码管理
│   ├── /generate      # 生成邀请码
│   ├── /list          # 邀请码列表
│   └── /analytics     # 使用分析
├── /subscriptions     # 订阅管理
│   ├── /active        # 活跃订阅
│   ├── /expired       # 已过期
│   └── /revenue       # 收入统计
├── /community         # 社区管理
│   ├── /posts         # 帖子审核
│   ├── /reports       # 举报处理
│   └── /moderation    # 内容审核
├── /analytics         # 数据分析
│   ├── /realtime      # 实时数据
│   ├── /archived      # 归档数据
│   └── /ai-insights   # AI洞察
├── /security          # 安全中心
│   ├── /logs          # 审计日志
│   ├── /firewall      # 防火墙规则
│   └── /alerts        # 安全警报
└── /settings          # 系统设置
    ├── /general       # 通用设置
    ├── /api           # API配置
    └── /backup        # 备份管理
```

---

## 实时数据 vs 归档数据

### 数据分层架构

```typescript
// 实时数据层 (Hot Data)
// 存储: Supabase PostgreSQL
interface RealtimeData {
  users: {
    online: User[]           // 当前在线用户
    active_30min: User[]     // 30分钟活跃
    realtime_stats: Stats    // 实时统计
  }
  
  system: {
    current_load: number     // 当前负载
    api_requests: Request[]  // 最近API请求
    errors: Error[]          // 最近错误
  }
}

// 归档数据层 (Cold Data)
// 存储: Supabase + S3/R2
interface ArchivedData {
  historical: {
    daily_stats: DailyStats[]    // 每日统计
    monthly_reports: Report[]    // 月度报告
    user_behavior: Behavior[]    // 用户行为分析
  }
  
  analytics: {
    trends: TrendData[]          // 趋势分析
    predictions: Prediction[]    // AI预测
    insights: Insight[]          // 深度洞察
  }
}

// 数据流转策略
// 实时数据 (保留7天) → 归档数据 (永久保存)
const archiveOldData = async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  
  // 1. 查询需要归档的数据
  const dataToArchive = await supabase
    .from('realtime_logs')
    .select('*')
    .lt('created_at', sevenDaysAgo)
  
  // 2. 压缩并上传到S3
  const compressed = await compress(dataToArchive)
  await uploadToS3(compressed, `archive/${date}.json.gz`)
  
  // 3. 删除实时数据
  await supabase
    .from('realtime_logs')
    .delete()
    .lt('created_at', sevenDaysAgo)
}
```

---

## Admin Dashboard设计

### 总览面板

```tsx
// app/admin/dashboard/page.tsx
'use client'

import { useRealtimeData } from '@/hooks/useRealtimeData'
import { GoogleAI } from '@/lib/google-ai'

export default function AdminDashboard() {
  const realtime = useRealtimeData()
  const [aiInsights, setAIInsights] = useState<string>()
  
  useEffect(() => {
    // AI实时分析
    const analyzeData = async () => {
      const insights = await GoogleAI.generateInsights(realtime)
      setAIInsights(insights)
    }
    analyzeData()
  }, [realtime])
  
  return (
    <div className="p-6 space-y-6">
      {/* 实时指标 */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          label="在线用户"
          value={realtime.onlineUsers}
          trend="+12%"
          realtime
        />
        <MetricCard
          label="今日注册"
          value={realtime.todaySignups}
          trend="+8%"
          realtime
        />
        <MetricCard
          label="活跃订阅"
          value={realtime.activeSubscriptions}
          trend="+5%"
        />
        <MetricCard
          label="今日收入"
          value={`$${realtime.todayRevenue}`}
          trend="+15%"
        />
      </div>
      
      {/* AI洞察 */}
      <AIInsightsPanel insights={aiInsights} />
      
      {/* 实时活动流 */}
      <RealtimeActivityFeed />
      
      {/* 系统健康 */}
      <SystemHealthPanel />
    </div>
  )
}
```

---

## 安全防护体系

### 1. 多层认证

```typescript
// middleware/admin-auth.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function adminAuthMiddleware(req: NextRequest) {
  const supabase = createMiddlewareClient({ req, res })
  
  // 1. 验证登录
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.redirect('/admin/login')
  }
  
  // 2. 验证角色
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()
  
  if (user?.role !== 'admin' && user?.role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  
  // 3. 验证IP白名单
  const clientIP = req.headers.get('x-forwarded-for')
  const isWhitelisted = await checkIPWhitelist(clientIP)
  if (!isWhitelisted) {
    await logSecurityEvent('unauthorized_ip', { ip: clientIP })
    return NextResponse.json({ error: 'IP not whitelisted' }, { status: 403 })
  }
  
  // 4. 验证2FA
  const has2FA = await check2FA(session.user.id)
  if (!has2FA) {
    return NextResponse.redirect('/admin/2fa/setup')
  }
  
  return NextResponse.next()
}
```

### 2. Row Level Security (RLS)

```sql
-- Supabase RLS策略
-- 只有admin角色可以访问所有数据

-- 用户表
CREATE POLICY "Admin full access"
ON users
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND raw_user_meta_data->>'role' IN ('admin', 'super_admin')
  )
);

-- 订阅表
CREATE POLICY "Admin can manage subscriptions"
ON subscriptions
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND raw_user_meta_data->>'role' IN ('admin', 'super_admin')
  )
);

-- 审计日志（只能插入，不能修改/删除）
CREATE POLICY "Admin can view audit logs"
ON audit_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND raw_user_meta_data->>'role' IN ('admin', 'super_admin')
  )
);

CREATE POLICY "System can insert audit logs"
ON audit_logs
FOR INSERT
WITH CHECK (true);
```

### 3. 审计日志

```typescript
// lib/audit-log.ts
interface AuditLog {
  id: string
  admin_id: string
  action: string
  resource: string
  resource_id: string
  changes: Record<string, any>
  ip_address: string
  user_agent: string
  timestamp: Date
}

export async function logAdminAction(
  adminId: string,
  action: string,
  resource: string,
  resourceId: string,
  changes?: Record<string, any>
) {
  await supabase.from('audit_logs').insert({
    admin_id: adminId,
    action,
    resource,
    resource_id: resourceId,
    changes,
    ip_address: req.headers.get('x-forwarded-for'),
    user_agent: req.headers.get('user-agent'),
    timestamp: new Date()
  })
}

// 使用示例
await logAdminAction(
  adminId,
  'UPDATE',
  'user',
  userId,
  { before: oldData, after: newData }
)
```

### 4. 防暴力破解

```typescript
// lib/rate-limit.ts
import { LRUCache } from 'lru-cache'

const ratelimit = new LRUCache<string, number>({
  max: 500,
  ttl: 60 * 1000 // 1分钟
})

export async function checkRateLimit(ip: string): Promise<boolean> {
  const attempts = ratelimit.get(ip) || 0
  
  if (attempts >= 5) {
    // 超过5次尝试，封禁IP
    await blockIP(ip, '1 hour')
    return false
  }
  
  ratelimit.set(ip, attempts + 1)
  return true
}
```

---

## Google AI智能功能

### 1. 智能数据分析

```typescript
// lib/google-ai.ts
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export class AdminAI {
  static async generateInsights(data: RealtimeData) {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp" 
    })
    
    const prompt = `
      分析以下实时数据，提供关键洞察和建议：
      
      在线用户: ${data.onlineUsers}
      今日注册: ${data.todaySignups}
      活跃订阅: ${data.activeSubscriptions}
      今日收入: $${data.todayRevenue}
      
      请提供：
      1. 关键趋势
      2. 潜在问题
      3. 优化建议
    `
    
    const result = await model.generateContent(prompt)
    return result.response.text()
  }
  
  static async detectAnomalies(metrics: Metric[]) {
    // AI异常检测
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp" 
    })
    
    const prompt = `
      检测以下指标中的异常值：
      ${JSON.stringify(metrics, null, 2)}
      
      返回JSON格式：
      {
        "anomalies": [
          { "metric": "...", "value": ..., "expected": ..., "severity": "high/medium/low" }
        ]
      }
    `
    
    const result = await model.generateContent(prompt)
    return JSON.parse(result.response.text())
  }
  
  static async generateReport(dateRange: { start: Date, end: Date }) {
    // AI生成报告
    const data = await fetchArchivedData(dateRange)
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp" 
    })
    
    const prompt = `
      基于以下数据生成专业的运营报告：
      ${JSON.stringify(data, null, 2)}
      
      包含：
      1. 执行摘要
      2. 关键指标分析
      3. 用户行为分析
      4. 收入分析
      5. 行动建议
    `
    
    const result = await model.generateContent(prompt)
    return result.response.text()
  }
}
```

### 2. 内容审核

```typescript
// lib/content-moderation.ts
export class ContentModeration {
  static async moderateText(text: string) {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp" 
    })
    
    const prompt = `
      审核以下内容是否包含敏感信息：
      "${text}"
      
      检查：
      1. 敏感词汇（VPN、翻墙等）
      2. 违法内容
      3. 垃圾信息
      
      返回JSON：
      {
        "safe": true/false,
        "issues": ["..."],
        "severity": "high/medium/low",
        "suggestions": ["..."]
      }
    `
    
    const result = await model.generateContent(prompt)
    return JSON.parse(result.response.text())
  }
}
```

---

## 数据库Schema (Supabase)

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ
);

-- 邀请码表
CREATE TABLE invite_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  email TEXT,
  created_by UUID REFERENCES users(id),
  used_by UUID REFERENCES users(id),
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 订阅表
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  plan TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 审计日志表
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 实时指标表（自动过期）
CREATE TABLE realtime_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_type TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建自动删除旧数据的函数
CREATE OR REPLACE FUNCTION delete_old_realtime_metrics()
RETURNS void AS $$
BEGIN
  DELETE FROM realtime_metrics
  WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- 每日执行清理
SELECT cron.schedule('delete-old-metrics', '0 2 * * *', 'SELECT delete_old_realtime_metrics()');
```

---

## 部署配置

### 环境变量

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Google AI (2025.10)
GOOGLE_AI_API_KEY=xxx

# Admin Security
ADMIN_IP_WHITELIST=1.2.3.4,5.6.7.8
ADMIN_2FA_REQUIRED=true

# S3 for Archive (Cloudflare R2)
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=oece-archives
```

---

## 实施清单

```
□ 创建Admin路由结构
□ 集成Supabase数据库
□ 实现多层认证
□ 配置RLS策略
□ 审计日志系统
□ 实时数据dashboard
□ 归档数据系统
□ Google AI集成
□ 内容审核
□ 安全监控
□ 备份策略
```

---

**Admin系统完成！**

**核心特性**:
- Supabase免费数据库
- Google Gemini 2.0 AI
- 实时+归档双层数据
- 多层安全防护
- 智能分析洞察
- 完整审计日志

**下一步**: 开始实现Admin页面 🔐
