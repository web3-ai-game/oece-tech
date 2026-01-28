'use client'

import Link from 'next/link'
import { Menu, X, User, LogIn, LogOut, BookOpen, Home, Wrench, DollarSign, MessageSquare, Activity } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { OECELogoSimple } from '@/components/logo/OECELogo'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // TODO: 從 auth context 獲取
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 bg-pixel-darker border-b-4 border-pixel-primary shadow-[0_4px_0_0_rgba(0,255,136,0.2)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <OECELogoSimple size={40} className="transition-transform group-hover:scale-110" />
            <div className="hidden sm:block">
              <div className="text-pixel-lg font-bold text-neon leading-tight font-mono">
                OECE.TECH
              </div>
              <div className="text-pixel-xs text-pixel-light/50 font-mono">
                ANONYMOUS TECH
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link 
              href="/" 
              className={`flex items-center gap-2 px-4 py-2 font-mono text-sm transition-all
                ${isActive('/') 
                  ? 'bg-pixel-primary text-pixel-darker border-2 border-pixel-darker' 
                  : 'text-pixel-light hover:text-pixel-primary hover:bg-pixel-grid border-2 border-transparent'
                }`}
            >
              <Home size={16} />
              <span>首頁</span>
            </Link>
            
            <Link 
              href="/tutorials" 
              className={`flex items-center gap-2 px-4 py-2 font-mono text-sm transition-all
                ${isActive('/tutorials')
                  ? 'bg-pixel-primary text-pixel-darker border-2 border-pixel-darker'
                  : 'text-pixel-light hover:text-pixel-primary hover:bg-pixel-grid border-2 border-transparent'
                }`}
            >
              <BookOpen size={16} />
              <span>教程</span>
            </Link>
            
            <Link 
              href="/tools" 
              className={`flex items-center gap-2 px-4 py-2 font-mono text-sm transition-all
                ${isActive('/tools')
                  ? 'bg-pixel-accent text-pixel-darker border-2 border-pixel-darker'
                  : 'text-pixel-light hover:text-pixel-accent hover:bg-pixel-grid border-2 border-transparent'
                }`}
            >
              <Wrench size={16} />
              <span>工具</span>
            </Link>
            
            <Link 
              href="/forum" 
              className={`flex items-center gap-2 px-4 py-2 font-mono text-sm transition-all
                ${isActive('/forum')
                  ? 'bg-pixel-secondary text-pixel-darker border-2 border-pixel-darker'
                  : 'text-pixel-light hover:text-pixel-secondary hover:bg-pixel-grid border-2 border-transparent'
                }`}
            >
              <MessageSquare size={16} />
              <span>論壇</span>
            </Link>
            
            <Link 
              href="/pricing" 
              className={`flex items-center gap-2 px-4 py-2 font-mono text-sm transition-all
                ${isActive('/pricing')
                  ? 'bg-pixel-warning text-pixel-darker border-2 border-pixel-darker'
                  : 'text-pixel-light hover:text-pixel-warning hover:bg-pixel-grid border-2 border-transparent'
                }`}
            >
              <DollarSign size={16} />
              <span>價格</span>
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 px-4 py-2 bg-pixel-grid hover:bg-pixel-primary hover:text-pixel-darker transition-all border-2 border-pixel-grid hover:border-pixel-primary font-mono text-sm"
                >
                  <User size={16} />
                  <span>面板</span>
                </Link>
                
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-pixel-danger hover:text-pixel-darker transition-all border-2 border-pixel-danger text-pixel-danger font-mono text-sm"
                  onClick={() => setIsLoggedIn(false)}
                >
                  <LogOut size={16} />
                  <span>登出</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-pixel-primary hover:text-pixel-darker transition-all border-2 border-pixel-primary text-pixel-primary font-mono text-sm"
                >
                  <LogIn size={16} />
                  <span>登入</span>
                </Link>
                
                <Link 
                  href="/auth/register" 
                  className="flex items-center gap-2 px-4 py-2 bg-pixel-primary hover:bg-pixel-accent transition-all border-2 border-pixel-darker text-pixel-darker font-mono text-sm shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]"
                >
                  <span>註冊</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-pixel-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-pixel-grid">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-pixel-light hover:text-pixel-primary transition-colors font-sans py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={18} />
                <span>首頁</span>
              </Link>
              
              <Link 
                href="/tutorials" 
                className="flex items-center gap-2 text-pixel-light hover:text-pixel-primary transition-colors font-sans py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen size={18} />
                <span>教程</span>
              </Link>
              
              <Link 
                href="/about" 
                className="text-pixel-light hover:text-pixel-primary transition-colors font-sans py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                關於
              </Link>
              
              <div className="border-t-2 border-pixel-grid my-2" />
              
              {isLoggedIn ? (
                <>
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-2 text-pixel-light hover:text-pixel-primary transition-colors font-sans py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>個人資料</span>
                  </Link>
                  
                  <button 
                    className="btn-pixel-outline w-full justify-center"
                    onClick={() => {
                      setIsLoggedIn(false)
                      setIsMenuOpen(false)
                    }}
                  >
                    <LogOut size={16} className="inline mr-2" />
                    登出
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link 
                    href="/auth/login" 
                    className="btn-pixel-outline text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn size={16} className="inline mr-2" />
                    登入
                  </Link>
                  
                  <Link 
                    href="/auth/register" 
                    className="btn-pixel text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    註冊
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
