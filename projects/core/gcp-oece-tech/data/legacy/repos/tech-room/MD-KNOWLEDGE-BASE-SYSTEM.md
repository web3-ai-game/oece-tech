# 📚 MD文件知识库系统设计

## 🎯 核心需求

```
✓ MD文件直接读取
✓ 放在VPS上
✓ 手机GitHub编写
✓ 推送自动部署
✓ 简单发教程
✓ 匿名化处理
```

---

## 🏗️ 系统架构

### 方案选择
```
推荐方案：GitHub + 自动部署钩子

原因：
✓ 手机可编辑
✓ 版本控制
✓ 免费存储
✓ 自动部署
✓ 简单维护
```

---

## 📁 文件结构

### GitHub仓库结构
```
tutorials/
├── getting-started/
│   ├── google-email.md
│   ├── vpn-setup.md
│   └── meta.json
│
├── vpn-tech/
│   ├── ss-config.md
│   ├── v2ray-guide.md
│   └── meta.json
│
├── anonymity/
│   ├── tor-usage.md
│   ├── privacy-tools.md
│   └── meta.json
│
└── index.json  // 教程索引
```

### MD文件格式
```markdown
---
title: Google郵箱註冊完整指南
category: getting-started
difficulty: easy
tags: [email, google, registration]
author: anonymous
points: 0
created: 2025-10-19
updated: 2025-10-19
---

# Google郵箱註冊完整指南

## 前言
這是一篇完整的Google郵箱註冊教程...

## 步驟1: 準備工作
...

## 步驟2: 註冊流程
...
```

---

## 🔄 自動部署流程

### 1. GitHub Actions 配置

创建 `.github/workflows/deploy.yml`:

```yaml
name: Auto Deploy Tutorials

on:
  push:
    branches: [ main ]
    paths:
      - 'tutorials/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to VPS
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.VPS_HOST }}
        username: ${{ secrets.VPS_USER }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/oece-tech
          git pull origin main
          npm run build
          pm2 restart oece-tech
```

### 2. VPS 部署脚本

创建 `scripts/deploy.sh`:

```bash
#!/bin/bash

# 拉取最新代码
git pull origin main

# 安装依赖（如有新增）
npm install

# 重新生成教程索引
npm run generate-index

# 构建项目
npm run build

# 重启服务
pm2 restart oece-tech

echo "✅ 部署完成！"
```

---

## 💻 MD读取实现

### 1. 教程读取API

创建 `lib/tutorial-reader.ts`:

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export interface Tutorial {
  slug: string
  title: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard' | 'hell'
  tags: string[]
  author: string
  points: number
  content: string
  created: string
  updated: string
}

// 读取单个教程
export async function getTutorial(category: string, slug: string): Promise<Tutorial | null> {
  try {
    const filePath = path.join(process.cwd(), 'tutorials', category, `${slug}.md`)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    
    const { data, content } = matter(fileContent)
    const htmlContent = marked(content)
    
    return {
      slug,
      title: data.title,
      category: data.category,
      difficulty: data.difficulty,
      tags: data.tags || [],
      author: data.author || 'anonymous',
      points: data.points || 0,
      content: htmlContent,
      created: data.created,
      updated: data.updated
    }
  } catch (error) {
    console.error('读取教程失败:', error)
    return null
  }
}

// 获取所有教程列表
export async function getAllTutorials(): Promise<Tutorial[]> {
  const tutorialsDir = path.join(process.cwd(), 'tutorials')
  const categories = fs.readdirSync(tutorialsDir)
  
  const tutorials: Tutorial[] = []
  
  for (const category of categories) {
    const categoryPath = path.join(tutorialsDir, category)
    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.md'))
    
    for (const file of files) {
      const slug = file.replace('.md', '')
      const tutorial = await getTutorial(category, slug)
      if (tutorial) {
        tutorials.push(tutorial)
      }
    }
  }
  
  return tutorials
}

