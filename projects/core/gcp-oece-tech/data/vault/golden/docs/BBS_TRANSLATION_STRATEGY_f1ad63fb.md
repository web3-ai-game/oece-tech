# BBS 论坛翻译策略

## 方案概述

BBS论坛内容分为**UI界面**和**用户生成内容（UGC）**两部分，需要不同的翻译策略。

---

## 1. UI 界面翻译（已实现）

### 静态UI元素
使用现有翻译系统 `/src/lib/translations.ts`：

```typescript
// 论坛相关翻译键
forumTitle: 'Forum' / '論壇'
newPost: 'New Post' / '發布新帖'
reply: 'Reply' / '回覆'
edit: 'Edit' / '編輯'
delete: 'Delete' / '刪除'
views: 'Views' / '瀏覽'
replies: 'Replies' / '回覆'
latestReply: 'Latest Reply' / '最新回覆'
```

### 实现方式
```tsx
'use client';
import { useLocale } from '@/contexts/locale-context';
import { translations } from '@/lib/translations';

const { locale } = useLocale();
const t = translations[locale];

<Button>{t.newPost}</Button>
```

---

## 2. 用户生成内容（UGC）翻译

### 策略A：双语显示（推荐）⭐

**适用场景：**
- 用户发帖时可选择语言（EN/繁中）
- 数据库存储原始语言标记
- 前端根据用户选择的界面语言显示对应内容

**数据库设计：**
```sql
-- BBS帖子表
CREATE TABLE bbs_posts (
  id UUID PRIMARY KEY,
  title_en TEXT,           -- 英文标题
  title_zh_tw TEXT,        -- 繁中标题
  content_en TEXT,         -- 英文内容
  content_zh_tw TEXT,      -- 繁中内容
  original_lang VARCHAR(10), -- 原始语言 'en' or 'zh-TW'
  created_at TIMESTAMP
);
```

**优点：**
- ✅ 无需AI翻译成本
- ✅ 翻译质量高（用户自己提供）
- ✅ 响应速度快
- ✅ 适合双语社群

**缺点：**
- ❌ 用户需要双语能力
- ❌ 数据库字段增多

---

### 策略B：AI实时翻译

**适用场景：**
- 用户只需用母语发帖
- 系统自动翻译为另一种语言
- 使用 Gemini 2.0 Flash Lite (翻译专用)

**实现方案：**

1. **发帖时翻译（推荐）**
   ```typescript
   // 用户发帖后，后台自动翻译
   async function createPost(content: string, originalLang: 'en' | 'zh-TW') {
     const translated = await translateText(content, originalLang);
     
     await supabase.from('bbs_posts').insert({
       content_original: content,
       content_translated: translated,
       original_lang: originalLang,
     });
   }
   ```

2. **阅读时翻译（按需）**
   ```typescript
   // 用户切换语言时才翻译
   const displayContent = locale === post.original_lang 
     ? post.content_original 
     : (post.content_translated || await translateOnDemand(post.content_original));
   ```

**API调用：**
```typescript
// src/lib/gemini-translator.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

export async function translateBBSPost(
  content: string, 
  from: 'en' | 'zh-TW', 
  to: 'en' | 'zh-TW'
) {
  const prompt = `Translate the following ${from} forum post to ${to}. Keep the tone casual and natural:\n\n${content}`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

**成本估算：**
- Gemini 2.0 Flash Lite: 1K次/天（免费）
- 适合中小型社群（每天<1000条新帖）
- 超出后可升级到 Gemini 2.5 Flash

**优点：**
- ✅ 用户体验好（只需用母语）
- ✅ 自动化程度高
- ✅ 支持更多用户

**缺点：**
- ❌ 需要AI成本
- ❌ 翻译质量依赖AI
- ❌ 需要配额管理

---

### 策略C：混合模式（最佳平衡）⭐⭐

**结合A和B的优点：**

1. **用户发帖时：**
   - 提供可选翻译按钮
   - 用户可自己填写双语内容（高质量）
   - 或点击"AI翻译"自动生成（便捷）

2. **数据库存储：**
   ```sql
   CREATE TABLE bbs_posts (
     id UUID PRIMARY KEY,
     title TEXT,                -- 原始标题
     title_translated TEXT,     -- 翻译后标题
     content TEXT,              -- 原始内容
     content_translated TEXT,   -- 翻译后内容
     original_lang VARCHAR(10), -- 'en' or 'zh-TW'
     is_auto_translated BOOLEAN -- 是否AI翻译
   );
   ```

3. **显示逻辑：**
   ```typescript
   function getDisplayContent(post, userLang) {
     if (userLang === post.original_lang) {
       return post.content; // 显示原文
     }
     
     if (post.content_translated) {
       return post.content_translated; // 显示已有翻译
     }
     
     // 按需翻译（缓存结果）
     return translateAndCache(post.content, post.original_lang, userLang);
   }
   ```

**优点：**
- ✅ 灵活性高
- ✅ 用户可控
- ✅ 成本可控（优先使用人工翻译）
- ✅ 体验最佳

---

## 3. 推荐实施方案

### 阶段1：MVP（立即实施）
- ✅ UI界面翻译（已完成）
- ✅ 帖子存储原始语言
- ✅ 显示语言标记（🇬🇧/🇹🇼）
- ⏭ 暂不翻译UGC内容

### 阶段2：基础翻译（1-2周后）
- 添加Gemini翻译API
- 发帖时可选AI翻译
- 存储双语内容

### 阶段3：完整体验（后续优化）
- 智能翻译缓存
- 用户反馈翻译质量
- 配额监控和降级策略

---

## 4. 数据库迁移

### 现有表结构
```sql
-- 检查当前bbs_posts表
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bbs_posts';
```

### 添加翻译字段
```sql
-- 迁移脚本
ALTER TABLE bbs_posts 
  ADD COLUMN title_translated TEXT,
  ADD COLUMN content_translated TEXT,
  ADD COLUMN original_lang VARCHAR(10) DEFAULT 'en',
  ADD COLUMN is_auto_translated BOOLEAN DEFAULT false;

-- 更新现有数据
UPDATE bbs_posts 
SET original_lang = 'en' 
WHERE original_lang IS NULL;
```

---

## 5. 前端组件示例

### BBS帖子显示组件
```tsx
'use client';
import { useLocale } from '@/contexts/locale-context';

function BBSPost({ post }: { post: BBSPost }) {
  const { locale } = useLocale();
  const isOriginalLang = locale === post.original_lang;
  
  return (
    <div className="post-card">
      <div className="flex items-center gap-2">
        <h3>{isOriginalLang ? post.title : post.title_translated || post.title}</h3>
        <span className="text-xs">
          {post.original_lang === 'en' ? '🇬🇧' : '🇹🇼'}
        </span>
      </div>
      
      <p>{isOriginalLang ? post.content : post.content_translated || post.content}</p>
      
      {!isOriginalLang && !post.content_translated && (
        <button onClick={() => translatePost(post.id)}>
          Translate to {locale === 'en' ? 'English' : '繁體中文'}
        </button>
      )}
    </div>
  );
}
```

---

## 总结

| 策略 | 成本 | 质量 | 体验 | 推荐度 |
|------|------|------|------|--------|
| 双语显示 | 无 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| AI实时翻译 | 中 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 混合模式 | 低 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**最终建议：采用混合模式（策略C）**

---

**下一步操作：**
1. ✅ 添加UI翻译到现有BBS页面
2. 📝 更新数据库schema添加翻译字段
3. 🔧 实现Gemini翻译API
4. 🎨 更新发帖表单UI（添加翻译选项）
