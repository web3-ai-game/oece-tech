# 新架构设计 - 邀请制社区

## 核心策略：暗黑引流 + 邀请制

```
从小红书暗黑引流 → 落地页获取邀请码 → 注册加入 → 用户面板
```

---

## 三大页面架构

### 1. 落地页 (Landing Page)
**路径**: `/`
**目的**: x.ai风格，发放邀请码，吸引注册

```
设计风格:
- Web3 像素赛博朋克
- 简约大气
- 霓虹绿+深色
- 极简主义

核心内容:
- Hero: 一句Slogan
- 邀请码获取表单
- 立即注册CTA
- 零SEO，无敏感词
```

### 2. 用户面板 (Dashboard)
**路径**: `/dashboard`
**目的**: 用户登录后的控制中心

```
功能模块:
- 个人信息（左上角悬浮）
- 传送门状态（VPN → 传送门）
- 任务进度
- 装备库（工具下载）
- 探险记录（学习历史）
- 社区入口
```

### 3. 论坛/社区 (Community)
**路径**: `/community`
**目的**: 当前设计保留，游戏化论坛

```
板块:
- 新手村
- 探险者公会
- 装备交流
- 通关心得
- 任务发布
```

---

## 落地页设计 (x.ai风格)

### Hero Section

```tsx
// 极简Hero
<section className="min-h-screen flex items-center justify-center bg-[#0D0221]">
  <div className="text-center max-w-4xl px-4">
    {/* Logo */}
    <div className="mb-8">
      <h1 className="text-6xl font-bold tracking-wider" 
          style={{
            background: 'linear-gradient(135deg, #05FFA1, #01CDFE, #FF71CE)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
        OECE
      </h1>
    </div>
    
    {/* Slogan */}
    <p className="text-4xl text-[#FFFB96] mb-4 font-['VT323']">
      数字世界的传送门
    </p>
    <p className="text-xl text-[#B967FF] mb-12">
      探索 · 学习 · 自由
    </p>
    
    {/* CTA */}
    <div className="flex gap-4 justify-center">
      <button className="pixel-button-large">
        获取邀请码
      </button>
      <button className="pixel-button-outline-large">
        立即注册
      </button>
    </div>
  </div>
</section>
```

### 特点展示（3列）

```tsx
<section className="py-20 bg-[#1A0E2E]">
  <div className="container mx-auto px-4">
    <div className="grid md:grid-cols-3 gap-8">
      {[
        { title: '传送门技术', desc: '解锁全球地图' },
        { title: '技能变现', desc: '月入$3000+' },
        { title: '探险者社区', desc: '1000+活跃成员' }
      ].map((item, i) => (
        <div key={i} className="cyber-card text-center">
          <h3 className="text-2xl text-[#05FFA1] mb-4">{item.title}</h3>
          <p className="text-[#FFFB96]">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

### 邀请码获取表单

```tsx
<section className="py-20 bg-[#0D0221]">
  <div className="max-w-md mx-auto px-4">
    <div className="cyber-window p-8">
      <h2 className="text-2xl text-[#01CDFE] mb-6 text-center">
        申请邀请码
      </h2>
      
      <form className="space-y-4">
        <input
          type="email"
          placeholder="邮箱地址"
          className="cyber-input w-full"
          required
        />
        
        <select className="cyber-input w-full">
          <option>我想学习传送门技术</option>
          <option>我想快速赚钱</option>
          <option>我想成为数字游民</option>
        </select>
        
        <button type="submit" className="pixel-button w-full">
          获取邀请码
        </button>
      </form>
      
      <p className="text-xs text-[#808080] text-center mt-4">
        已有邀请码？
        <a href="/auth/register" className="text-[#05FFA1] ml-1">
          立即注册
        </a>
      </p>
    </div>
  </div>
</section>
```

---

## 用户面板设计

### 顶部导航栏

```tsx
<nav className="h-16 bg-[#1A0E2E] border-b-2 border-[#05FFA1] flex items-center px-6">
  {/* Logo */}
  <div className="text-2xl font-bold text-[#05FFA1]">OECE</div>
  
  {/* 导航 */}
  <div className="flex gap-6 ml-12">
    <NavLink href="/dashboard">控制台</NavLink>
    <NavLink href="/tutorials">任务</NavLink>
    <NavLink href="/tools">装备库</NavLink>
    <NavLink href="/community">公会</NavLink>
  </div>
  
  {/* 右侧用户区 */}
  <div className="ml-auto flex items-center gap-4">
    {/* 等级 */}
    <div className="text-[#FFFB96]">Lv.12</div>
    
    {/* 用户头像（左上角悬浮区域）*/}
    <div className="relative">
      <button className="w-10 h-10 rounded-full bg-[#2D1B3D] border-2 border-[#05FFA1] overflow-hidden">
        <img src="/avatar.png" alt="User" />
      </button>
      
      {/* 下拉菜单 */}
      <div className="absolute right-0 top-12 w-48 bg-[#1A0E2E] border-2 border-[#05FFA1] hidden group-hover:block">
        <a href="/profile" className="block px-4 py-2 hover:bg-[#2D1B3D]">
          个人信息
        </a>
        <a href="/settings" className="block px-4 py-2 hover:bg-[#2D1B3D]">
          设置
        </a>
        <button className="block w-full text-left px-4 py-2 hover:bg-[#2D1B3D]">
          退出
        </button>
      </div>
    </div>
  </div>
