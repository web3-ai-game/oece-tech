import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DeepWeay SMS | 知識蒸餾平台',
  description: '向量擴散 · 知識蒸餾 · AI驅動',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen bg-[#0a0a0f]">
        {/* 背景網格 */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
        
        {/* 光暈效果 */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
