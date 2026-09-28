"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Boop } from "@/components/motion/Boop";
import { cn } from "@/lib/cn";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { getDictionary, type Locale } from "@/i18n";

// Sun/moon switch. Both icons are rendered and CSS picks the visible one
// from html[data-theme], so server and client markup always match.
export function ThemeToggle({ className, lang = "id" }: { className?: string; lang?: Locale }) {
  const t = getDictionary(lang).common;
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.dataset.theme === "light");
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    const root = document.documentElement;
    if (next) root.dataset.theme = "light";
    else delete root.dataset.theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "light" : "dark");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? t.themeToDark : t.themeToLight}
      aria-pressed={light}
      data-boop
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-button text-ink-muted transition-colors duration-150 hover:bg-surface hover:text-ink",
        className
      )}
    >
      <Boop trigger="parent" rotation={light ? -20 : 20} scale={1.1}>
        <Sun className="theme-icon-sun h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
        <Moon className="theme-icon-moon h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
      </Boop>
    </button>
  );
}
