"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { SiGoogle, SiGithub } from "react-icons/si";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-provider";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signInWithGoogle, signInWithGithub } = useAuth();
  const router = useRouter();
  const { lang } = useLanguage();

  const txt = {
    title: lang === "zh" ? "歡迎回來" : "Welcome Back",
    subtitle: lang === "zh" ? "登入以訪問您的知識庫" : "Sign in to access your knowledge base",
    google: lang === "zh" ? "使用 Google 登入" : "Continue with Google",
    github: lang === "zh" ? "使用 GitHub 登入" : "Continue with GitHub",
    divider: lang === "zh" ? "或使用電子郵件" : "Or continue with email",
    email: lang === "zh" ? "電子郵件" : "Email",
    password: lang === "zh" ? "密碼" : "Password",
    remember: lang === "zh" ? "記住我" : "Remember me",
    forgot: lang === "zh" ? "忘記密碼？" : "Forgot password?",
    signIn: lang === "zh" ? "登入" : "Sign In",
    signingIn: lang === "zh" ? "登入中..." : "Signing in...",
    noAccount: lang === "zh" ? "還沒有帳號？" : "Don\u2019t have an account?",
    signUp: lang === "zh" ? "註冊" : "Sign up",
    beta: lang === "zh" ? "Beta 期間所有功能免費" : "All features free during Beta",
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push("/profile");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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

  const handleGithubLogin = async () => {
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
            <div className="inline-block px-3 py-1 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs">
              🎉 {txt.beta}
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-[var(--card)] border border-[var(--border-subtle)] rounded-2xl p-8 shadow-xl shadow-[var(--shadow-color)]">
            <h1 className="text-2xl font-bold mb-1 text-center">{txt.title}</h1>
            <p className="text-sm text-[var(--muted)] text-center mb-6">{txt.subtitle}</p>

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
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-[var(--input-bg)] hover:bg-[var(--primary)]/5 border border-[var(--border-subtle)] hover:border-[var(--primary)]/30 rounded-xl transition-all disabled:opacity-50"
              >
                <SiGoogle className="h-5 w-5" />
                <span className="text-sm font-medium">{txt.google}</span>
              </button>
              <button
                onClick={handleGithubLogin}
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

            {/* Email Form */}
            <form onSubmit={handleLogin} className="space-y-4">
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-[var(--border-subtle)]" />
                  <span className="text-[var(--muted)]">{txt.remember}</span>
                </label>
                <Link href="/forgot-password" className="text-[var(--primary)] hover:underline text-xs">
                  {txt.forgot}
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />{txt.signingIn}</>
                ) : (
                  <>{txt.signIn}<ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[var(--muted)]">
              {txt.noAccount}{" "}
              <Link href="/register" className="text-[var(--primary)] hover:underline font-medium">
                {txt.signUp}
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <SharedFooter />
    </div>
  );
}
