"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

type Capability = { id: string; title: string; detail: string | null };

// Interactive demo panel for a project's feature list, laid out like a small app
// window: a clickable sidebar of features and a "screen" showing the active
// one. On mobile every feature is shown stacked (nothing hidden).
export function CapabilityDemo({ items }: { items: Capability[] }) {
  const [active, setActive] = useState(0);
  const base = `cap${useId().replace(/:/g, "")}`;

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    setActive(next);
    e.currentTarget.querySelectorAll<HTMLElement>("[data-cap]")[next]?.focus();
  }

  return (
    <div className="overflow-hidden rounded-panel bg-panel shadow-lift">

      <div className="md:grid md:min-h-[20rem] md:grid-cols-12">
        {/* sidebar (desktop) */}
        <div className="hidden flex-col gap-1 border-r border-line p-2.5 md:col-span-5 md:flex" onKeyDown={onKeyDown}>
          {items.map((c, i) => (
            <button
              key={c.id}
              type="button"
              data-cap
              aria-controls={`${base}-${i}`}
              aria-pressed={active === i}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "group flex items-center gap-3 rounded-card px-3 py-2.5 text-left text-[0.875rem] font-semibold leading-snug transition-colors duration-150",
                active === i ? "bg-canvas text-ink" : "text-ink-muted hover:bg-canvas/60 hover:text-ink"
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 shrink-0 rounded-full transition-colors duration-150",
                  active === i ? "bg-accent-pink" : "bg-line group-hover:bg-ink-muted"
                )}
                aria-hidden
              />
              {c.title}
            </button>
          ))}
        </div>

        {/* screen */}
        <div className="p-4 md:col-span-7 md:bg-canvas md:p-7">
          <ul className="flex flex-col gap-3 md:block">
            {items.map((c, i) => (
              <li
                key={c.id}
                id={`${base}-${i}`}
                className={cn(
                  "rounded-card bg-surface p-5 shadow-card md:p-6",
                  active === i ? "md:block md:animate-reveal-up" : "md:hidden"
                )}
              >
                <h3 className="text-[1.125rem] font-bold leading-snug text-ink md:text-[1.375rem]">{c.title}</h3>
                {c.detail ? <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted md:text-body">{c.detail}</p> : null}
                {/* decorative skeleton UI */}
                <div className="mt-6 hidden space-y-2.5 md:block" aria-hidden>
                  <div className="flex gap-2.5">
                    <span className="h-16 flex-1 rounded-button bg-surface-elevated" />
                    <span className="h-16 flex-1 rounded-button bg-surface-elevated" />
                    <span className="h-16 w-16 rounded-button bg-accent-pink/15" />
                  </div>
                  <span className="block h-2.5 w-4/5 rounded-full bg-surface-elevated" />
                  <span className="block h-2.5 w-3/5 rounded-full bg-surface-elevated" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
