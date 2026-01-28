# 🚀 快速开始 Mini Gemini

## 一键启动

```bash
# 1. 安装依赖（首次使用）
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 添加你的 GEMINI_API_KEY

# 3. 启动开发服务器
npm run dev
```

## 访问聊天界面

服务器启动后，在浏览器中打开：

### 🎨 经典风格（推荐用于办公）
```
http://localhost:3000/dashboard/tools/chat
```
- 有侧边栏，可以管理多个对话
- 简洁专业的界面
- 适合长时间使用

### 🌈 渐变风格（推荐用于展示）
```
http://localhost:3000/dashboard/tools/chat-gradient
```
- 炫酷的动画效果
- 彩色渐变设计
- 适合产品演示

## 🎯 快速测试提示词

复制以下任意一个，粘贴到聊天框试试：

```
帮我写一首关于春天的诗
```

```
用 Python 写一个快速排序算法
```

```
解释一下什么是机器学习
```

```
给我5个创意的博客文章标题
```

## ⚙️ 环境变量配置

在 `.env.local` 文件中需要配置：

```env
# 必需 - Gemini API Key
GEMINI_API_KEY=your_api_key_here

# 可选 - Firebase配置（如果需要用户系统）
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# 可选 - Stripe配置（如果需要支付功能）
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## 🎨 修改主题色

### 经典风格
编辑 `app/(dashboard)/dashboard/tools/chat/page.tsx`:

```typescript
// AI 头像颜色
from-purple-500 to-pink-500 
→ 改成你喜欢的颜色

// 用户头像颜色  
from-blue-500 to-cyan-500
→ 改成你喜欢的颜色
```

### 渐变风格
编辑 `app/(dashboard)/dashboard/tools/chat-gradient/page.tsx`:

```typescript
// 主Logo和按钮
from-purple-500 via-pink-500 to-yellow-500
→ 改成你的品牌色

// 背景漂浮球
bg-purple-500, bg-yellow-500, bg-pink-500
→ 改成你喜欢的颜色
```

## 🐛 常见问题

### Q: 提示 "Failed to send message"
A: 检查 GEMINI_API_KEY 是否正确配置

### Q: 页面打不开
A: 确保运行了 `npm run dev` 且没有端口冲突

### Q: 样式不对
A: 清除缓存后重启：
```bash
rm -rf .next
npm run dev
```

### Q: 想要暗色/亮色主题
A: 点击右上角的主题切换按钮 🌙/☀️

## 📱 移动端支持

两套模板都支持响应式设计，可以在手机上使用！

## 🎉 开始享受吧！

现在打开浏览器，开始和你的 Mini Gemini 聊天吧！

哈哈哈哈哈 🚀✨
