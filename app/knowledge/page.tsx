"use client";

import { useState } from "react";
import { Search, BookOpen, Sparkles, Zap, Database, Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";

const categories = [
  { 
    id: "ai-strategy", 
    name: "AI Strategy Core", 
    desc: "Strategic AI frameworks and methodologies",
    icon: Sparkles, 
    color: "#4285F4",
    count: 8
  },
  { 
    id: "deepweay-products", 
    name: "DeepWeay Products", 
    desc: "Product matrix and ecosystem",
    icon: Rocket, 
    color: "#F59E0B",
    count: 12
  },
  { 
    id: "cyber-universe", 
    name: "Cyber Universe", 
    desc: "Digital philosophy and worldview",
    icon: Zap, 
    color: "#8B5CF6",
    count: 6
  },
  { 
    id: "oece-engineering", 
    name: "OECE Engineering", 
    desc: "Technical architecture and systems",
    icon: Database, 
    color: "#22C55E",
    count: 15
  },
  { 
    id: "resources", 
    name: "Resources & Tools", 
    desc: "Utilities and development resources",
    icon: BookOpen, 
    color: "#06B6D4",
    count: 10
  },
];

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("");

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
              🧠 Knowledge Distillation · Vector Memory · Semantic Routing
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3">
              Knowledge <span className="text-[var(--primary)]">Base</span>
            </h1>
            <p className="text-sm md:text-base text-[var(--muted)] max-w-2xl mx-auto mb-8">
              We distill massive data into searchable semantic vectors, stored in vector DB, with semantic routing to guide each query to the optimal reasoning chain.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search knowledge base..."
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
                <p className="text-sm text-[var(--muted)] mb-3">{cat.desc}</p>
                <div className="flex items-center justify-between text-xs text-[var(--muted)]">
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
            <div className="p-4 rounded-lg bg-[var(--card)]">
              <div className="text-2xl font-bold text-blue-400">51+</div>
              <div className="text-xs text-[var(--muted)]">Articles</div>
            </div>
            <div className="p-4 rounded-lg bg-[var(--card)]">
              <div className="text-2xl font-bold text-green-400">5</div>
              <div className="text-xs text-[var(--muted)]">Categories</div>
            </div>
            <div className="p-4 rounded-lg bg-[var(--card)]">
              <div className="text-2xl font-bold text-purple-400">∞</div>
              <div className="text-xs text-[var(--muted)]">AI Powered</div>
            </div>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
