# 📚 GeekSEA 教程系统设计

## 🎯 定位

**落地页功能** - 简单的教程展示，几十个页面
**不是重点** - 重点是匿名技术论坛

---

## 📊 教程结构

### 首页展示

```typescript
// 首页展示的教程卡片（已在 app/page.tsx 实现）
const featuredTutorials = [
  {
    id: 1,
    title: 'Solidity 智能合约完全指南',
    category: 'Web3',
    difficulty: 'Advanced',
    duration: '120 分鐘',
    students: 1337,
    rating: 4.9,
    tags: ['Solidity', 'Smart Contract', 'Ethereum'],
  },
  // ... 更多教程
]
```

### 教程页面结构

```
/tutorials
  ├── /                    列表页（所有教程）
  ├── /[id]                详情页（单个教程）
  └── /category/[slug]     分类页
```

---

## 🗄️ 数据库设计

### tutorials 表

```sql
CREATE TABLE tutorials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT NOT NULL,  -- Markdown 格式
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL, -- 'Beginner', 'Intermediate', 'Advanced'
  duration INTEGER,  -- 分钟
  is_premium BOOLEAN DEFAULT 0,  -- 是否付费
  unlock_points INTEGER DEFAULT 50,  -- 解锁所需积分
  cover_image TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tutorials_category ON tutorials(category);
CREATE INDEX idx_tutorials_difficulty ON tutorials(difficulty);
```

---

## 🎨 简单实现

### 教程列表页

```typescript
// app/tutorials/page.tsx
'use client'

import { useState } from 'react'
import { BookOpen, Clock, Users, Lock } from 'lucide-react'
import Link from 'next/link'

export default function TutorialsPage() {
  const [filter, setFilter] = useState('all')
  
  // 模拟数据，后续从数据库获取
  const tutorials = [
    {
      id: 1,
      title: 'Solidity 智能合约开发',
      slug: 'solidity-smart-contracts',
      category: 'Web3',
      difficulty: 'Advanced',
      duration: 120,
      isPremium: true,
      unlockPoints: 50,
      views: 1337,
    },
    // ... 更多
  ]
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-pixel-2xl mb-8">所有教程</h1>
      
      {/* 筛选 */}
      <div className="flex gap-2 mb-8">
        <button onClick={() => setFilter('all')} className="btn-pixel-outline">
          全部
        </button>
        <button onClick={() => setFilter('free')} className="btn-pixel-outline">
          免費
        </button>
        <button onClick={() => setFilter('premium')} className="btn-pixel-outline">
          付費
        </button>
      </div>
      
      {/* 教程卡片 */}
      <div className="grid md:grid-cols-3 gap-6">
        {tutorials.map(tutorial => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </div>
    </div>
  )
}

function TutorialCard({ tutorial }: any) {
  return (
    <Link href={`/tutorials/${tutorial.slug}`} className="card-pixel-glow group">
      {tutorial.isPremium && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs px-2 py-1 border border-pixel-warning text-pixel-warning">
            付費
          </span>
          <span className="text-xs text-pixel-accent">
            <Lock size={12} className="inline" /> {tutorial.unlockPoints} 積分
          </span>
        </div>
      )}
      
      <h3 className="text-pixel-base mb-3 group-hover:text-pixel-primary transition-colors">
        {tutorial.title}
      </h3>
      
      <div className="flex items-center gap-4 text-xs text-pixel-light/70">
        <span><Clock size={12} className="inline" /> {tutorial.duration}分鐘</span>
        <span><Users size={12} className="inline" /> {tutorial.views}</span>
      </div>
    </Link>
  )
}
```

---

## 💡 重点说明

**教程系统是次要功能**：
- 只需简单的列表和详情页
- 主要用于展示专业内容
- 支持积分解锁即可

**真正的重点是匿名论坛**！
