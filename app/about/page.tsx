"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, BookOpen, Code, Zap, Users, Heart, Brain } from "lucide-react";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";
import { useLanguage } from "@/lib/language-provider";

const ecosystem = [
  {
    icon: Brain,
    title: "AI Infrastructure",
    desc: "Multi-model AI routing with Gemini, Grok, Claude — semantic caching, key pool load balancing, and intelligent failover.",
    color: "text-blue-400",
    gradient: "from-blue-500/10 to-indigo-500/10",
    border: "border-blue-500/20",
    projects: ["Gemini API Pool", "Semantic Router", "Vector Memory Engine"]
  },
  {
    icon: Shield,
    title: "Security Services",
    desc: "Red Team / Blue Team adversarial AI training, prompt injection defense, cognitive warfare research.",
    color: "text-red-400",
    gradient: "from-red-500/10 to-rose-500/10",
    border: "border-red-500/20",
    projects: ["AI Guardrails", "Semantic Firewall", "Anomaly Detection"]
  },
  {
    icon: BookOpen,
    title: "Knowledge Management",
    desc: "1000+ distilled e-books compressed to vector space with 99.5% semantic fidelity — instant retrieval across the entire corpus.",
    color: "text-purple-400",
    gradient: "from-purple-500/10 to-pink-500/10",
    border: "border-purple-500/20",
    projects: ["Knowledge Distillation", "MongoDB Atlas Search", "LangChain RAG"]
  },
  {
    icon: Code,
    title: "Developer Tools",
    desc: "Full-stack open-source toolkit: Next.js templates, Firebase integrations, MCP servers, CLI utilities.",
    color: "text-green-400",
    gradient: "from-green-500/10 to-emerald-500/10",
    border: "border-green-500/20",
    projects: ["MCP Prompt Library", "Cloud Run API", "GitHub Actions CI/CD"]
  },
];

const stats = [
  { value: "27+", label: "Projects", color: "text-blue-400" },
  { value: "1000+", label: "Distilled Books", color: "text-green-400" },
  { value: "20+", label: "AI Models", color: "text-purple-400" },
  { value: "99.5%", label: "Semantic Fidelity", color: "text-amber-400" },
];

const values = [
  { icon: Zap, title: "Innovation", desc: "Pushing the frontier of AI-native knowledge systems", color: "text-amber-400" },
  { icon: Shield, title: "Security", desc: "Red/Blue team approach to AI safety at every layer", color: "text-red-400" },
  { icon: BookOpen, title: "Knowledge", desc: "Distilling human wisdom into machine-searchable intelligence", color: "text-blue-400" },
  { icon: Heart, title: "Open Source", desc: "Building in public — defensive techniques shared with the community", color: "text-pink-400" },
];

const timeline = [
  { phase: "Phase 1", title: "Core Chat + Themes", status: "done" },
  { phase: "Phase 2", title: "Auth + Member System", status: "done" },
  { phase: "Phase 3", title: "Cyber Divination", status: "active" },
  { phase: "Phase 4", title: "Knowledge Base + Vector Search", status: "active" },
  { phase: "Phase 5", title: "Forum + Community", status: "upcoming" },
  { phase: "Phase 6", title: "Telegram Bot Integration", status: "upcoming" },
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--hero-gradient-from)] via-transparent to-[var(--hero-gradient-to)] pointer-events-none" />

      <SharedHeader currentPage="about" />

      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs font-medium"
            >
              🌐 AI-Native Ecosystem · Bangkok, Thailand
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black mb-4"
            >
              <span className="bg-gradient-to-r from-[var(--foreground)] via-[var(--primary)] to-[var(--foreground)] bg-clip-text text-transparent">
                {t("about.title")}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-[var(--muted)] max-w-3xl mx-auto"
            >
              {t("about.subtitle")}
            </motion.p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-20">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="text-center p-6 rounded-xl bg-[var(--card)] border border-[var(--border-subtle)]"
              >
                <div className={`text-3xl font-black ${s.color} mb-1`}>{s.value}</div>
                <div className="text-xs text-[var(--muted)]">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Ecosystem */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">
                <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                  🏗️ Ecosystem Overview
                </span>
              </h2>
              <p className="text-sm text-[var(--muted)]">Four pillars of the OECE platform</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {ecosystem.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-8 rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.border} relative overflow-hidden`}
                >
                  <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-current opacity-5 blur-3xl" />
                  <item.icon className={`h-8 w-8 ${item.color} mb-4`} />
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.projects.map((p) => (
                      <span key={p} className="px-2 py-1 rounded-full bg-[var(--input-bg)] border border-[var(--border-subtle)] text-[10px] text-[var(--muted-foreground)]">
                        {p}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  💎 Core Values
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-[var(--card)] border border-[var(--border-subtle)]"
                >
                  <v.icon className={`h-8 w-8 ${v.color} mx-auto mb-3`} />
                  <h3 className="font-bold mb-1">{v.title}</h3>
                  <p className="text-xs text-[var(--muted)]">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Roadmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  🚀 Roadmap
                </span>
              </h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    item.status === "done"
                      ? "bg-green-500/5 border-green-500/20"
                      : item.status === "active"
                      ? "bg-[var(--primary)]/5 border-[var(--primary)]/20"
                      : "bg-[var(--card)] border-[var(--border-subtle)]"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    item.status === "done" ? "bg-green-400" : item.status === "active" ? "bg-[var(--primary)] animate-pulse" : "bg-[var(--muted-foreground)]"
                  }`} />
                  <span className="text-xs font-mono text-[var(--muted-foreground)] w-16 flex-shrink-0">{item.phase}</span>
                  <span className="font-medium flex-1">{item.title}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    item.status === "done" ? "bg-green-500/10 text-green-400" : item.status === "active" ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "bg-[var(--input-bg)] text-[var(--muted)]"
                  }`}>
                    {item.status === "done" ? "Complete" : item.status === "active" ? "In Progress" : "Upcoming"}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-12 rounded-2xl bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 border border-[var(--primary)]/15"
          >
            <Users className="h-10 w-10 text-[var(--primary)] mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">DeepWeay Labs</h3>
            <p className="text-sm text-[var(--muted)] max-w-lg mx-auto mb-6">
              A small, focused team building AI-native tools from Bangkok. We believe in open-source, transparent pricing, and putting knowledge in everyone&apos;s hands.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <Link
                href="/companion"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Try AI Companion
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--border-subtle)] rounded-xl font-medium hover:border-[var(--primary)] transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
