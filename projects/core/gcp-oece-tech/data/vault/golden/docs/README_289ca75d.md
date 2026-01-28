# 🎓 OECE - AI赋能教育培训平台

> 使用 Google Gemini 2.5 Flash 驱动的智能教育工具平台
> 
> Powered by Gemini 2.5 Flash - Fast, Affordable, Efficient

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

---

## 🌟 项目亮点

### 💰 超低成本
- **Gemini 2.5 Flash**: 每次请求仅 $0.001
- **比市场价低80%**: 成本优化至极致
- **免费试用**: 新用户注册即送 $5 额度

### ⚡ 极速响应
- **Flash模型**: 响应速度极快
- **优化架构**: 前端完全优化
- **多语言**: 5种语言无缝切换

### 🎨 现代化设计
- **3种页面风格**: 亮色官网 + 深色炫酷展示 + 简洁工具列表
- **Framer Motion动画**: 流畅的3D效果
- **完全响应式**: 桌面端/移动端完美适配

---

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，添加 NEXT_PUBLIC_GEMINI_API_KEY

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
# 首页:         http://localhost:3000
# 工具展示:     http://localhost:3000/tools-showcase
# 工具列表:     http://localhost:3000/tools
```

---

## 📁 项目结构

```
ai-tools-hub/
├── app/
│   ├── page.tsx                  # 首页（亮色主题）
│   ├── tools-showcase/           # 工具展示页（深色炫酷）⭐
│   ├── tools/                    # 工具列表（侧边栏）
│   ├── auth/                     # 认证系统
│   └── (dashboard)/              # Dashboard
├── config/                       # 配置文件 ⭐
│   ├── pricing.ts               # 定价配置
│   ├── gemini-personas.ts       # AI人格配置
│   └── translation.ts           # 翻译配置
├── components/                   # React组件
├── SYSTEM_CONFIG.md              # 系统配置文档 ⭐
├── PROJECT_SUMMARY.md            # 项目总结 ⭐
└── QUICK_START.md                # 快速启动指南 ⭐
```

---

## 💰 定价策略

### 工具定价
| 工具 | 价格 | 免费额度可用 |
|------|------|-------------|
| AI教学助手 | $0.001/次 | ~5000次 |
| AI图片生成 | $0.50/张 | ~10张 |
| 教案生成器 | $0.002/次 | ~2500次 |
| 测验生成器 | $0.001/题 | ~5000题 |

### 用户套餐
- **免费版**: $5 (注册即送)
- **基础版**: $20/月
- **专业版**: $100/月 (85折)
- **企业版**: 定制

---

## 🤖 6种AI人格

1. **教学助手** - 备课、答疑、学习指导
2. **教案专家** - 完整教案设计
3. **测评专家** - 题目生成、评分标准
4. **内容作家** - 博客、社媒、营销文案
5. **翻译专家** - 多语言精准翻译
6. **数据分析师** - 学习数据洞察

---

## 🌍 多语言支持

- 🇨🇳 简体中文
- 🇹🇼 繁体中文
- 🇺🇸 English
- 🇹🇭 ไทย (泰语)
- 🇲🇾 Bahasa Melayu (马来语)

---

## 📊 35+ AI工具

### 🎓 AI教学工具 (6个)
- AI教学助手、教案生成器、测验生成器...

### ✍️ 内容工厂 (6个)
- 文章生成、社媒文案、营销文案...

### 📈 SEO优化 (6个)
- 关键词研究、标题生成、描述优化...

### 📢 流量工厂 (6个)
- 短视频脚本、直播文案、电商详情页...

### 📊 数据分析 (4个)
- 学习分析、用户画像、趋势预测...

### 💡 创意工具 (3个)
- AI绘画、视频剪辑、音乐生成...

---

## 🛠️ 技术栈

- **框架**: Next.js 15 + React 19
- **语言**: TypeScript 5
- **样式**: TailwindCSS + shadcn/ui
- **动画**: Framer Motion
- **AI**: Google Gemini 2.5 Flash
- **认证**: Firebase Auth (计划)
- **支付**: Stripe (计划)

---

## 📚 文档

- [**系统配置文档**](./SYSTEM_CONFIG.md) - 完整配置说明
- [**项目总结**](./PROJECT_SUMMARY.md) - 完成情况总结
- [**快速启动**](./QUICK_START.md) - 快速上手指南
- [**路由指南**](./ROUTES_GUIDE.md) - 路由结构说明

---

## 📈 成本分析 (月度预估)

### 收入 (1000用户)
```
基础版 (300): $6,000
专业版 (150): $15,000
企业版 (50):  $25,000
总收入: $46,000
```

### 成本
```
AI调用: $4,000
服务器: $500
其他:   $500
总成本: $5,000
```

### 利润
```
净利润: $41,000
利润率: 89%
```

---

## 🚧 开发状态

- ✅ **前端完成** (95%)
- ✅ 所有页面UI
- ✅ 路由配置
- ✅ 配置文件
- ⏳ **后端集成** (0%)
- ⏳ Firebase Auth
- ⏳ Gemini API
- ⏳ Stripe支付

---

## 🔑 环境变量

```bash
# .env.local
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY=your_key_here
```

---

## 📞 联系方式

- **网站**: https://oece.tech (计划)
- **邮箱**: support@oece.tech
- **文档**: 查看项目中的Markdown文档

---

## 📄 许可证

MIT License - 查看 [LICENSE](./LICENSE)

---

<div align="center">

**用AI赋能教育，让学习更高效！**

Made with ❤️ by OECE Team

[系统文档](./SYSTEM_CONFIG.md) · [快速启动](./QUICK_START.md) · [项目总结](./PROJECT_SUMMARY.md)

**版本**: v1.0.0 | **更新**: 2025-01-05 | **状态**: ✅ 前端完成

</div>
