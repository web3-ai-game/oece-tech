"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/lib/language-provider";
import { cn } from "@/lib/utils";

interface SharedHeaderProps {
  currentPage?: "home" | "knowledge" | "pricing" | "tools" | "about" | "divination" | "forum";
}

const navLinks = [
  { href: "/knowledge", key: "knowledge", labelKey: "nav.knowledge" },
  { href: "/pricing", key: "pricing", labelKey: "nav.pricing" },
  { href: "/tools", key: "tools", labelKey: "nav.tools" },
  { href: "/divination", key: "divination", labelKey: "nav.divination" },
  { href: "/about", key: "about", labelKey: "nav.about" },
];

export function SharedHeader({ currentPage = "home" }: SharedHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <header className="fixed top-0 w-full z-50 border-b border-[var(--border-subtle)] bg-[var(--header-bg)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <Sparkles className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <span className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
              OECE<span className="text-[var(--primary)]">.</span>tech
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, key, labelKey }) => (
              <Link
                key={key}
                href={href}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-lg transition-colors",
                  currentPage === key
                    ? "text-[var(--primary)] bg-[var(--primary)]/10 font-medium"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--input-bg)]"
                )}
              >
                {t(labelKey)}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/login"
              className="px-4 py-1.5 text-sm border border-[var(--border-subtle)] rounded-lg hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all text-[var(--foreground)]"
            >
              {t("nav.signIn")}
            </Link>
            <Link
              href="/register"
              className="px-4 py-1.5 text-sm bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              {t("nav.getStarted")}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--input-bg)] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-14 right-0 w-72 max-h-[calc(100vh-3.5rem)] overflow-y-auto bg-[var(--card)] border-l border-b border-[var(--border-subtle)] rounded-bl-2xl shadow-xl">
            <nav className="p-4 space-y-1">
              {navLinks.map(({ href, key, labelKey }) => (
                <Link
                  key={key}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-sm transition-colors",
                    currentPage === key
                      ? "text-[var(--primary)] bg-[var(--primary)]/10 font-medium"
                      : "text-[var(--foreground)] hover:bg-[var(--input-bg)]"
                  )}
                >
                  {t(labelKey)}
                </Link>
              ))}
            </nav>

            <div className="px-4 pb-4 space-y-3 border-t border-[var(--border-subtle)] pt-4">
              <div className="flex items-center justify-between">
                <LanguageToggle />
                <ThemeToggle />
              </div>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-2.5 text-sm border border-[var(--border-subtle)] rounded-xl hover:border-[var(--primary)] transition-all text-[var(--foreground)]"
              >
                {t("nav.signIn")}
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-2.5 text-sm bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl hover:opacity-90 transition-opacity font-medium"
              >
                {t("nav.getStarted")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
