"use client";

import { motion } from "framer-motion";

const pipelineSteps = [
  { emoji: "📚", title: "Knowledge Distillation", desc: "1000+ books semantic extraction", color: "purple" },
  { emoji: "🧠", title: "Vector Storage", desc: "MongoDB semantic indexing", color: "blue" },
  { emoji: "🎯", title: "Semantic Routing", desc: "Intelligent intent recognition", color: "green" },
  { emoji: "🔄", title: "Multi-Persona Polling", desc: "Key pool load balancing", color: "amber" },
  { emoji: "✨", title: "Content Generation", desc: "Multi-modal output", color: "red" },
];

const colorMap: Record<string, string> = {
  purple: "text-purple-400",
  blue: "text-blue-400",
  green: "text-green-400",
  amber: "text-amber-400",
  red: "text-red-400",
};

const gradientMap: Record<string, string> = {
  purple: "from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:border-purple-500/60",
  blue: "from-blue-500/10 to-cyan-500/10 border-blue-500/30 hover:border-blue-500/60",
  green: "from-green-500/10 to-emerald-500/10 border-green-500/30 hover:border-green-500/60",
  amber: "from-amber-500/10 to-orange-500/10 border-amber-500/30 hover:border-amber-500/60",
  red: "from-red-500/10 to-pink-500/10 border-red-500/30 hover:border-red-500/60",
};

const blueprintSteps = [
  { label: "INPUT", title: "Raw Data", items: ["PDF / EPUB / TXT", "Web Scraping", "API Feeds"], style: "border-dashed border-[var(--border-subtle)] bg-[var(--background)]/50", labelColor: "text-[var(--muted-foreground)]" },
  { label: "DISTILL", title: "Knowledge Extraction", items: ["LangChain", "Unstructured.io", "Chunk + Overlap"], style: "border-purple-500/30 bg-purple-500/5", labelColor: "text-purple-400", highlightItems: [0, 1] },
  { label: "EMBED", title: "Vector Store", items: ["text-embedding-004", "MongoDB Atlas", "HNSW Index"], style: "border-blue-500/30 bg-blue-500/5", labelColor: "text-blue-400", highlightItems: [0, 1] },
  { label: "ROUTE", title: "Semantic Router", items: ["semantic-router", "Intent Classification", "Dynamic Dispatch"], style: "border-green-500/30 bg-green-500/5", labelColor: "text-green-400", highlightItems: [0, 1] },
  { label: "GENERATE", title: "Multi-Model", items: ["Gemini 2.5 Flash", "Grok-3", "Key Pool Rotation"], style: "border-amber-500/30 bg-amber-500/5", labelColor: "text-amber-400", highlightItems: [0, 1] },
];

const techTags = [
  { label: "Next.js 16", style: "bg-[var(--input-bg)] border-[var(--border-subtle)] text-[var(--muted)]" },
  { label: "TypeScript", style: "bg-[var(--input-bg)] border-[var(--border-subtle)] text-[var(--muted)]" },
  { label: "LangChain", style: "bg-purple-900/30 border-purple-700/50 text-purple-400" },
  { label: "MongoDB Atlas", style: "bg-blue-900/30 border-blue-700/50 text-blue-400" },
  { label: "semantic-router", style: "bg-green-900/30 border-green-700/50 text-green-400" },
  { label: "Gemini API", style: "bg-amber-900/30 border-amber-700/50 text-amber-400" },
  { label: "Firebase", style: "bg-[var(--input-bg)] border-[var(--border-subtle)] text-[var(--muted)]" },
  { label: "Supabase", style: "bg-[var(--input-bg)] border-[var(--border-subtle)] text-[var(--muted)]" },
  { label: "TailwindCSS", style: "bg-[var(--input-bg)] border-[var(--border-subtle)] text-[var(--muted)]" },
];

const factories = [
  { emoji: "📖", title: "Novel Factory", desc: "Knowledge Distillation + Gemini Text Gen\nAutomated Chapter Engine" },
  { emoji: "🎨", title: "Comic Factory", desc: "Text Distillation + Gemini Image Gen\nAI Storyboard Pipeline" },
  { emoji: "🤖", title: "Chat Factory", desc: "Semantic Routing + Grok Multi-turn\nAI Companion System" },
];

