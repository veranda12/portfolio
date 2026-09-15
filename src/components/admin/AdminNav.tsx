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
      <div className="flex items-center justify-between border-b border-console-line px-4 py-3 md:hidden">
        <Link href="/admin" className="font-display text-lg font-bold text-paper">
          Console
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="font-mono text-xs uppercase tracking-label text-paper/70"
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <nav
        className={cn(
          "flex-col gap-1 border-console-line bg-console p-4 md:flex md:h-screen md:w-60 md:shrink-0 md:border-r",
          open ? "flex" : "hidden md:flex"
        )}
      >
        <div className="mb-6 hidden px-2 md:block">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-signal" aria-hidden />
            <span className="font-mono text-[0.62rem] uppercase tracking-label text-paper/50">Studio Console</span>
          </div>
          <Link href="/" target="_blank" className="mt-3 block font-mono text-[0.66rem] text-paper/40 hover:text-signal">
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
                ? "bg-console-2 text-paper"
                : "text-paper/50 hover:bg-console-2/60 hover:text-paper"
            )}
          >
            <span className="flex items-center gap-2">
              <span className={cn("h-1 w-1", isActive(item) ? "bg-signal" : "bg-transparent")} aria-hidden />
              {item.label}
            </span>
            {item.href === "/admin/messages" && unread > 0 ? (
              <span className="bg-signal px-1.5 py-0.5 text-[0.6rem] text-paper">{unread}</span>
            ) : null}
          </Link>
        ))}

        <div className="mt-auto hidden border-t border-console-line pt-4 md:block">
          <p className="px-3 font-mono text-[0.62rem] text-paper/40">Signed in</p>
          <p className="px-3 font-mono text-xs text-paper/80">{userName}</p>
          <form action={logoutAction} className="mt-3">
            <button
              type="submit"
              className="w-full px-3 py-2 text-left font-mono text-[0.66rem] uppercase tracking-label text-paper/50 transition-colors hover:text-signal"
            >
              ← Sign out
            </button>
          </form>
        </div>
      </nav>
    </>
  );
}
