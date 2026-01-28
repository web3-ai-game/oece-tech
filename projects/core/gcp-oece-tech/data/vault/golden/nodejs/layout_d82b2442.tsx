import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cyberpunk Nexus',
  description: 'A cyberpunk-themed Next.js application with glitch effects',
  keywords: ['cyberpunk', 'nextjs', 'typescript', 'tailwind'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-darkMode text-neon antialiased font-mono">
        <div className="scanlines" />
        <div className="cyber-grid-overlay" />
        {children}
      </body>
    </html>
  )
}
