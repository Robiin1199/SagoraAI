"use client";

import { useTheme } from "next-themes";
import { MoonStar, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        aria-label="Changer de thème"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white"
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100"
      aria-label="Changer de thème"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
    </button>
  );
}
