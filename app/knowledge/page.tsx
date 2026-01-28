"use client";

import { useState } from "react";
import { Search, BookOpen, Sparkles, Zap, Database, Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";
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
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      {/* Background Effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--primary)]/5 pointer-events-none" />

      <SharedHeader currentPage="knowledge" />

      {/* Main Content */}
      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--border)] text-[var(--primary)] text-xs font-medium">
              🧠 Knowledge Distillation · 向量記憶 · 語義路由
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3">
              {lang === "zh" ? "知識" : "Knowledge"} <span className="text-[var(--primary)]">{lang === "zh" ? "庫" : "Base"}</span>
            </h1>
            <p className="text-sm md:text-base text-[var(--muted)] max-w-2xl mx-auto mb-8">
              {lang === "zh" 
                ? "我們把海量資料做「可檢索的語義蒸餾」，存入向量庫，並用語義路由把每次提問導向最合適的推理鏈。"
                : "We distill massive data into searchable semantic vectors, stored in vector DB, with semantic routing to guide each query to the optimal reasoning chain."
              }
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "zh" ? "搜索知識庫..." : "Search knowledge base..."}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] focus:border-[var(--primary)] outline-none transition-colors text-[var(--foreground)]"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/knowledge/${cat.id}`}
                className="group p-6 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/50 transition-all"
              >
                <cat.icon 
                  className="h-8 w-8 mb-4" 
                  style={{ color: cat.color }}
                />
                <h3 className="text-lg font-semibold mb-1 group-hover:text-[var(--primary)] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-[var(--muted)] mb-3">{cat.nameEn}</p>
                <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>{cat.count} {lang === "zh" ? "篇文章" : "articles"}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto text-center">
            <div className="p-4 rounded-lg bg-[var(--card)]">
              <div className="text-2xl font-bold text-blue-400">51+</div>
              <div className="text-xs text-[var(--muted)]">{lang === "zh" ? "文章" : "Articles"}</div>
            </div>
            <div className="p-4 rounded-lg bg-[var(--card)]">
              <div className="text-2xl font-bold text-green-400">5</div>
              <div className="text-xs text-[var(--muted)]">{lang === "zh" ? "分類" : "Categories"}</div>
            </div>
            <div className="p-4 rounded-lg bg-[var(--card)]">
              <div className="text-2xl font-bold text-purple-400">∞</div>
              <div className="text-xs text-[var(--muted)]">{lang === "zh" ? "AI 驅動" : "AI Powered"}</div>
            </div>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
