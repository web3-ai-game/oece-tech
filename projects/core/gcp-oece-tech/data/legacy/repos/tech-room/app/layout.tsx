import type { Metadata } from 'next'
import { Press_Start_2P, JetBrains_Mono, Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const pressStart2P = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'GeekSEA - 專業技術教程平台',
  description: '像素化 Web3 風格的個人品牌專業教程站',
  keywords: ['Web3', '教程', '像素藝術', '技術', 'Tutorial', 'Blockchain'],
  authors: [{ name: 'GeekSEA Team' }],
  openGraph: {
    title: 'GeekSEA - 專業技術教程平台',
    description: '像素化 Web3 風格的個人品牌專業教程站',
    type: 'website',
    locale: 'zh_TW',
    alternateLocale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" className="dark">
      <body 
        className={`
          ${pressStart2P.variable} 
          ${jetbrainsMono.variable} 
          ${inter.variable}
          bg-pixel-darker text-pixel-light
          antialiased
        `}
      >
        {/* 像素網格背景 */}
        <div className="fixed inset-0 bg-pixel-grid bg-pixel-grid-size opacity-20 pointer-events-none" />
        
        {/* 掃描線效果 */}
        <div className="scanline" />
        
        {/* 主容器 */}
        <div className="relative min-h-screen flex flex-col">
          <Header />
          
          <main className="flex-1">
            {children}
          </main>
          
          <Footer />
        </div>
        
        {/* CRT 效果疊加層 */}
        <div className="crt-overlay" />
      </body>
    </html>
  )
}
