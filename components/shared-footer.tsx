"use client";

import { TechStack } from "@/components/tech-stack";
import { SocialChannels } from "@/components/social-channels";
import { useLanguage } from "@/lib/language-provider";

export function SharedFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[var(--border-subtle)]">
      <TechStack />
      <SocialChannels />
      <div className="py-8 border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-[var(--foreground)] mb-2">
            📞 +66 88 88080888
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mb-4">
            {t("footer.copyright")}
          </p>
          <div className="flex justify-center gap-4 text-xs text-[var(--muted-foreground)]">
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
