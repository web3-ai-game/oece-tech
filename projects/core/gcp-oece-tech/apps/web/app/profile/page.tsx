"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, User, MessageSquare, BookOpen, Settings, LogOut, Zap } from "lucide-react";

export default function ProfilePage() {
  const [user] = useState({
    name: "DeepWeay",
    email: "deepweay@oece.tech",
    tier: "Beta Tester",
    tokensUsed: 12450,
    tokensLimit: 50000,
    conversationsCount: 28,
    joinedDate: "2025-11-28"
  });

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
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
            <p className="text-sm text-gray-400 mb-2">{user.email}</p>
            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">
              {user.tier}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
              <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">
                {user.tokensUsed.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Tokens Used</div>
              <div className="mt-2 w-full bg-white/10 rounded-full h-1.5">
                <div 
                  className="bg-yellow-400 h-1.5 rounded-full" 
                  style={{ width: `${(user.tokensUsed / user.tokensLimit) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
              <MessageSquare className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">{user.conversationsCount}</div>
              <div className="text-xs text-gray-500">Conversations</div>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
              <BookOpen className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">∞</div>
              <div className="text-xs text-gray-500">Knowledge Access</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Link 
              href="/chat"
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--primary)] hover:bg-white/10 transition-all group"
            >
              <MessageSquare className="h-6 w-6 text-[var(--primary)] mb-3" />
              <h3 className="text-lg font-semibold mb-1 group-hover:text-[var(--primary)]">Chat History</h3>
              <p className="text-sm text-gray-400">View all your conversations</p>
            </Link>

            <Link 
              href="/knowledge"
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--primary)] hover:bg-white/10 transition-all group"
            >
              <BookOpen className="h-6 w-6 text-[var(--primary)] mb-3" />
              <h3 className="text-lg font-semibold mb-1 group-hover:text-[var(--primary)]">Knowledge Base</h3>
              <p className="text-sm text-gray-400">Explore articles and guides</p>
            </Link>
          </div>

          {/* Settings & Logout */}
          <div className="flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
              <Settings className="h-4 w-4" />
              <span className="text-sm">Settings</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors">
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
