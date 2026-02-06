"use client";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Zap, Download, RefreshCw, Loader2 } from 'lucide-react';

export default function NovelPage() {
  const [protagonist, setProtagonist] = useState('');
  const [genre, setGenre] = useState('cultivation');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chapters, setChapters] = useState<Array<{ title: string; content: string }>>([]);

  const genres = [
    { id: 'cultivation', name: '修仙', emoji: '⚔️', color: 'from-blue-500 to-cyan-500' },
    { id: 'urban', name: '都市', emoji: '🏙️', color: 'from-orange-500 to-yellow-500' },
    { id: 'fantasy', name: '玄幻', emoji: '🔮', color: 'from-purple-500 to-pink-500' },
    { id: 'scifi', name: '科幻', emoji: '🚀', color: 'from-green-500 to-teal-500' },
  ];

  const handleGenerate = async () => {
    if (!protagonist.trim()) return;
    
    setIsGenerating(true);
    // TODO: 調用 Grok API 生成爽文
    setTimeout(() => {
      setChapters([
        {
          title: '第一章：覺醒',
          content: `${protagonist}睜開眼睛，發現自己躺在一個陌生的地方。周圍是古老的石柱，空氣中瀰漫著神秘的能量...\n\n"這是哪裡？"他喃喃自語，突然感覺到體內有一股強大的力量在湧動。\n\n【系統啟動】\n【恭喜宿主獲得：無敵修仙系統】\n【新手禮包已發放】`,
        },
        {
          title: '第二章：初試身手',
          content: `剛剛獲得系統的${protagonist}，決定測試一下自己的新能力。他走出石室，來到一片開闊的廣場...\n\n"就讓我看看，這個系統到底有多強！"`,
        },
      ]);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-white">      <SharedHeader />

      {/* Main Content */}
      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                爽文推演引擎
              </span>
            </h1>
            <p className="text-[var(--muted)] text-lg">
              設定主角，AI 自動生成無限爽文劇情
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Settings */}
            <div className="lg:col-span-1 space-y-6">
              {/* Genre Selection */}
              <div className="p-6 rounded-2xl bg-[var(--card)] border border-blue-500/20">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  選擇類型
                </h3>
                <div className="space-y-3">
                  {genres.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGenre(g.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        genre === g.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-[var(--border-subtle)] hover:border-blue-500/50'
                      }`}
                    >
                      <div className="text-2xl">{g.emoji}</div>
                      <div className="text-left flex-1">
                        <div className="font-bold">{g.name}</div>
                        <div className="text-xs text-[var(--muted)]">
                          {g.id === 'cultivation' && '修仙煉氣，逆天改命'}
                          {g.id === 'urban' && '都市風雲，商戰情場'}
                          {g.id === 'fantasy' && '異世冒險，稱霸諸天'}
                          {g.id === 'scifi' && '星際征途，科技至上'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Protagonist Input */}
              <div className="p-6 rounded-2xl bg-[var(--card)] border border-blue-500/20">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  主角設定
                </h3>
                <input
                  type="text"
                  value={protagonist}
                  onChange={(e) => setProtagonist(e.target.value)}
                  placeholder="輸入主角名字，例如：葉凡"
                  className="w-full bg-[var(--background)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors mb-4"
                />
                <button
                  onClick={handleGenerate}
                  disabled={!protagonist.trim() || isGenerating}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      推演中...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      開始推演
                    </>
                  )}
                </button>
              </div>

              {/* Stats */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="text-xs text-[var(--muted)] space-y-2">
                  <div className="flex justify-between">
                    <span>已生成章節</span>
                    <span className="text-blue-400 font-bold">{chapters.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>總字數</span>
                    <span className="text-blue-400 font-bold">
                      {chapters.reduce((acc, ch) => acc + ch.content.length, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Content */}
            <div className="lg:col-span-2">
              <div className="p-6 rounded-2xl bg-[var(--card)] border border-blue-500/20 min-h-[600px]">
                {chapters.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-4">📖</div>
                    <h3 className="text-xl font-bold mb-2">等待推演</h3>
                    <p className="text-sm text-[var(--muted)]">
                      設定主角和類型，點擊開始推演按鈕
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">《{protagonist}的逆襲之路》</h3>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-[var(--background)] border border-[var(--border-subtle)] rounded-lg text-sm hover:border-blue-500 transition-colors flex items-center gap-2">
                          <RefreshCw className="w-4 h-4" />
                          繼續生成
                        </button>
                        <button className="px-4 py-2 bg-[var(--background)] border border-[var(--border-subtle)] rounded-lg text-sm hover:border-blue-500 transition-colors flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          下載
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {chapters.map((chapter, idx) => (
                        <div key={idx} className="p-6 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] hover:border-blue-500 transition-colors">
                          <h4 className="text-lg font-bold mb-4 text-blue-400">{chapter.title}</h4>
                          <div className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">
                            {chapter.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <SharedFooter />
    </div>
  );
}
