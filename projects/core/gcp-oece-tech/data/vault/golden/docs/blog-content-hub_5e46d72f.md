---
trigger: always_on
---

# Content Hub Architecture Rules

## 核心定位
博客(主体) + X同步 + Telegram推送

## 内容结构
/blog → 主文章(Markdown)
/snippets → 代码片段
/links → X/Telegram跨链接
/about → 开发转博主故事

## X集成规则
- 每篇文章自动生成Thread串
- 代码块转图片(Carbon/ray.so)
- Meta tags优化(OG+Twitter Card)

## Telegram Bot规则
- 文章发布→自动推送频道
- 互动数据回传(点赞/评论)
- 命令系统: /search /latest /random

## SEO强制要求
- 所有页面<3s LCP
- 移动优先索引
- 结构化数据(JSON-LD)