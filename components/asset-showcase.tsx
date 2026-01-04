"use client";

import { motion } from "framer-motion";
import { DollarSign, Zap, Database, Shield } from "lucide-react";
import { SiGoogle, SiGithub } from "react-icons/si";

export function AssetShowcase() {
  return (
    <section className="py-12 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block mb-3 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-mono"
          >
            💎 ASSET PORTFOLIO
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-bold text-white mb-2"
          >
            資產組合 · 算力池
          </motion.h2>
          <p className="text-sm text-gray-400">
            Google 教育 + 開發者計劃 + GitHub 學生包 + API 資產
          </p>
        </div>

        {/* Main Assets Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Google Ecosystem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <SiGoogle className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-bold">Google Ecosystem</h3>
                <p className="text-xs text-gray-400">Education + Developer + AI Premium</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">GCP Credits</span>
                <span className="font-mono text-green-400">$300</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gemini API Credits</span>
                <span className="font-mono text-green-400">$1,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Workspace Education</span>
                <span className="text-blue-400">Unlimited Storage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">One AI Premium</span>
                <span className="text-purple-400">2 TB + Gemini Advanced</span>
              </div>
            </div>
          </motion.div>

          {/* GitHub Ecosystem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <SiGithub className="h-8 w-8 text-white" />
              <div>
                <h3 className="text-lg font-bold">GitHub Ecosystem</h3>
                <p className="text-xs text-gray-400">Pro + Student Pack + Copilot</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Student Developer Pack</span>
                <span className="font-mono text-green-400">$200K+ Value</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">GitHub Pro</span>
                <span className="text-blue-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Copilot</span>
                <span className="text-purple-400">Student Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Actions</span>
                <span className="text-green-400">3000 min/month</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* API Assets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-4 mb-6"
        >
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white mb-1">28+1</div>
            <div className="text-xs text-gray-400">Gemini API Keys</div>
            <div className="text-xs font-mono text-green-400 mt-1">$2,900</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Database className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white mb-1">$1,111</div>
            <div className="text-xs text-gray-400">OpenRouter Balance</div>
            <div className="text-xs font-mono text-green-400 mt-1">$1,111</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Shield className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white mb-1">$100</div>
            <div className="text-xs text-gray-400">Claude Kilo (至 2030)</div>
            <div className="text-xs font-mono text-green-400 mt-1">$100</div>
          </div>
        </motion.div>

        {/* Total Assets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="h-6 w-6 text-yellow-400" />
            <h3 className="text-lg font-bold">Total Digital Assets</h3>
          </div>
          <div className="text-4xl font-bold text-yellow-400 mb-1">
            $205,311
          </div>
          <div className="text-sm text-gray-400">
            USD · Capital Restructuring · Compute Power Foundation
          </div>
          <div className="mt-4 flex justify-center gap-6 text-xs text-gray-500">
            <span>💰 Liquid: $5,311</span>
            <span>•</span>
            <span>📦 Subscriptions: $200K</span>
            <span>•</span>
            <span>📊 Monthly Cost: $44</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
