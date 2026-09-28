"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { Boop } from "@/components/motion/Boop";
import { getDictionary, lp, stripLocale, type Locale } from "@/i18n";
import { cn } from "@/lib/cn";

// Links to the same page in the other language (/work ↔ /en/work), keeping
// the current #section when there is one.
export function LanguageSwitch({ lang, className }: { lang: Locale; className?: string }) {
  const t = getDictionary(lang).common;
  const other: Locale = lang === "id" ? "en" : "id";
  const base = stripLocale(usePathname() ?? "/");
  const href = lp(other, base);

  return (
    <Link
      href={href}
      hrefLang={other}
      aria-label={t.switchTo}
      title={t.switchTo}
      data-boop
      onClick={(e) => {
        const hash = window.location.hash;
        if (hash) {
          e.preventDefault();
          window.location.assign(href + hash);
        }
      }}
      className={cn(
        "flex h-10 items-center justify-center gap-1.5 rounded-button px-2.5 text-[0.8125rem] font-bold tracking-[0.04em] text-ink-muted transition-colors duration-150 hover:bg-surface hover:text-ink",
        className
      )}
    >
      <Boop trigger="parent" rotation={-12}>
        <Languages className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
      </Boop>
      {t.switchLabel}
    </Link>
  );
}
