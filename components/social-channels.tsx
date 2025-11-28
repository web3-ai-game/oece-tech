"use client";

import { motion } from "framer-motion";

// 社交媒體 & 通訊渠道
const socialChannels = [
  // 重點宣傳
  { name: "Telegram", color: "#0088cc" },
  { name: "Instagram", color: "#E4405F" },
  // 視頻平台
  { name: "YouTube", color: "#FF0000" },
  { name: "YouTube Shorts", color: "#FF0000" },
  { name: "TikTok", color: "#000000" },
  // 社交平台
  { name: "Facebook", color: "#1877F2" },
  { name: "Twitter/X", color: "#000000" },
  { name: "LinkedIn", color: "#0A66C2" },
  { name: "Discord", color: "#5865F2" },
  // 協作工具
  { name: "Slack", color: "#4A154B" },
  { name: "Notion", color: "#000000" },
  { name: "WhatsApp", color: "#25D366" },
  { name: "WeChat", color: "#07C160" },
];

// Firebase 全棧登錄
const authProviders = [
  // 原生供應商
  { name: "Email", type: "native" },
  { name: "Phone", type: "native" },
  { name: "Anonymous", type: "native" },
  // 第三方供應商
  { name: "Google", type: "provider", color: "#4285F4" },
  { name: "Facebook", type: "provider", color: "#1877F2" },
  { name: "Apple", type: "provider", color: "#000000" },
  { name: "GitHub", type: "provider", color: "#181717" },
  { name: "Microsoft", type: "provider", color: "#00A4EF" },
  { name: "Twitter", type: "provider", color: "#1DA1F2" },
  { name: "Yahoo", type: "provider", color: "#6001D2" },
  { name: "Game Center", type: "provider", color: "#EA4335" },
  { name: "Play Games", type: "provider", color: "#34A853" },
  // 自訂供應商
  { name: "OpenID", type: "custom" },
  { name: "SAML", type: "custom" },
];

export function SocialChannels() {
  return (
    <div className="py-12 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
            📢 Omni-Channel Marketing
          </span>
        </div>

        {/* Social Icons Grid */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {socialChannels.map((channel, i) => (
            <motion.div
              key={channel.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.1, y: -2 }}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/30 transition-all cursor-default"
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: channel.color }}
              />
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
                {channel.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Priority Channels */}
        <div className="flex justify-center gap-4 text-xs text-gray-500">
          <span>🔥 Primary: <span className="text-blue-400">Telegram</span> · <span className="text-pink-400">Instagram</span></span>
          <span className="text-gray-700">|</span>
          <span>📹 Video: YouTube · TikTok</span>
          <span className="text-gray-700">|</span>
          <span>💼 B2B: Slack · Notion</span>
        </div>
      </div>
    </div>
  );
}

export function AuthProviders() {
  return (
    <div className="py-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">
            🔥 Firebase Authentication · 全棧登錄支持
          </span>
        </div>

        {/* Auth Providers Grid */}
        <div className="flex flex-wrap justify-center gap-2">
          {authProviders.map((provider, i) => (
            <motion.div
              key={provider.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                provider.type === "native" 
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : provider.type === "custom"
                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:border-white/30"
              }`}
            >
              {provider.name}
            </motion.div>
          ))}
        </div>

        {/* Provider Types Legend */}
        <div className="flex justify-center gap-6 mt-4 text-[10px] text-gray-600">
          <span><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" />Native</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-1" />OAuth Providers</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1" />Enterprise SSO</span>
        </div>
      </div>
    </div>
  );
}
