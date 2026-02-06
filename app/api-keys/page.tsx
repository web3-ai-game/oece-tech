"use client";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Key, Copy, Eye, EyeOff, Plus, Trash2, RefreshCw } from "lucide-react";

const apiKeys = [
  {
    id: 1,
    name: "Production Bot",
    key: "oece_sk_live_a1b2c3d4e5f6g7h8i9j0",
    created: "2025-11-28",
    lastUsed: "2 mins ago",
    requests: 12450,
    cost: "฿245.60",
    status: "active"
  },
  {
    id: 2,
    name: "Development Test",
    key: "oece_sk_test_z9y8x7w6v5u4t3s2r1q0",
    created: "2025-11-27",
    lastUsed: "1 hour ago",
    requests: 567,
    cost: "฿11.34",
    status: "active"
  },
  {
    id: 3,
    name: "Legacy Bot (Deprecated)",
    key: "oece_sk_live_old_key_deprecated",
    created: "2025-11-20",
    lastUsed: "5 days ago",
    requests: 234,
    cost: "฿4.68",
    status: "inactive"
  }
];

export default function APIKeysPage() {
  const [showKeys, setShowKeys] = useState<Record<number, boolean>>({});

  const toggleKeyVisibility = (id: number) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    // TODO: Show toast notification
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">      <SharedHeader />

      {/* Main Content */}
      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="mb-8">
            <div className="inline-block mb-3 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-mono">
              🔑 DEVELOPER CONSOLE
            </div>
            <h1 className="text-4xl font-bold mb-2">
              API <span className="text-[var(--primary)]">Keys</span>
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Manage your API keys · Call OECE services from your code · Lock users in your ecosystem
            </p>
          </div>

          {/* Usage Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)]">
              <div className="text-2xl font-bold text-blue-400">3</div>
              <div className="text-xs text-[var(--muted-foreground)]">Active Keys</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)]">
              <div className="text-2xl font-bold text-green-400">13,251</div>
              <div className="text-xs text-[var(--muted-foreground)]">Total Requests</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)]">
              <div className="text-2xl font-bold text-yellow-400">฿261.62</div>
              <div className="text-xs text-[var(--muted-foreground)]">Total Cost</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)]">
              <div className="text-2xl font-bold text-purple-400">99.8%</div>
              <div className="text-xs text-[var(--muted-foreground)]">Success Rate</div>
            </div>
          </div>

          {/* API Keys List */}
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="p-6 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)] hover:border-[var(--border)] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{apiKey.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        apiKey.status === "active" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-gray-500/20 text-[var(--muted)]"
                      }`}>
                        {apiKey.status}
                      </span>
                    </div>
                    
                    {/* API Key Display */}
                    <div className="flex items-center gap-2 mb-3">
                      <code className="flex-1 px-3 py-2 bg-black/50 border border-[var(--border-subtle)] rounded-lg text-sm font-mono">
                        {showKeys[apiKey.id] ? apiKey.key : "••••••••••••••••••••••••••••••••"}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="p-2 hover:bg-[var(--input-bg)] rounded-lg transition-colors"
                      >
                        {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="p-2 hover:bg-[var(--input-bg)] rounded-lg transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-xs">
                      <div>
                        <div className="text-[var(--muted-foreground)] mb-1">Created</div>
                        <div className="text-[var(--foreground)]">{apiKey.created}</div>
                      </div>
                      <div>
                        <div className="text-[var(--muted-foreground)] mb-1">Last Used</div>
                        <div className="text-[var(--foreground)]">{apiKey.lastUsed}</div>
                      </div>
                      <div>
                        <div className="text-[var(--muted-foreground)] mb-1">Requests</div>
                        <div className="text-[var(--foreground)]">{apiKey.requests.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[var(--muted-foreground)] mb-1">Cost</div>
                        <div className="font-mono text-yellow-400">{apiKey.cost}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-[var(--input-bg)] rounded-lg transition-colors">
                      <RefreshCw className="h-4 w-4 text-[var(--muted)]" />
                    </button>
                    <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Code Example */}
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30">
            <h3 className="text-lg font-bold mb-3">Quick Start</h3>
            <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs">
              <code className="text-green-400">{`// Node.js Example
const response = await fetch('https://api.oece.tech/v1/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer oece_sk_live_YOUR_KEY_HERE',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gemini-2.5-flash',
    messages: [{ role: 'user', content: 'Hello!' }],
    vectorMemory: true  // 啟用向量記憶
  })
});

const data = await response.json();
console.log(data.response);
// 💸 漫不經心一句話，幾萬 Token 燒出去`}</code>
            </pre>
          </div>
        </div>
      </main>
      <SharedFooter />
    </div>
  );
}
