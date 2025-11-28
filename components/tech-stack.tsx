"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, Brain, Bot, Terminal, Code2, Eye, Cloud, Zap, Shield,
  Database, Server, Search, GitBranch, Lock, MessageSquare, Rocket, Globe
} from "lucide-react";

const techStack = [
  // Row 1 - AI
  { name: "Gemini 2.5 Pro", desc: "Multi-modal AI Brain", icon: Sparkles, color: "#4285F4" },
  { name: "Claude 4", desc: "Anthropic Intelligence", icon: Brain, color: "#FF6B35" },
  { name: "GPT-4o", desc: "OpenAI Flagship", icon: Bot, color: "#10A37F" },
  { name: "Windsurf IDE", desc: "AI-Native Flow State", icon: Terminal, color: "#06B6D4" },
  { name: "GitHub Copilot", desc: "AI Pair Programmer", icon: Code2, color: "#A855F7" },
  { name: "Cursor AI", desc: "Code Intelligence", icon: Eye, color: "#EC4899" },
  // Row 2 - Cloud
  { name: "Google Cloud", desc: "Enterprise Infrastructure", icon: Cloud, color: "#FACC15" },
  { name: "Firebase Hosting", desc: "Global Edge CDN", icon: Zap, color: "#F97316" },
  { name: "Cloudflare", desc: "DDoS Protection", icon: Shield, color: "#F97316" },
  { name: "MongoDB Atlas", desc: "Vector Memory Store", icon: Database, color: "#22C55E" },
  { name: "Supabase", desc: "PostgreSQL + Realtime", icon: Server, color: "#34D399" },
  { name: "Algolia", desc: "Instant Search", icon: Search, color: "#3B82F6" },
  // Row 3 - DevOps
  { name: "GitHub Actions", desc: "CI/CD Pipeline", icon: GitBranch, color: "#FFFFFF" },
  { name: "Doppler", desc: "Secrets Management", icon: Lock, color: "#8B5CF6" },
  { name: "Sentry", desc: "Error Tracking", icon: Eye, color: "#EF4444" },
  { name: "Telegram Bot", desc: "Instant Messaging", icon: MessageSquare, color: "#0EA5E9" },
  { name: "OpenRouter", desc: "$1111 API Credits", icon: Rocket, color: "#EC4899" },
  { name: "Vercel", desc: "Edge Functions", icon: Globe, color: "#FFFFFF" },
];

export function TechStack() {
  return (
    <section className="py-16 bg-black/20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
            🏆 POWERED BY GIANTS
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 text-white">
            Built on World-Class Infrastructure
          </h2>
        </div>

        {/* Stats - Inline */}
        <div className="flex justify-center gap-6 mb-10 text-center">
          <div><span className="text-xl font-bold text-blue-400">20+</span><span className="text-xs text-gray-500 ml-1">Keys</span></div>
          <div><span className="text-xl font-bold text-green-400">$1,411</span><span className="text-xs text-gray-500 ml-1">Credits</span></div>
          <div><span className="text-xl font-bold text-orange-400">200+</span><span className="text-xs text-gray-500 ml-1">Edge</span></div>
          <div><span className="text-xl font-bold text-purple-400">99.9%</span><span className="text-xs text-gray-500 ml-1">SLA</span></div>
        </div>

        {/* Tech Grid - Flat Style */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {techStack.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              whileHover={{ y: -3 }}
              className="group p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-default"
            >
              <item.icon 
                className="w-6 h-6 mb-2 mx-auto" 
                style={{ color: item.color }}
              />
              <h3 className="text-xs font-medium text-center text-gray-300 group-hover:text-white truncate">
                {item.name}
              </h3>
              <p className="text-[10px] text-center text-gray-600 truncate">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-600">
          Enterprise-grade security • Auto-scaling • Global CDN • Zero-config deployment
        </div>
        <div className="flex justify-center gap-3 mt-3 text-[10px] text-gray-500">
          <span>🔥 Firebase Blaze</span>
          <span>•</span>
          <span>☁️ GCP Free Tier</span>
          <span>•</span>
          <span>🤖 Gemini Pro</span>
          <span>•</span>
          <span>🔒 SOC2</span>
        </div>
      </div>
    </section>
  );
}