export function TechArchitecture() {
  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-black mb-4"
        >
          <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] bg-clip-text text-transparent">
            Core Technology Architecture
          </span>
        </motion.h2>
        <p className="text-[var(--muted)] max-w-2xl mx-auto">
          Next-gen content pipeline powered by deep knowledge distillation and multi-modal AI
        </p>
      </div>

      {/* Pipeline Flow */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {pipelineSteps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className={`p-6 rounded-xl bg-gradient-to-br ${gradientMap[step.color]} border transition-all`}>
                <div className="text-3xl mb-3">{step.emoji}</div>
                <h3 className={`text-sm font-bold mb-2 ${colorMap[step.color]}`}>{step.title}</h3>
                <p className="text-xs text-[var(--muted)]">{step.desc}</p>
              </div>
              {i < pipelineSteps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-current to-current opacity-30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech Details - Two Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative p-8 rounded-2xl bg-[var(--card)] border border-[var(--primary)]/20 overflow-hidden"
        >
          <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[var(--primary)]/10 blur-3xl" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
              <span className="text-2xl">🔬</span>
            </div>
            <h3 className="text-xl font-bold">Deep Knowledge Distillation</h3>
          </div>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
            Using advanced <span className="text-[var(--primary)] font-semibold">semantic compression algorithms</span> for multi-level abstraction of massive text data.
            Through <span className="text-[var(--primary)] font-semibold">neural network encoders</span>, knowledge is transformed into high-dimensional vector space,
            achieving <span className="text-[var(--primary)] font-semibold">99.5% semantic fidelity</span> while compressing storage to <span className="text-[var(--primary)] font-semibold">1/100</span> of original data.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs">Semantic Encoding</span>
            <span className="px-3 py-1 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs">Vector Compression</span>
            <span className="px-3 py-1 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs">Knowledge Graph</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl bg-[var(--card)] border border-[var(--accent)]/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold">Intelligent Load Balancer</h3>
          </div>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
            Distributed scheduling system based on <span className="text-[var(--accent)] font-semibold">multi-persona AI Key pool</span>,
            achieving <span className="text-[var(--accent)] font-semibold">millisecond-level</span> request routing and failover.
            Combined with <span className="text-[var(--accent)] font-semibold">semantic cache layer</span>,
            response speed increased by <span className="text-[var(--accent)] font-semibold">300%</span>, cost reduced by <span className="text-[var(--accent)] font-semibold">70%</span>.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs">Load Balancing</span>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs">Smart Routing</span>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs">Fault Tolerance</span>
          </div>
        </motion.div>
      </div>

      {/* AI Content Factory Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 border border-[var(--primary)]/20 max-w-5xl mx-auto"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
              🏭 AI Content Factory Pipeline
            </span>
          </h3>
          <p className="text-sm text-[var(--muted)]">Fully automated production chain from knowledge to creativity</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {factories.map((f) => (
            <div key={f.title} className="text-center">
              <div className="text-4xl mb-3">{f.emoji}</div>
              <h4 className="font-bold mb-2">{f.title}</h4>
              <p className="text-xs text-[var(--muted)] whitespace-pre-line">{f.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Technical Blueprint */}
      <div className="mt-16 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">
            <span className="bg-gradient-to-r from-[var(--muted)] via-[var(--foreground)] to-[var(--muted)] bg-clip-text text-transparent">
              📐 Technical Blueprint
            </span>
          </h3>
          <p className="text-sm text-[var(--muted-foreground)]">Low-cost, high-efficiency solution based on mature open-source stack</p>
        </div>

        <div className="relative p-6 md:p-8 rounded-2xl bg-[var(--card)] border border-[var(--border-subtle)] overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(rgba(100,100,100,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,100,100,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px'}} />

          <div className="relative flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--primary)]/60" />
              <span className="text-xs font-mono text-[var(--muted-foreground)]">OECE-ARCH-v1.0</span>
            </div>
            <span className="text-xs font-mono text-[var(--muted-foreground)]">REV: 2026.01</span>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-2 mb-8">
            {blueprintSteps.map((step) => (
              <div key={step.label} className={`p-4 rounded-lg border ${step.style}`}>
                <div className={`text-xs font-mono ${step.labelColor} mb-2`}>{step.label}</div>
                <div className="text-sm font-semibold text-[var(--foreground)] mb-1">{step.title}</div>
                <div className="text-[10px] text-[var(--muted)] space-y-0.5">
                  {step.items.map((item, i) => (
                    <div key={item} className={step.highlightItems?.includes(i) ? step.labelColor : ""}>
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="relative pt-4 border-t border-[var(--border-subtle)]">
            <div className="text-xs font-mono text-[var(--muted-foreground)] mb-3">TECH STACK</div>
            <div className="flex flex-wrap gap-2">
              {techTags.map((tag) => (
                <span key={tag.label} className={`px-2 py-1 rounded text-[10px] font-mono border ${tag.style}`}>{tag.label}</span>
              ))}
            </div>
            <div className="mt-4 text-[10px] text-[var(--muted-foreground)] font-mono">
              * Full-stack open-source · Single-machine deployable · API cost &lt; $0.01/1K tokens
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
