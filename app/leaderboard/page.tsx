"use client";

import Link from "next/link";
import { Sparkles, Trophy, Zap, TrendingUp, Award, Crown } from "lucide-react";

const leaderboard = [
  { rank: 1, user: "Deep**ay", tokens: 125678, cost: 2513.56, city: "🏙️ Mega City", level: 15, badge: "👑" },
  { rank: 2, user: "Cyber**ge", tokens: 98234, cost: 1964.68, city: "🌆 Tech Hub", level: 12, badge: "🥇" },
  { rank: 3, user: "AI**ster", tokens: 76543, cost: 1530.86, city: "🏘️ Smart Town", level: 10, badge: "🥈" },
  { rank: 4, user: "Code**nja", tokens: 65432, cost: 1308.64, city: "🏠 Dev Village", level: 9, badge: "🥉" },
  { rank: 5, user: "Data**uru", tokens: 54321, cost: 1086.42, city: "🏡 Data Farm", level: 8, badge: "⭐" },
  { rank: 6, user: "Vec**ord", tokens: 43210, cost: 864.20, city: "🏚️ Vector Hut", level: 7, badge: "💎" },
  { rank: 7, user: "Prom**ing", tokens: 32109, cost: 642.18, city: "🏗️ Build Site", level: 6, badge: "🔥" },
  { rank: 8, user: "Tok**ner", tokens: 21098, cost: 421.96, city: "🌃 Night City", level: 5, badge: "⚡" },
  { rank: 9, user: "Mem**ank", tokens: 10987, cost: 219.74, city: "🏞️ Memory Lake", level: 4, badge: "🌟" },
  { rank: 10, user: "New**ser", tokens: 5432, cost: 108.64, city: "🌱 Starter Camp", level: 2, badge: "🎯" },
];

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-[var(--background)]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--primary)]" />
            <span className="text-lg font-semibold">OECE.tech</span>
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-block mb-3 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-mono">
              🏆 TOKEN LEADERBOARD
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              矩陣 <span className="text-[var(--primary)]">城市</span>
            </h1>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Token 消耗排行榜 · 微縮城市可視化 · 匿名後兩位 · GitHub Contributions 風格
            </p>
          </div>

          {/* Top 3 Podium */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {leaderboard.slice(0, 3).map((user, i) => (
              <div
                key={user.rank}
                className={`p-6 rounded-2xl border transition-all ${
                  i === 0 ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 md:order-2 transform md:scale-110" :
                  i === 1 ? "bg-gradient-to-br from-gray-500/20 to-slate-500/20 border-gray-500/50 md:order-1" :
                  "bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/50 md:order-3"
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{user.badge}</div>
                  <div className="text-6xl font-bold mb-2">#{user.rank}</div>
                  <div className="text-lg font-semibold mb-1">{user.user}</div>
                  <div className="text-2xl mb-1">{user.city}</div>
                  <div className="text-sm text-gray-400 mb-2">Level {user.level}</div>
                  <div className="font-mono text-lg text-yellow-400 mb-1">
                    {user.tokens.toLocaleString()} tokens
                  </div>
                  <div className="text-xs text-gray-500">฿{user.cost.toFixed(2)} burned</div>
                </div>
              </div>
            ))}
          </div>

          {/* Full Leaderboard */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 bg-white/5 border-b border-white/10">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Complete Rankings
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-gray-400">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Rank</th>
                  <th className="px-6 py-3 text-left font-medium">User</th>
                  <th className="px-6 py-3 text-left font-medium">City</th>
                  <th className="px-6 py-3 text-left font-medium">Level</th>
                  <th className="px-6 py-3 text-right font-medium">Tokens</th>
                  <th className="px-6 py-3 text-right font-medium">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {leaderboard.map((user) => (
                  <tr key={user.rank} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{user.badge}</span>
                        <span className="font-bold">#{user.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{user.user}</td>
                    <td className="px-6 py-4">{user.city}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                        Lv.{user.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-gray-300">
                      {user.tokens.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-yellow-400">
                      ฿{user.cost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* City Matrix Visualization (GitHub style) */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30">
            <h2 className="text-2xl font-bold mb-6 text-center">
              🏙️ Matrix City Visualization
            </h2>
            <p className="text-sm text-gray-400 text-center mb-8">
              每個方塊 = 100 tokens · 顏色深度 = 使用強度 · GitHub Contributions 風格
            </p>
            
            {/* Contribution Grid */}
            <div className="flex justify-center">
              <div className="inline-block">
                <div className="grid grid-cols-52 gap-1">
                  {Array.from({ length: 364 }).map((_, i) => {
                    const intensity = Math.random();
                    return (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer ${
                          intensity > 0.8 ? "bg-purple-500" :
                          intensity > 0.6 ? "bg-blue-500" :
                          intensity > 0.4 ? "bg-cyan-500" :
                          intensity > 0.2 ? "bg-teal-500/50" :
                          "bg-white/10"
                        }`}
                        title={`${Math.floor(intensity * 1000)} tokens`}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-white/10 rounded-sm" />
                    <div className="w-3 h-3 bg-teal-500/50 rounded-sm" />
                    <div className="w-3 h-3 bg-cyan-500 rounded-sm" />
                    <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                    <div className="w-3 h-3 bg-purple-500 rounded-sm" />
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-purple-400 font-mono">
                💸 漫不經心一句話，幾萬 Token 燒出去 · 你的城市正在成長
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
