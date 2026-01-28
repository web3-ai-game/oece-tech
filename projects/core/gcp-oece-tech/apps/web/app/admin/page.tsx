"use client";

import Link from "next/link";
import { Sparkles, Users, Bot, Database, Zap, TrendingUp, AlertTriangle, Ban, Eye } from "lucide-react";

const systemStats = {
  totalUsers: 234,
  activeUsers: 89,
  totalBots: 12,
  totalTokens: 1245678,
  totalCost: 2456.78,
  revenue: 0, // Beta 免費
  alerts: 3
};

const recentUsers = [
  { id: 1, name: "DeepWeay", email: "deep@oece.tech", tokens: 12450, cost: 245.60, status: "active", risk: "low" },
  { id: 2, name: "CyberSage", email: "sage@oece.tech", tokens: 8900, cost: 178.00, status: "active", risk: "low" },
  { id: 3, name: "Hacker123", email: "hack@evil.com", tokens: 45678, cost: 913.56, status: "suspicious", risk: "high" },
];

const alerts = [
  { id: 1, type: "security", message: "用戶 Hacker123 疑似注入攻擊", severity: "high", time: "2 mins ago" },
  { id: 2, type: "cost", message: "Token 使用量超過預算 20%", severity: "medium", time: "1 hour ago" },
  { id: 3, type: "system", message: "Bot #3 響應時間過長", severity: "low", time: "3 hours ago" },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-[var(--background)]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--primary)]" />
            <span className="text-lg font-semibold">OECE.tech</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium border border-red-500/30">
              🔴 ADMIN MODE
            </div>
            <Link href="/" className="text-sm text-gray-400 hover:text-white">
              ← Exit
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Admin <span className="text-[var(--primary)]">Dashboard</span>
            </h1>
            <p className="text-sm text-gray-400">上帝視角 · 核按鈕 · 隨時封禁</p>
          </div>

          {/* System Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
              <Users className="h-8 w-8 text-blue-400 mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{systemStats.totalUsers}</div>
              <div className="text-xs text-gray-400">Total Users</div>
              <div className="text-xs text-green-400 mt-1">+{systemStats.activeUsers} active</div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
              <Bot className="h-8 w-8 text-purple-400 mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{systemStats.totalBots}</div>
              <div className="text-xs text-gray-400">Active Bots</div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
              <Zap className="h-8 w-8 text-yellow-400 mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {(systemStats.totalTokens / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-gray-400">Tokens Burned</div>
              <div className="text-xs font-mono text-yellow-400 mt-1">฿{systemStats.totalCost.toFixed(2)}</div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30">
              <AlertTriangle className="h-8 w-8 text-red-400 mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{systemStats.alerts}</div>
              <div className="text-xs text-gray-400">Active Alerts</div>
            </div>
          </div>

          {/* Alerts */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Security Alerts
            </h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-all ${
                    alert.severity === "high" ? "bg-red-500/10 border-red-500/30" :
                    alert.severity === "medium" ? "bg-yellow-500/10 border-yellow-500/30" :
                    "bg-blue-500/10 border-blue-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium ${
                          alert.severity === "high" ? "text-red-400" :
                          alert.severity === "medium" ? "text-yellow-400" :
                          "text-blue-400"
                        }`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                    <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition-colors">
                      處理
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Management */}
          <div>
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-gray-400">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">User</th>
                    <th className="px-6 py-3 text-left font-medium">Tokens</th>
                    <th className="px-6 py-3 text-left font-medium">Cost</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                    <th className="px-6 py-3 text-left font-medium">Risk</th>
                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-300">
                        {user.tokens.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-mono text-yellow-400">
                        ฿{user.cost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.status === "active" ? "bg-green-500/20 text-green-400" :
                          user.status === "suspicious" ? "bg-red-500/20 text-red-400" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.risk === "high" ? "bg-red-500/20 text-red-400" :
                          user.risk === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-green-500/20 text-green-400"
                        }`}>
                          {user.risk}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Eye className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors" title="封禁用戶">
                            <Ban className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
