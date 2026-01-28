"use client";

import { Check, Zap, Database, Brain } from "lucide-react";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";
import { useLanguage } from "@/lib/language-provider";

const pricingPlans = [
  {
    name: "Free Tier",
    price: "฿0",
    period: "/month",
    description: "Perfect for trying out",
    features: [
      "Gemini 2.5 Flash Lite - Unlimited",
      "5 requests/min rate limit",
      "Basic chat history",
      "Community support",
      "No vector memory"
    ],
    cta: "Start Free",
    highlight: false
  },
  {
    name: "Beta Tester",
    price: "฿0",
    period: "Limited Time",
    description: "Current plan - All features unlocked",
    features: [
      "All AI models (Gemini Pro, Claude, GPT-4o)",
      "Unlimited requests",
      "Vector memory included",
      "Multi-persona chat",
      "Priority support",
      "Early access to new features"
    ],
    cta: "Active Now",
    highlight: true
  },
  {
    name: "Pro Plan",
    price: "฿499",
    period: "/month",
    description: "For power users",
    features: [
      "All Beta features",
      "50,000 tokens/month included",
      "Vector memory: ฿0.14/1K tokens",
      "API access",
      "Custom personas",
      "24/7 support"
    ],
    cta: "Coming Soon",
    highlight: false
  }
];

const costBreakdown = [
  {
    service: "Gemini API",
    cost: "฿0.07/1K tokens",
    markup: "×2",
    final: "฿0.14/1K tokens",
    type: "API Call"
  },
  {
    service: "Vector Memory",
    cost: "฿0.05/1K tokens",
    markup: "×2",
    final: "฿0.10/1K tokens",
    type: "Storage"
  },
  {
    service: "Vector Search",
    cost: "฿0.03/query",
    markup: "×2",
    final: "฿0.06/query",
    type: "Retrieval"
  }
];

export default function PricingPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      {/* Background Effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--primary)]/5 pointer-events-none" />

      <SharedHeader currentPage="pricing" />

      {/* Main Content */}
      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              {lang === "zh" ? "價格 &" : "Pricing &"} <span className="text-[var(--primary)]">{lang === "zh" ? "記憶面板" : "Memory Panel"}</span>
            </h1>
            <p className="text-sm text-[var(--muted)] max-w-2xl mx-auto mb-6">
              {lang === "zh" 
                ? "按用量付費。向量記憶確保準確性，API 調用極低成本。"
                : "Pay only for what you use. Vector memory ensures accuracy, API calls are cheap."
              }
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-sm text-blue-400">
              <Database className="h-4 w-4" />
              <span>{lang === "zh" ? "天價向量 · 極低 API · 保證準確" : "Premium Vector · Low API Cost · Guaranteed Accuracy"}</span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-2xl border transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/50 shadow-lg shadow-blue-500/20"
                    : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/30"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                    {lang === "zh" ? "當前" : "ACTIVE"}
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-[var(--muted)]">{plan.period}</span>
                  </div>
                  <p className="text-xs text-[var(--muted)]">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-[var(--foreground)]/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    plan.highlight
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
                      : "bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/50"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Cost Breakdown */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              💰 {lang === "zh" ? "成本明細 - 透明定價" : "Cost Breakdown - Transparent Pricing"}
            </h2>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-[var(--background)]">
                  <tr className="text-left text-sm">
                    <th className="px-6 py-4">{lang === "zh" ? "服務" : "Service"}</th>
                    <th className="px-6 py-4">{lang === "zh" ? "基礎成本" : "Base Cost"}</th>
                    <th className="px-6 py-4">{lang === "zh" ? "加成" : "Markup"}</th>
                    <th className="px-6 py-4">{lang === "zh" ? "最終價格" : "Final Price"}</th>
                    <th className="px-6 py-4">{lang === "zh" ? "類型" : "Type"}</th>
                  </tr>
                </thead>
                <tbody>
                  {costBreakdown.map((item, i) => (
                    <tr key={i} className="border-t border-[var(--border)] hover:bg-[var(--background)] transition-colors">
                      <td className="px-6 py-4 font-medium">{item.service}</td>
                      <td className="px-6 py-4 text-[var(--muted)]">{item.cost}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-mono">
                          {item.markup}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-green-400">{item.final}</td>
                      <td className="px-6 py-4 text-xs text-[var(--muted)]">{item.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-xs text-[var(--muted)] mt-4">
              {lang === "zh" ? "公式：" : "Formula:"} <span className="text-blue-400">Final Price = Base Cost × 2 × Vector Index</span>
            </p>
          </div>

          {/* Memory Panel Explanation */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--border)]">
              <Brain className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">{lang === "zh" ? "向量記憶" : "Vector Memory"}</h3>
              <p className="text-sm text-[var(--muted)] mb-4">
                {lang === "zh" 
                  ? "每次對話都會被索引並存儲在 MongoDB Atlas。檢索即時且具有上下文感知。"
                  : "Every conversation is indexed and stored in MongoDB Atlas. Retrieval is instant and context-aware."
                }
              </p>
              <ul className="space-y-2 text-xs text-[var(--muted)]">
                <li>• {lang === "zh" ? "跨對話語義搜索" : "Semantic search across all chats"}</li>
                <li>• {lang === "zh" ? "長期記憶保留" : "Long-term memory retention"}</li>
                <li>• {lang === "zh" ? "跨對話上下文" : "Cross-conversation context"}</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--border)]">
              <Zap className="h-8 w-8 text-yellow-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">{lang === "zh" ? "低 API 成本" : "Low API Cost"}</h3>
              <p className="text-sm text-[var(--muted)] mb-4">
                {lang === "zh" 
                  ? "Gemini API 調用極低成本。我們收取 2× 用於基礎設施和支持。"
                  : "Gemini API calls are extremely cheap. We charge 2× for infrastructure and support."
                }
              </p>
              <ul className="space-y-2 text-xs text-[var(--muted)]">
                <li>• Gemini 2.5 Flash: ฿0.14/1K tokens</li>
                <li>• Claude 4: ฿1.12/1K tokens</li>
                <li>• GPT-4o: ฿2.80/1K tokens</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
