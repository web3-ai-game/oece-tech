'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Code2, Zap, Shield, Terminal, Cpu, Binary, Hexagon, Layers, GitBranch } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [matrixChars, setMatrixChars] = useState<string[]>([])
  const [terminalText, setTerminalText] = useState('')
  
  // 矩阵雨效果
  useEffect(() => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    setMatrixChars(Array(20).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]))
    
    const interval = setInterval(() => {
      setMatrixChars(Array(20).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]))
    }, 150)
    
    return () => clearInterval(interval)
  }, [])
  
  // 終端打字效果
  useEffect(() => {
    const text = '> INITIALIZING GEEKSEA PROTOCOL..._'
    let index = 0
    const typing = setInterval(() => {
      if (index < text.length) {
        setTerminalText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(typing)
      }
    }, 100)
    return () => clearInterval(typing)
  }, [])

  return (
    <div className="relative">
      {/* 矩陣背景裝飾 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 w-full h-full flex justify-around text-pixel-primary font-mono text-xs">
          {matrixChars.map((char, i) => (
            <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
              {char}
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section - 賽博朋克風格 */}
        <section className="text-center py-20 relative">
          {/* 數字雨裝飾 */}
          <div className="absolute top-0 left-1/4 text-pixel-accent font-mono text-2xl opacity-30 pixel-blink">
            {'</>'
          </div>
          <div className="absolute top-10 right-1/4 text-pixel-secondary font-mono text-2xl opacity-30 pixel-blink" style={{ animationDelay: '1s' }}>
            {'{}'
          </div>
          
          {/* 終端提示 */}
          <div className="inline-block mb-4 font-mono text-xs text-pixel-accent border border-pixel-accent px-3 py-1 bg-pixel-darker/50">
            {terminalText}
          </div>
          
          {/* 主標題 - 霓虹閃爍 */}
          <div className="relative inline-block mb-8">
            <h1 className="text-pixel-2xl md:text-[64px] mb-2 text-neon leading-tight relative z-10">
              {'< GEEKSEA />'
            </h1>
            <div className="absolute inset-0 text-pixel-2xl md:text-[64px] text-pixel-primary opacity-50 blur-xl animate-pulse">
              {'< GEEKSEA />'
            </div>
          </div>
          
          {/* 子標題 - 像素終端風格 */}
          <div className="relative mb-6 inline-block">
            <Terminal className="inline mr-2 text-pixel-accent" size={24} />
            <span className="text-xl md:text-3xl font-mono text-pixel-accent tracking-wider">
              [TECH_LEARNING_PROTOCOL]
            </span>
          </div>
          
          <p className="text-lg text-pixel-light/90 mb-4 max-w-3xl mx-auto font-mono">
            <span className="text-pixel-primary">{'>'</span> 像素化賽博空間 
            <span className="text-pixel-accent mx-2">{'|'</span>
            Web3 技術矩陣
            <span className="text-pixel-secondary mx-2">{'|'</span>
            解密未來代碼
          </p>
          
          {/* 統計數據 - 科技面板 */}
          <div className="flex justify-center gap-4 md:gap-8 mb-12 flex-wrap">
            <div className="card-pixel px-4 py-2 bg-pixel-darker/80">
              <div className="text-pixel-primary text-2xl font-bold font-mono">1,337</div>
              <div className="text-pixel-xs text-pixel-light/70">HACKERS</div>
            </div>
            <div className="card-pixel px-4 py-2 bg-pixel-darker/80">
              <div className="text-pixel-accent text-2xl font-bold font-mono">256</div>
              <div className="text-pixel-xs text-pixel-light/70">PROTOCOLS</div>
            </div>
            <div className="card-pixel px-4 py-2 bg-pixel-darker/80">
              <div className="text-pixel-secondary text-2xl font-bold font-mono">99.9%</div>
              <div className="text-pixel-xs text-pixel-light/70">UPTIME</div>
            </div>
          </div>
          
          {/* CTA 按鈕 - 霓虹風格 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/tutorials" className="btn-pixel relative group">
              <Binary className="inline mr-2" size={16} />
              <span>進入矩陣</span>
              <ArrowRight className="inline ml-2" size={16} />
              <div className="absolute inset-0 bg-pixel-primary opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>
            
            <Link href="/auth/register" className="btn-pixel-outline relative group">
              <Terminal className="inline mr-2" size={16} />
              <span>連接節點</span>
              <div className="absolute inset-0 border-2 border-pixel-accent opacity-0 group-hover:opacity-50 transition-opacity animate-pulse" />
            </Link>
          </div>
          
          {/* 科技裝飾 - 3D等距風格 */}
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="relative group">
              <Hexagon className="w-16 h-16 text-pixel-primary pixel-float stroke-[3]" />
              <Cpu className="absolute inset-0 m-auto w-8 h-8 text-pixel-darker group-hover:text-pixel-primary transition-colors" />
            </div>
            <div className="relative group" style={{ animationDelay: '0.5s' }}>
              <Hexagon className="w-16 h-16 text-pixel-accent pixel-float stroke-[3]" />
              <GitBranch className="absolute inset-0 m-auto w-8 h-8 text-pixel-darker group-hover:text-pixel-accent transition-colors" />
            </div>
            <div className="relative group" style={{ animationDelay: '1s' }}>
              <Hexagon className="w-16 h-16 text-pixel-secondary pixel-float stroke-[3]" />
              <Layers className="absolute inset-0 m-auto w-8 h-8 text-pixel-darker group-hover:text-pixel-secondary transition-colors" />
            </div>
          </div>
        </section>
      
        {/* Features Section - 科技面板風格 */}
        <section className="py-20">
          <div className="text-center mb-16">
            <div className="inline-block font-mono text-xs text-pixel-accent border border-pixel-accent px-3 py-1 mb-4">
              [SYSTEM_FEATURES]
            </div>
            <h2 className="text-pixel-xl text-neon">
              核心協議
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 - 增強科技感 */}
            <div className="card-pixel-glow group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-pixel-primary/10 blur-xl group-hover:bg-pixel-primary/20 transition-all" />
              <div className="mb-4 relative">
                <Sparkles className="text-pixel-primary" size={48} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-pixel-primary rounded-full opacity-50 animate-ping" />
              </div>
              <h3 className="text-pixel-base mb-2 font-mono">[VISUAL_SYSTEM]</h3>
              <div className="text-xs text-pixel-primary mb-3 font-mono">v2.0.0</div>
              <p className="text-pixel-light/80 font-sans text-sm leading-relaxed">
                8-bit 復古美學 × 賽博朋克視覺 × 霓虹燈效果
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card-pixel-glow group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-pixel-accent/10 blur-xl group-hover:bg-pixel-accent/20 transition-all" />
              <div className="mb-4 relative">
                <Code2 className="text-pixel-accent" size={48} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-pixel-accent rounded-full opacity-50 animate-ping" style={{ animationDelay: '0.5s' }} />
              </div>
              <h3 className="text-pixel-base mb-2 font-mono">[KNOWLEDGE_BASE]</h3>
              <div className="text-xs text-pixel-accent mb-3 font-mono">256 MODULES</div>
              <p className="text-pixel-light/80 font-sans text-sm leading-relaxed">
                Web3 × 前端 × 後端 × 密碼學 深度解構
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card-pixel-glow group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-pixel-secondary/10 blur-xl group-hover:bg-pixel-secondary/20 transition-all" />
              <div className="mb-4 relative">
                <Zap className="text-pixel-secondary" size={48} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-pixel-secondary rounded-full opacity-50 animate-ping" style={{ animationDelay: '1s' }} />
              </div>
              <h3 className="text-pixel-base mb-2 font-mono">[NEURAL_LINK]</h3>
              <div className="text-xs text-pixel-secondary mb-3 font-mono">REAL-TIME</div>
              <p className="text-pixel-light/80 font-sans text-sm leading-relaxed">
                即時編譯 × 進度同步 × 互動終端 × AI 輔助
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="card-pixel-glow group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-pixel-warning/10 blur-xl group-hover:bg-pixel-warning/20 transition-all" />
              <div className="mb-4 relative">
                <Shield className="text-pixel-warning" size={48} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-pixel-warning rounded-full opacity-50 animate-ping" style={{ animationDelay: '1.5s' }} />
              </div>
              <h3 className="text-pixel-base mb-2 font-mono">[SECURITY_PROTOCOL]</h3>
              <div className="text-xs text-pixel-warning mb-3 font-mono">LEVEL 9</div>
              <p className="text-pixel-light/80 font-sans text-sm leading-relaxed">
                JWT 加密 × SQLite 本地 × 零信任架構
              </p>
            </div>
          </div>
        </section>
        
        {/* Featured Tutorials - 熱門教程 */}
        <section className="py-20 bg-pixel-darker/30">
          <div className="text-center mb-16">
            <div className="inline-block font-mono text-xs text-pixel-primary border border-pixel-primary px-3 py-1 mb-4 animate-pulse">
              [HOT_PROTOCOLS]
            </div>
            <h2 className="text-pixel-xl text-neon">
              熱門教程
            </h2>
            <p className="text-pixel-light/70 mt-4 font-mono">最受歡迎的學習內容</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {featuredTutorials.map((tutorial) => (
              <Link
                key={tutorial.id}
                href={`/tutorials/${tutorial.id}`}
                className="card-pixel-glow group relative overflow-hidden"
              >
                {/* 熱度指示器 */}
                <div className="absolute top-4 right-4 flex gap-1">
                  <div className="w-2 h-2 bg-pixel-primary animate-pulse" />
                  <div className="w-2 h-2 bg-pixel-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-pixel-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
                
                <div className="mb-4">
                  <span className="text-xs text-pixel-accent border border-pixel-accent px-2 py-1">
                    {tutorial.category}
                  </span>
                  <span className={`ml-2 text-xs px-2 py-1 border ${
                    tutorial.difficulty === 'Beginner' ? 'text-pixel-primary border-pixel-primary' :
                    tutorial.difficulty === 'Intermediate' ? 'text-pixel-warning border-pixel-warning' :
                    'text-pixel-danger border-pixel-danger'
                  }`}>
                    {tutorial.difficulty}
                  </span>
                </div>
                
                <h3 className="text-pixel-base mb-4 group-hover:text-pixel-primary transition-colors">
                  {tutorial.title}
                </h3>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-pixel-light/70 font-mono">
                  <span>⏱️ {tutorial.duration}</span>
                  <span>👥 {tutorial.students}</span>
                  <span>⭐ {tutorial.rating}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {tutorial.tags.map((tag) => (
                    <span key={tag} className="text-pixel-xs text-pixel-secondary/70 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
        
        {/* Tech Stack - 技術棧展示 */}
        <section className="py-20">
          <div className="text-center mb-16">
            <div className="inline-block font-mono text-xs text-pixel-accent border border-pixel-accent px-3 py-1 mb-4">
              [TECH_MATRIX]
            </div>
            <h2 className="text-pixel-xl text-neon-cyan">
              技術生態
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <div
                key={tech.name}
                className="card-pixel px-6 py-4 hover:border-pixel-primary transition-all group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center">
                  <div className={`text-3xl mb-2 ${tech.color} group-hover:scale-110 transition-transform`}>
                    {tech.icon}
                  </div>
                  <div className="text-sm font-mono">{tech.name}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Learning Paths - 學習路徑 */}
        <section className="py-20 bg-pixel-darker/30">
          <div className="text-center mb-16">
            <div className="inline-block font-mono text-xs text-pixel-secondary border border-pixel-secondary px-3 py-1 mb-4">
              [SKILL_TREES]
            </div>
            <h2 className="text-pixel-xl text-neon-pink">
              學習路徑
            </h2>
            <p className="text-pixel-light/70 mt-4 font-mono">系統化進階方案</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {learningPaths.map((path, index) => (
              <div
                key={path.id}
                className="card-pixel-glow relative overflow-hidden group"
              >
                {/* 進度條裝飾 */}
                <div className="absolute top-0 left-0 w-full h-1 bg-pixel-darker">
                  <div 
                    className="h-full bg-gradient-to-r from-pixel-primary via-pixel-accent to-pixel-secondary"
                    style={{ width: `${(index + 1) * 33}%` }}
                  />
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-pixel-accent">
                      PATH_{String(path.id).padStart(2, '0&apos;)}
                    </span>
                    <span className={`text-xs px-2 py-1 border ${
                      path.level === 'Beginner' ? 'text-pixel-primary border-pixel-primary' :
                      path.level === 'Intermediate' ? 'text-pixel-warning border-pixel-warning' :
                      'text-pixel-danger border-pixel-danger'
                    }`}>
                      {path.level}
                    </span>
                  </div>
                  
                  <h3 className="text-pixel-base mb-4 group-hover:text-pixel-primary transition-colors">
                    {path.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm text-pixel-light/70 font-mono">
                    <span>📚 {path.steps} 步驟</span>
                    <span>⏰ {path.duration}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {path.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="text-pixel-xs text-pixel-accent border border-pixel-accent/50 px-2 py-1"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* 底部按鈕 */}
                <div className="mt-6 pt-4 border-t border-pixel-grid">
                  <button className="w-full btn-pixel-outline text-sm">
                    開始學習 →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      
        {/* Tutorial Categories - 數據終端風格 */}
        <section className="py-20">
          <div className="text-center mb-16">
            <div className="inline-block font-mono text-xs text-pixel-secondary border border-pixel-secondary px-3 py-1 mb-4">
              [DATA_ARCHIVES]
            </div>
            <h2 className="text-pixel-xl text-neon-pink">
              知識矩陣
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorialCategories.map((category, index) => (
              <Link 
                key={category.slug}
                href={`/tutorials?category=${category.slug}`}
                className="card-pixel group hover:border-pixel-primary relative overflow-hidden"
              >
                {/* 掃描線效果 */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pixel-primary/5 to-transparent h-1/3 top-0 group-hover:animate-scan" />
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-pixel-base font-mono">{`[${String(index + 1).padStart(2, '0&apos;)}]`} {category.title}</h3>
                  <span className="badge-pixel bg-pixel-accent/20 text-pixel-accent border-pixel-accent">
                    {category.count}
                  </span>
                </div>
                
                <p className="text-pixel-light/70 font-sans text-sm mb-4">
                  {category.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {category.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-pixel-xs text-pixel-accent border border-pixel-accent/50 px-2 py-1 group-hover:border-pixel-accent transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {/* 角落裝飾 */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-pixel-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-pixel-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </section>
        
        {/* CTA Section - 終端命令風格 */}
        <section className="py-20">
          <div className="card-pixel-glow text-center p-12 relative overflow-hidden">
            {/* 背景動畫 */}
            <div className="absolute inset-0 bg-gradient-to-r from-pixel-primary/10 via-pixel-accent/10 to-pixel-secondary/10 opacity-50 blur-3xl" />
            
            <div className="relative z-10">
              <div className="inline-block font-mono text-xs text-pixel-primary border border-pixel-primary px-3 py-1 mb-6">
                [CONNECT_TO_MATRIX]
              </div>
              
              <h2 className="text-pixel-xl mb-4 text-neon-cyan font-mono">
                {'> sudo join_geeksea --now'
              </h2>
              
              <p className="text-lg text-pixel-light/90 mb-8 font-mono max-w-2xl mx-auto leading-relaxed">
                <span className="text-pixel-primary">$</span> 解鎖全部協議
                <span className="text-pixel-accent mx-2">×</span>
                追蹤進度數據
                <span className="text-pixel-secondary mx-2">×</span>
                連接黑客網絡
              </p>
              
              <Link href="/auth/register" className="btn-pixel btn-pixel-secondary relative group">
                <Terminal className="inline mr-2" size={16} />
                <span>初始化節點</span>
                <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </Link>
              
              {/* 裝飾元素 */}
              <div className="mt-8 flex justify-center gap-3">
                <div className="w-3 h-3 bg-pixel-primary animate-pulse" />
                <div className="w-3 h-3 bg-pixel-accent animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="w-3 h-3 bg-pixel-secondary animate-pulse" style={{ animationDelay: '0.6s' }} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

// 教程分類數據
const tutorialCategories = [
  {
    title: 'Web3 開發',
    slug: 'web3',
    count: 24,
    description: '智能合約、DApp 開發、區塊鏈基礎',
    tags: ['Solidity', 'Ethereum', 'Web3.js'],
  },
  {
    title: '前端開發',
    slug: 'frontend',
    count: 36,
    description: 'React、Next.js、TypeScript 現代前端技術',
    tags: ['React', 'Next.js', 'Tailwind'],
  },
  {
    title: '後端開發',
    slug: 'backend',
    count: 28,
    description: 'Node.js、數據庫、API 設計',
    tags: ['Node.js', 'Express', 'SQLite'],
  },
  {
    title: '設計系統',
    slug: 'design',
    count: 18,
    description: 'UI/UX 設計、像素藝術、動畫效果',
    tags: ['UI/UX', 'Pixel Art', 'CSS'],
  },
  {
    title: '開發工具',
    slug: 'tools',
    count: 22,
    description: 'Git、Docker、CI/CD 工具鏈',
    tags: ['Git', 'Docker', 'GitHub'],
  },
  {
    title: '數據科學',
    slug: 'data-science',
    count: 15,
    description: 'Python、機器學習、數據分析',
    tags: ['Python', 'ML', 'Pandas'],
  },
]

// 熱門教程數據（後續從 Notion 獲取）
const featuredTutorials = [
  {
    id: 1,
    title: 'Solidity 智能合約完全指南',
    category: 'Web3',
    difficulty: 'Advanced',
    duration: '120 分鐘',
    students: 1337,
    rating: 4.9,
    tags: ['Solidity', 'Smart Contract', 'Ethereum'],
  },
  {
    id: 2,
    title: 'Next.js 14 App Router 深度解析',
    category: '前端',
    difficulty: 'Intermediate',
    duration: '90 分鐘',
    students: 2048,
    rating: 4.8,
    tags: ['Next.js', 'React', 'TypeScript'],
  },
  {
    id: 3,
    title: '像素藝術設計從入門到精通',
    category: '設計',
    difficulty: 'Beginner',
    duration: '60 分鐘',
    students: 892,
    rating: 4.7,
    tags: ['Pixel Art', 'Design', 'Aseprite'],
  },
]

// 技術棧數據
const techStack = [
  { name: 'React', icon: '⚛️', color: 'text-[#61DAFB]' },
  { name: 'Next.js', icon: '▲', color: 'text-white' },
  { name: 'TypeScript', icon: 'TS', color: 'text-[#3178C6]' },
  { name: 'Solidity', icon: '◆', color: 'text-[#363636]' },
  { name: 'Python', icon: '🐍', color: 'text-[#3776AB]' },
  { name: 'Rust', icon: '🦀', color: 'text-[#CE412B]' },
  { name: 'Go', icon: '🔵', color: 'text-[#00ADD8]' },
  { name: 'Docker', icon: '🐳', color: 'text-[#2496ED]' },
]

// 學習路徑數據
const learningPaths = [
  {
    id: 1,
    title: 'Web3 全棧開發者',
    steps: 8,
    duration: '3 個月',
    level: 'Advanced',
    skills: ['Solidity', 'React', 'Web3.js', 'Node.js'],
  },
  {
    id: 2,
    title: '前端工程師進階',
    steps: 6,
    duration: '2 個月',
    level: 'Intermediate',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
  },
  {
    id: 3,
    title: '區塊鏈開發入門',
    steps: 5,
    duration: '1 個月',
    level: 'Beginner',
    skills: ['Blockchain', 'Solidity', 'Ethereum', 'Basics'],
  },
]
