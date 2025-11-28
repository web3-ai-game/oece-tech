"use client";

import { motion } from "framer-motion";
import { 
  SiGooglegemini, SiAnthropic, SiOpenai, SiGooglecloud, SiFirebase, 
  SiCloudflare, SiMongodb, SiSupabase, SiAlgolia, SiGithubactions,
  SiSentry, SiTelegram, SiVercel, SiDocker
} from "react-icons/si";
import { VscTerminalBash, VscGithubInverted, VscLock, VscRocket, VscCode } from "react-icons/vsc";

const techStack = [
  // Row 1 - AI
  { name: "Gemini 2.5 Pro", desc: "Multi-modal AI", icon: SiGooglegemini, color: "#4285F4" },
  { name: "Claude 4", desc: "Anthropic", icon: SiAnthropic, color: "#D4A373" },
  { name: "GPT-4o", desc: "OpenAI", icon: SiOpenai, color: "#10A37F" },
  { name: "Windsurf", desc: "AI IDE", icon: VscTerminalBash, color: "#06B6D4" },
  { name: "Copilot", desc: "AI Pair", icon: VscGithubInverted, color: "#A855F7" },
  { name: "Cursor", desc: "AI Editor", icon: VscCode, color: "#EC4899" },
  // Row 2 - Cloud
  { name: "Google Cloud", desc: "$300 Credits", icon: SiGooglecloud, color: "#4285F4" },
  { name: "Firebase", desc: "Edge CDN", icon: SiFirebase, color: "#FFCA28" },
  { name: "Cloudflare", desc: "Security", icon: SiCloudflare, color: "#F38020" },
  { name: "MongoDB", desc: "Vector DB", icon: SiMongodb, color: "#47A248" },
  { name: "Supabase", desc: "PostgreSQL", icon: SiSupabase, color: "#3FCF8E" },
  { name: "Algolia", desc: "Search", icon: SiAlgolia, color: "#003DFF" },
  // Row 3 - DevOps
  { name: "Actions", desc: "CI/CD", icon: SiGithubactions, color: "#2088FF" },
  { name: "Doppler", desc: "Secrets", icon: VscLock, color: "#8B5CF6" },
  { name: "Sentry", desc: "Monitor", icon: SiSentry, color: "#362D59" },
  { name: "Telegram", desc: "Bot", icon: SiTelegram, color: "#26A5E4" },
  { name: "OpenRouter", desc: "$1111", icon: VscRocket, color: "#EC4899" },
  { name: "Vercel", desc: "Edge", icon: SiVercel, color: "#FFFFFF" },
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
