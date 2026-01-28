# ⏭️ DeepWeay 2.0 - 下一步行动计划

**当前状态**: 3个AI工具已完成  
**目标**: 本周完成基础设施 + 5个新工具

---

## 🎯 本周任务（Week 1）

### Day 1-2: i18n系统实现
```bash
# 创建i18n基础架构
src/lib/i18n/
├── config.ts
├── translations/
│   ├── en.json
│   └── zh-TW.json
├── provider.tsx
└── hooks.ts

# 重点：
- next-intl 或 next-i18next
- 语言切换持久化
- URL路由支持 (/en/, /zh-TW/)
- 翻译所有现有页面
```

### Day 3: Header/Footer组件
```bash
# Header功能
- Logo + 品牌名
- 语言切换器（EN/繁中）
- 用户菜单
- 响应式导航

# Footer功能
- 品牌信息
- 快速链接
- 社交媒体
- Copyright
```

### Day 4-7: 新增5个工具
1. **签证申请助手** - 表格填写AI指导
2. **个人税务计算器** - 多国税务对比
3. **Coworking地图** - 全球共享办公空间搜索
4. **机票价格预测** - 最佳购票时机
5. **国际医疗保险对比** - 数字游民专属保险

---

## 📂 文件结构规划

### 新增目录
```
src/
├── lib/
│   ├── i18n/              # 🆕 国际化系统
│   ├── gemini/            # ✅ 已完成
│   └── supabase/          # ✅ 已完成
├── components/
│   ├── layout/            # 🆕 布局组件
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── language-switcher.tsx
│   ├── tools/             # 🆕 工具模板
│   │   ├── tool-layout.tsx
│   │   ├── form-section.tsx
│   │   └── result-section.tsx
│   ├── ui/                # ✅ shadcn/ui
│   └── common/            # ✅ 已有
├── app/
│   ├── [locale]/          # 🆕 国际化路由
│   │   ├── (public)/
│   │   └── (authenticated)/
│   └── api/               # 🆕 API路由
│       └── tools/
└── templates/             # 🆕 工具模板
    └── ai-tool.tsx
```

---

## 🛠️ 技术选型

### i18n方案
**推荐**: `next-intl`
- Next.js 15 App Router原生支持
- TypeScript类型安全
- 服务端+客户端渲染
- 文件大小优化

```bash
npm install next-intl
```

### Header/Footer
- 使用现有 shadcn/ui 组件
- 添加 `DropdownMenu` 语言切换
- 响应式 `Sheet` 移动端菜单

### 工具开发模板
```typescript
// templates/ai-tool.tsx
export interface AIToolProps {
  title: string;
  description: string;
  category: ToolCategory;
  formSchema: z.ZodObject;
  aiFunction: (input: any) => Promise<any>;
  resultDisplay: (data: any) => JSX.Element;
}

export function AIToolTemplate({ ...props }: AIToolProps) {
  // 统一的工具模板
}
```

---

## 📊 本周目标

### 代码指标
- [ ] i18n覆盖率: 100%（所有UI文本）
- [ ] 新增组件: 5个（Header/Footer/LanguageSwitcher等）
- [ ] 新增工具: 5个
- [ ] 测试覆盖: 关键路径

### 用户体验
- [ ] 移动端优化完成
- [ ] 语言切换流畅(<1秒)
- [ ] AI响应时间<5秒
- [ ] 无明显bug

### 文档
- [ ] i18n使用文档
- [ ] 新工具使用指南
- [ ] API文档更新

---

## 💡 开发优先级

### P0 - 必须完成
1. i18n系统
2. Header语言切换
3. Footer品牌信息
4. 翻译现有3个工具

### P1 - 重要
5. 签证申请助手
6. 税务计算器
7. Coworking地图

### P2 - 可选
8. 机票价格预测
9. 医疗保险对比

---

## 🧪 测试计划

### 功能测试
- [ ] 语言切换正常
- [ ] 所有翻译显示正确
- [ ] Header/Footer在所有页面显示
- [ ] 5个新工具AI功能正常

### 性能测试
- [ ] 首屏加载<2秒
- [ ] 语言切换无闪烁
- [ ] AI请求并发处理

### 兼容性测试
- [ ] Chrome/Safari/Firefox
- [ ] iOS/Android
- [ ] 不同屏幕尺寸

---

## 📞 需要确认的问题

1. **i18n路由方案**：
   - 使用URL路径？ `/en/` vs `/zh-TW/`
   - 还是Cookie + Header？

2. **翻译内容优先级**：
   - 先翻译UI？
   - 还是先翻译工具结果？

3. **新工具数据源**：
   - Coworking数据从哪来？
   - 保险对比需要API？

---

## 🚀 开始开发！

### 命令速查
```bash
# 启动开发服务器
npm run dev

# 安装i18n
npm install next-intl

# 创建翻译文件
mkdir -p src/lib/i18n/translations
touch src/lib/i18n/translations/en.json
touch src/lib/i18n/translations/zh-TW.json

# 提交代码
git add -A
git commit -m "feat: add i18n system"
git push
```

---

**准备好了就开始吧！我们一步步来！** 🎯
