"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { logoutAction } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/content", label: "Site content" },
];

export function AdminNav({
  userName,
  unread,
}: {
  userName: string;
  unread: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <>
      {/* Mobile bar */}
      <div className="flex items-center justify-between border-b border-rule px-4 py-3 md:hidden">
        <Link href="/admin" className="font-display text-lg font-bold text-ink">
          Console
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="font-mono text-xs uppercase tracking-label text-ink-soft"
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <nav
        className={cn(
          "flex-col gap-1 border-rule bg-white p-4 md:flex md:h-screen md:w-60 md:shrink-0 md:border-r",
          open ? "flex" : "hidden md:flex"
        )}
      >
        <div className="mb-6 hidden px-2 md:block">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-signal" aria-hidden />
            <span className="font-mono text-[0.62rem] uppercase tracking-label text-ink-faint">Studio Console</span>
          </div>
          <Link href="/" target="_blank" className="mt-3 block font-mono text-[0.66rem] text-ink-faint hover:text-signal">
            View live site ↗
          </Link>
        </div>

        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center justify-between px-3 py-2.5 font-mono text-xs uppercase tracking-label transition-colors",
              isActive(item)
                ? "bg-surface-2 text-ink"
                : "text-ink-faint hover:bg-surface-2/60 hover:text-ink"
            )}
          >
            <span className="flex items-center gap-2">
              <span className={cn("h-1 w-1", isActive(item) ? "bg-signal" : "bg-transparent")} aria-hidden />
              {item.label}
            </span>
            {item.href === "/admin/messages" && unread > 0 ? (
              <span className="bg-signal px-1.5 py-0.5 text-[0.6rem] text-white">{unread}</span>
            ) : null}
          </Link>
        ))}

        <div className="mt-auto hidden border-t border-rule pt-4 md:block">
          <p className="px-3 font-mono text-[0.62rem] text-ink-faint">Signed in</p>
          <p className="px-3 font-mono text-xs text-ink">{userName}</p>
          <form action={logoutAction} className="mt-3">
            <button
              type="submit"
              className="w-full px-3 py-2 text-left font-mono text-[0.66rem] uppercase tracking-label text-ink-faint transition-colors hover:text-signal"
            >
              ← Sign out
            </button>
          </form>
        </div>
      </nav>
    </>
  );
}
