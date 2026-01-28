# 🚀 OECE.TECH 实现指南

## ✅ 核心定位（已确认）

**教程聚合平台 + 积分众包 + 社区讨论**

---

## 📦 已完成的工作

### 1. 核心文件

#### 首页设计
- ✅ `app/page-tutorial-hub.tsx` - 教程聚合平台首页
  - 10大教程分类
  - 积分系统说明
  - 繁体中文为主

#### 多语言系统
- ✅ `lib/i18n.ts` - 繁体中文 + 英文翻译
  - 完整翻译字典
  - useTranslation Hook
  - 自动语言检测

#### Notion集成
- ✅ `lib/notion.ts` - 教程数据源
  - 从Notion读取教程
  - Markdown转换
  - 浏览量/点赞统计

#### 语言切换
- ✅ `components/LanguageSwitcher.tsx` - 语言切换组件
  - 繁体/英文切换
  - LocalStorage保存
  - 自动检测浏览器语言

#### 设计文档
- ✅ `CORRECT-POSITIONING.md` - 正确定位说明

---

## 🔧 实现步骤

### Phase 1: 启用新首页（5分钟）

```bash
# 1. 备份原首页
mv app/page.tsx app/page-old.tsx

# 2. 启用教程聚合首页
mv app/page-tutorial-hub.tsx app/page.tsx

# 3. 查看效果
npm run dev
```

---

### Phase 2: 配置Notion集成（30分钟）

#### 1. 创建Notion Integration

访问: https://www.notion.so/my-integrations

1. 点击 "New integration"
2. 填写信息:
   - Name: OECE Tutorial Hub
   - Logo: 上传Logo
   - Associated workspace: 选择你的workspace
3. 保存并复制 "Internal Integration Token"

#### 2. 创建Notion Database

在Notion中创建新的Database，包含以下字段:

```
必需字段:
├── Title (标题) - Title
├── TitleEN (英文标题) - Text
├── Category (分类) - Select
├── Difficulty (难度) - Select [easy, medium, hard, hell]
├── Published (发布) - Checkbox
├── Verified (认证) - Checkbox
├── Points (积分) - Number
├── Views (浏览) - Number
├── Likes (点赞) - Number
├── Author (作者) - Text
├── Description (描述) - Text
├── DescriptionEN (英文描述) - Text
├── Tags (标签) - Multi-select
├── CreatedAt (创建时间) - Date
├── UpdatedAt (更新时间) - Date
└── EstimatedTime (预计时间) - Text

分类选项:
- getting-started
- vpn-tech
- social-engineering
- kali-linux
- anonymity
- ssh-remote
- hardware
- anti-tracking
- virtual-env
- avoid-pitfalls
```

#### 3. 分享Database给Integration

1. 打开Database
2. 点击右上角 "..." → "Add connections"
3. 选择你创建的Integration
4. 复制Database ID（URL中的一串字符）

#### 4. 配置环境变量

创建 `.env.local`:

```bash
# Notion API
NOTION_API_KEY=secret_your_integration_token_here
NOTION_DATABASE_ID=your_database_id_here

# 其他配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### 5. 安装Notion SDK

```bash
npm install @notionhq/client
```

---

### Phase 3: 添加语言切换到Header（15分钟）

编辑 `components/layout/Header.tsx`:

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

// 在Header右侧导航添加语言切换
<div className="flex items-center gap-4">
  <LanguageSwitcher />
  {/* 其他导航项 */}
</div>
```

---

### Phase 4: 创建教程列表页（1小时）

创建 `app/tutorials/page.tsx`:

```tsx
import { getTutorials, categories } from '@/lib/notion'
import { TutorialCard } from '@/components/TutorialCard'

export default async function TutorialsPage() {
  const tutorials = await getTutorials()
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1>所有教程</h1>
      
      {/* 分类筛选 */}
      <div className="flex gap-2 mb-8">
        {categories.map(cat => (
          <button key={cat.id}>
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>
      
      {/* 教程列表 */}
      <div className="grid md:grid-cols-3 gap-6">
        {tutorials.map(tutorial => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </div>
    </div>
  )
}
```

---

### Phase 5: 创建教程详情页（1小时）

创建 `app/tutorials/[id]/page.tsx`:

```tsx
import { getTutorial, incrementViews } from '@/lib/notion'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

export default async function TutorialPage({ params }: { params: { id: string } }) {
  const tutorial = await getTutorial(params.id)
  
  if (!tutorial) {
    notFound()
  }
  
  // 增加浏览量
  await incrementViews(params.id)
  
  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      {/* 封面图 */}
      {tutorial.coverImage && (
        <img src={tutorial.coverImage} alt={tutorial.title} />
      )}
      
      {/* 标题 */}
      <h1>{tutorial.title}</h1>
      
      {/* 元数据 */}
      <div className="flex items-center gap-4">
        <span>{tutorial.category}</span>
        <span>{tutorial.difficulty}</span>
        <span>{tutorial.views} 浏览</span>
        <span>{tutorial.likes} 点赞</span>
      </div>
      
      {/* 内容 */}
      <ReactMarkdown>{tutorial.content}</ReactMarkdown>
    </article>
  )
}
```

