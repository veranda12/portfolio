"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Thin top loading bar for page navigations. The App Router has no
// "navigation started" event, so we start on clicks of internal links (and
// back/forward), creep towards 90% while waiting, and complete when the
// pathname actually changes. Same-page hash links (/#work) are ignored.

type Phase = "idle" | "loading" | "done";

const SAFETY_TIMEOUT = 10_000; // never leave a bar hanging

function isPlainLeftClick(e: MouseEvent) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

export function RouteProgress() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const committedPath = useRef(pathname);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  function start() {
    clearTimers();
    setPhase("loading");
    setProgress(0.12);
    // Trickle: each step closes a slice of the remaining gap to 90%.
    const tick = () => {
      setProgress((p) => p + (0.9 - p) * 0.12);
      timers.current.push(window.setTimeout(tick, 220));
    };
    timers.current.push(window.setTimeout(tick, 150));
    timers.current.push(window.setTimeout(finish, SAFETY_TIMEOUT));
  }

  function finish() {
    clearTimers();
    setProgress(1);
    setPhase("done");
    // Let the bar reach the end, fade it, then reset for the next run.
    timers.current.push(
      window.setTimeout(() => {
        setPhase("idle");
        setProgress(0);
      }, 450)
    );
  }

  // Start on internal link clicks.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!isPlainLeftClick(e)) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      start();
    }
    function onPopState() {
      if (location.pathname !== committedPath.current) start();
    }
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
    };
    // start/finish only touch refs and state setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Complete once the new route has rendered.
  useEffect(() => {
    if (pathname === committedPath.current) return;
    committedPath.current = pathname;
    if (phase === "loading") finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => clearTimers, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]"
      style={{ opacity: phase === "idle" ? 0 : 1, transition: `opacity ${phase === "done" ? 250 : 0}ms linear ${phase === "done" ? 200 : 0}ms` }}
    >
      <div
        className="route-progress h-full origin-left rounded-r-full"
        style={{
          transform: `scaleX(${progress})`,
          transitionDuration: phase === "idle" ? "0ms" : undefined,
        }}
      />
    </div>
  );
}
