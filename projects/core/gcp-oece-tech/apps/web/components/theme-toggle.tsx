"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: "warm", icon: Sun, label: "Warm" },
    { name: "dark", icon: Moon, label: "Dark" },
  ] as const;

  return (
    <div className="flex items-center gap-2 p-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
      {themes.map(({ name, icon: Icon, label }) => (
        <button
          key={name}
          onClick={() => setTheme(name)}
          className={cn(
            "p-2 rounded-full transition-all",
            theme === name
              ? "bg-white/20 text-white"
              : "text-white/60 hover:text-white hover:bg-white/10"
          )}
          title={label}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
