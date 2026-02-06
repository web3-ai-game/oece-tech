"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-provider";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <div className="text-center mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs font-medium"
      >
        🎉 Beta Free Access · 20 Early Adopters
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-7xl font-black mb-6 leading-tight"
      >
        <span className="bg-gradient-to-r from-[var(--foreground)] via-[var(--primary)] to-[var(--foreground)] bg-clip-text text-transparent">
          {t("hero.title")}
        </span>
        <br />
        <span className="text-[var(--primary)]">
          {t("hero.highlight")}
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-[var(--muted)] max-w-2xl mx-auto mb-8"
      >
        {t("hero.subtitle")}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-center gap-4"
      >
        <Link href="/companion" className="group relative px-8 py-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl text-base font-bold hover:scale-105 transition-all shadow-2xl shadow-[var(--shadow-color)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          <div className="relative flex items-center gap-2">
            <Heart className="h-5 w-5" />
            {t("hero.cta.companion")}
          </div>
        </Link>
        <Link href="/comic" className="px-8 py-4 border-2 border-[var(--border)] text-[var(--primary)] rounded-xl text-base font-bold hover:bg-[var(--primary)]/10 hover:border-[var(--primary)] transition-all">
          {t("hero.cta.explore")}
        </Link>
      </motion.div>
    </div>
  );
}
