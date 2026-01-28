'use client'

import Link from 'next/link'
import { BookOpen, Coins, TrendingUp, MessageSquare, Zap, Shield, Eye, Users, Activity, ArrowRight } from 'lucide-react'
import { OECELogo } from '@/components/logo/OECELogo'
import { 
  WaveBackground,
  CirclePulses,
  ShootingStars,
  CircularGrid,
  GlowingRings,
  DataFlowLines,
  RoundedRectGrid,
  GlowDots,
  CircularProgress,
  IconDecorations
} from '@/components/decorations/EnhancedSVGDecorations'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-pixel-darker overflow-hidden">
      {/* 多层SVG背景装饰 */}
      <WaveBackground />
      <CircularGrid />
      <RoundedRectGrid />
      <DataFlowLines />
      <GlowDots />
      <CirclePulses />
      <ShootingStars />
      <IconDecorations />
      
      <div className="relative z-10">
        
        {/* Hero Section - 紧凑型 */}
        <section className="py-8 sm:py-12 px-3 sm:px-4">
          <div className="max-w-7xl mx-auto">
            
            {/* Logo + 标题 - 水平布局（移动端） */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="flex-shrink-0">
                <OECELogo size={100} animated={true} glowing={true} />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 font-mono">
                  <span className="text-neon">OECE</span>
                  <span className="text-neon-cyan">.TECH</span>
                </h1>
                <p className="text-base sm:text-lg text-pixel-accent font-mono">
                  技術教程聚合平台
                </p>
                <p className="text-sm text-pixel-light/60 mt-1">
                  🔐 匿名 · 📚 30+教程 · 💰 積分眾包
                </p>
              </div>
            </div>
            
            {/* CTA按钮 - 紧凑 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link href="/tutorials" className="btn-pixel flex items-center justify-center gap-2 py-3 text-base">
                <BookOpen size={20} />
                <span>瀏覽教程</span>
              </Link>
              <Link href="/auth/register" className="btn-pixel-outline flex items-center justify-center gap-2 py-3 text-base">
                <Coins size={20} />
                <span>賺取積分</span>
              </Link>
            </div>
          </div>
        </section>
        
        {/* 数据面板 - 密集展示 */}
        <section className="py-6 px-3 sm:px-4">
          <div className="max-w-7xl mx-auto">
            
            {/* 标题 */}
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 font-mono text-neon flex items-center justify-center gap-2">
              <Activity size={24} />
              <span>實時數據</span>
            </h2>
            
            {/* 数据卡片 - 4列紧凑 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              
              {/* 在线用户 */}
              <div className="bg-pixel-dark/80 backdrop-blur-sm rounded-2xl p-4 border border-pixel-grid hover:border-pixel-primary transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-pixel-primary/20 flex items-center justify-center">
                    <Users className="text-pixel-primary" size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pixel-primary font-mono">42</div>
                    <div className="text-xs text-pixel-light/60">在線用戶</div>
                  </div>
                </div>
              </div>
              
              {/* 教程数量 */}
              <div className="bg-pixel-dark/80 backdrop-blur-sm rounded-2xl p-4 border border-pixel-grid hover:border-pixel-accent transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-pixel-accent/20 flex items-center justify-center">
                    <BookOpen className="text-pixel-accent" size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pixel-accent font-mono">30+</div>
                    <div className="text-xs text-pixel-light/60">專業教程</div>
                  </div>
                </div>
              </div>
              
              {/* 总积分 */}
              <div className="bg-pixel-dark/80 backdrop-blur-sm rounded-2xl p-4 border border-pixel-grid hover:border-pixel-warning transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-pixel-warning/20 flex items-center justify-center">
                    <Coins className="text-pixel-warning" size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pixel-warning font-mono">1.2M</div>
                    <div className="text-xs text-pixel-light/60">總積分</div>
                  </div>
                </div>
              </div>
              
              {/* 讨论数 */}
              <div className="bg-pixel-dark/80 backdrop-blur-sm rounded-2xl p-4 border border-pixel-grid hover:border-pixel-secondary transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-pixel-secondary/20 flex items-center justify-center">
                    <MessageSquare className="text-pixel-secondary" size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pixel-secondary font-mono">580</div>
                    <div className="text-xs text-pixel-light/60">討論主題</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* 热门教程 - 横向滚动 */}
        <section className="py-6 px-3 sm:px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-neon flex items-center gap-2">
                <Zap size={24} />
                <span>熱門教程</span>
              </h2>
              <Link href="/tutorials" className="text-sm text-pixel-accent hover:text-pixel-primary transition-colors flex items-center gap-1">
                <span>查看全部</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="overflow-x-auto pb-4 -mx-3 px-3">
              <div className="flex gap-3 min-w-max">
                {[
                  { emoji: '🚀', title: 'Google郵箱註冊', cat: '出海', views: '2.3K', likes: 156 },
                  { emoji: '🔐', title: 'VPN搭建完整指南', cat: 'VPN', views: '1.8K', likes: 234 },
                  { emoji: '🕵️', title: '社工防範技巧', cat: '安全', views: '1.5K', likes: 189 },
                  { emoji: '🐧', title: 'Kali環境搭建', cat: 'Kali', views: '1.2K', likes: 167 },
                  { emoji: '🛡️', title: 'Tor網絡使用', cat: '匿名', views: '980', likes: 145 }
                ].map((tutorial, i) => (
                  <div key={i} className="w-64 flex-shrink-0">
                    <div className="bg-pixel-dark/80 backdrop-blur-sm rounded-2xl p-4 border border-pixel-grid hover:border-pixel-primary transition-all">
                      <div className="text-3xl mb-3">{tutorial.emoji}</div>
                      <div className="text-base font-bold text-pixel-light mb-2 line-clamp-2">
                        {tutorial.title}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2 py-1 bg-pixel-primary/20 text-pixel-primary rounded-lg">
                          {tutorial.cat}
                        </span>
                        <div className="flex items-center gap-3 text-pixel-light/60">
                          <span>👁️ {tutorial.views}</span>
                          <span>❤️ {tutorial.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* 教程分类 - 紧凑网格 */}
        <section className="py-6 px-3 sm:px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 font-mono text-neon">
              📚 教程分類
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { emoji: '🚀', name: '出海第一步', count: 8, color: 'primary' },
                { emoji: '🔐', name: 'VPN/SS技術', count: 6, color: 'accent' },
                { emoji: '🕵️', name: '社會工程學', count: 5, color: 'warning' },
                { emoji: '🐧', name: 'Kali實戰', count: 4, color: 'secondary' },
                { emoji: '🛡️', name: '匿名化技術', count: 7, color: 'primary' },
                { emoji: '💻', name: 'SSH技巧', count: 5, color: 'accent' },
                { emoji: '🔧', name: '硬件改裝', count: 3, color: 'warning' },
                { emoji: '🎯', name: '反跟蹤', count: 4, color: 'danger' },
                { emoji: '🎮', name: '虛擬環境', count: 3, color: 'primary' },
                { emoji: '🌐', name: '跳坑指南', count: 6, color: 'accent' }
              ].map((cat, i) => (
                <Link 
                  key={i}
                  href={`/tutorials/${cat.name}`}
                  className="bg-pixel-dark/80 backdrop-blur-sm rounded-2xl p-4 border border-pixel-grid hover:border-pixel-primary transition-all text-center"
                >
                  <div className="text-3xl mb-2">{cat.emoji}</div>
                  <div className="text-sm font-bold text-pixel-light mb-1">{cat.name}</div>
                  <div className="text-xs text-pixel-light/60">{cat.count} 篇教程</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* 实时股市数据 - 紧凑展示 */}
        <section className="py-6 px-3 sm:px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-neon flex items-center gap-2">
                <TrendingUp size={24} />
                <span>實時數據</span>
              </h2>
              <Link href="/tools/data" className="text-sm text-pixel-accent hover:text-pixel-primary transition-colors flex items-center gap-1">
                <span>查看詳情</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
              {[
                { symbol: '^SET.BK', name: '泰國SET', price: 1420.50, change: 0.87 },
                { symbol: '^STI', name: '新加坡STI', price: 3245.80, change: -0.16 },
                { symbol: 'BTC', name: 'Bitcoin', price: 67234.50, change: 1.87 },
                { symbol: 'ETH', name: 'Ethereum', price: 3542.80, change: -1.26 },
                { symbol: 'USD/THB', name: 'USD泰銖', price: 35.42, change: 0.14 },
                { symbol: 'USD/SGD', name: 'USD新元', price: 1.34, change: -0.75 }
              ].map((data, i) => (
                <div key={i} className="bg-pixel-dark/80 backdrop-blur-sm rounded-2xl p-3 border border-pixel-grid hover:border-pixel-accent transition-all">
                  <div className="text-xs text-pixel-light/50 mb-1 font-mono">{data.symbol}</div>
                  <div className="text-lg font-bold text-pixel-light mb-1 font-mono">
                    {data.price.toLocaleString()}
                  </div>
                  <div className={`text-xs font-mono ${data.change > 0 ? 'text-pixel-primary' : 'text-pixel-danger'}`}>
                    {data.change > 0 ? '↑' : '↓' {Math.abs(data.change)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 论坛最新讨论 - 列表形式 */}
        <section className="py-6 px-3 sm:px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-neon flex items-center gap-2">
                <MessageSquare size={24} />
                <span>最新討論</span>
              </h2>
              <Link href="/forum" className="text-sm text-pixel-accent hover:text-pixel-primary transition-colors flex items-center gap-1">
                <span>進入論壇</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="space-y-3">
              {[
                { user: '神秘駭客#1024', title: '請問VPN如何選擇？', replies: 12, time: '5分鐘前', tag: 'VPN' },
                { user: '匿名開發者#2048', title: 'SSH配置問題求助', replies: 8, time: '15分鐘前', tag: 'SSH' },
                { user: '幽靈工程師#4096', title: '分享一個好用的工具', replies: 23, time: '30分鐘前', tag: '工具' },
                { user: '暗影用戶#8192', title: 'Kali最新版本測試心得', replies: 15, time: '1小時前', tag: 'Kali' }
              ].map((post, i) => (
                <div key={i} className="bg-pixel-dark/80 backdrop-blur-sm rounded-2xl p-4 border border-pixel-grid hover:border-pixel-primary transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye size={14} className="text-pixel-accent flex-shrink-0" />
                        <span className="text-xs text-pixel-accent font-mono truncate">{post.user}</span>
                        <span className="px-2 py-0.5 bg-pixel-primary/20 text-pixel-primary text-xs rounded-lg flex-shrink-0">
                          {post.tag}
                        </span>
                      </div>
                      <div className="text-base font-bold text-pixel-light mb-1 line-clamp-1">
                        {post.title}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-pixel-light/60">
                        <span>💬 {post.replies} 回覆</span>
                        <span>⏰ {post.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 积分系统 - 简化版 */}
        <section className="py-6 px-3 sm:px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 font-mono text-neon flex items-center justify-center gap-2">
              <Coins size={24} />
              <span>積分系統</span>
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {/* 获取积分 */}
              <div className="bg-pixel-dark/80 backdrop-blur-sm rounded-2xl p-6 border border-pixel-grid">
                <h3 className="text-lg font-bold text-pixel-primary mb-4 flex items-center gap-2">
                  <TrendingUp size={20} />
                  <span>獲取積分</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-pixel-light">註冊獎勵</span>
                    <span className="text-pixel-primary font-mono font-bold">+150</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-pixel-light">貢獻教程</span>
                    <span className="text-pixel-warning font-mono font-bold">+500</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-pixel-light">看廣告</span>
                    <span className="text-pixel-accent font-mono font-bold">+20</span>
                  </div>
                </div>
              </div>
              
              {/* 使用积分 */}
              <div className="bg-pixel-dark/80 backdrop-blur-sm rounded-2xl p-6 border border-pixel-grid">
                <h3 className="text-lg font-bold text-pixel-accent mb-4 flex items-center gap-2">
                  <BookOpen size={20} />
                  <span>使用積分</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-pixel-light">解鎖教程</span>
                    <span className="text-pixel-warning font-mono font-bold">50-200</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-pixel-light">下載資源</span>
                    <span className="text-pixel-danger font-mono font-bold">50-500</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-pixel-light">私密諮詢</span>
                    <span className="text-pixel-secondary font-mono font-bold">100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* 免责声明 - 精简版 */}
        <section className="py-6 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-pixel-danger/10 backdrop-blur-sm rounded-2xl p-4 border border-pixel-danger">
              <div className="flex items-start gap-3">
                <Shield className="text-pixel-danger flex-shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <div className="text-sm text-pixel-danger font-bold mb-1">重要聲明</div>
                  <div className="text-xs text-pixel-light/80 leading-relaxed">
                    本平台提供的教程內容僅供技術學習研究使用，請勿用於非法用途。
                    <Link href="/disclaimer" className="text-pixel-primary hover:underline ml-1">
                      查看完整聲明 →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  )
}
