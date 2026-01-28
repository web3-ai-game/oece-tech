# 完整系统升级方案

## 1. 知识库结构重构

### 文件夹架构
```
/knowledge-base/
├── /cryptography/          # 密码学
│   ├── 01-basics.md       # 基础概念
│   ├── 02-symmetric.md    # 对称加密
│   ├── 03-asymmetric.md   # 非对称加密
│   ├── 04-hashing.md      # 哈希算法
│   └── 05-applications.md # 实际应用
├── /network-protocols/     # 网络协议（原VPN内容）
│   ├── 01-portal-basics.md    # 传送门基础
│   ├── 02-route-planning.md   # 路径规划
│   └── 03-advanced.md         # 高级技术
├── /digital-nomad/         # 数字游民
└── /monetization/          # 技能变现
```

## 2. 个人面板设计

### 核心模块
```tsx
// app/profile/page.tsx
interface ProfileData {
  // 基础信息
  avatar: string
  username: string
  level: number
  experience: number
  joinDate: Date
  
  // 学习数据
  completedCourses: number
  totalHours: number
  currentStreak: number
  
  // 知识库
  notes: Note[]
  mindmaps: MindMap[]
  bookmarks: Bookmark[]
  
  // 订阅
  subscription: {
    plan: 'free' | 'pro' | 'enterprise'
    expiresAt: Date
    features: string[]
  }
}
```

## 3. Notion式编辑器（匿名）

### 编辑器组件
```tsx
// components/AnonymousEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export function AnonymousEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      CodeBlock,
      Table,
    ],
    content: '',
    autofocus: true,
  })
  
  // 自动保存到本地
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      localStorage.setItem('draft', editor.getHTML())
    }, 1000)
    return () => clearTimeout(saveTimer)
  }, [editor?.state])
  
  return <EditorContent editor={editor} />
}
```

## 4. 密码学入门课程

### 课程大纲
```markdown
# 密码学：数字世界的守护者

## 第一章：古典密码学
- 凯撒密码
- 维吉尼亚密码
- Enigma机器

## 第二章：现代密码学基础
- XOR运算
- 一次性密码本
- 信息论基础

## 第三章：对称加密
- DES/3DES
- AES算法
- 工作模式（ECB/CBC/CTR）

## 第四章：非对称加密
- RSA原理
- 椭圆曲线密码
- Diffie-Hellman密钥交换

## 第五章：哈希与签名
- SHA家族
- HMAC
- 数字签名

## 第六章：实战应用
- HTTPS原理
- 区块链密码学
- 端到端加密
```

## 5. 升级版黑话系统

### 深层概念漂移
```typescript
// 密码学相关
'加密' → '数据护甲'
'解密' → '护甲解除'
'密钥' → '魔法钥匙'
'算法' → '魔法公式'
'哈希' → '指纹术'
'签名' → '魔法印章'

// 网络深层
'协议' → '通信契约'
'端口' → '传送门入口'
'防火墙' → '能量护盾'
'路由' → '星图导航'
'DNS' → '地名簿'
'IP地址' → '坐标点'

// 更深层隐喻
'突破限制' → '解锁新地图'
'绕过检测' → '隐身模式'
'加速访问' → '时空折跃'
'匿名浏览' → '幽灵模式'
```

## 6. Gemini关键词筛查

```typescript
// lib/gemini-filter.ts
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_FREE_KEY!)

export async function filterContent(text: string): Promise<{
  safe: boolean
  issues: string[]
  suggestions: string[]
}> {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash" // 免费版
  })
  
  const prompt = `
    检查以下内容是否包含敏感词：
    ${text}
    
    敏感词列表：VPN,翻墙,代理,梯子,科学上网,GFW,防火墙
    
    返回JSON格式：
    {
      "safe": true/false,
      "detected": ["检测到的敏感词"],
      "replacements": ["建议替换为"]
    }
  `
  
  const result = await model.generateContent(prompt)
  return JSON.parse(result.response.text())
}
```

## 7. 专业Logo设计

