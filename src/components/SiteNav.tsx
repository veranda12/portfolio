"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/ThemeToggle";

const LINKS = [
  { href: "/#work", label: "Karya" },
  { href: "/capabilities", label: "Kapabilitas" },
  { href: "/#about", label: "Tentang" },
  { href: "/#stack", label: "Stack" },
];

export function SiteNav({ siteName }: { siteName: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 [transition-timing-function:var(--spring-snappy)]",
        solid
          ? "bg-canvas/80 shadow-[0_1px_0_rgb(var(--border-rgb)),0_8px_24px_-12px_rgb(0_0_0/0.6)] backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="shell flex h-16 items-center justify-between md:h-[4.5rem]">
        <Link
          href="/"
          aria-label="Home"
          className="rounded-button text-[1.0625rem] font-bold tracking-tight text-ink transition-colors duration-150 hover:text-accent-pink"
        >
          {siteName}
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {LINKS.map((l) => {
            const active = !l.href.includes("#") && pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-button px-3.5 py-2 text-[0.9375rem] font-medium transition-colors duration-150",
                  active ? "text-accent-blue" : "text-ink-muted hover:bg-surface hover:text-ink"
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <ThemeToggle className="ml-1" />
          <Link href="/#contact" className="ui-btn ui-btn-secondary group ml-2 px-4 py-2.5 text-sm">
            <span className="status-dot" aria-hidden />
            Mulai Proyek
          </Link>
        </nav>

        <div className="-mr-2 flex items-center gap-1 md:hidden">
        <ThemeToggle className="h-11 w-11" />
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-button text-ink transition-colors duration-150 hover:bg-surface md:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={cn(
                "absolute left-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-300 [transition-timing-function:var(--spring-snappy)]",
                open ? "top-1.5 rotate-45" : "top-0"
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-3 h-0.5 w-5 rounded-full bg-current transition-transform duration-300 [transition-timing-function:var(--spring-snappy)]",
                open ? "-translate-y-1.5 -rotate-45" : ""
              )}
            />
          </span>
        </button>
        </div>
      </div>

      {/* Mobile menu: panel with a small arrow pointing at its trigger. */}
      <div
        id="mobile-menu"
        className={cn("fixed inset-x-0 top-16 z-40 h-[calc(100dvh-4rem)] bg-canvas/70 backdrop-blur-sm md:hidden", open ? "block" : "hidden")}
        onClick={() => setOpen(false)}
      >
        <div className="shell pt-2" onClick={(e) => e.stopPropagation()}>
          <div className="relative rounded-panel bg-panel p-2 shadow-lift">
            <span
              className="absolute -top-1.5 right-3 h-3 w-3 rotate-45 rounded-[2px] bg-panel"
              aria-hidden
            />
            <nav className="relative flex flex-col" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-card px-4 py-3.5 text-lg font-semibold text-ink transition-colors duration-150 hover:bg-canvas"
                >
                  {l.label}
                  <span className="label">{String(i + 1).padStart(2, "0")}</span>
                </Link>
              ))}
              <Link
                href="/#contact"
                onClick={() => setOpen(false)}
                className="ui-btn ui-btn-primary group m-2 mt-3 py-3.5"
              >
                <span className="status-dot bg-canvas" aria-hidden /> Mulai Proyek
                <ArrowRight className="nudge-x h-4 w-4" aria-hidden />
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
