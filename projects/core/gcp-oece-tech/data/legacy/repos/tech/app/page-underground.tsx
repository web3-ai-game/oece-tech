'use client'

import Link from 'next/link'
import { Eye, Shield, Lock, AlertTriangle, Globe, Server, Radio } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [matrixChars, setMatrixChars] = useState<string[]>([])
  const [glitchText, setGlitchText] = useState('GEEKSEA')
  
  // 矩阵雨效果
  useEffect(() => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    setMatrixChars(Array(30).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]))
    
    const interval = setInterval(() => {
      setMatrixChars(Array(30).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]))
    }, 100)
    
    return () => clearInterval(interval)
  }, [])
  
  // 故障效果
  useEffect(() => {
    const glitch = setInterval(() => {
      const random = Math.random()
      if (random > 0.95) {
        setGlitchText('G3EK5EA')
        setTimeout(() => setGlitchText('GEEKSEA'), 100)
      }
    }, 2000)
    return () => clearInterval(glitch)
  }, [])

  return (
    <div className="relative min-h-screen bg-pixel-darker overflow-hidden">
      {/* 矩阵雨背景 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-15">
        <div className="absolute top-0 left-0 w-full h-full flex justify-around text-pixel-primary font-mono text-sm">
          {matrixChars.map((char, i) => (
            <div 
              key={i} 
              className="animate-pulse" 
              style={{ 
                animationDelay: `${i * 0.1}s`,
                transform: `translateY(${Math.sin(i) * 20}px)`
              }}
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      {/* 扫描线效果 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 scanline-effect opacity-10" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* ⚠️ 顶部警告横幅 - "开天窗"效果 */}
        <div className="mb-8">
          <div className="card-pixel border-pixel-danger bg-pixel-danger/10 backdrop-blur-md p-4 animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pixel-danger/20 to-transparent animate-scan" />
            <div className="flex items-center justify-center gap-3 text-sm font-mono relative z-10">
              <AlertTriangle className="text-pixel-danger" size={20} />
              <span className="text-pixel-danger font-bold">UNDERGROUND TECH COMMUNITY</span>
              <span className="text-pixel-light/30">|</span>
              <span className="text-pixel-accent">完全匿名</span>
              <span className="text-pixel-light/30">|</span>
              <span className="text-pixel-warning">突破封鎖</span>
              <span className="text-pixel-light/30">|</span>
              <span className="text-pixel-secondary">自負風險</span>
              <AlertTriangle className="text-pixel-danger" size={20} />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="text-center py-16 relative">
          {/* "偷窥技术" 视觉暗示 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <div className="relative">
              <Eye className="text-pixel-primary opacity-20 animate-pulse" size={64} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-pixel-danger rounded-full animate-ping" />
              </div>
            </div>
          </div>

          {/* "开天窗" 视觉效果框 */}
          <div className="mb-8 relative">
            <div className="card-pixel border-pixel-primary bg-pixel-darker/90 backdrop-blur-lg p-6 inline-block relative overflow-hidden">
              {/* 扫描动画 */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-pixel-primary/50 animate-scan" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-pixel-accent/50 animate-scan" style={{ animationDelay: '1s' }} />
              
              <div className="flex items-center gap-4 text-xs font-mono mb-4">
                <span className="text-pixel-danger animate-pulse">● REC</span>
                <span className="text-pixel-accent">BREAKING FIREWALL</span>
                <span className="text-pixel-primary">|</span>
                <span className="text-pixel-warning">突破封鎖</span>
                <span className="text-pixel-primary">|</span>
                <span className="text-pixel-secondary">技術自由</span>
                <Radio className="text-pixel-primary animate-pulse" size={16} />
              </div>

              {/* 主标题 with 故障效果 */}
              <h1 className="text-5xl md:text-7xl font-bold mb-4 relative">
                <span className="text-neon relative inline-block">
                  {glitchText}
                  <span className="absolute inset-0 text-pixel-danger opacity-50 blur-sm">{glitchText}</span>
                </span>
              </h1>

              {/* 神秘标语 */}
              <div className="space-y-2">
                <p className="text-xl text-pixel-danger font-mono flex items-center justify-center gap-2">
                  <Eye size={20} />
                  <span>Underground Tech Community</span>
                  <Eye size={20} />
                </p>
                <p className="text-lg text-pixel-accent font-mono">
                  // 匿名技術討論 · VPN/VPS · 突破技術封鎖
                </p>
              </div>
            </div>
          </div>

          {/* 神秘功能标签 */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="badge-pixel text-pixel-primary border-pixel-primary">
              <Lock size={14} className="inline mr-1" />
              完全匿名發帖
            </div>
            <div className="badge-pixel text-pixel-accent border-pixel-accent">
              <Shield size={14} className="inline mr-1" />
              端到端加密
            </div>
            <div className="badge-pixel text-pixel-warning border-pixel-warning">
              <Server size={14} className="inline mr-1" />
              VPS/VPN 技術
            </div>
            <div className="badge-pixel text-pixel-secondary border-pixel-secondary">
              <Globe size={14} className="inline mr-1" />
              跨境通信
            </div>
          </div>

          {/* 免责声明 */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="card-pixel border-pixel-warning bg-pixel-warning/5 p-4">
              <p className="text-xs text-pixel-warning font-mono leading-relaxed">
                <AlertTriangle size={14} className="inline mr-1" />
                <strong>免責聲明</strong>: 本平台僅供技術研究學習使用，禁止用於非法用途。
                所有技術討論內容由用戶發布，<span className="text-pixel-danger">與平台無關</span>。
                用戶需自行承擔一切法律責任。使用 VPN/VPS 請遵守當地法律。
                <Link href="/disclaimer" className="text-pixel-primary hover:text-pixel-accent ml-2 underline">
                  查看完整免責聲明 →
                </Link>
              </p>
            </div>
          </div>

          {/* CTA 按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/auth/register" 
              className="btn-pixel group relative overflow-hidden"
            >
              <span className="relative z-10">🔒 匿名註冊進入</span>
              <div className="absolute inset-0 bg-pixel-primary/20 translate-y-full group-hover:translate-y-0 transition-transform" />
            </Link>
            <Link 
              href="/forum" 
              className="btn-pixel-outline group"
            >
              <Eye size={16} className="inline mr-2" />
              <span>窺探技術論壇</span>
            </Link>
          </div>

          {/* 在线用户提示 */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-mono text-pixel-light/70">
            <div className="w-2 h-2 bg-pixel-primary rounded-full animate-pulse" />
            <span>當前在線: <span className="text-pixel-primary">42</span> 位匿名用戶</span>
          </div>
        </section>

        {/* 核心功能 - 神秘展示 */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-pixel-xl mb-4 text-neon-cyan font-mono">
              {'[CORE_FEATURES]'
            </h2>
            <p className="text-pixel-light/70 font-mono">
              為大陸兄弟開天窗，技術無國界
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 匿名论坛 */}
            <div className="card-pixel-glow group cursor-pointer hover:border-pixel-primary transition-all">
              <div className="p-6">
                <div className="w-16 h-16 rounded-full bg-pixel-primary/20 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Eye className="text-pixel-primary" size={32} />
                </div>
                <h3 className="text-pixel-lg mb-3 text-center font-mono">匿名技術論壇</h3>
                <ul className="text-sm text-pixel-light/80 space-y-2">
                  <li>🔒 完全匿名發帖和評論</li>
                  <li>💬 VPN/VPS 技術討論</li>
                  <li>🌐 突破封鎖經驗分享</li>
                  <li>🤝 匿名站內私信</li>
                  <li>💰 積分打賞和懸賞</li>
                </ul>
                <div className="mt-4 text-center">
                  <span className="text-xs text-pixel-accent font-mono">← 這才是核心</span>
                </div>
              </div>
            </div>

            {/* VPS/VPN 工具 */}
            <div className="card-pixel-glow group cursor-pointer hover:border-pixel-accent transition-all">
              <div className="p-6">
                <div className="w-16 h-16 rounded-full bg-pixel-accent/20 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Server className="text-pixel-accent" size={32} />
                </div>
                <h3 className="text-pixel-lg mb-3 text-center font-mono">VPS/VPN 工具庫</h3>
                <ul className="text-sm text-pixel-light/80 space-y-2">
                  <li>🚀 VPN 速度測試</li>
                  <li>🔧 VPS 配置教程</li>
                  <li>📡 節點測試工具</li>
                  <li>🛡️ 加密工具</li>
                  <li>💻 代理配置生成器</li>
                </ul>
                <div className="mt-4 text-center">
                  <span className="text-xs text-pixel-warning font-mono">實用工具</span>
                </div>
              </div>
            </div>

            {/* 技术教程 */}
            <div className="card-pixel-glow group cursor-pointer hover:border-pixel-secondary transition-all">
              <div className="p-6">
                <div className="w-16 h-16 rounded-full bg-pixel-secondary/20 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Globe className="text-pixel-secondary" size={32} />
                </div>
                <h3 className="text-pixel-lg mb-3 text-center font-mono">突破技術教程</h3>
                <ul className="text-sm text-pixel-light/80 space-y-2">
                  <li>📚 VPN 搭建指南</li>
                  <li>🔐 加密通信技術</li>
                  <li>🌍 跨境技術方案</li>
                  <li>🛠️ 自建服務器教程</li>
                  <li>🔓 科學上網技巧</li>
                </ul>
                <div className="mt-4 text-center">
                  <span className="text-xs text-pixel-secondary font-mono">知識庫</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 底部再次强调 */}
        <section className="py-12 text-center">
          <div className="card-pixel border-pixel-danger bg-pixel-danger/5 p-6 max-w-4xl mx-auto">
            <h3 className="text-pixel-lg text-pixel-danger mb-3 font-mono">
              ⚠️ 重要提醒
            </h3>
            <p className="text-sm text-pixel-light/80 leading-relaxed mb-4">
              GeekSEA 是一個<strong className="text-pixel-warning">技術討論平台</strong>，
              所有內容僅供<strong className="text-pixel-accent">學習研究</strong>使用。
              我們<strong className="text-pixel-danger">不鼓勵、不支持</strong>任何違反當地法律的行為。
              用戶發布的內容與平台無關，<strong className="text-pixel-primary">請理性討論，合法使用</strong>。
            </p>
            <Link href="/disclaimer" className="btn-pixel-outline text-sm">
              閱讀完整免責聲明
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
