'use client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ReactNode } from 'react'

interface ToolKitLayoutProps {
  title: string
  subtitle: string
  icon: ReactNode
  backLink: string
  backText: string
  children: ReactNode
  className?: string
}

export default function ToolKitLayout({
  title,
  subtitle,
  icon,
  backLink,
  backText,
  children,
  className = ''
}: ToolKitLayoutProps) {
  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <Link href="/" className="pixel-logo">OECE.TECH</Link>
            <div className="tagline">// 數位游牧開發者日誌</div>
          </div>
          <nav className="nav">
            <Link href="/">首頁</Link>
            <Link href="/tutorials">教學</Link>
            <Link href="/journey">旅程</Link>
            <Link href="/toolkits">工具包</Link>
          </nav>
        </div>
      </header>

      <main className={`main ${className}`}>
        <div className="tool-page-header">
          <Link href={backLink} className="back-link">
            <ArrowLeft size={20} />
            <span>{backText}</span>
          </Link>
          <div className="tool-title-section">
            <div className="tool-icon-large">
              {icon}
            </div>
            <div>
              <h1 className="tool-title">{title}</h1>
              <p className="tool-subtitle">{subtitle}</p>
            </div>
          </div>
        </div>

        <div className="tool-container">
          {children}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 OECE.TECH | Coded with ☕ from various corners of the world</p>
        </div>
      </footer>
    </div>
  )
}
