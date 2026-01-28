"use client";

import { TechStack } from "@/components/tech-stack";
import { SocialChannels, AuthProviders } from "@/components/social-channels";

export function SharedFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-gradient-to-b from-transparent to-[var(--background)]">
      <AuthProviders />
      <SocialChannels />
      <TechStack />
      <div className="py-8 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg font-medium text-[var(--foreground)] mb-2">
            📞 +66 88 88080888
          </p>
          <p className="text-xs text-[var(--muted)] mb-4">
            © 2025 OECE Tech · Built with 🔥 Firebase · Powered by Gemini AI
          </p>
          <div className="flex justify-center gap-4 text-[10px] text-[var(--muted)]">
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Contact</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
