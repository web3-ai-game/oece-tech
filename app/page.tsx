"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { ChatWindow } from "@/components/chat-window";
import { TechStack } from "@/components/tech-stack";
import { SocialChannels, AuthProviders } from "@/components/social-channels";
import { Sparkles, MessageSquare, Zap, FileText, CreditCard } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-[var(--background)]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--primary)]" />
            <span className="text-lg font-semibold">OECE.tech</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/knowledge" className="px-3 py-1.5 text-sm hover:text-[var(--primary)] transition-colors">
              Knowledge
            </Link>
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/login" className="px-3 py-1.5 text-sm hover:text-[var(--primary)] transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="px-3 py-1.5 text-sm bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Unified Flow */}
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
              AI-Powered <span className="text-[var(--primary)]">Knowledge Engine</span>
            </h1>
            <p className="text-sm text-[var(--foreground)]/60 max-w-xl mx-auto">
              Chat with Gemini AI, explore knowledge base, unlock the future.
            </p>
          </div>

          {/* Chat Window */}
          <div className="mb-6">
            <ChatWindow />
          </div>
          
          {/* Quick Actions */}
          <div className="flex justify-center gap-3 mb-8">
            <button className="flex items-center gap-2 px-4 py-2 border border-[var(--foreground)]/20 rounded-lg text-xs hover:border-[var(--primary)] transition-colors">
              <CreditCard className="h-3.5 w-3.5" />
              Pricing
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-[var(--foreground)]/20 rounded-lg text-xs hover:border-[var(--primary)] transition-colors">
              <FileText className="h-3.5 w-3.5" />
              Docs
            </button>
          </div>

          {/* Features - Inline */}
          <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto mb-12">
            <div className="p-3 rounded-lg bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 transition-colors text-center">
              <Sparkles className="h-4 w-4 text-[var(--primary)] mx-auto mb-1" />
              <h3 className="text-xs font-semibold mb-0.5">Gemini Pro</h3>
              <p className="text-[10px] text-[var(--foreground)]/50">Unlimited Lite</p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 transition-colors text-center">
              <MessageSquare className="h-4 w-4 text-[var(--primary)] mx-auto mb-1" />
              <h3 className="text-xs font-semibold mb-0.5">Smart Chat</h3>
              <p className="text-[10px] text-[var(--foreground)]/50">Multi-modal</p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 transition-colors text-center">
              <Zap className="h-4 w-4 text-[var(--primary)] mx-auto mb-1" />
              <h3 className="text-xs font-semibold mb-0.5">Beta Free</h3>
              <p className="text-[10px] text-[var(--foreground)]/50">All features</p>
            </div>
          </div>
        </div>
      </main>

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
