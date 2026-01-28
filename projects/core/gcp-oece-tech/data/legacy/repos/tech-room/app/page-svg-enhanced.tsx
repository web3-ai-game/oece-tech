'use client'

import Link from 'next/link'
import { ArrowRight, Eye, Shield, Zap, MessageSquare, Lock } from 'lucide-react'
import { OECELogo } from '@/components/logo/OECELogo'
import { 
  HexagonGrid, 
  CircuitPattern, 
  RadarCircle, 
  DataStream,
  FloatingParticles,
  TechCorners,
  DigitalRain,
  HologramScanlines,
  EnergyPulse,
  CubeGrid
} from '@/components/decorations/CyberDecorations'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-pixel-darker overflow-hidden">
      {/* ========== 背景装饰层 ========== */}
      
      {/* 六边形网格 */}
      <HexagonGrid className="text-pixel-primary" />
      
      {/* 电路板纹理 */}
      <CircuitPattern />
      
      {/* 立方体网格 */}
      <CubeGrid className="text-pixel-accent" />
      
      {/* 全息扫描线 */}
      <HologramScanlines />
      
      {/* 数据流动 */}
      <DataStream className="opacity-20" />
      
      {/* 浮动粒子 */}
      <FloatingParticles count={30} className="opacity-30" />
      
      {/* 数字雨 */}
      <DigitalRain className="opacity-20" />
      
      {/* 四角装饰 */}
      <TechCorners className="text-pixel-primary opacity-30" />
      
      {/* ========== 主要内容 ========== */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 relative">
          {/* 雷达扫描圈 - 背景 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <RadarCircle size={800} />
          </div>
          
          {/* 能量脉冲 - 左上 */}
          <div className="absolute top-20 left-20 w-64 h-64 opacity-20">
            <EnergyPulse />
          </div>
          
          {/* 能量脉冲 - 右下 */}
          <div className="absolute bottom-20 right-20 w-64 h-64 opacity-20">
            <EnergyPulse />
          </div>
          
          <div className="text-center max-w-4xl mx-auto relative">
            {/* 主Logo */}
            <div className="mb-12">
              <OECELogo 
                size={300}
                animated={true}
                glowing={true}
              />
            </div>
            
            {/* 站点名称 */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-mono">
              <span className="text-neon">OECE</span>
              <span className="text-neon-cyan">.TECH</span>
            </h1>
            
            {/* 副标题 */}
            <div className="mb-8 space-y-3">
              <p className="text-2xl md:text-3xl text-pixel-danger font-mono animate-pulse flex items-center justify-center gap-3">
                <Eye size={28} />
                <span>Underground Tech Community</span>
                <Eye size={28} />
              </p>
              <p className="text-lg md:text-xl text-pixel-accent font-mono">
                // 匿名技術討論 · VPN/VPS · 突破封鎖
              </p>
              <p className="text-base text-pixel-light/70 font-mono">
                🔒 完全匿名 · 🌐 技術自由 · 💬 安全討論
              </p>
            </div>
            
            {/* 免责声明 */}
            <div className="mb-10 card-pixel border-pixel-warning bg-pixel-warning/5 p-4 backdrop-blur-sm max-w-2xl mx-auto">
              <p className="text-xs text-pixel-warning font-mono">
                ⚠️ 僅供技術研究學習 · 請勿用於非法用途 · 一切行為與平台無關
              </p>
            </div>
            
            {/* CTA按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/auth/register" 
                className="btn-pixel group relative overflow-hidden px-8 py-4"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Lock size={20} />
                  <span>匿名註冊進入</span>
                  <ArrowRight size={20} />
                </span>
                <div className="absolute inset-0 bg-pixel-primary/20 translate-x-full group-hover:translate-x-0 transition-transform" />
              </Link>
              
              <Link 
                href="/forum" 
                className="btn-pixel-outline group px-8 py-4"
              >
                <Eye size={20} className="inline mr-2" />
                <span>窺探技術論壇</span>
              </Link>
            </div>
            
            {/* 在线用户 */}
            <div className="mt-8 flex items-center justify-center gap-2 text-sm font-mono text-pixel-light/70">
              <div className="w-2 h-2 bg-pixel-primary rounded-full animate-pulse" />
              <span>當前在線: <span className="text-pixel-primary">42</span> 位匿名用戶</span>
            </div>
          </div>
        </section>
        
        {/* ========== 核心功能展示 ========== */}
        <section className="py-20 px-4 relative">
          {/* 标题 */}
          <div className="text-center mb-16 relative">
            {/* 背景装饰 */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <polygon 
                  points="100,10 190,50 190,150 100,190 10,150 10,50" 
                  fill="none" 
                  stroke="#00ff88" 
                  strokeWidth="2"
                />
                <polygon 
                  points="100,30 170,60 170,140 100,170 30,140 30,60" 
                  fill="none" 
                  stroke="#00d4ff" 
                  strokeWidth="1"
                  opacity="0.5"
                />
              </svg>
            </div>
            
            <h2 className="text-pixel-xl mb-4 text-neon-cyan font-mono relative z-10">
              {'[CORE_FEATURES]'
            </h2>
            <p className="text-pixel-light/70 font-mono relative z-10">
              為大陸兄弟開天窗，技術無國界
            </p>
          </div>
          
          {/* 功能卡片 */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 匿名论坛 */}
            <div className="card-pixel-glow group cursor-pointer hover:border-pixel-primary transition-all relative overflow-hidden">
              {/* 卡片背景装饰 */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="1" fill="#00ff88" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
              </div>
              
              <div className="p-6 relative z-10">
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
            <div className="card-pixel-glow group cursor-pointer hover:border-pixel-accent transition-all relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="lines" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="20" y2="20" stroke="#00d4ff" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#lines)" />
                </svg>
              </div>
              
              <div className="p-6 relative z-10">
                <div className="w-16 h-16 rounded-full bg-pixel-accent/20 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Shield className="text-pixel-accent" size={32} />
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
            <div className="card-pixel-glow group cursor-pointer hover:border-pixel-secondary transition-all relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <rect x="0" y="0" width="20" height="20" fill="none" stroke="#ff3366" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              <div className="p-6 relative z-10">
                <div className="w-16 h-16 rounded-full bg-pixel-secondary/20 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Zap className="text-pixel-secondary" size={32} />
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
        
        {/* ========== 底部警告 ========== */}
        <section className="py-12 px-4 text-center relative">
          <div className="card-pixel border-pixel-danger bg-pixel-danger/5 p-6 max-w-4xl mx-auto backdrop-blur-sm">
            <h3 className="text-pixel-lg text-pixel-danger mb-3 font-mono">
              ⚠️ 重要提醒
            </h3>
            <p className="text-sm text-pixel-light/80 leading-relaxed mb-4">
              OECE.TECH 是一個<strong className="text-pixel-warning">技術討論平台</strong>，
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
