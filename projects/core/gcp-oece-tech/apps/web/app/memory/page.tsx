"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Database, Brain, Zap, Search, Upload, Download, Trash2, Eye, Lock } from "lucide-react";

const memoryStats = {
  totalVectors: 12450,
  storageUsed: 2.3, // GB
  storageLimit: 10, // GB
  queriesThisMonth: 856,
  accuracy: 98.7,
  cost: 245.60 // THB
};

const recentMemories = [
  {
    id: 1,
    title: "Firebase 部署配置完整記錄",
    type: "Technical",
    vectors: 234,
    created: "2025-11-28",
    size: "1.2 MB",
    queries: 45
  },
  {
    id: 2,
    title: "賽博神佛對話歷史",
    type: "Conversation",
    vectors: 567,
    created: "2025-11-27",
    size: "3.4 MB",
    queries: 123
  },
  {
    id: 3,
    title: "AI 戰略核心知識庫",
    type: "Knowledge",
    vectors: 1234,
    created: "2025-11-26",
    size: "8.9 MB",
    queries: 234
  }
];

export default function MemoryPage() {
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
            <div className="inline-block mb-3 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-mono">
              🧠 VECTOR MEMORY VAULT
            </div>
            <h1 className="text-4xl font-bold mb-2">
              向量 <span className="text-[var(--primary)]">記憶庫</span>
            </h1>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto mb-4">
              虛空取物 · 天價索引 · 精準召回 · MongoDB Atlas Vector Search
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-sm text-yellow-400">
              <Lock className="h-4 w-4" />
              Premium Feature · ฿0.10/1K vectors
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30">
              <Database className="h-8 w-8 text-blue-400 mb-3" />
              <div className="text-2xl font-bold text-white mb-1">
                {memoryStats.totalVectors.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Total Vectors</div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
              <Brain className="h-8 w-8 text-green-400 mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{memoryStats.accuracy}%</div>
              <div className="text-xs text-gray-400">Accuracy</div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/30">
              <Search className="h-8 w-8 text-orange-400 mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{memoryStats.queriesThisMonth}</div>
              <div className="text-xs text-gray-400">Queries This Month</div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/30">
              <Zap className="h-8 w-8 text-pink-400 mb-3" />
              <div className="text-2xl font-bold text-yellow-400 mb-1">฿{memoryStats.cost}</div>
              <div className="text-xs text-gray-400">Cost This Month</div>
            </div>
          </div>

          {/* Storage Usage */}
          <div className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Storage Usage</h3>
              <span className="text-sm text-gray-400">
                {memoryStats.storageUsed} GB / {memoryStats.storageLimit} GB
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${(memoryStats.storageUsed / memoryStats.storageLimit) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {((memoryStats.storageLimit - memoryStats.storageUsed) * 1024).toFixed(0)} MB remaining
            </p>
          </div>

          {/* Recent Memories */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Memories</h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10">
                  <Upload className="h-4 w-4" />
                  Upload
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10">
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {recentMemories.map((mem) => (
                <div
                  key={mem.id}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-1">{mem.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                          {mem.type}
                        </span>
                        <span>{mem.vectors} vectors</span>
                        <span>•</span>
                        <span>{mem.size}</span>
                        <span>•</span>
                        <span>{mem.created}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Eye className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Download className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-green-400">
                      <Search className="h-3 w-3" />
                      {mem.queries} queries
                    </span>
                    <span className="text-gray-600">
                      Cost: ฿{(mem.vectors * 0.10 / 1000).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Info */}
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Vector Memory Pricing
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Storage</div>
                <div className="font-mono text-yellow-400">฿0.10/1K vectors</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Search Query</div>
                <div className="font-mono text-yellow-400">฿0.06/query</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Retrieval</div>
                <div className="font-mono text-yellow-400">฿0.02/result</div>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              💎 天價向量索引 = 虛空取物 · 精準召回 · 永久存儲 · 迷你蒸餾效果
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
