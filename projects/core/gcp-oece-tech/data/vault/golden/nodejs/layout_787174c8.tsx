import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OECE.TECH | 數字遊民漂流日記',
  description: '記錄數字遊民在全球漂流的生活、分享實用教程與在線工具。A tech blog about coding while traveling the world.',
  keywords: '數字遊民, digital nomad, developer, travel, coding, tutorials, 在線工具, 漂流日記',
  
  openGraph: {
    title: 'OECE.TECH | 數字遊民漂流日記',
    description: '記錄數字遊民在全球漂流的生活、分享實用教程與在線工具。',
    url: 'https://oece.tech',
    siteName: 'OECE.TECH',
    type: 'website',
    // 為了獲得最佳的預覽卡片效果，請在此處添加一個圖片的絕對 URL
    // 例如： images: ['https://oece.tech/og-image.png'],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'OECE.TECH | 數字遊民漂流日記',
    description: '記錄數字遊民在全球漂流的生活、分享實用教程與在線工具。',
    // 同樣，建議為 Twitter 卡片也提供圖片
    // 例如： images: ['https://oece.tech/twitter-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}
