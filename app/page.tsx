"use client";

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
            <LanguageToggle />
            <ThemeToggle />
            <button className="px-3 py-1.5 text-sm hover:text-[var(--primary)] transition-colors">
              Sign In
            </button>
            <button className="px-3 py-1.5 text-sm bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero + Chat Section - Compact */}
      <main className="pt-24 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            AI-Powered <span className="text-[var(--primary)]">Knowledge Engine</span>
          </h1>
          
          <p className="text-base text-[var(--foreground)]/60 mb-8 max-w-xl mx-auto">
            Chat with Gemini AI, explore knowledge base, unlock the future.
          </p>

          {/* Chat Window */}
          <div className="mb-8">
            <ChatWindow />
          </div>
          
          {/* Compact CTA + Features Row */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button className="flex items-center gap-2 px-5 py-2.5 border border-[var(--foreground)]/20 rounded-lg text-sm hover:border-[var(--primary)] transition-colors">
              <CreditCard className="h-4 w-4" />
              View Pricing
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 border border-[var(--foreground)]/20 rounded-lg text-sm hover:border-[var(--primary)] transition-colors">
              <FileText className="h-4 w-4" />
              Documentation
            </button>
          </div>

          {/* Inline Features - More Compact */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-xl bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 transition-colors">
              <Sparkles className="h-5 w-5 text-[var(--primary)] mx-auto mb-2" />
              <h3 className="text-sm font-semibold mb-1">Gemini Pro</h3>
              <p className="text-xs text-[var(--foreground)]/50">Unlimited Lite · 5/min Pro</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 transition-colors">
              <MessageSquare className="h-5 w-5 text-[var(--primary)] mx-auto mb-2" />
              <h3 className="text-sm font-semibold mb-1">Smart Chat</h3>
              <p className="text-xs text-[var(--foreground)]/50">Files · Voice · Stream</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 transition-colors">
              <Zap className="h-5 w-5 text-[var(--primary)] mx-auto mb-2" />
              <h3 className="text-sm font-semibold mb-1">Beta Access</h3>
              <p className="text-xs text-[var(--foreground)]/50">All features FREE</p>
            </div>
          </div>
        </div>
      </main>

      {/* Tech Stack Badge Wall */}
      <TechStack />

      {/* Social Channels */}
      <SocialChannels />

      {/* Footer with Auth Providers */}
      <footer className="bg-black/30">
        <AuthProviders />
        
        <div className="border-t border-white/5 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-xs text-gray-500 mb-2">
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
