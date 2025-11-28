"use client";

import { motion } from "framer-motion";
import { 
  Terminal, 
  Cpu, 
  Globe, 
  Shield, 
  Zap, 
  Cloud, 
  Database,
  Code2,
  GitBranch,
  Bot,
  Lock,
  Search,
  Sparkles,
  Server,
  Rocket,
  Brain,
  Eye,
  MessageSquare
} from "lucide-react";

const stackItems = [
  // AI 核心引擎
  {
    name: "Gemini 2.5 Pro",
    description: "Multi-modal AI Brain",
    icon: <Sparkles className="w-8 h-8 text-blue-400" />,
    badge: "Core Engine",
    tier: "ai"
  },
  {
    name: "Claude 4",
    description: "Anthropic Intelligence",
    icon: <Brain className="w-8 h-8 text-orange-400" />,
    badge: "Reasoning",
    tier: "ai"
  },
  {
    name: "GPT-4o",
    description: "OpenAI Flagship",
    icon: <Bot className="w-8 h-8 text-green-400" />,
    badge: "Fallback",
    tier: "ai"
  },
  // 開發工具
  {
    name: "Windsurf IDE",
    description: "AI-Native Flow State",
    icon: <Terminal className="w-8 h-8 text-cyan-400" />,
    badge: "Built With",
    tier: "dev"
  },
  {
    name: "GitHub Copilot",
    description: "AI Pair Programmer",
    icon: <Code2 className="w-8 h-8 text-purple-400" />,
    badge: "Accelerated",
    tier: "dev"
  },
  {
    name: "Cursor AI",
    description: "Code Intelligence",
    icon: <Eye className="w-8 h-8 text-pink-400" />,
    badge: "Editor",
    tier: "dev"
  },
  // 雲端基礎設施
  {
    name: "Google Cloud",
    description: "Enterprise Infrastructure",
    icon: <Cloud className="w-8 h-8 text-yellow-400" />,
    badge: "$300 Credits",
    tier: "cloud"
  },
  {
    name: "Firebase Hosting",
    description: "Global Edge CDN",
    icon: <Zap className="w-8 h-8 text-orange-400" />,
    badge: "0ms Latency",
    tier: "cloud"
  },
  {
    name: "Cloudflare",
    description: "DDoS Protection",
    icon: <Shield className="w-8 h-8 text-orange-500" />,
    badge: "Security",
    tier: "cloud"
  },
  // 數據與存儲
  {
    name: "MongoDB Atlas",
    description: "Vector Memory Store",
    icon: <Database className="w-8 h-8 text-green-400" />,
    badge: "Recall",
    tier: "data"
  },
  {
    name: "Supabase",
    description: "PostgreSQL + Realtime",
    icon: <Server className="w-8 h-8 text-emerald-400" />,
    badge: "Database",
    tier: "data"
  },
  {
    name: "Algolia",
    description: "Instant Search",
    icon: <Search className="w-8 h-8 text-blue-500" />,
    badge: "10K/mo",
    tier: "data"
  },
  // DevOps & 安全
  {
    name: "GitHub Actions",
    description: "CI/CD Pipeline",
    icon: <GitBranch className="w-8 h-8 text-white" />,
    badge: "Auto Deploy",
    tier: "devops"
  },
  {
    name: "Doppler",
    description: "Secrets Management",
    icon: <Lock className="w-8 h-8 text-violet-400" />,
    badge: "Encrypted",
    tier: "devops"
  },
  {
    name: "Sentry",
    description: "Error Tracking",
    icon: <Eye className="w-8 h-8 text-red-400" />,
    badge: "Monitoring",
    tier: "devops"
  },
  // 通訊
  {
    name: "Telegram Bot",
    description: "Instant Messaging",
    icon: <MessageSquare className="w-8 h-8 text-blue-400" />,
    badge: "Connected",
    tier: "comms"
  },
  {
    name: "OpenRouter",
    description: "$1111 API Credits",
    icon: <Rocket className="w-8 h-8 text-pink-500" />,
    badge: "Multi-Model",
    tier: "ai"
  },
  {
    name: "Vercel",
    description: "Edge Functions",
    icon: <Globe className="w-8 h-8 text-white" />,
    badge: "Serverless",
    tier: "cloud"
  },
];

const tierColors: Record<string, string> = {
  ai: "from-blue-500/20 to-purple-500/20 border-blue-500/30",
  dev: "from-cyan-500/20 to-teal-500/20 border-cyan-500/30",
  cloud: "from-orange-500/20 to-yellow-500/20 border-orange-500/30",
  data: "from-green-500/20 to-emerald-500/20 border-green-500/30",
  devops: "from-violet-500/20 to-pink-500/20 border-violet-500/30",
  comms: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
};

export function TechStack() {
  return (
    <section className="py-24 relative overflow-hidden bg-black/20">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent z-0" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-mono"
          >
            🏆 POWERED BY GIANTS
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
          >
            Built on World-Class<br />Infrastructure
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Gemini AI · GCP $300 Credits · Firebase Global CDN · GitHub CI/CD · Cloudflare Security
          </motion.p>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-8 mb-16 text-center"
        >
          <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-blue-400">20+</div>
            <div className="text-xs text-gray-400">Gemini API Keys</div>
          </div>
          <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-green-400">$1,411</div>
            <div className="text-xs text-gray-400">API Credits</div>
          </div>
          <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-orange-400">200+</div>
            <div className="text-xs text-gray-400">Edge Locations</div>
          </div>
          <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-purple-400">99.9%</div>
            <div className="text-xs text-gray-400">Uptime SLA</div>
          </div>
        </motion.div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {stackItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`group relative p-4 rounded-2xl bg-gradient-to-br ${tierColors[item.tier]} border hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-default`}
            >
              {/* Badge */}
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-blue-500/80 text-white border border-blue-400/50 shadow-lg">
                  {item.badge}
                </span>
              </div>
              
              {/* Icon */}
              <div className="mb-3 p-2 bg-black/50 w-fit rounded-xl border border-white/5 group-hover:border-white/20 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all">
                {item.icon}
              </div>
              
              {/* Name */}
              <h3 className="text-sm font-bold mb-0.5 text-gray-200 group-hover:text-white transition-colors truncate">
                {item.name}
              </h3>
              <p className="text-xs text-gray-500 group-hover:text-gray-400 truncate">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 text-sm mb-4">
            Enterprise-grade security • Auto-scaling • Global CDN • Zero-config deployment
          </p>
          <div className="flex justify-center gap-4 text-xs text-gray-600">
            <span>🔥 Firebase Blaze Plan</span>
            <span>•</span>
            <span>☁️ GCP Free Tier</span>
            <span>•</span>
            <span>🤖 Gemini Pro Access</span>
            <span>•</span>
            <span>🔒 SOC2 Compliant</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