```tsx
// components/Logo.tsx
export function Logo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#05FFA1" />
          <stop offset="50%" stopColor="#01CDFE" />
          <stop offset="100%" stopColor="#FF71CE" />
        </linearGradient>
      </defs>
      
      {/* O */}
      <circle 
        cx="20" cy="50" r="15" 
        fill="none" 
        stroke="url(#logoGradient)" 
        strokeWidth="3"
      />
      
      {/* E */}
      <path 
        d="M 35 35 L 50 35 M 35 35 L 35 65 L 50 65 M 35 50 L 45 50" 
        stroke="url(#logoGradient)" 
        strokeWidth="3"
        fill="none"
      />
      
      {/* C */}
      <path 
        d="M 65 35 Q 55 35 55 50 Q 55 65 65 65" 
        stroke="url(#logoGradient)" 
        strokeWidth="3"
        fill="none"
      />
      
      {/* E */}
      <path 
        d="M 75 35 L 90 35 M 75 35 L 75 65 L 90 65 M 75 50 L 85 50" 
        stroke="url(#logoGradient)" 
        strokeWidth="3"
        fill="none"
      />
    </svg>
  )
}
```

## 8. 定价页面

```tsx
// app/pricing/page.tsx
const PLANS = [
  {
    name: '探险者',
    price: 0,
    period: '永久免费',
    features: [
      '基础传送门教程',
      '社区访问',
      '每月5次AI助手',
      '基础装备下载'
    ]
  },
  {
    name: '冒险家',
    price: 19,
    period: '/月',
    features: [
      '所有探险者功能',
      '高级传送门技术',
      '无限AI助手',
      '优先支持',
      '专属装备库',
      '视频教程'
    ],
    popular: true
  },
  {
    name: '世界行者',
    price: 99,
    period: '/月',
    features: [
      '所有功能',
      '1对1指导',
      '定制化路径',
      '私人据点部署',
      '团队协作',
      '商业授权'
    ]
  }
]
```

## 9. 邀请码机制优化

```typescript
// 更严格的邀请码系统
export async function generateInviteCode(
  method: 'ad' | 'crypto' | 'share'
): Promise<string> {
  // 根据不同方式生成
  switch(method) {
    case 'ad':
      // 看5个广告
      return generateAfterAds(5)
    
    case 'crypto':
      // 完成密码学入门
      return generateAfterCrypto()
    
    case 'share':
      // 分享给3个朋友
      return generateAfterShare(3)
  }
}

// 防机器人
async function verifyCaptcha(token: string): Promise<boolean> {
  // 使用hCaptcha（免费）
  const response = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    body: JSON.stringify({
      secret: process.env.HCAPTCHA_SECRET,
      response: token
    })
  })
  return response.json().then(data => data.success)
}
```

## 10. UI质量提升

### 设计系统规范
```css
/* 统一设计语言 */
:root {
  /* 间距系统 */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* 圆角系统 */
  --radius-sm: 0.125rem;
  --radius-md: 0.25rem;
  --radius-lg: 0.5rem;
  --radius-xl: 1rem;
  
  /* 阴影系统 */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.1);
  
  /* 动画 */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
}
```

### 组件质量标准
```tsx
// 每个组件必须包含
interface ComponentStandards {
  accessibility: {
    ariaLabels: boolean
    keyboardNav: boolean
    screenReaderSupport: boolean
  }
  
  responsive: {
    mobile: boolean
    tablet: boolean
    desktop: boolean
  }
  
  performance: {
    lazyLoad: boolean
    memoized: boolean
    optimizedRenders: boolean
  }
  
  documentation: {
    storybook: boolean
    tests: boolean
    types: boolean
  }
}
```

## VS Code问题修复

### ESLint配置
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-img-element": "off",
    "no-console": "warn",
    "no-unused-vars": "warn"
  }
}
```

### 自动修复脚本
```json
// package.json
{
  "scripts": {
    "lint": "next lint",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "fix-all": "npm run lint:fix && npm run format"
  }
}
```

---

**完整升级方案就绪！**

下一步执行命令：
```bash
npm run fix-all
```
