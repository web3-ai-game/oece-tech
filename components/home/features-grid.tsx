"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-provider";

const features = [
  {
    href: "/comic",
    emoji: "🎨",
    titleKey: "features.comic.title",
    descKey: "features.comic.desc",
    gradient: "from-purple-500/10 to-pink-500/10",
    border: "border-purple-500/20 hover:border-purple-500/60",
    hoverGradient: "group-hover:from-purple-500/20 group-hover:to-pink-500/20",
    hoverColor: "group-hover:text-purple-400",
  },
  {
    href: "/novel",
    emoji: "📖",
    titleKey: "features.novel.title",
    descKey: "features.novel.desc",
    gradient: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-500/20 hover:border-blue-500/60",
    hoverGradient: "group-hover:from-blue-500/20 group-hover:to-cyan-500/20",
    hoverColor: "group-hover:text-blue-400",
  },
  {
    href: "/pastlife",
    emoji: "🔮",
    titleKey: "features.pastlife.title",
    descKey: "features.pastlife.desc",
    gradient: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-500/20 hover:border-amber-500/60",
    hoverGradient: "group-hover:from-amber-500/20 group-hover:to-orange-500/20",
    hoverColor: "group-hover:text-amber-400",
  },
  {
    href: "/prompts",
    emoji: "💡",
    titleKey: "features.prompts.title",
    descKey: "features.prompts.desc",
    gradient: "from-green-500/10 to-emerald-500/10",
    border: "border-green-500/20 hover:border-green-500/60",
    hoverGradient: "group-hover:from-green-500/20 group-hover:to-emerald-500/20",
    hoverColor: "group-hover:text-green-400",
  },
];

export function FeaturesGrid() {
  const { t, lang } = useLanguage();

  const stats = [
    { value: "1000+", en: "Distilled Books", zh: "蒸餾書籍" },
    { value: "4", en: "AI Core Features", zh: "AI 核心功能" },
    { value: "20", en: "Beta Tester Slots", zh: "Beta 測試名額" },
    { value: "24/7", en: "Always Online", zh: "全天候服務" },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
        {features.map((f, i) => (
          <motion.div
            key={f.href}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href={f.href}
              className={`group relative p-8 rounded-2xl bg-gradient-to-br ${f.gradient} border ${f.border} transition-all hover:scale-105 overflow-hidden block`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-transparent ${f.hoverGradient} transition-all`} />
              <div className="relative">
                <div className="text-5xl mb-4">{f.emoji}</div>
                <h3 className={`text-lg font-bold mb-2 ${f.hoverColor} transition-colors`}>{t(f.titleKey)}</h3>
                <p className="text-sm text-[var(--muted)]">{t(f.descKey)}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="text-center p-6 rounded-xl bg-[var(--card)] border border-[var(--border-subtle)]"
          >
            <div className="text-3xl font-black text-[var(--primary)] mb-2">{s.value}</div>
            <div className="text-sm text-[var(--muted)]">{lang === "zh" ? s.zh : s.en}</div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
