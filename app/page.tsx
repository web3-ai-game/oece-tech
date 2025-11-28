"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { ChatWindow } from "@/components/chat-window";
import { Sparkles, MessageSquare, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-[var(--background)]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[var(--primary)]" />
            <span className="text-xl font-semibold">OECE.tech</span>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <ThemeToggle />
            <button className="px-4 py-2 text-sm font-medium hover:text-[var(--primary)] transition-colors">
              Sign In
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            AI-Powered
            <br />
            <span className="text-[var(--primary)]">Knowledge Engine</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--foreground)]/70 mb-12 max-w-2xl mx-auto">
            Chat with Gemini AI, explore knowledge base, and unlock the future of intelligent conversation.
          </p>

          {/* Chat Window - Direct on Homepage */}
          <div className="mb-20">
            <ChatWindow />
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <button className="px-8 py-4 border border-[var(--foreground)]/20 rounded-xl font-medium hover:border-[var(--primary)] transition-colors">
              View Pricing
            </button>
            <button className="px-8 py-4 border border-[var(--foreground)]/20 rounded-xl font-medium hover:border-[var(--primary)] transition-colors">
              Documentation
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="p-6 rounded-2xl border border-[var(--foreground)]/10 hover:border-[var(--primary)]/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Gemini Pro</h3>
              <p className="text-sm text-[var(--foreground)]/70">
                Unlimited Lite access. 5 free Pro requests per minute.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--foreground)]/10 hover:border-[var(--primary)]/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-4 mx-auto">
                <MessageSquare className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Chat</h3>
              <p className="text-sm text-[var(--foreground)]/70">
                Multi-modal support. Upload files, voice input, streaming responses.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--foreground)]/10 hover:border-[var(--primary)]/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Beta Access</h3>
              <p className="text-sm text-[var(--foreground)]/70">
                All features unlocked. Register with invite code.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--foreground)]/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-[var(--foreground)]/50">
          © 2025 OECE Tech. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
