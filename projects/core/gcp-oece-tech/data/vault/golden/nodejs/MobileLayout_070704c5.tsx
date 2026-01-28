'use client'

import { ReactNode, useState } from 'react'
import { Home, MessageSquare, Mail, User, Eye, Signal, Wifi } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MobileLayoutProps {
  children: ReactNode
}

// 移动端主布局
export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-pixel-darker pb-20">
      {/* 顶部状态栏 */}
      <MobileStatusBar />
      
      {/* 主内容区域 */}
      <main className="pt-12">
        {children}
      </main>
      
      {/* 底部导航栏 */}
      <MobileBottomNav />
    </div>
  )
}

// 移动端状态栏
function MobileStatusBar() {
  const [isSecure] = useState(true)
  const [onlineUsers] = useState(42)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-pixel-darker/98 backdrop-blur-md border-b border-pixel-danger shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        {/* 左：安全状态 */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isSecure ? 'bg-pixel-danger animate-pulse' : 'bg-pixel-light/30'}`} />
          <span className="text-xs font-mono text-pixel-danger font-bold">
            {isSecure ? 'SECURE' : 'OFFLINE'
          </span>
          <Signal size={12} className="text-pixel-primary" />
        </div>
        
        {/* 中：标题/Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Eye size={16} className="text-pixel-accent animate-pulse" />
          <span className="font-mono text-sm text-pixel-light/90">GeekSEA</span>
        </Link>
        
        {/* 右：在线人数 */}
        <div className="flex items-center gap-1.5">
          <Wifi size={12} className="text-pixel-primary" />
          <span className="text-xs text-pixel-light/70 font-mono">{onlineUsers}</span>
        </div>
      </div>
      
      {/* 扫描线效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pixel-primary to-transparent opacity-50" />
    </div>
  )
}

// 移动端底部导航
function MobileBottomNav() {
  const pathname = usePathname()
  
  const navItems = [
    { icon: Home, label: '首頁', href: '/', badge: 0 },
    { icon: MessageSquare, label: '論壇', href: '/forum', badge: 0 },
    { icon: Mail, label: '信箱', href: '/messages', badge: 3 },
    { icon: User, label: '我的', href: '/dashboard', badge: 0 },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-pixel-darker/98 backdrop-blur-md border-t border-pixel-grid shadow-lg">
      {/* 顶部装饰线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pixel-accent to-transparent opacity-30" />
      
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 relative transition-all ${
                isActive ? 'text-pixel-primary' : 'text-pixel-light/50'
              }`}
            >
              <div className="relative">
                <Icon size={20} />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-pixel-danger text-pixel-darker text-xs flex items-center justify-center rounded-full font-mono">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-mono">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-pixel-primary" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// 移动端卡片组件
export function MobileCard({ children, className = '', onClick }: unknown) {
  return (
    <div 
      onClick={onClick}
      className={`card-pixel p-4 active:scale-[0.98] transition-transform cursor-pointer ${className}`}
    >
      {children}
    </div>
  )
}

// 移动端空状态
export function MobileEmpty({ icon: Icon, title, description, action }: unknown) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-pixel-grid/50 flex items-center justify-center mb-4">
        <Icon size={32} className="text-pixel-light/30" />
      </div>
      <h3 className="text-base text-pixel-light/70 mb-2">{title}</h3>
      <p className="text-sm text-pixel-light/50 mb-6">{description}</p>
      {action && (
        <button className="btn-pixel text-sm">{action}</button>
      )}
    </div>
  )
}

// 移动端加载骨架
export function MobileSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="card-pixel p-4 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-pixel-grid" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-pixel-grid rounded w-3/4" />
              <div className="h-3 bg-pixel-grid rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// 移动端下拉刷新
export function PullToRefresh({ onRefresh, children }: unknown) {
  const [pulling, setPulling] = useState(false)
  const [startY, setStartY] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY > 0) {
      const currentY = e.touches[0].clientY
      const diff = currentY - startY
      if (diff > 50) {
        setPulling(true)
      }
    }
  }

  const handleTouchEnd = async () => {
    if (pulling) {
      await onRefresh()
      setPulling(false)
    }
    setStartY(0)
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {pulling && (
        <div className="text-center py-4 text-pixel-primary text-sm font-mono">
          釋放刷新...
        </div>
      )}
      {children}
    </div>
  )
}

// 移动端FAB按钮
export function MobileFAB({ icon: Icon, onClick, label }: unknown) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 w-14 h-14 bg-pixel-primary rounded-full shadow-lg shadow-pixel-primary/50 flex items-center justify-center active:scale-95 transition-all z-40"
      aria-label={label}
    >
      <Icon size={24} className="text-pixel-darker" />
    </button>
  )
}
