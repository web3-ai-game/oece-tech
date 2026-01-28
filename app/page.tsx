"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { TokenMeter } from "@/components/token-meter";
import { ChatWindow } from "@/components/chat-window";
import { TechStack } from "@/components/tech-stack";
import { AssetShowcase } from "@/components/asset-showcase";
import { SocialChannels, AuthProviders } from "@/components/social-channels";
import { Sparkles, MessageSquare, Zap, FileText, CreditCard, Heart } from "lucide-react";
import { useLanguage } from "@/lib/language-provider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full bg-[#0D1117] text-white">
      {/* Matrix Background Effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#00FF41]/5 via-transparent to-[#00FF41]/5 pointer-events-none" />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-[#00FF41]/20 bg-[#0D1117]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="h-6 w-6 text-[#00FF41] animate-pulse" />
              <div className="absolute inset-0 blur-xl bg-[#00FF41]/30" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#00FF41] to-[#00FF41]/60 bg-clip-text text-transparent">OECE.tech</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/knowledge" className="px-3 py-1.5 text-sm text-gray-300 hover:text-[#00FF41] transition-colors">
              {t("nav.knowledge")}
            </Link>
            <Link href="/pricing" className="px-3 py-1.5 text-sm text-gray-300 hover:text-[#00FF41] transition-colors">
              {t("nav.pricing")}
            </Link>
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/login" className="px-4 py-2 text-sm border border-[#00FF41]/30 rounded-lg hover:border-[#00FF41] hover:bg-[#00FF41]/10 transition-all">
              {t("nav.signIn")}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] text-xs font-medium">
              🎉 Beta 免費使用 · 20人小圈子測試
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-[#00FF41] to-white bg-clip-text text-transparent">
                {t("hero.title")}
              </span>
              <br />
              <span className="text-[#00FF41] drop-shadow-[0_0_30px_rgba(0,255,65,0.5)]">
                {t("hero.highlight")}
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4 mb-20">
            <Link href="/companion" className="group relative px-8 py-4 bg-[#00FF41] text-black rounded-xl text-base font-bold hover:scale-105 transition-all shadow-2xl shadow-[#00FF41]/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <div className="relative flex items-center gap-2">
                <Heart className="h-5 w-5" />
                體驗 AI 伴侶
              </div>
            </Link>
            <Link href="/comic" className="px-8 py-4 border-2 border-[#00FF41]/30 text-[#00FF41] rounded-xl text-base font-bold hover:bg-[#00FF41]/10 hover:border-[#00FF41] transition-all">
              探索功能
            </Link>
          </div>

          {/* Features - 4 核心功能 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
            <Link href="/comic" className="group relative p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/60 transition-all hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all" />
              <div className="relative">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-purple-400 transition-colors">AI 漫畫生成器</h3>
                <p className="text-sm text-gray-400">輸入劇情，AI 生成精美漫畫分鏡</p>
              </div>
            </Link>

            <Link href="/novel" className="group relative p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/60 transition-all hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all" />
              <div className="relative">
                <div className="text-5xl mb-4">📖</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">爽文推演引擎</h3>
                <p className="text-sm text-gray-400">設定主角，自動生成爽文劇情</p>
              </div>
            </Link>

            <Link href="/pastlife" className="group relative p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/60 transition-all hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/20 group-hover:to-orange-500/20 transition-all" />
              <div className="relative">
                <div className="text-5xl mb-4">🔮</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors">前世分析器</h3>
                <p className="text-sm text-gray-400">基於生辰性格，推演前世身份</p>
              </div>
            </Link>

            <Link href="/prompts" className="group relative p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/60 transition-all hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all" />
              <div className="relative">
                <div className="text-5xl mb-4">💡</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-green-400 transition-colors">MCP 提示詞庫</h3>
                <p className="text-sm text-gray-400">精選高質量 AI 提示詞</p>
              </div>
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            <div className="text-center p-6 rounded-xl bg-[#161B22] border border-gray-700">
              <div className="text-3xl font-black text-[#00FF41] mb-2">1000+</div>
              <div className="text-sm text-gray-400">電子書資源</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-[#161B22] border border-gray-700">
              <div className="text-3xl font-black text-[#00FF41] mb-2">4</div>
              <div className="text-sm text-gray-400">AI 核心功能</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-[#161B22] border border-gray-700">
              <div className="text-3xl font-black text-[#00FF41] mb-2">20</div>
              <div className="text-sm text-gray-400">測試用戶名額</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-[#161B22] border border-gray-700">
              <div className="text-3xl font-black text-[#00FF41] mb-2">24/7</div>
              <div className="text-sm text-gray-400">全天候服務</div>
            </div>
          </div>
        </div>
      </main>

      {/* Asset Portfolio */}
      <AssetShowcase />

      {/* Footer - Unified Section */}
      <footer className="border-t border-white/10 bg-gradient-to-b from-transparent to-black/30">
        {/* 1. 登錄支持 */}
        <AuthProviders />
        
        {/* 2. 宣傳渠道 */}
        <SocialChannels />
        
        {/* 3. 技術棧背書 */}
        <TechStack />
        
        {/* 4. 聯繫方式 */}
        <div className="py-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-lg font-medium text-white mb-2">
              📞 +66 88 88080888
            </p>
            <p className="text-xs text-gray-500 mb-4">
              © 2025 OECE Tech · Built with 🔥 Firebase · Powered by Gemini AI
            </p>
            <div className="flex justify-center gap-4 text-[10px] text-gray-600">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
