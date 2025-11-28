"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const [lang, setLang] = useState<"en" | "zh">("en");

  const languages = [
    { code: "en", label: "EN" },
    { code: "zh", label: "中文" },
  ] as const;

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-[var(--foreground)]/50" />
      <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--foreground)]/5">
        {languages.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-all",
              lang === code
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
