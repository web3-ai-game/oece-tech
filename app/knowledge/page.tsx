"use client";

import { useState } from "react";
import { Search, BookOpen, Sparkles, Zap, Database, Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { TechStack } from "@/components/tech-stack";
import { SocialChannels, AuthProviders } from "@/components/social-channels";
import { useLanguage } from "@/lib/language-provider";

const categories = [
  { 
    id: "ai-strategy", 
    name: "AI 戰略核心", 
    nameEn: "AI Strategy Core",
    icon: Sparkles, 
    color: "#4285F4",
    count: 8
  },
  { 
    id: "deepweay-products", 
    name: "DeepWeay 產品矩陣", 
    nameEn: "DeepWeay Products",
    icon: Rocket, 
    color: "#F59E0B",
    count: 12
  },
  { 
    id: "cyber-universe", 
    name: "賽博宇宙觀", 
    nameEn: "Cyber Universe",
    icon: Zap, 
    color: "#8B5CF6",
    count: 6
  },
  { 
    id: "oece-engineering", 
    name: "OECE 工程體系", 
    nameEn: "OECE Engineering",
    icon: Database, 
    color: "#22C55E",
    count: 15
  },
  { 
    id: "resources", 
    name: "資源與工具", 
    nameEn: "Resources & Tools",
    icon: BookOpen, 
    color: "#06B6D4",
    count: 10
  },
];

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("");
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
            <Link href="/knowledge" className="px-3 py-1.5 text-sm text-[#00FF41]">
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
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] text-xs font-medium">
              🧠 Knowledge Distillation · 向量記憶 · 語義路由
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3">
              Knowledge <span className="text-[#00FF41]">Base</span>
            </h1>
            <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto mb-8">
              我們把海量資料做「可檢索的語義蒸餾」，存入向量庫，並用語義路由把每次提問導向最合適的推理鏈。
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search knowledge base..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#00FF41] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/knowledge/${cat.id}`}
                className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#00FF41]/30 hover:bg-white/10 transition-all"
              >
                <cat.icon 
                  className="h-8 w-8 mb-4" 
                  style={{ color: cat.color }}
                />
                <h3 className="text-lg font-semibold mb-1 group-hover:text-[#00FF41] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{cat.nameEn}</p>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{cat.count} articles</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto text-center">
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-blue-400">51+</div>
              <div className="text-xs text-gray-500">Articles</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-green-400">5</div>
              <div className="text-xs text-gray-500">Categories</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-purple-400">∞</div>
              <div className="text-xs text-gray-500">AI Powered</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Unified Section */}
      <footer className="border-t border-white/10 bg-gradient-to-b from-transparent to-black/30">
        <AuthProviders />
        <SocialChannels />
        <TechStack />
        <div className="py-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-lg font-medium text-white mb-2">📞 +66 88 88080888</p>
            <p className="text-xs text-gray-500 mb-4">© 2025 OECE Tech · Built with 🔥 Firebase · Powered by Gemini AI</p>
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
