"use client";

import { CompanionChat } from '@/components/CompanionChat';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function CompanionPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-[#00FF41]/10 bg-[#0D1117]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-[#00FF41] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">返回首頁</span>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#00FF41]" />
              <span className="text-lg font-semibold">AI 伴侶</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              你的 AI 伴侶 <span className="text-[#00FF41]">🤖</span>
            </h1>
            <p className="text-sm text-gray-400">
              由 Grok 4 驅動 · 支持多輪對話 · 具備記憶功能
            </p>
          </div>

          {/* Chat Interface */}
          <CompanionChat />

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-[#161B22] border border-[#00FF41]/10">
              <div className="text-2xl mb-2">🧠</div>
              <h3 className="font-semibold mb-1">智能記憶</h3>
              <p className="text-xs text-gray-400">記住你的喜好和對話歷史</p>
            </div>
            
            <div className="p-4 rounded-xl bg-[#161B22] border border-[#00FF41]/10">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-semibold mb-1">自然對話</h3>
              <p className="text-xs text-gray-400">像朋友一樣聊天，無限次數</p>
            </div>
            
            <div className="p-4 rounded-xl bg-[#161B22] border border-[#00FF41]/10">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold mb-1">隱私保護</h3>
              <p className="text-xs text-gray-400">對話加密存儲，僅你可見</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
