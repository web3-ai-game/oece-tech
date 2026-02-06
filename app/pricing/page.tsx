"use client";

import { Check, Zap, Database, Brain, ArrowRight, Sparkles, Shield } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";
import { useLanguage } from "@/lib/language-provider";

const costBreakdown = [
  { service: "Gemini API", cost: "฿0.07/1K", markup: "×2", final: "฿0.14/1K", type: "API Call" },
  { service: "Vector Memory", cost: "฿0.05/1K", markup: "×2", final: "฿0.10/1K", type: "Storage" },
  { service: "Vector Search", cost: "฿0.03/query", markup: "×2", final: "฿0.06/query", type: "Retrieval" },
];

export default function PricingPage() {
  const { t } = useLanguage();

  const pricingPlans = [
    {
      name: t("pricing.free.name"),
      price: "฿0",
      period: "/month",
      description: t("pricing.free.desc"),
      features: [
        "Gemini 2.5 Flash Lite — Unlimited",
        "5 requests/min rate limit",
        "Basic chat history",
        "Community support",
        "No vector memory"
      ],
      cta: "Start Free",
      highlight: false,
      gradient: "",
      border: "border-[var(--border-subtle)]",
    },
    {
      name: t("pricing.beta.name"),
      price: "฿0",
      period: "Limited Time",
      description: t("pricing.beta.desc"),
      features: [
        "All AI models (Gemini Pro, Claude, GPT-4o)",
        "Unlimited requests",
        "Vector memory included",
        "Multi-persona chat",
        "Priority support",
        "Early access to new features"
      ],
      cta: "Active Now",
      highlight: true,
      gradient: "bg-gradient-to-br from-blue-500/10 to-purple-500/10",
      border: "border-blue-500/50 shadow-lg shadow-blue-500/10",
    },
    {
      name: t("pricing.pro.name"),
      price: "฿499",
      period: "/month",
      description: t("pricing.pro.desc"),
      features: [
        "All Beta features",
        "50,000 tokens/month included",
        "Vector memory: ฿0.14/1K tokens",
        "API access",
        "Custom personas",
        "24/7 support"
      ],
      cta: "Coming Soon",
      highlight: false,
      gradient: "",
      border: "border-[var(--border-subtle)]",
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--hero-gradient-from)] via-transparent to-[var(--hero-gradient-to)] pointer-events-none" />

      <SharedHeader currentPage="pricing" />

      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs font-medium"
            >
              💎 {t("pricing.badge")}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black mb-4"
            >
              <span className="bg-gradient-to-r from-[var(--foreground)] via-[var(--primary)] to-[var(--foreground)] bg-clip-text text-transparent">
                {t("pricing.title")}
              </span>{" "}
              <span className="text-[var(--primary)]">{t("pricing.highlight")}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-[var(--muted)] max-w-2xl mx-auto"
            >
              {t("pricing.subtitle")}
            </motion.p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`relative p-8 rounded-2xl border transition-all hover:scale-[1.02] ${plan.gradient} ${plan.border} ${!plan.highlight ? 'bg-[var(--card)]' : ''}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
                    ✨ ACTIVE
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold mb-3">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className="text-sm text-[var(--muted)]">{plan.period}</span>
                  </div>
                  <p className="text-xs text-[var(--muted)]">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-[var(--foreground)]/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    plan.highlight
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 shadow-lg"
                      : "bg-[var(--input-bg)] border border-[var(--border-subtle)] hover:border-[var(--primary)]/50 text-[var(--foreground)]"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Cost Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-center mb-8">
              💰 {t("pricing.cost.title")}
            </h2>
            <div className="bg-[var(--card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-lg shadow-[var(--shadow-color)]">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm border-b border-[var(--border-subtle)]">
                    <th className="px-6 py-4 text-[var(--muted)]">Service</th>
                    <th className="px-6 py-4 text-[var(--muted)]">Base Cost</th>
                    <th className="px-6 py-4 text-[var(--muted)]">Markup</th>
                    <th className="px-6 py-4 text-[var(--muted)]">Final Price</th>
                    <th className="px-6 py-4 text-[var(--muted)]">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {costBreakdown.map((item) => (
                    <tr key={item.service} className="border-t border-[var(--border-subtle)] hover:bg-[var(--input-bg)] transition-colors">
                      <td className="px-6 py-4 font-medium">{item.service}</td>
                      <td className="px-6 py-4 text-[var(--muted)] font-mono text-sm">{item.cost}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-orange-500/15 text-orange-400 rounded text-xs font-mono">
                          {item.markup}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-green-400 font-mono text-sm">{item.final}</td>
                      <td className="px-6 py-4 text-xs text-[var(--muted)]">{item.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-xs text-[var(--muted-foreground)] mt-4 font-mono">
              Formula: <span className="text-[var(--primary)]">Final Price = Base Cost × 2 × Vector Index</span>
            </p>
          </motion.div>

          {/* Memory Panel */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-[var(--card)] border border-[var(--primary)]/20 relative overflow-hidden"
            >
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />
              <Brain className="h-10 w-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">{t("pricing.memory.title")}</h3>
              <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed">
                {t("pricing.memory.desc")}
              </p>
              <ul className="space-y-2 text-sm text-[var(--muted)]">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-400" /> Semantic search across all chats</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-400" /> Long-term memory retention</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-400" /> Cross-conversation context</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-[var(--card)] border border-[var(--accent)]/20 relative overflow-hidden"
            >
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-yellow-500/10 blur-3xl" />
              <Zap className="h-10 w-10 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">{t("pricing.api.title")}</h3>
              <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed">
                {t("pricing.api.desc")}
              </p>
              <ul className="space-y-2 text-sm text-[var(--muted)]">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-yellow-400" /> Gemini 2.5 Flash: ฿0.14/1K tokens</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-yellow-400" /> Claude 4: ฿1.12/1K tokens</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-yellow-400" /> GPT-4o: ฿2.80/1K tokens</li>
              </ul>
            </motion.div>
          </div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-10 rounded-2xl bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 border border-[var(--primary)]/15"
          >
            <Shield className="h-10 w-10 text-[var(--primary)] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Enterprise-Grade Security</h3>
            <p className="text-sm text-[var(--muted)] max-w-lg mx-auto mb-6">
              All data encrypted at rest and in transit. SOC2 compliant infrastructure. Your conversations are yours alone.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              {t("nav.getStarted")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
