"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, MessageSquare, BookOpen, Settings, LogOut, Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-provider";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";

export default function ProfilePage() {
  const { user, userData, loading, signOut } = useAuth();
  const router = useRouter();
  const { lang } = useLanguage();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const txt = {
    title: lang === "zh" ? "個人中心" : "Profile",
    tokensUsed: lang === "zh" ? "已用 Tokens" : "Tokens Used",
    conversations: lang === "zh" ? "對話記錄" : "Conversations",
    knowledgeAccess: lang === "zh" ? "知識庫權限" : "Knowledge Access",
    chatHistory: lang === "zh" ? "對話歷史" : "Chat History",
    chatDesc: lang === "zh" ? "查看所有對話記錄" : "View all your conversations",
    knowledgeBase: lang === "zh" ? "知識庫" : "Knowledge Base",
    knowledgeDesc: lang === "zh" ? "瀏覽文章與指南" : "Explore articles and guides",
    settings: lang === "zh" ? "設定" : "Settings",
    signOut: lang === "zh" ? "登出" : "Sign Out",
    loading: lang === "zh" ? "載入中..." : "Loading...",
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
        <span className="ml-3 text-[var(--muted)]">{txt.loading}</span>
      </div>
    );
  }

  if (!user) return null;

  const displayName = userData?.displayName || user.displayName || user.email?.split("@")[0] || "User";
  const displayEmail = user.email || "";
  const tier = userData?.tier || "beta";
  const tokens = userData?.tokens ?? 9999;
  const tokensLimit = 50000;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--hero-gradient-from)] via-transparent to-[var(--hero-gradient-to)] pointer-events-none" />

      <SharedHeader />

      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-[var(--primary)]/30"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-[var(--primary-foreground)]" />
              </div>
            )}
            <h1 className="text-3xl font-bold mb-1">{displayName}</h1>
            <p className="text-sm text-[var(--muted)] mb-2">{displayEmail}</p>
            <span className="inline-block px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-xs font-medium border border-[var(--primary)]/30 uppercase">
              {tier === "beta" ? "Beta Tester" : tier}
            </span>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-3 gap-4 mb-8"
          >
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border-subtle)] text-center">
              <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold mb-1">{tokens.toLocaleString()}</div>
              <div className="text-xs text-[var(--muted-foreground)]">{txt.tokensUsed}</div>
              <div className="mt-2 w-full bg-[var(--input-bg)] rounded-full h-1.5">
                <div
                  className="bg-yellow-400 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min((tokens / tokensLimit) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border-subtle)] text-center">
              <MessageSquare className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold mb-1">—</div>
              <div className="text-xs text-[var(--muted-foreground)]">{txt.conversations}</div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border-subtle)] text-center">
              <BookOpen className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold mb-1">∞</div>
              <div className="text-xs text-[var(--muted-foreground)]">{txt.knowledgeAccess}</div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-4 mb-8"
          >
            <Link
              href="/chat"
              className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border-subtle)] hover:border-[var(--primary)]/30 transition-all group"
            >
              <MessageSquare className="h-6 w-6 text-[var(--primary)] mb-3" />
              <h3 className="text-lg font-semibold mb-1 group-hover:text-[var(--primary)]">{txt.chatHistory}</h3>
              <p className="text-sm text-[var(--muted)]">{txt.chatDesc}</p>
            </Link>

            <Link
              href="/knowledge"
              className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border-subtle)] hover:border-[var(--primary)]/30 transition-all group"
            >
              <BookOpen className="h-6 w-6 text-[var(--primary)] mb-3" />
              <h3 className="text-lg font-semibold mb-1 group-hover:text-[var(--primary)]">{txt.knowledgeBase}</h3>
              <p className="text-sm text-[var(--muted)]">{txt.knowledgeDesc}</p>
            </Link>
          </motion.div>

          {/* Settings & Logout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
            <Link
              href="/settings"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-[var(--card)] border border-[var(--border-subtle)] rounded-xl hover:border-[var(--primary)]/30 transition-all"
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">{txt.settings}</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-red-500/5 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/10 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">{txt.signOut}</span>
            </button>
          </motion.div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
