"use client";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, MessageSquare, ThumbsUp, Eye, Plus, TrendingUp, Clock, Loader2, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const categories = [
  { id: "ai-discussion", name: "AI 討論", icon: Sparkles, color: "#4285F4" },
  { id: "divination", name: "算命交流", icon: MessageSquare, color: "#8B5CF6" },
  { id: "tech-support", name: "技術支持", icon: TrendingUp, color: "#22C55E" },
  { id: "announcements", name: "公告區", icon: Clock, color: "#F59E0B" }
];

interface Post {
  id: string;
  title: string;
  user_name: string;
  category: string;
  views_count: number;
  likes_count: number;
  replies_count: number;
  created_at: string;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function getCategoryName(categoryId: string): string {
  const cat = categories.find(c => c.id === categoryId);
  return cat?.name || categoryId;
}

export default function ForumPage() {
  const { user, userData } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("ai-discussion");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/forum/posts");
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPost = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    if (!user || !userData) {
      alert("請先登錄");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          userName: userData.displayName || user.email?.split("@")[0] || "Anonymous",
          title: newTitle,
          content: newContent,
          category: newCategory,
        }),
      });

      if (res.ok) {
        setNewTitle("");
        setNewContent("");
        setShowNewPost(false);
        fetchPosts();
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">      <SharedHeader />

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--background)] border border-[var(--border-subtle)] rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">發布新帖子</h2>
              <button onClick={() => setShowNewPost(false)} className="text-[var(--muted)] hover:text-[var(--foreground)]">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">標題</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="輸入標題..."
                  className="w-full p-3 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-lg focus:border-[var(--primary)] outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">分類</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-3 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-lg focus:border-[var(--primary)] outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-1">內容</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="輸入內容..."
                  rows={5}
                  className="w-full p-3 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-lg focus:border-[var(--primary)] outline-none resize-none"
                />
              </div>
              
              <button
                onClick={handleSubmitPost}
                disabled={isSubmitting || !newTitle.trim() || !newContent.trim()}
                className="w-full py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {isSubmitting ? "發布中..." : "發布帖子"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Community <span className="text-[var(--primary)]">Forum</span></h1>
            <p className="text-sm text-[var(--muted)]">Share knowledge, ask questions, connect with others</p>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)] hover:border-[var(--border)] transition-all cursor-pointer"
              >
                <cat.icon className="h-6 w-6 mb-2" style={{ color: cat.color }} />
                <h3 className="text-sm font-semibold mb-1">{cat.name}</h3>
              </div>
            ))}
          </div>

          {/* Posts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-400" />
                Hot Topics
              </h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-[var(--muted-foreground)]">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>還沒有帖子，成為第一個發帖的人吧！</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-5 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)] hover:border-[var(--border)] hover:bg-[var(--input-bg)] transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-base font-semibold flex-1 hover:text-[var(--primary)] transition-colors">
                        {post.title}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                        {getCategoryName(post.category)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                      <span className="text-[var(--muted)]">{post.user_name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {post.likes_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {post.replies_count}
                      </span>
                      <span>•</span>
                      <span>{formatTimeAgo(post.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <SharedFooter />
    </div>
  );
}