// 按分类获取教程
export async function getTutorialsByCategory(category: string): Promise<Tutorial[]> {
  const categoryPath = path.join(process.cwd(), 'tutorials', category)
  
  if (!fs.existsSync(categoryPath)) {
    return []
  }
  
  const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.md'))
  const tutorials: Tutorial[] = []
  
  for (const file of files) {
    const slug = file.replace('.md', '')
    const tutorial = await getTutorial(category, slug)
    if (tutorial) {
      tutorials.push(tutorial)
    }
  }
  
  return tutorials
}

// 搜索教程
export async function searchTutorials(query: string): Promise<Tutorial[]> {
  const allTutorials = await getAllTutorials()
  
  return allTutorials.filter(tutorial => 
    tutorial.title.toLowerCase().includes(query.toLowerCase()) ||
    tutorial.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  )
}
```

### 2. 教程详情页面

创建 `app/tutorials/[category]/[slug]/page.tsx`:

```typescript
import { getTutorial } from '@/lib/tutorial-reader'
import { notFound } from 'next/navigation'
import { DOSWindow, RetroTag, PixelDivider } from '@/components/retro/RetroEffects'
import { CRTScanlines } from '@/components/retro/RetroEffects'

export default async function TutorialPage({ 
  params 
}: { 
  params: { category: string, slug: string } 
}) {
  const tutorial = await getTutorial(params.category, params.slug)
  
  if (!tutorial) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-pixel-darker p-4">
      <CRTScanlines />
      
      <div className="max-w-4xl mx-auto py-8 relative z-10">
        <DOSWindow title={`[ ${tutorial.category.toUpperCase()} ]`}>
          {/* 标题 */}
          <h1 className="text-3xl font-bold font-mono text-pixel-primary mb-4">
            {tutorial.title}
          </h1>
          
          {/* 元数据 */}
          <div className="flex flex-wrap gap-2 mb-6">
            <RetroTag color="primary">{tutorial.category}</RetroTag>
            <RetroTag color="warning">{tutorial.difficulty}</RetroTag>
            {tutorial.tags.map(tag => (
              <RetroTag key={tag} color="accent">{tag}</RetroTag>
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-pixel-light/60 mb-6 font-mono">
            <span>👤 {tutorial.author}</span>
            <span>📅 {tutorial.created}</span>
            <span>💰 {tutorial.points} 积分</span>
          </div>
          
          <PixelDivider />
          
          {/* MD内容 */}
          <div 
            className="prose prose-invert max-w-none font-mono text-pixel-light"
            dangerouslySetInnerHTML={{ __html: tutorial.content }}
          />
        </DOSWindow>
      </div>
    </div>
  )
}
```

---

## 📱 手机端编辑流程

### 1. 使用GitHub Mobile App

```
步骤1: 安装GitHub App
步骤2: 打开tutorials仓库
步骤3: 选择分类文件夹
步骤4: 点击"+"创建新文件
步骤5: 编写MD内容
步骤6: Commit并Push
步骤7: 自动部署触发
步骤8: 等待2-3分钟部署完成
```

### 2. 使用Working Copy (iOS)

```
更专业的Git客户端：
✓ 离线编辑
✓ Markdown预览
✓ 语法高亮
✓ 批量提交
```

### 3. 使用Termux (Android)

```bash
# 克隆仓库
git clone https://github.com/your-repo/tutorials

# 编辑文件
cd tutorials/getting-started
vim new-tutorial.md

# 提交推送
git add .
git commit -m "Add new tutorial"
git push origin main
```

---

## 🔐 匿名化处理方案

### 1. 作者匿名

```yaml
# 教程元数据
---
author: anonymous  # 统一使用匿名
author_id: hash_123456  # 内部ID（加密）
---
```

### 2. Git提交匿名

```bash
# 配置匿名Git用户
git config user.name "Anonymous Tech"
git config user.email "noreply@oece.tech"

# 使用GPG签名（可选）
git config commit.gpgsign true
```

### 3. VPS匿名部署

```bash
# 使用SSH密钥认证（不暴露个人信息）
# 使用GitHub Secrets存储凭证
# 部署日志不记录个人信息
```

### 4. 内容审查

创建 `scripts/content-check.sh`:

```bash
#!/bin/bash

# 检查MD文件是否包含敏感信息
echo "🔍 检查敏感信息..."

# 检查邮箱
if grep -r "@" tutorials/*.md; then
  echo "⚠️  发现邮箱地址！"
fi

# 检查手机号
if grep -r "[0-9]\{11\}" tutorials/*.md; then
  echo "⚠️  发现手机号码！"
fi

# 检查IP地址
if grep -r "[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}" tutorials/*.md; then
  echo "⚠️  发现IP地址！"
fi

echo "✅ 内容检查完成"
```

---

## 🚀 快速开始

### 1. 初始化教程仓库

```bash
# 创建tutorials目录
mkdir tutorials
cd tutorials

# 初始化Git
git init
git remote add origin https://github.com/your-name/tutorials.git

# 创建基础结构
mkdir -p getting-started vpn-tech anonymity

# 创建示例教程
cat > getting-started/example.md << 'EOF'
---
title: 示例教程
category: getting-started
difficulty: easy
tags: [example]
author: anonymous
points: 0
---

# 示例教程

这是一个示例教程。
EOF

# 提交推送
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. 配置自动部署

```bash
# VPS上克隆仓库
cd /var/www
git clone https://github.com/your-name/tutorials.git oece-tutorials

# 配置webhook
# 在GitHub仓库设置中添加webhook
# Payload URL: https://your-vps.com/api/deploy
# Secret: your-secret-key

# 设置自动拉取
cd oece-tutorials
chmod +x scripts/deploy.sh
```

### 3. 安装依赖

```bash
npm install gray-matter marked
```

---

## 📊 教程发布流程

### 简化版流程

```
1. 手机打开GitHub App
   ↓
2. 找到tutorials仓库
   ↓
3. 选择分类文件夹
   ↓
4. 创建新MD文件
   ↓
5. 复制粘贴MD模板
   ↓
6. 填写标题和内容
   ↓
7. Commit & Push
   ↓
8. 等待自动部署（2-3分钟）
   ↓
9. 访问网站查看新教程
```

### MD模板

```markdown
---
title: 教程标题
category: getting-started
difficulty: easy
tags: [标签1, 标签2]
author: anonymous
points: 0
created: 2025-10-19
updated: 2025-10-19
---

# 教程标题

## 简介
简要说明这个教程的内容...

## 前置要求
- 要求1
- 要求2

## 步骤1: XXX
详细步骤说明...

## 步骤2: XXX
详细步骤说明...

## 常见问题
**Q: 问题1？**
A: 回答1

## 总结
总结教程要点...

## 参考资料
- 链接1
- 链接2
```

---

## 🛠️ 推荐工具

### Markdown编辑器
```
手机端:
- iA Writer (iOS/Android)
- Joplin (开源)
- Markor (Android)

桌面端:
- VS Code
- Typora
- Obsidian
```

### Git客户端
```
手机端:
- GitHub Mobile (官方)
- Working Copy (iOS, 最佳)
- MGit (Android)

桌面端:
- GitHub Desktop
- SourceTree
- VS Code Git
```

---

## 📝 package.json 脚本

```json
{
  "scripts": {
    "generate-index": "node scripts/generate-index.js",
    "check-content": "bash scripts/content-check.sh",
    "deploy": "bash scripts/deploy.sh"
  },
  "dependencies": {
    "gray-matter": "^4.0.3",
    "marked": "^9.0.0"
  }
}
```

---

## 🔒 安全建议

```
✓ 使用SSH密钥而非密码
✓ GitHub Secrets存储敏感信息
✓ 定期审查提交历史
✓ 使用匿名邮箱
✓ 不在MD中包含个人信息
✓ 使用VPN提交代码
✓ 定期检查内容合规
```

---

**MD知识库系统设计完成！** 📚✨

**核心优势**:
- 📱 手机直接编辑
- 🔄 自动部署
- 🔐 匿名化处理
- 📝 简单发布
- 💰 零成本存储
- 🚀 快速上线

**立即开始**: 创建GitHub仓库 → 配置自动部署 → 开始写教程！
