"use client";

import { useState } from "react";
import { Search, BookOpen, Sparkles, Zap, Database, Rocket, ArrowRight, Brain, Globe, Shield, Code, FileText } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";
import { useLanguage } from "@/lib/language-provider";

const categories = [
  { 
    id: "ai-strategy", 
    nameKey: "knowledge.cat.ai",
    descKey: "knowledge.cat.ai.desc",
    icon: Brain, 
    gradient: "from-blue-500/10 to-indigo-500/10",
    border: "border-blue-500/20 hover:border-blue-500/50",
    iconColor: "text-blue-400",
    count: 156,
    tags: ["Deep Learning", "LLM", "RAG"]
  },
  { 
    id: "deepweay-products", 
    nameKey: "knowledge.cat.product",
    descKey: "knowledge.cat.product.desc",
    icon: Rocket, 
    gradient: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-500/20 hover:border-amber-500/50",
    iconColor: "text-amber-400",
    count: 27,
    tags: ["Ecosystem", "Matrix", "Integration"]
  },
  { 
    id: "cyber-universe", 
    nameKey: "knowledge.cat.cyber",
    descKey: "knowledge.cat.cyber.desc",
    icon: Globe, 
    gradient: "from-purple-500/10 to-pink-500/10",
    border: "border-purple-500/20 hover:border-purple-500/50",
    iconColor: "text-purple-400",
    count: 42,
    tags: ["Philosophy", "Cyber Buddha", "Metaphysics"]
  },
  { 
    id: "oece-engineering", 
    nameKey: "knowledge.cat.eng",
    descKey: "knowledge.cat.eng.desc",
    icon: Code, 
    gradient: "from-green-500/10 to-emerald-500/10",
    border: "border-green-500/20 hover:border-green-500/50",
    iconColor: "text-green-400",
    count: 89,
    tags: ["Next.js", "Firebase", "MongoDB"]
  },
  { 
    id: "resources", 
    nameKey: "knowledge.cat.resources",
    descKey: "knowledge.cat.resources.desc",
    icon: BookOpen, 
    gradient: "from-cyan-500/10 to-sky-500/10",
    border: "border-cyan-500/20 hover:border-cyan-500/50",
    iconColor: "text-cyan-400",
    count: 73,
    tags: ["APIs", "Frameworks", "DevOps"]
  },
  {
    id: "security",
    nameKey: "knowledge.cat.ai",
    descKey: "knowledge.cat.ai.desc",
    icon: Shield,
    gradient: "from-red-500/10 to-rose-500/10",
    border: "border-red-500/20 hover:border-red-500/50",
    iconColor: "text-red-400",
    count: 34,
    tags: ["Red Team", "Blue Team", "Guardrails"]
  },
];

const stats = [
  { value: "1000+", labelKey: "knowledge.stats.books", color: "text-blue-400" },
  { value: "2.4M", labelKey: "knowledge.stats.vectors", color: "text-green-400" },
  { value: "5", labelKey: "knowledge.stats.categories", color: "text-purple-400" },
  { value: "99.5%", labelKey: "knowledge.stats.accuracy", color: "text-amber-400" },
];

const recentArticles = [
  { title: "Building RAG Pipelines with LangChain & MongoDB Atlas", category: "Engineering", time: "2 days ago" },
  { title: "Semantic Router: Intent Classification at Scale", category: "AI Strategy", time: "3 days ago" },
  { title: "Knowledge Distillation: From 1000 Books to Vector Space", category: "AI Strategy", time: "5 days ago" },
  { title: "Multi-Persona AI Key Pool Architecture", category: "Engineering", time: "1 week ago" },
  { title: "Cyber Buddha: Ancient Wisdom Meets Neural Networks", category: "Cyber Cosmology", time: "1 week ago" },
];

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--hero-gradient-from)] via-transparent to-[var(--hero-gradient-to)] pointer-events-none" />

      <SharedHeader currentPage="knowledge" />

      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs font-medium"
            >
              🧠 Knowledge Distillation · Vector Memory · Semantic Routing
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black mb-4"
            >
              <span className="bg-gradient-to-r from-[var(--foreground)] via-[var(--primary)] to-[var(--foreground)] bg-clip-text text-transparent">
                {t("knowledge.title")}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-[var(--muted)] max-w-3xl mx-auto mb-10"
            >
              {t("knowledge.subtitle")}
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("knowledge.search")}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--card)] border border-[var(--border-subtle)] focus:border-[var(--primary)] outline-none transition-colors text-[var(--foreground)] shadow-lg shadow-[var(--shadow-color)]"
              />
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
            {stats.map((s, i) => (
              <motion.div
                key={s.labelKey}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="text-center p-5 rounded-xl bg-[var(--card)] border border-[var(--border-subtle)]"
              >
                <div className={`text-3xl font-black ${s.color} mb-1`}>{s.value}</div>
                <div className="text-xs text-[var(--muted)]">{t(s.labelKey)}</div>
              </motion.div>
            ))}
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={`/knowledge/${cat.id}`}
                  className={`group block p-6 rounded-2xl bg-gradient-to-br ${cat.gradient} border ${cat.border} transition-all hover:scale-[1.02]`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <cat.icon className={`h-8 w-8 ${cat.iconColor}`} />
                    <span className="text-xs font-mono text-[var(--muted-foreground)]">{cat.count} docs</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--primary)] transition-colors">
                    {t(cat.nameKey)}
                  </h3>
                  <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed">{t(cat.descKey)}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {cat.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-[var(--input-bg)] border border-[var(--border-subtle)] text-[10px] text-[var(--muted)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ArrowRight className="h-4 w-4 text-[var(--muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Recent Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[var(--primary)]" />
              Recent Articles
            </h2>
            <div className="space-y-3">
              {recentArticles.map((article, i) => (
                <motion.div
                  key={article.title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex items-center justify-between p-4 rounded-xl bg-[var(--card)] border border-[var(--border-subtle)] hover:border-[var(--primary)]/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                    <div>
                      <h3 className="text-sm font-medium group-hover:text-[var(--primary)] transition-colors">{article.title}</h3>
                      <p className="text-xs text-[var(--muted-foreground)]">{article.category} · {article.time}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[var(--muted)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-12 rounded-2xl bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 border border-[var(--primary)]/20"
          >
            <Sparkles className="h-10 w-10 text-[var(--primary)] mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                Powered by Semantic Vector Search
              </span>
            </h3>
            <p className="text-sm text-[var(--muted)] max-w-lg mx-auto mb-6">
              Every document is distilled, embedded, and indexed in MongoDB Atlas — enabling instant semantic retrieval across the entire knowledge base.
            </p>
            <Link
              href="/companion"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              {t("knowledge.cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
