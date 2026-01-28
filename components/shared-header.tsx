"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface SharedHeaderProps {
  currentPage?: "home" | "knowledge" | "pricing";
}

export function SharedHeader({ currentPage = "home" }: SharedHeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Sparkles className="h-6 w-6 text-[var(--primary)] animate-pulse" />
            <div className="absolute inset-0 blur-xl bg-[var(--primary)]/30" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/60 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            OECE.tech
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link 
            href="/knowledge" 
            className={`px-3 py-1.5 text-sm transition-colors ${
              currentPage === "knowledge" 
                ? "text-[var(--primary)]" 
                : "text-[var(--muted)] hover:text-[var(--primary)]"
            }`}
          >
            Knowledge
          </Link>
          <Link 
            href="/pricing" 
            className={`px-3 py-1.5 text-sm transition-colors ${
              currentPage === "pricing" 
                ? "text-[var(--primary)]" 
                : "text-[var(--muted)] hover:text-[var(--primary)]"
            }`}
          >
            Pricing
          </Link>
          <ThemeToggle />
          <Link 
            href="/login" 
            className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all text-[var(--foreground)]"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
