"use client";

import Link from "next/link";
import { Sparkles, MessageSquare, ThumbsUp, Eye, Plus, TrendingUp, Clock } from "lucide-react";

const categories = [
  { id: "ai", name: "AI 討論", icon: Sparkles, color: "#4285F4", posts: 156 },
  { id: "divination", name: "算命交流", icon: MessageSquare, color: "#8B5CF6", posts: 89 },
  { id: "tech", name: "技術支持", icon: TrendingUp, color: "#22C55E", posts: 234 },
  { id: "announce", name: "公告區", icon: Clock, color: "#F59E0B", posts: 12 }
];

const hotPosts = [
  {
    id: 1,
    title: "Gemini 2.5 Pro 使用心得分享",
    author: "DeepWeay",
    category: "AI 討論",
    views: 1234,
    likes: 89,
    replies: 23,
    time: "2 hours ago"
  },
  {
    id: 2,
    title: "賽博神佛算命準確率測試報告",
    author: "CyberSage",
    category: "算命交流",
    views: 856,
    likes: 67,
    replies: 15,
    time: "5 hours ago"
  },
  {
    id: 3,
    title: "Firebase Hosting 部署最佳實踐",
    author: "TechGuru",
    category: "技術支持",
    views: 2341,
    likes: 145,
    replies: 56,
    time: "1 day ago"
  }
];

export default function ForumPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-[var(--background)]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--primary)]" />
            <span className="text-lg font-semibold">OECE.tech</span>
          </Link>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm hover:opacity-90">
              <Plus className="h-4 w-4" />
              New Post
            </button>
            <Link href="/" className="text-sm text-gray-400 hover:text-white">
              ← Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Community <span className="text-[var(--primary)]">Forum</span></h1>
            <p className="text-sm text-gray-400">Share knowledge, ask questions, connect with others</p>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <cat.icon className="h-6 w-6 mb-2" style={{ color: cat.color }} />
                <h3 className="text-sm font-semibold mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500">{cat.posts} posts</p>
              </div>
            ))}
          </div>

          {/* Hot Posts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-400" />
                Hot Topics
              </h2>
              <button className="text-sm text-gray-400 hover:text-white">View All →</button>
            </div>

            <div className="space-y-3">
              {hotPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-semibold flex-1 hover:text-[var(--primary)] transition-colors">
                      {post.title}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                      {post.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="text-gray-400">{post.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {post.replies}
                    </span>
                    <span>•</span>
                    <span>{post.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
