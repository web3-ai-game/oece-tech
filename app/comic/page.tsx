"use client";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Wand2, Download, Share2, Loader2 } from 'lucide-react';

export default function ComicPage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('anime');
  const [isGenerating, setIsGenerating] = useState(false);
  const [panels, setPanels] = useState<string[]>([]);

  const styles = [
    { id: 'anime', name: '日漫風格', emoji: '🇯🇵' },
    { id: 'american', name: '美漫風格', emoji: '🇺🇸' },
    { id: 'chinese', name: '國漫風格', emoji: '🇨🇳' },
    { id: 'webtoon', name: '條漫風格', emoji: '📱' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // TODO: 調用 Gemini/Grok API 生成漫畫
    setTimeout(() => {
      setPanels([
        'https://placehold.co/600x400/1a1a1a/00FF41?text=Panel+1',
        'https://placehold.co/600x400/1a1a1a/00FF41?text=Panel+2',
        'https://placehold.co/600x400/1a1a1a/00FF41?text=Panel+3',
        'https://placehold.co/600x400/1a1a1a/00FF41?text=Panel+4',
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
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                AI 漫畫生成器
              </span>
            </h1>
            <p className="text-[var(--muted)] text-lg">
              輸入劇情，AI 自動生成精美漫畫分鏡
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Input */}
            <div className="lg:col-span-1 space-y-6">
              {/* Style Selection */}
              <div className="p-6 rounded-2xl bg-[var(--card)] border border-purple-500/20">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-purple-400" />
                  選擇風格
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {styles.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        style === s.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-[var(--border-subtle)] hover:border-purple-500/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{s.emoji}</div>
                      <div className="text-xs font-medium">{s.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div className="p-6 rounded-2xl bg-[var(--card)] border border-purple-500/20">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  劇情描述
                </h3>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例如：一個少年在森林中遇到神秘的精靈，精靈告訴他世界即將毀滅..."
                  className="w-full h-40 bg-[var(--background)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      生成漫畫
                    </>
                  )}
                </button>
              </div>

              {/* Tips */}
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <div className="text-xs text-[var(--muted)] space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="text-purple-400">💡</span>
                    <span>描述越詳細，生成的漫畫越精準</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-purple-400">🎯</span>
                    <span>建議包含場景、角色、動作、情緒</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Panel - Results */}
            <div className="lg:col-span-2">
              <div className="p-6 rounded-2xl bg-[var(--card)] border border-purple-500/20 min-h-[600px]">
                {panels.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-xl font-bold mb-2">等待生成</h3>
                    <p className="text-sm text-[var(--muted)]">
                      輸入劇情並選擇風格，點擊生成按鈕開始創作
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">生成結果</h3>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-[var(--background)] border border-[var(--border-subtle)] rounded-lg text-sm hover:border-purple-500 transition-colors flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          下載
                        </button>
                        <button className="px-4 py-2 bg-[var(--background)] border border-[var(--border-subtle)] rounded-lg text-sm hover:border-purple-500 transition-colors flex items-center gap-2">
                          <Share2 className="w-4 h-4" />
                          分享
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {panels.map((panel, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={panel}
                            alt={`Panel ${idx + 1}`}
                            className="w-full rounded-xl border border-[var(--border-subtle)] group-hover:border-purple-500 transition-colors"
                          />
                          <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 rounded-lg text-xs font-bold">
                            分鏡 {idx + 1}
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
