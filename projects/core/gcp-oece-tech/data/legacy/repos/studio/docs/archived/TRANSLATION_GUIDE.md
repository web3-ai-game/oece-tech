# 翻译系统使用指南

## 概述
项目使用简单的自定义翻译系统，不依赖 next-intl，支持 **英文（EN）** 和 **繁体中文（zh-TW）**。

## 快速使用

### 1. 在客户端组件中使用翻译

```tsx
'use client';

import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';

export default function MyComponent() {
  const { locale } = useLocale();  // 获取当前语言
  const t = translations[locale];  // 获取翻译对象
  
  return (
    <div>
      <h1>{t.articleCollection}</h1>
      <button>{t.more}</button>
    </div>
  );
}
```

### 2. 添加新的翻译键

编辑 `/src/lib/translations.ts`:

```typescript
export const translations = {
  en: {
    // 添加新键
    myNewKey: 'My New Text',
    anotherKey: 'Another Text',
  },
  
  'zh-TW': {
    // 对应的繁体中文翻译
    myNewKey: '我的新文本',
    anotherKey: '另一個文本',
  },
};
```

### 3. 切换语言

Header 组件中已包含语言切换按钮：
- 点击 "繁" → 切换到繁体中文
- 点击 "Eng" → 切换到英文

语言选择会保存在 Cookie 中，页面刷新后保持不变。

## 当前已定义的翻译键

```typescript
// 通用
brand         // 'DeepWeay'
tagline       // 'Deep Dive into Digital Nomad 2.0'
slogan        // 'Negotiate with physical distance and time'

// 导航
home          // 'Home' / '首頁'
articles      // 'Articles' / '文章'
aiTools       // 'AI Tools' / 'AI 工具'
forum         // 'Forum' / '論壇'
login         // 'Login' / '登入'
dashboard     // 'Dashboard' / '儀表板'

// 首页
articleCollection  // 'Article Collection' / '文章精選'
more              // 'More' / '更多'

// 卡片
proMembership     // 'PRO Membership' / 'PRO 會員'
proDescription    // 'Unlock AI tools...'
upgradeToPro      // 'Upgrade to PRO' / '升級至 PRO'
bbsCommunity      // 'BBS Community' / 'BBS 社群'
bbsDescription    // 'Join discussions...'
exploreForum      // 'Explore Forum' / '探索論壇'
aiToolsPreview    // 'AI Tools' / 'AI 工具'
aiToolsDescription // 'AI-powered travel...'
viewAllTools      // 'View All Tools' / '查看所有工具'

// Footer
connect       // 'Connect' / '連結'
navigation    // 'Navigation' / '導航'
links         // 'Links' / '友情連結'
```

## 示例

### 按钮组件
```tsx
<Button>
  {t.upgradeToPro}  {/* 自动根据语言显示 */}
</Button>
```

### 标题
```tsx
<h2>{t.articleCollection}</h2>
```

### 链接
```tsx
<Link href="/articles">
  {t.more} &gt;&gt;
</Link>
```

## 注意事项

1. **只在客户端组件使用** - 必须有 `'use client'` 声明
2. **TypeScript 类型安全** - 所有翻译键都有类型检查
3. **默认语言** - 英文（EN）
4. **禁用 Google 翻译** - 已全局设置 `translate="no"`

## 架构

```
/src
  /contexts
    locale-context.tsx   # 语言上下文 Provider
  /lib
    translations.ts      # 翻译定义文件
  /app
    layout.tsx          # 包含 LocaleProvider
  /components/common
    header.tsx          # 包含语言切换按钮
```

## 后续开发

1. 添加新页面时：引入 `useLocale` 和 `translations`
2. 添加新文案时：在 `translations.ts` 中同时添加 EN 和 zh-TW
3. 测试翻译：点击 Header 中的语言切换按钮验证

**翻译系统已完全集成，可以正常开发了！** ✅
