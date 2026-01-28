import Link from 'next/link'
import { Github, Twitter, Mail, Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-pixel-dark border-t-4 border-pixel-grid mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pixel-primary border-4 border-pixel-darker flex items-center justify-center">
                <span className="text-pixel-darker font-pixel text-pixel-xs">G</span>
              </div>
              <span className="font-pixel text-pixel-base text-pixel-primary">
                GeekSEA
              </span>
            </div>
            <p className="text-pixel-light/70 text-sm font-sans leading-relaxed">
              專業技術教程平台
              <br />
              像素化 Web3 風格
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-pixel text-pixel-sm text-pixel-accent mb-4">
              快速連結
            </h3>
            <ul className="space-y-2 font-sans text-sm">
              <li>
                <Link 
                  href="/tutorials" 
                  className="text-pixel-light/70 hover:text-pixel-primary transition-colors"
                >
                  教程列表
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-pixel-light/70 hover:text-pixel-primary transition-colors"
                >
                  關於我們
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-pixel-light/70 hover:text-pixel-primary transition-colors"
                >
                  聯絡我們
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-pixel-light/70 hover:text-pixel-primary transition-colors"
                >
                  常見問題
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-pixel text-pixel-sm text-pixel-accent mb-4">
              教程分類
            </h3>
            <ul className="space-y-2 font-sans text-sm">
              <li>
                <Link 
                  href="/tutorials/web3" 
                  className="text-pixel-light/70 hover:text-pixel-primary transition-colors"
                >
                  Web3 開發
                </Link>
              </li>
              <li>
                <Link 
                  href="/tutorials/frontend" 
                  className="text-pixel-light/70 hover:text-pixel-primary transition-colors"
                >
                  前端開發
                </Link>
              </li>
              <li>
                <Link 
                  href="/tutorials/backend" 
                  className="text-pixel-light/70 hover:text-pixel-primary transition-colors"
                >
                  後端開發
                </Link>
              </li>
              <li>
                <Link 
                  href="/tutorials/design" 
                  className="text-pixel-light/70 hover:text-pixel-primary transition-colors"
                >
                  設計系統
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-pixel text-pixel-sm text-pixel-accent mb-4">
              社交媒體
            </h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pixel-darker border-2 border-pixel-grid hover:border-pixel-primary flex items-center justify-center transition-colors group"
                aria-label="GitHub"
              >
                <Github size={20} className="text-pixel-light group-hover:text-pixel-primary" />
              </a>
              
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pixel-darker border-2 border-pixel-grid hover:border-pixel-accent flex items-center justify-center transition-colors group"
                aria-label="Twitter"
              >
                <Twitter size={20} className="text-pixel-light group-hover:text-pixel-accent" />
              </a>
              
              <a
                href="mailto:hello@geeksea.com"
                className="w-10 h-10 bg-pixel-darker border-2 border-pixel-grid hover:border-pixel-secondary flex items-center justify-center transition-colors group"
                aria-label="Email"
              >
                <Mail size={20} className="text-pixel-light group-hover:text-pixel-secondary" />
              </a>
            </div>
            
            <div className="mt-6">
              <p className="text-pixel-light/70 text-sm font-sans">
                訂閱最新教程
              </p>
              <div className="mt-2 flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input-pixel flex-1 text-xs py-2"
                />
                <button className="btn-pixel text-pixel-xs px-3 py-2">
                  訂閱
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t-2 border-pixel-grid">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-pixel-light/50 text-sm font-sans flex items-center gap-2">
              © {currentYear} GeekSEA. Made with 
              <Heart size={16} className="text-pixel-danger animate-pulse" /> 
              by Geeks
            </p>
            
            <div className="flex gap-6 text-sm font-sans">
              <Link 
                href="/privacy" 
                className="text-pixel-light/50 hover:text-pixel-primary transition-colors"
              >
                隱私政策
              </Link>
              <Link 
                href="/terms" 
                className="text-pixel-light/50 hover:text-pixel-primary transition-colors"
              >
                使用條款
              </Link>
              <Link 
                href="/sitemap" 
                className="text-pixel-light/50 hover:text-pixel-primary transition-colors"
              >
                網站地圖
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pixel Art Decoration */}
      <div className="h-4 bg-gradient-to-r from-pixel-primary via-pixel-accent to-pixel-secondary" />
    </footer>
  )
}
