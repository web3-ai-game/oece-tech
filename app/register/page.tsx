"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, Key, ArrowRight, Loader2, Gift } from "lucide-react";
import { SiGoogle, SiGithub } from "react-icons/si";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-provider";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUpWithEmail, signInWithGoogle, signInWithGithub } = useAuth();
  const router = useRouter();
  const { lang } = useLanguage();

  const txt = {
    title: lang === "zh" ? "建立帳號" : "Create Account",
    subtitle: lang === "zh" ? "加入 Beta 測試 — 需要邀請碼" : "Join the Beta — Invite code required",
    google: lang === "zh" ? "使用 Google 註冊" : "Sign up with Google",
    github: lang === "zh" ? "使用 GitHub 註冊" : "Sign up with GitHub",
    divider: lang === "zh" ? "或使用電子郵件" : "Or with email",
    inviteCode: lang === "zh" ? "邀請碼" : "Invite Code",
    inviteHint: lang === "zh" ? "Beta 測試需要邀請碼" : "Beta testing requires an invite code",
    email: lang === "zh" ? "電子郵件" : "Email",
    password: lang === "zh" ? "密碼" : "Password",
    create: lang === "zh" ? "建立帳號" : "Create Account",
    creating: lang === "zh" ? "建立中..." : "Creating account...",
    hasAccount: lang === "zh" ? "已有帳號？" : "Already have an account?",
    signIn: lang === "zh" ? "登入" : "Sign in",
    beta: lang === "zh" ? "Beta 期間所有功能免費開放" : "All features free during Beta",
    gift: lang === "zh" ? "註冊即送 9,999 免費 Tokens" : "Get 9,999 free Tokens on signup",
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUpWithEmail(email, password, inviteCode);
      router.push("/profile");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push("/profile");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGithub();
      router.push("/profile");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--hero-gradient-from)] via-transparent to-[var(--hero-gradient-to)] pointer-events-none" />

      <SharedHeader />

      <main className="relative pt-24 pb-16 px-4 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <Sparkles className="h-8 w-8 text-[var(--primary)]" />
              <span className="text-3xl font-black">OECE<span className="text-[var(--primary)]">.</span>tech</span>
            </div>
            <div className="flex justify-center gap-2">
              <span className="inline-block px-3 py-1 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs">
                🎉 {txt.beta}
              </span>
            </div>
          </div>

          {/* Register Card */}
          <div className="bg-[var(--card)] border border-[var(--border-subtle)] rounded-2xl p-8 shadow-xl shadow-[var(--shadow-color)]">
            <h1 className="text-2xl font-bold mb-1 text-center">{txt.title}</h1>
            <p className="text-sm text-[var(--muted)] text-center mb-6">{txt.subtitle}</p>

            {/* Gift banner */}
            <div className="mb-6 p-3 bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-xl flex items-center gap-3">
              <Gift className="h-5 w-5 text-[var(--primary)] flex-shrink-0" />
              <span className="text-xs text-[var(--primary)] font-medium">{txt.gift}</span>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400"
              >
                {error}
              </motion.div>
            )}

            {/* OAuth */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleGoogleSignup}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-[var(--input-bg)] hover:bg-[var(--primary)]/5 border border-[var(--border-subtle)] hover:border-[var(--primary)]/30 rounded-xl transition-all disabled:opacity-50"
              >
                <SiGoogle className="h-5 w-5" />
                <span className="text-sm font-medium">{txt.google}</span>
              </button>
              <button
                onClick={handleGithubSignup}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-[var(--input-bg)] hover:bg-[var(--primary)]/5 border border-[var(--border-subtle)] hover:border-[var(--primary)]/30 rounded-xl transition-all disabled:opacity-50"
              >
                <SiGithub className="h-5 w-5" />
                <span className="text-sm font-medium">{txt.github}</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border-subtle)]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[var(--card)] px-3 text-[var(--muted-foreground)]">{txt.divider}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{txt.inviteCode}</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="BETA-2025-XXXXX"
                    className="w-full pl-10 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl focus:border-[var(--primary)] outline-none transition-colors text-[var(--foreground)] font-mono"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{txt.inviteHint}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{txt.email}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl focus:border-[var(--primary)] outline-none transition-colors text-[var(--foreground)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{txt.password}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl focus:border-[var(--primary)] outline-none transition-colors text-[var(--foreground)]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />{txt.creating}</>
                ) : (
                  <>{txt.create}<ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[var(--muted)]">
              {txt.hasAccount}{" "}
              <Link href="/login" className="text-[var(--primary)] hover:underline font-medium">
                {txt.signIn}
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <SharedFooter />
    </div>
  );
}
