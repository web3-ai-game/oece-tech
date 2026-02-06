"use client";

import { Sun, Moon, Snowflake } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: "warm", icon: Sun, label: "Warm" },
    { name: "cool", icon: Snowflake, label: "Cool" },
    { name: "dark", icon: Moon, label: "Dark" },
  ] as const;

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--input-bg)] backdrop-blur-sm border border-[var(--border-subtle)]">
      {themes.map(({ name, icon: Icon, label }) => (
        <button
          key={name}
          onClick={() => setTheme(name)}
          className={cn(
            "p-1.5 rounded-full transition-all duration-200",
            theme === name
              ? "bg-[var(--primary)]/20 text-[var(--primary)] shadow-sm"
              : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--input-bg)]"
          )}
          title={label}
          aria-label={`Switch to ${label} theme`}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
