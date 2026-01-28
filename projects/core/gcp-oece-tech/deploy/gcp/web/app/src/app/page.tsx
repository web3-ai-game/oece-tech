'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const features = [
    {
      icon: '🧠',
      title: 'AI 知識蒸餾',
      description: '將複雜知識提煉為核心精華，使用向量引擎智能檢索',
    },
    {
      icon: '🚀',
      title: '向量噴射引擎',
      description: '四種溫度模式：冷切割、向量噴射、高溫擴散、蒸餾提煉',
    },
    {
      icon: '🌌',
      title: '賽博宇宙觀',
      description: '融合科幻美學與實用技術，打造獨特的知識體驗',
    },
    {
      icon: '⚡',
      title: '極速部署',
      description: 'Google Cloud Run 容器化，全球邊緣加速',
    },
  ];

  const stats = [
    { label: '知識文檔', value: '14+', unit: '篇' },
    { label: '向量維度', value: '1536', unit: 'D' },
    { label: '知識密度', value: '2.2x', unit: '提升' },
    { label: '純度', value: '98%', unit: '' },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🌌</span>
            <span className="text-xl font-bold cyber-text">DeepWeay</span>
          </div>
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            ) : user ? (
              <>
                <Link href="/dashboard" className="btn-secondary text-sm">
                  控制台
                </Link>
                <div className="flex items-center space-x-2">
                  <img 
                    src={user.photoURL || '/default-avatar.png'} 
                    alt="avatar" 
                    className="w-8 h-8 rounded-full border-2 border-purple-500"
                  />
                  <span className="text-sm text-slate-300">{user.displayName || user.email}</span>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm">
                  登入
                </Link>
                <Link href="/register" className="btn-primary text-sm">
                  註冊
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 animate-float">
            <span className="text-8xl">🚀</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="cyber-text">DeepWeay</span>
            <br />
            <span className="text-white">數字煉金術平台</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            知識蒸餾 · 向量引擎 · AI 驅動
            <br />
            將海量信息提煉為可執行的智慧結晶
          </p>
          <div className="flex justify-center space-x-4">
            <Link href={user ? "/dashboard" : "/register"} className="btn-primary text-lg px-8 py-4">
              開始探索 →
            </Link>
            <a href="#features" className="btn-secondary text-lg px-8 py-4">
              了解更多
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold cyber-text">
                    {stat.value}
                    <span className="text-lg text-slate-400">{stat.unit}</span>
                  </div>
                  <div className="text-slate-400 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="cyber-text">核心功能</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card-cyber group cursor-pointer">
                <div className="text-4xl mb-4 group-hover:animate-float">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-2xl p-12 cyber-glow">
            <h2 className="text-3xl font-bold mb-4 text-white">準備好開始了嗎？</h2>
            <p className="text-slate-300 mb-8">
              加入 DeepWeay，探索 AI 驅動的知識蒸餾世界
            </p>
            <Link href="/register" className="btn-primary text-lg px-12 py-4">
              免費開始 🚀
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>© 2025 DeepWeay Labs. 知識蒸餾 · 賽博朋克化傳承</p>
          <p className="mt-2 text-sm">
            Powered by Firebase · Supabase · Google Cloud Run
          </p>
        </div>
      </footer>
    </div>
  );
}
