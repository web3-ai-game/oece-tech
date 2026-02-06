"use client";

import { motion } from "framer-motion";

const redTeamItems = ["Prompt Injection", "Jailbreak Techniques", "Social Engineering", "Cognitive Warfare"];
const blueTeamItems = ["Input Sanitization", "Guardrails System", "Anomaly Detection", "Semantic Firewall"];

export function SecurityArena() {
  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-black mb-4"
        >
          <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            🎯 AI Security Battle Arena
          </span>
        </motion.h2>
        <p className="text-[var(--muted)] max-w-2xl mx-auto">
          Red vs Blue adversarial training platform for the cognitive warfare era · <span className="text-amber-400">Coming Soon</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Red Team */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative p-8 rounded-2xl bg-gradient-to-br from-red-950/50 to-red-900/30 border border-red-500/30 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                <span className="text-2xl">🔴</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-400">Red Team</h3>
                <p className="text-xs text-red-400/60">Offensive Security</p>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed">
              Simulating real threat scenarios, mastering cutting-edge attack vectors. We research but <span className="text-red-400 font-semibold">do not disclose</span> specific techniques:
            </p>
            <div className="space-y-2 mb-4">
              {redTeamItems.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <span className="text-red-400">▸</span>
                  <span className="text-[var(--muted-foreground)]">{item}</span>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400/80">
              ⚠️ Red Team techniques are for internal research only
            </div>
          </div>
        </motion.div>

        {/* Blue Team */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-950/50 to-blue-900/30 border border-blue-500/30 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <span className="text-2xl">🔵</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-400">Blue Team</h3>
                <p className="text-xs text-blue-400/60">Defensive Security</p>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed">
              Building impenetrable AI security defenses. We <span className="text-blue-400 font-semibold">open-source share</span> defensive techniques:
            </p>
            <div className="space-y-2 mb-4">
              {blueTeamItems.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <span className="text-blue-400">▸</span>
                  <span className="text-[var(--foreground)]">{item}</span>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400/80">
              ✓ Blue Team techniques are open-source for community security
            </div>
          </div>
        </motion.div>
      </div>

      {/* Battle Arena Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-red-500/5 via-purple-500/10 to-blue-500/5 border border-purple-500/20 max-w-5xl mx-auto"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h4 className="font-bold text-lg mb-1">
              <span className="text-red-400">Red</span>
              <span className="text-[var(--muted)] mx-2">vs</span>
              <span className="text-blue-400">Blue</span>
              <span className="text-[var(--foreground)] ml-2">Battle Arena</span>
            </h4>
            <p className="text-xs text-[var(--muted-foreground)]">Adversarial training in a secure sandbox environment to enhance AI security awareness</p>
          </div>
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 border border-purple-500/30 text-sm font-semibold hover:border-purple-400/50 transition-all">
            🎮 Coming Soon
          </button>
        </div>
      </motion.div>
    </div>
  );
}
