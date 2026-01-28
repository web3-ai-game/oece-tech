'use client';

import Link from 'next/link';
import { Cpu, Database, Sparkles, Zap, ArrowRight, Brain, Layers } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* 導航 */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Cpu className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-bold gradient-text">DeepWeay</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 text-gray-400 hover:text-white transition">
              登錄
            </Link>
            <Link href="/register" className="cyber-btn text-sm">
              開始使用
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero 區域 */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-300">向量擴散 · 知識蒸餾 · AI驅動</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">知識蒸餾</span>
            <br />
            <span className="text-white">下一代向量引擎</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            基於 Gemini 2.5 Pro 的智能蒸餾系統，將海量知識壓縮為精華向量，
            實現因果推理與命運擴散
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="cyber-btn flex items-center justify-center gap-2">
              免費開始 <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition flex items-center justify-center gap-2">
              探索功能
            </Link>
          </div>
        </div>
      </section>

      {/* 功能卡片 */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Brain,
              title: '知識蒸餾',
              desc: '4種調溫模式：冷切割、向量噴射、高溫擴散、蒸餾提煉',
              color: 'cyan',
            },
            {
              icon: Database,
              title: '向量搜索',
              desc: '基於 Supabase pgvector，毫秒級語義相似度匹配',
              color: 'purple',
            },
            {
              icon: Layers,
              title: '多模態生成',
              desc: '小愛同學漫畫生成、視頻創作、TTS語音合成',
              color: 'pink',
            },
          ].map((item, i) => (
            <div key={i} className="glass-card p-8 hover:border-cyan-500/30 transition group">
              <div className={`w-14 h-14 bg-${item.color}-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                <item.icon className={`w-7 h-7 text-${item.color}-400`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 數據統計 */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '฿3.5', label: '/百萬Token' },
            { value: '4把', label: '付費Keys' },
            { value: '20฿', label: '封頂/會話' },
            { value: '∞', label: '向量容量' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto glass-card p-12 text-center cyber-border">
          <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">準備好蒸餾你的知識了嗎？</h2>
          <p className="text-gray-400 mb-8">加入 DeepWeay，開啟向量擴散之旅</p>
          <Link href="/register" className="cyber-btn inline-flex items-center gap-2">
            立即註冊 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© 2025 DeepWeay SMS | 知識蒸餾平台 v2077</p>
      </footer>
    </div>
  );
}
