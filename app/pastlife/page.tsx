"use client";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Calendar, MapPin, Briefcase, Download, Loader2 } from 'lucide-react';

interface PastLifeResult {
  era: string;
  location: string;
  occupation: string;
  personality: string;
  achievements: string[];
  fate: string;
}

export default function PastLifePage() {
  const [birthDate, setBirthDate] = useState('');
  const [personality, setPersonality] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PastLifeResult | null>(null);

  const handleAnalyze = async () => {
    if (!birthDate || !personality.trim()) return;
    
    setIsAnalyzing(true);
    // TODO: 調用 Grok API 分析前世
    setTimeout(() => {
      setResult({
        era: '唐朝貞觀年間（公元 627-649 年）',
        location: '長安城（今西安）',
        occupation: '翰林學士',
        personality: '才華橫溢，性格儒雅，喜愛詩詞歌賦，為人正直不阿',
        achievements: [
          '曾參與編纂《貞觀政要》',
          '詩作被收錄於《全唐詩》',
          '深得唐太宗賞識，多次參與朝政討論',
          '培養了三位進士，桃李滿天下',
        ],
        fate: '享年六十有八，壽終正寢。後世子孫繁榮昌盛，家族延續至今。',
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-white">      <SharedHeader />

      {/* Main Content */}
      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                前世分析器
              </span>
            </h1>
            <p className="text-[var(--muted)] text-lg">
              基於生辰和性格，AI 推演你的前世身份
            </p>
          </div>

          {!result ? (
            /* Input Form */
            <div className="max-w-2xl mx-auto">
              <div className="p-8 rounded-2xl bg-[var(--card)] border border-amber-500/20 space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    出生日期
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-[var(--background)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    性格特徵
                  </label>
                  <textarea
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    placeholder="描述你的性格特徵，例如：內向、喜歡閱讀、善於思考..."
                    className="w-full h-32 bg-[var(--background)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!birthDate || !personality.trim() || isAnalyzing}
                  className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      分析中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      開始分析
                    </>
                  )}
                </button>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="text-xs text-[var(--muted)] space-y-2">
                    <p className="flex items-start gap-2">
                      <span className="text-amber-400">🔮</span>
                      <span>分析結果僅供娛樂參考</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-amber-400">✨</span>
                      <span>AI 基於玄學理論和歷史數據推演</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Result Display */
            <div className="space-y-6">
              <div className="text-center">
                <button
                  onClick={() => setResult(null)}
                  className="px-6 py-2 bg-[var(--card)] border border-[var(--border-subtle)] rounded-lg text-sm hover:border-amber-500 transition-colors"
                >
                  重新分析
                </button>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">👑</div>
                  <h2 className="text-3xl font-black text-amber-400 mb-2">你的前世身份</h2>
                  <p className="text-[var(--muted)]">根據你的生辰和性格推演</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 rounded-xl bg-[var(--card)] border border-amber-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-amber-400" />
                      <h3 className="font-bold">時代</h3>
                    </div>
                    <p className="text-sm text-[var(--foreground)]">{result.era}</p>
                  </div>

                  <div className="p-6 rounded-xl bg-[var(--card)] border border-amber-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="w-5 h-5 text-amber-400" />
                      <h3 className="font-bold">地域</h3>
                    </div>
                    <p className="text-sm text-[var(--foreground)]">{result.location}</p>
                  </div>

                  <div className="p-6 rounded-xl bg-[var(--card)] border border-amber-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Briefcase className="w-5 h-5 text-amber-400" />
                      <h3 className="font-bold">職業</h3>
                    </div>
                    <p className="text-sm text-[var(--foreground)]">{result.occupation}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-[var(--card)] border border-amber-500/20">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      性格特質
                    </h3>
                    <p className="text-sm text-[var(--foreground)] leading-relaxed">{result.personality}</p>
                  </div>

                  <div className="p-6 rounded-xl bg-[var(--card)] border border-amber-500/20">
                    <h3 className="font-bold mb-3">主要成就</h3>
                    <ul className="space-y-2">
                      {result.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                          <span className="text-amber-400 mt-1">✦</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 rounded-xl bg-[var(--card)] border border-amber-500/20">
                    <h3 className="font-bold mb-3">人生結局</h3>
                    <p className="text-sm text-[var(--foreground)] leading-relaxed">{result.fate}</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:scale-105 transition-all flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    下載報告
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <SharedFooter />
    </div>
  );
}
