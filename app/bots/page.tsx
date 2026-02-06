"use client";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Bot, MessageSquare, Zap, Settings, Play, Pause, Trash2, Plus } from "lucide-react";
import { SiTelegram, SiDiscord, SiSlack, SiWhatsapp, SiWechat } from "react-icons/si";

const bots = [
  {
    id: "telegram-love",
    name: "Love Bot",
    platform: "Telegram",
    icon: SiTelegram,
    color: "#26A5E4",
    status: "active",
    messages: 1234,
    users: 89,
    uptime: "99.9%",
    cost: "฿12.50/month"
  },
  {
    id: "discord-sage",
    name: "Cyber Sage",
    platform: "Discord",
    icon: SiDiscord,
    color: "#5865F2",
    status: "active",
    messages: 567,
    users: 34,
    uptime: "98.5%",
    cost: "฿8.30/month"
  },
  {
    id: "slack-assistant",
    name: "Work Assistant",
    platform: "Slack",
    icon: SiSlack,
    color: "#4A154B",
    status: "paused",
    messages: 234,
    users: 12,
    uptime: "95.2%",
    cost: "฿5.60/month"
  },
  {
    id: "whatsapp-support",
    name: "Customer Support",
    platform: "WhatsApp",
    icon: SiWhatsapp,
    color: "#25D366",
    status: "inactive",
    messages: 0,
    users: 0,
    uptime: "0%",
    cost: "฿0/month"
  }
];

export default function BotsPage() {
  const [selectedBot, setSelectedBot] = useState(bots[0]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">      <SharedHeader />

      {/* Main Content */}
      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-block mb-3 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono">
              🤖 BOT MANAGEMENT CENTER
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Bot <span className="text-[var(--primary)]">管理中心</span>
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Manage all your AI bots across platforms
            </p>
          </div>

          {/* Bots Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {bots.map((bot) => (
              <div
                key={bot.id}
                onClick={() => setSelectedBot(bot)}
                className={`p-6 rounded-xl transition-all cursor-pointer ${
                  selectedBot.id === bot.id
                    ? "bg-[var(--input-bg)] border-2 border-white/30"
                    : "bg-[var(--input-bg)] border border-[var(--border-subtle)] hover:border-[var(--border)]"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <bot.icon className="h-8 w-8" style={{ color: bot.color }} />
                    <div>
                      <h3 className="text-lg font-semibold">{bot.name}</h3>
                      <p className="text-xs text-[var(--muted-foreground)]">{bot.platform}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    bot.status === "active" ? "bg-green-500/20 text-green-400" :
                    bot.status === "paused" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-gray-500/20 text-[var(--muted)]"
                  }`}>
                    {bot.status}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)]">Messages</div>
                    <div className="text-lg font-bold">{bot.messages.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)]">Users</div>
                    <div className="text-lg font-bold">{bot.users}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)]">Uptime</div>
                    <div className="text-lg font-bold text-green-400">{bot.uptime}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-yellow-400">{bot.cost}</span>
                  <div className="flex gap-2">
                    {bot.status === "active" ? (
                      <button className="p-1.5 hover:bg-[var(--input-bg)] rounded">
                        <Pause className="h-4 w-4" />
                      </button>
                    ) : (
                      <button className="p-1.5 hover:bg-[var(--input-bg)] rounded">
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                    <button className="p-1.5 hover:bg-[var(--input-bg)] rounded">
                      <Settings className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 hover:bg-red-500/20 rounded">
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bot Details */}
          <div className="bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <selectedBot.icon className="h-6 w-6" style={{ color: selectedBot.color }} />
              {selectedBot.name} Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bot Token</label>
                <input
                  type="password"
                  value="••••••••••••••••••••"
                  disabled
                  className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-lg opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Webhook URL</label>
                <input
                  type="text"
                  value={`https://oece.tech/api/bots/${selectedBot.id}`}
                  disabled
                  className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-lg opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">AI Model</label>
                <select className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-lg focus:border-[var(--primary)] outline-none">
                  <option>Gemini 2.5 Flash (฿0.14/1K)</option>
                  <option>Gemini 2.5 Pro (฿0.28/1K)</option>
                  <option>賽博神佛 (฿7.00/1K)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Vector Memory</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">Enable long-term memory for this bot</p>
                </div>
                <button className="w-12 h-6 rounded-full bg-green-500">
                  <div className="w-5 h-5 bg-white rounded-full translate-x-6" />
                </button>
              </div>

              <button className="w-full py-3 bg-[var(--primary)] text-white rounded-xl font-medium hover:opacity-90">
                Save Configuration
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-8 text-center">
            <div className="p-4 rounded-lg bg-[var(--input-bg)]">
              <div className="text-2xl font-bold text-blue-400">4</div>
              <div className="text-xs text-[var(--muted-foreground)]">Active Bots</div>
            </div>
            <div className="p-4 rounded-lg bg-[var(--input-bg)]">
              <div className="text-2xl font-bold text-green-400">2,035</div>
              <div className="text-xs text-[var(--muted-foreground)]">Total Messages</div>
            </div>
            <div className="p-4 rounded-lg bg-[var(--input-bg)]">
              <div className="text-2xl font-bold text-purple-400">135</div>
              <div className="text-xs text-[var(--muted-foreground)]">Total Users</div>
            </div>
            <div className="p-4 rounded-lg bg-[var(--input-bg)]">
              <div className="text-2xl font-bold text-yellow-400">฿26.40</div>
              <div className="text-xs text-[var(--muted-foreground)]">Monthly Cost</div>
            </div>
          </div>
        </div>
      </main>
      <SharedFooter />
    </div>
  );
}
