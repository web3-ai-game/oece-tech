'use client'

import { MessageSquare, TrendingUp, Clock, Eye } from 'lucide-react'
import Link from 'next/link'

export default function ForumPage() {
  // 模拟数据，后续从数据库获取
  const categories = [
    { id: 1, name: 'Web3 開發', slug: 'web3', posts: 128, icon: '⛓️' },
    { id: 2, name: '前端技術', slug: 'frontend', posts: 256, icon: '⚛️' },
    { id: 3, name: '後端架構', slug: 'backend', posts: 189, icon: '🖥️' },
    { id: 4, name: '工具分享', slug: 'tools', posts: 94, icon: '🔧' },
    { id: 5, name: '職業發展', slug: 'career', posts: 167, icon: '💼' },
    { id: 6, name: '閒聊灌水', slug: 'offtopic', posts: 312, icon: '💬' },
  ]

  const hotPosts = [
    {
      id: 1,
      title: 'Solidity Gas 優化完全指南',
      author: 'CryptoGuru',
      anonymous: false,
      category: 'Web3 開發',
      replies: 23,
      views: 1337,
      lastReply: '5 分鐘前',
    },
    {
      id: 2,
      title: '如何從零搭建 Next.js 14 項目',
      author: '匿名用戶',
      anonymous: true,
      category: '前端技術',
      replies: 45,
      views: 2048,
      lastReply: '10 分鐘前',
    },
    {
      id: 3,
      title: 'VPN 測速工具開發心得分享',
      author: 'DevMaster',
      anonymous: false,
      category: '工具分享',
      replies: 12,
      views: 892,
      lastReply: '半小時前',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <section className="text-center mb-16">
        <div className="inline-block font-mono text-xs text-pixel-secondary border border-pixel-secondary px-3 py-1 mb-4">
          [FORUM_SYSTEM]
        </div>
        <h1 className="text-pixel-2xl mb-6 text-neon">
          技術論壇
        </h1>
        <p className="text-lg text-pixel-light/80 font-mono max-w-2xl mx-auto mb-8">
          分享知識 • 匿名討論 • 共同成長
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-pixel">
            <MessageSquare className="inline mr-2" size={16} />
            發表新帖
          </button>
          <button className="btn-pixel-outline">
            <MessageSquare className="inline mr-2" size={16} />
            匿名發帖
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-pixel text-center p-4">
            <div className="text-2xl font-bold text-pixel-primary font-mono">1,146</div>
            <div className="text-xs text-pixel-light/70 font-mono">總帖子數</div>
          </div>
          <div className="card-pixel text-center p-4">
            <div className="text-2xl font-bold text-pixel-accent font-mono">432</div>
            <div className="text-xs text-pixel-light/70 font-mono">活躍用戶</div>
          </div>
          <div className="card-pixel text-center p-4">
            <div className="text-2xl font-bold text-pixel-secondary font-mono">89</div>
            <div className="text-xs text-pixel-light/70 font-mono">今日新帖</div>
          </div>
          <div className="card-pixel text-center p-4">
            <div className="text-2xl font-bold text-pixel-warning font-mono">156</div>
            <div className="text-xs text-pixel-light/70 font-mono">在線用戶</div>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Hot Posts */}
          <div className="mb-8">
            <h2 className="text-pixel-lg mb-6 flex items-center gap-2">
              <TrendingUp className="text-pixel-primary" size={24} />
              <span className="font-mono">熱門討論</span>
            </h2>

            <div className="space-y-4">
              {hotPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/forum/posts/${post.id}`}
                  className="card-pixel-glow group block"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-pixel-base mb-2 group-hover:text-pixel-primary transition-colors">
                        {post.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-pixel-light/70 font-mono">
                        <span className="flex items-center gap-1">
                          {post.anonymous ? '👤' : '👨‍💻'} {post.author}
                        </span>
                        <span className="text-pixel-accent">{post.category}</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={12} /> {post.replies}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={12} /> {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {post.lastReply}
                        </span>
                      </div>
                    </div>

                    <div className="w-2 h-2 bg-pixel-primary rounded-full animate-pulse" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* All Posts */}
          <div>
            <h2 className="text-pixel-lg mb-6 font-mono">最新帖子</h2>
            <div className="card-pixel text-center py-12">
              <div className="text-4xl mb-4">🚧</div>
              <p className="text-pixel-light/70 font-mono">開發中...</p>
              <p className="text-sm text-pixel-light/50 font-sans mt-2">
                完整論壇功能即將上線
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Categories */}
          <div className="card-pixel-glow mb-8">
            <h3 className="text-pixel-base mb-4 font-mono">討論分類</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/forum/${category.slug}`}
                  className="flex items-center justify-between p-3 rounded hover:bg-pixel-primary/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-sm font-mono group-hover:text-pixel-primary transition-colors">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-xs text-pixel-light/50 font-mono">
                    {category.posts}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="card-pixel">
            <h3 className="text-pixel-base mb-4 font-mono text-pixel-accent">
              📜 社區規則
            </h3>
            <ul className="space-y-2 text-sm text-pixel-light/80 font-sans">
              <li>• 尊重他人，禁止人身攻擊</li>
              <li>• 禁止發布違法內容</li>
              <li>• 禁止垃圾廣告</li>
              <li>• 匿名發帖需遵守規則</li>
              <li>• 技術討論為主</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