---

### Phase 6: 在Notion中创建教程（持续）

#### 教程模板

在Notion中创建新页面，使用以下结构:

```markdown
# 教程标题

## 简介
简要说明教程内容

## 前置要求
- 要求1
- 要求2

## 步骤1: XXX
详细说明...

## 步骤2: XXX
详细说明...

## 常见问题
Q: 问题1?
A: 回答1

## 总结
总结教程要点
```

#### 填写字段
- Title: 教程标题
- TitleEN: Tutorial Title (可用Notion AI翻译)
- Category: 选择分类
- Difficulty: 选择难度
- Published: ✓ (勾选后才会显示)
- Verified: ✓ (认证教程)
- Points: 解锁所需积分（免费=0）
- Author: 你的名字
- Description: 简短描述
- DescriptionEN: Short description

#### 使用Notion AI润色
1. 选中文本
2. 点击 "Ask AI"
3. 选择 "Improve writing" 或 "Translate"

---

## 🎯 教程内容规划

### 已规划的30+教程

#### 1. 出海第一步 (8篇)
- [ ] Google邮箱注册完整指南
- [ ] 数字世界匿名化入门
- [ ] 国外服务注册技巧
- [ ] 支付方式选择指南
- [ ] 隐私邮箱对比
- [ ] 虚拟手机号获取
- [ ] 出海必备工具清单
- [ ] 新手常见问题FAQ

#### 2. VPN/SS技术 (6篇)
- [ ] VPN基础原理详解
- [ ] SS/SSR协议对比
- [ ] V2Ray完整配置教程
- [ ] 不同网络环境配置VPS
- [ ] 自建VPN服务器
- [ ] 速度优化技巧

#### 3. 社会工程学 (5篇)
- [ ] 信息收集基础
- [ ] OSINT工具使用
- [ ] 社工防范指南
- [ ] 数字足迹清理
- [ ] 隐私保护实战

#### 4. Kali Linux (4篇)
- [ ] Kali环境搭建
- [ ] 常用渗透工具
- [ ] 网络安全实战案例
- [ ] 漏洞扫描技术

#### 5. 匿名化技术 (7篇)
- [ ] 软件匿名化处理
- [ ] 加密通信技巧
- [ ] Tor网络深度使用
- [ ] 隐私浏览器配置
- [ ] 匿名支付方案
- [ ] 数字身份管理
- [ ] PGP加密通信

#### 6. SSH/远程 (5篇)
- [ ] SSH安全配置
- [ ] 跳板机搭建
- [ ] 3389远程桌面
- [ ] 虚拟机技巧
- [ ] 端口转发实战

#### 7. 硬件改装 (3篇)
- [ ] 路由器刷机指南
- [ ] 硬件匿名化
- [ ] 防追踪硬件

#### 8. 反跟踪 (4篇) 🔥
- [ ] 反追踪技术原理
- [ ] 反侦察实战手段
- [ ] 虚拟身份构建
- [ ] 深度匿名终极方案

#### 9. 虚拟环境 (3篇)
- [ ] 完整虚拟环境搭建
- [ ] 沙盒测试平台
- [ ] 实验环境安全隔离

#### 10. 跳坑指南 (6篇)
- [ ] 新手十大常见错误
- [ ] VPN使用避坑指南
- [ ] 支付安全注意事项
- [ ] 账号安全最佳实践
- [ ] 故障排查方法论
- [ ] 应急处理预案

---

## 🔐 积分系统实现（Phase 7）

### 数据库表设计

```sql
-- 用户表
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  points INTEGER DEFAULT 100,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 积分交易表
CREATE TABLE point_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  reference_type VARCHAR(50),
  reference_id INTEGER,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 教程解锁记录
CREATE TABLE tutorial_unlocks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  tutorial_id VARCHAR(100) NOT NULL,
  points_spent INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, tutorial_id)
);
```

---

## 📝 待办清单

### 立即可做（本周）
- [ ] 启用新首页
- [ ] 配置Notion集成
- [ ] 添加语言切换到Header
- [ ] 创建第1篇教程测试

### 短期（2周内）
- [ ] 完成教程列表页
- [ ] 完成教程详情页
- [ ] 实现积分系统
- [ ] 创建10篇核心教程

### 中期（1月内）
- [ ] Google AdSense集成
- [ ] 用户注册系统
- [ ] 教程解锁功能
- [ ] 完成30篇教程

### 长期（3月内）
- [ ] 简化论坛功能
- [ ] 用户贡献教程
- [ ] 积分排行榜
- [ ] 移动端优化

---

## 🚀 快速启动

```bash
# 1. 安装依赖
npm install @notionhq/client react-markdown

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入Notion配置

# 3. 启用新首页
mv app/page.tsx app/page-old.tsx
mv app/page-tutorial-hub.tsx app/page.tsx

# 4. 启动开发服务器
npm run dev

# 5. 访问
open http://localhost:3000
```

---

**实现指南完成！按步骤操作即可！** 🎉📚🚀