</nav>
```

### Dashboard主体

```tsx
<div className="min-h-screen bg-[#0D0221] p-6">
  <div className="grid grid-cols-12 gap-6">
    {/* 左侧：状态卡片 */}
    <div className="col-span-3 space-y-6">
      {/* 传送门状态 */}
      <div className="cyber-card">
        <h3 className="text-[#05FFA1] mb-4">传送门状态</h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#05FFA1] animate-pulse" />
          <span className="text-[#FFFB96]">已激活</span>
        </div>
        <div className="mt-4 text-sm text-[#808080]">
          传送点: 东京据点
          <br />
          延迟: 45ms
        </div>
      </div>
      
      {/* 等级进度 */}
      <div className="cyber-card">
        <h3 className="text-[#01CDFE] mb-4">探险者等级</h3>
        <div className="text-3xl text-[#FFFB96] mb-2">Lv.12</div>
        <div className="w-full bg-[#2D1B3D] h-2 rounded">
          <div className="bg-[#05FFA1] h-2 rounded" style={{ width: '67%' }} />
        </div>
        <p className="text-xs text-[#808080] mt-2">
          距离下一级还需 3300 经验
        </p>
      </div>
      
      {/* 快速操作 */}
      <div className="cyber-card">
        <h3 className="text-[#FF71CE] mb-4">快速操作</h3>
        <div className="space-y-2">
          <button className="w-full pixel-button-sm">激活传送</button>
          <button className="w-full pixel-button-sm">下载装备</button>
          <button className="w-full pixel-button-sm">加入公会</button>
        </div>
      </div>
    </div>
    
    {/* 中间：实时数据 */}
    <div className="col-span-6">
      {/* 标题 */}
      <h2 className="text-3xl text-[#FFFB96] mb-6 font-['VT323']">
        探险控制台
      </h2>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: '完成任务', value: '23', icon: '✓' },
          { label: '探索天数', value: '45', icon: '📅' },
          { label: '获得装备', value: '12', icon: '🎒' },
          { label: '社区贡献', value: '89', icon: '⭐' }
        ].map((stat, i) => (
          <div key={i} className="cyber-card text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl text-[#05FFA1]">{stat.value}</div>
            <div className="text-xs text-[#808080]">{stat.label}</div>
          </div>
        ))}
      </div>
      
      {/* 进行中的任务 */}
      <div className="cyber-card mb-6">
        <h3 className="text-[#01CDFE] mb-4">进行中的任务</h3>
        <div className="space-y-3">
          {[
            { name: '建立第一个传送据点', progress: 75 },
            { name: '解锁Google大陆', progress: 100 },
            { name: '配置光速隧道', progress: 30 }
          ].map((task, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#FFFB96]">{task.name}</span>
                <span className="text-[#05FFA1]">{task.progress}%</span>
              </div>
              <div className="w-full bg-[#2D1B3D] h-2 rounded">
                <div 
                  className="bg-[#05FFA1] h-2 rounded" 
                  style={{ width: `${task.progress}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 最新消息 */}
      <div className="cyber-card">
        <h3 className="text-[#FF71CE] mb-4">探险者公会</h3>
        <div className="space-y-2 text-sm">
          <div className="p-2 bg-[#1A0E2E] rounded">
            <span className="text-[#05FFA1]">小李</span>
            <span className="text-[#808080] mx-2">刚刚</span>
            <span className="text-[#FFFB96]">完成了传送门搭建任务</span>
          </div>
          <div className="p-2 bg-[#1A0E2E] rounded">
            <span className="text-[#01CDFE]">张三</span>
            <span className="text-[#808080] mx-2">5分钟前</span>
            <span className="text-[#FFFB96]">分享了新的装备包</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* 右侧：推荐和帮助 */}
    <div className="col-span-3 space-y-6">
      {/* 推荐任务 */}
      <div className="cyber-card">
        <h3 className="text-[#05FFA1] mb-4">推荐任务</h3>
        <div className="space-y-3">
          {[
            { name: '传送门进阶', level: 'Lv.10' },
            { name: '多据点管理', level: 'Lv.15' },
            { name: '隐身大师', level: 'Lv.20' }
          ].map((task, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="text-[#FFFB96]">{task.name}</span>
              <span className="text-[#808080]">{task.level}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* 帮助 */}
      <div className="cyber-card">
        <h3 className="text-[#01CDFE] mb-4">需要帮助？</h3>
        <div className="space-y-2">
          <a href="/guide" className="block text-[#FFFB96] hover:text-[#05FFA1] text-sm">
            新手指南
          </a>
          <a href="/faq" className="block text-[#FFFB96] hover:text-[#05FFA1] text-sm">
            常见问题
          </a>
          <a href="/community" className="block text-[#FFFB96] hover:text-[#05FFA1] text-sm">
            加入公会
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## 小红书暗黑引流策略

### 内容策略

```
禁止使用:
❌ VPN
❌ 翻墙
❌ 科学上网
❌ 代理
❌ 任何直接敏感词

使用:
✅ 数字游民生活
✅ 远程工作技巧
✅ 跨境电商工具
✅ 独立开发者成长
✅ 技术变现路径
✅ 全球自由职业

话术示例:
"想要探索全球市场？加入我们的探险者社区"
"从0到月入$3000的完整路径"
"1000+数字游民的秘密基地"
```

### 引流路径

```
小红书笔记 
    ↓
个人简介放落地页链接
    ↓
落地页申请邀请码
    ↓
邮件发送邀请码
    ↓
注册加入社区
    ↓
用户面板开始探险
```

### 小红书内容模板

```
标题: 《我是如何在3个月内实现远程工作自由的》

内容:
分享一下我的经历...
（不提任何敏感词）
（只讲故事和结果）

最后一句:
"想了解完整路径？点击主页链接加入探险者社区"
```

---

## 完全脱敏的新术语

### 全部替换

```
服务 → 装备
工具 → 道具
教程 → 任务
用户 → 探险者
注册 → 加入
登录 → 进入世界
订阅 → 装备包
下载 → 获取
配置 → 部署
连接 → 传送
服务器 → 据点
节点 → 传送点
速度 → 传送速度
稳定 → 稳固
延迟 → 传送时间
```

### UI文案

```
不说: "VPN连接成功"
改说: "传送门已激活"

不说: "选择服务器"
改说: "选择传送点"

不说: "订阅套餐"
改说: "获取装备包"

不说: "网络加速"
改说: "传送加速"
```

---

## 注册流程

```
1. 落地页获取邀请码
   ↓
2. 填写注册信息
   - 邀请码
   - 邮箱
   - 用户名
   - 密码
   ↓
3. 邮箱验证
   ↓
4. 自动登录
   ↓
5. 跳转到 /dashboard
   ↓
6. 显示新手引导
```

---

## 技术实现

### 路由结构

```
/                  → 落地页（x.ai风格）
/invite            → 邀请码申请页
/auth/register     → 注册页
/auth/login        → 登录页
/dashboard         → 用户面板
/tutorials         → 任务列表
/tools             → 装备库
/community         → 论坛（现有设计）
/profile           → 个人信息
/settings          → 设置
```

### 邀请码系统

```typescript
// lib/invite-code.ts
export async function generateInviteCode(email: string): Promise<string> {
  // 生成6位邀请码
  const code = Math.random().toString(36).substring(2, 8).toUpperCase()
  
  // 存入数据库
  await db.inviteCode.create({
    code,
    email,
    used: false,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天
  })
  
  // 发送邮件
  await sendInviteEmail(email, code)
  
  return code
}
```

---

## CSS样式

```css
/* 赛博朋克卡片 */
.cyber-card {
  background: #1A0E2E;
  border: 2px solid #05FFA1;
  padding: 1.5rem;
  position: relative;
}

.cyber-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(5, 255, 161, 0.1));
  pointer-events: none;
}

/* 像素按钮（大） */
.pixel-button-large {
  padding: 16px 48px;
  background: #05FFA1;
  color: #0D0221;
  font-family: 'VT323', monospace;
  font-size: 24px;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
}

.pixel-button-large:hover {
  box-shadow: 0 0 30px #05FFA1;
  transform: translateY(-2px);
}

/* 赛博输入框 */
.cyber-input {
  background: #2D1B3D;
  border: 2px solid #05FFA1;
  color: #FFFB96;
  padding: 12px;
  font-family: 'VT323', monospace;
  font-size: 18px;
}

.cyber-input:focus {
  outline: none;
  box-shadow: 0 0 20px rgba(5, 255, 161, 0.5);
}
```

---

## 实施清单

```
□ 创建落地页（x.ai风格）
□ 创建用户面板
□ 邀请码系统
□ 注册流程
□ 更新所有文案（脱敏）
□ 小红书引流内容
□ 邮件模板
□ 新手引导
□ 论坛保留并游戏化
```

---

**新架构完成！**

**核心特点**:
- x.ai风格极简落地页
- 专业用户面板
- 邀请制社区
- 完全脱敏
- 暗黑引流策略
- 零SEO

**下一步**: 开始实现各个页面 🚀
