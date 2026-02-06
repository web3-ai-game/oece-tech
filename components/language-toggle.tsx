"use client";

import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-provider";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  const languages = [
    { code: "en", label: "EN" },
    { code: "zh", label: "繁體" },
  ] as const;

  return (
    <div className="flex items-center gap-1.5">
      <Globe className="h-3.5 w-3.5 text-[var(--muted)]" />
      <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--input-bg)] border border-[var(--border-subtle)]">
        {languages.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200",
              lang === code
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
