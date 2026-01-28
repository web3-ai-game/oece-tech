"use client";

import { useState } from "react";
import { Search, BookOpen, Sparkles, Zap, Database, Rocket } from "lucide-react";
import Link from "next/link";

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

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-[var(--background)]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--primary)]" />
            <span className="text-lg font-semibold">OECE.tech</span>
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Knowledge <span className="text-[var(--primary)]">Base</span>
            </h1>
            <p className="text-sm text-gray-400 mb-8">
              Explore AI strategies, product insights, and engineering best practices
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search knowledge base..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--primary)] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/knowledge/${cat.id}`}
                className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
              >
                <cat.icon 
                  className="h-8 w-8 mb-4" 
                  style={{ color: cat.color }}
                />
                <h3 className="text-lg font-semibold mb-1 group-hover:text-[var(--primary)] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{cat.nameEn}</p>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{cat.count} articles</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
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
    </div>
  );
}
