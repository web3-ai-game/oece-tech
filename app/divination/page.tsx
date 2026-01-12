"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Moon, Star, Zap, Eye, Heart, Loader2 } from "lucide-react";

const divinationTypes = [
  {
    id: "tarot",
    name: "塔羅占卜",
    nameEn: "Tarot Reading",
    icon: Moon,
    color: "#8B5CF6",
    desc: "探索命運之輪",
    descEn: "Explore the Wheel of Fortune",
    cost: "฿7.00/reading"
  },
  {
    id: "astrology",
    name: "星座運勢",
    nameEn: "Astrology",
    icon: Star,
    color: "#F59E0B",
    desc: "解讀星辰密語",
    descEn: "Decode Celestial Messages",
    cost: "฿5.00/reading"
  },
  {
    id: "iching",
    name: "易經卦象",
    nameEn: "I-Ching",
    icon: Zap,
    color: "#10B981",
    desc: "古老智慧指引",
    descEn: "Ancient Wisdom Guidance",
    cost: "฿7.00/reading"
  },
  {
    id: "dream",
    name: "AI 解夢",
    nameEn: "Dream Analysis",
    icon: Eye,
    color: "#06B6D4",
    desc: "潛意識解碼",
    descEn: "Decode Subconscious",
    cost: "฿3.00/reading"
  },
  {
    id: "love",
    name: "情感分析",
    nameEn: "Love Analysis",
    icon: Heart,
    color: "#EC4899",
    desc: "業力算法診斷",
    descEn: "Karmic Algorithm Diagnosis",
    cost: "฿10.00/session"
  }
];

export default function DivinationPage() {
  const [selectedType, setSelectedType] = useState(divinationTypes[0]);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDivination = async () => {
    if (!question.trim()) {
      setError("請輸入你的問題");
      return;
    }

    setIsLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch(`/api/divination/${selectedType.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "占卜失敗");
      }

      setResponse(data.response);
    } catch (err: any) {
      setError(err.message || "占卜服務暫時不可用");
    } finally {
      setIsLoading(false);
    }
  };

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
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-mono">
              🔮 CYBER DIVINATION
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              賽博 <span className="text-[var(--primary)]">神佛</span>
            </h1>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Ancient wisdom meets AI. Tarot, Astrology, I-Ching, Dream Analysis.
            </p>
          </div>

          {/* Divination Types Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {divinationTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type)}
                className={`group p-6 rounded-2xl text-left transition-all ${
                  selectedType.id === type.id
                    ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50"
                    : "bg-white/5 border border-white/10 hover:border-white/20"
                }`}
              >
                <type.icon 
                  className="h-10 w-10 mb-4" 
                  style={{ color: type.color }}
                />
                <h3 className="text-lg font-bold mb-1">{type.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{type.nameEn}</p>
                <p className="text-sm text-gray-400 mb-3">{type.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-yellow-400">{type.cost}</span>
                  <span className="text-xs text-gray-600 group-hover:text-white transition-colors">
                    開始占卜 →
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Divination Panel */}
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <selectedType.icon className="h-8 w-8" style={{ color: selectedType.color }} />
              <div>
                <h2 className="text-2xl font-bold">{selectedType.name}</h2>
                <p className="text-sm text-gray-400">{selectedType.nameEn}</p>
              </div>
            </div>

            {/* Divination Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">你的問題 / Your Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="請輸入你想要占卜的問題... (例如：我的事業發展如何？)"
                className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 outline-none resize-none"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Action Button */}
            <button 
              onClick={handleDivination}
              disabled={isLoading || !question.trim()}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  占卜中...
                </>
              ) : (
                <>
                  <selectedType.icon className="h-5 w-5" />
                  開始 {selectedType.name} - {selectedType.cost}
                </>
              )}
            </button>

            {/* Response */}
            {response && (
              <div className="mt-6 p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <selectedType.icon className="h-5 w-5" style={{ color: selectedType.color }} />
                  {selectedType.name}結果
                </h3>
                <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {response}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <p className="mt-4 text-xs text-center text-gray-600">
              ⚠️ 占卜結果僅供娛樂參考，請勿過度迷信
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto text-center">
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-purple-400">1,234</div>
              <div className="text-xs text-gray-500">Total Readings</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-pink-400">98.7%</div>
              <div className="text-xs text-gray-500">Satisfaction</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-yellow-400">5</div>
              <div className="text-xs text-gray-500">Methods</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
