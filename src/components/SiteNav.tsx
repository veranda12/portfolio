"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/#work", label: "Karya" },
  { href: "/#services", label: "Yang Saya Bangun" },
  { href: "/#about", label: "Tentang" },
  { href: "/#stack", label: "Stack" },
];

export function SiteNav({ siteName }: { siteName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled ? "border-rule bg-paper/85 backdrop-blur-md" : "border-transparent bg-transparent"
      )}
    >
      <div className="shell flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-baseline gap-2" aria-label="Home">
          <span className="font-display text-lg font-bold tracking-tight">{siteName}</span>
          <span className="label-signal hidden sm:inline">/ full-stack</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="link-underline font-mono text-[0.72rem] uppercase tracking-label text-ink-soft hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-2 border border-ink px-4 py-2 font-mono text-[0.72rem] uppercase tracking-label text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            <span className="status-dot" aria-hidden />
            Mulai Proyek
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="relative h-3.5 w-6">
            <span
              className={cn(
                "absolute left-0 h-0.5 w-6 bg-ink transition-all duration-300",
                open ? "top-1.5 rotate-45" : "top-0"
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-3 h-0.5 w-6 bg-ink transition-all duration-300",
                open ? "-rotate-45" : ""
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 z-40 origin-top border-b border-rule bg-paper md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav className="shell flex flex-col py-6" aria-label="Mobile">
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-b border-rule py-4 font-display text-2xl"
            >
              {l.label}
              <span className="label">{String(i + 1).padStart(2, "0")}</span>
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex items-center justify-center gap-2 bg-ink px-4 py-4 font-mono text-xs uppercase tracking-label text-paper"
          >
            <span className="status-dot" aria-hidden /> Mulai Proyek
          </Link>
        </nav>
      </div>
    </header>
  );
}
