import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Fluffy - 全栈应用',
  description: '基于Google Cloud的轻量级全栈应用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <header className="bg-primary-600 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Fluffy</h1>
            <nav className="mt-2">
              <a href="/" className="mr-4 hover:underline">首页</a>
              <a href="/dashboard" className="mr-4 hover:underline">仪表板</a>
              <a href="/profile" className="mr-4 hover:underline">个人资料</a>
            </nav>
          </div>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          <p>&copy; 2023 Fluffy. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}