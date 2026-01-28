# 🎨 Mini Gemini Chat Templates

欢迎使用 Mini Gemini！我创建了两套超级漂亮的 ChatGPT 风格聊天界面模板。

## ✨ 模板介绍

### 1️⃣ 经典风格 - Classic Chat Template
**路由**: `/dashboard/tools/chat`

仿照 ChatGPT 的经典设计，简洁而专业。

#### 特性：
- 📂 **左侧边栏**
  - 聊天历史管理
  - 创建新对话
  - 删除旧对话
  - 设置面板

- 💬 **消息显示**
  - 清晰的用户/AI消息区分
  - 圆润的消息气泡
  - 流畅的动画效果
  - 自动滚动到最新消息

- 🎯 **建议卡片**
  - Emoji 图标点缀
  - 快速开始对话
  - 4个精选提示词

- ⌨️ **输入框**
  - 自适应高度
  - Enter 发送，Shift+Enter 换行
  - 发送按钮动态状态

#### 界面预览：
```
┌─────────────┬──────────────────────────────────┐
│  [新对话]   │                                  │
│             │         Mini Gemini Chat         │
│ 历史记录    │     How can I help you today?    │
│ ├ 对话1     │                                  │
│ ├ 对话2     │    [💡]  [🎨]  [💻]  [📚]       │
│ └ 对话3     │                                  │
│             │                                  │
│ [设置]      │    [输入消息...]    [发送]      │
└─────────────┴──────────────────────────────────┘
```

---

### 2️⃣ 渐变风格 - Gradient Chat Template
**路由**: `/dashboard/tools/chat-gradient`

充满活力的现代设计，带有动画背景和炫酷渐变效果。

#### 特性：
- 🌈 **动态背景**
  - 3个彩色圆球漂浮动画
  - 柔和的模糊效果
  - 混合模式叠加

- 🎯 **能力展示卡片**
  - 6个功能分类卡片
  - 渐变图标背景
  - Hover 悬浮动画
  - 功能：代码生成、创意想法、学习、内容创作、问题解决、创意写作

- 💫 **消息动画**
  - 弹簧物理动画
  - 渐变头像光晕
  - 用户消息渐变背景
  - AI消息卡片阴影

- ⚡ **加载动画**
  - 3个彩色圆点跳动
  - 渐变颜色过渡
  - 平滑的动画效果

- 🎨 **输入框特效**
  - 外发光渐变效果
  - 渐变发送按钮
  - Hover 放大动画
  - 大号圆角设计

#### 界面预览：
```
┌──────────────────────────────────────────────┐
│        ✨                                    │
│     Mini Gemini                              │
│  Your AI-powered creative assistant          │
│                                              │
│  [💻 Code]  [💡 Ideas]  [📚 Learning]       │
│  [🎨 Content] [⚡ Problem] [🎵 Writing]      │
│                                              │
│  Try: [Prompt 1] [Prompt 2] [Prompt 3]      │
│                                              │
│  ╭─────────────────────────────────────╮    │
│  │  Ask me anything...          [✈️]  │    │
│  ╰─────────────────────────────────────╯    │
└──────────────────────────────────────────────┘
```

---

## 🚀 使用方法

### 访问模板

1. **经典风格**：
   ```
   http://localhost:3000/dashboard/tools/chat
   ```

2. **渐变风格**：
   ```
   http://localhost:3000/dashboard/tools/chat-gradient
   ```

### API 配置

确保在 `.env.local` 文件中配置了 Gemini API Key：

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 开始使用

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问聊天界面
# 经典风格: http://localhost:3000/dashboard/tools/chat
# 渐变风格: http://localhost:3000/dashboard/tools/chat-gradient
```

---

## 🎯 功能特点对比

| 特性 | 经典风格 | 渐变风格 |
|------|---------|---------|
| 侧边栏 | ✅ | ❌ |
| 聊天历史 | ✅ | ❌ |
| 动画背景 | ❌ | ✅ |
| 能力展示 | 简单 | 详细 |
| 颜色风格 | 简洁单色 | 多彩渐变 |
| 适用场景 | 专业办公 | 创意展示 |

---

## 🛠️ 技术栈

- **框架**: Next.js 15 + React 19
- **UI组件**: shadcn/ui + Radix UI
- **动画**: Framer Motion
- **样式**: Tailwind CSS
- **AI**: Google Gemini API
- **类型**: TypeScript

---

## 📝 代码结构

```
app/
├── (dashboard)/
│   └── dashboard/
│       └── tools/
│           ├── chat/              # 经典风格模板
│           │   └── page.tsx
│           └── chat-gradient/     # 渐变风格模板
│               └── page.tsx
└── api/
    └── chat/
        └── gemini/                # Gemini API 路由
            └── route.ts

lib/
└── gemini.ts                      # Gemini 客户端配置
```

---

## 🎨 自定义建议

### 修改颜色主题

**经典风格** - 在 `chat/page.tsx` 中修改：
```typescript
// 修改AI头像渐变
from-purple-500 to-pink-500

// 修改用户头像渐变  
from-blue-500 to-cyan-500
```

**渐变风格** - 在 `chat-gradient/page.tsx` 中修改：
```typescript
// 修改主渐变色
from-purple-500 via-pink-500 to-yellow-500

// 修改能力卡片渐变
capabilities 数组中的 gradient 属性
```

### 添加新功能

1. **建议提示词**: 修改 `promptSuggestions` 或 `quickPrompts` 数组
2. **能力卡片**: 修改 `capabilities` 数组
3. **动画效果**: 调整 Framer Motion 的 `transition` 参数

---

## 🚀 部署建议

### Vercel (推荐)
```bash
# 连接 GitHub 仓库自动部署
vercel --prod
```

### 环境变量
生产环境需要配置：
- `GEMINI_API_KEY`: Gemini API密钥
- `NEXT_PUBLIC_FIREBASE_*`: Firebase配置（如需要）

---

## 💡 使用场景

### 经典风格适合：
- 🏢 企业内部工具
- 📊 数据分析助手
- 💼 专业咨询服务
- 📝 文档生成工具

### 渐变风格适合：
- 🎨 创意设计平台
- 🎮 游戏互动体验
- 🌟 产品展示页面
- 🚀 创业项目演示

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 🎉 享受你的 Mini Gemini！

哈哈哈哈哈，现在你有两套超级漂亮的聊天界面啦！选一个你最喜欢的开始使用吧！🚀

有任何问题随时联系我~ 😊
