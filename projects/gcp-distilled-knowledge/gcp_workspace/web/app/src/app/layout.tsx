import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DeepWeay - 數字煉金術平台',
  description: '知識蒸餾 · 向量引擎 · AI 驅動',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
