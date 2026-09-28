"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

// Micro-interaction for the About bento: each principle's number is a
// physical-feeling keycap. Pressing it sinks the key and lights the card.
export function PrincipleKeys({ principles }: { principles: string[] }) {
  const [lit, setLit] = useState<number | null>(null);

  return (
    <ul className="flex flex-1 flex-col gap-4">
      {principles.map((p, i) => {
        const on = lit === i;
        return (
          <li
            key={i}
            className={cn(
              "ui-card flex flex-1 items-center gap-5 rounded-card p-5 shadow-card",
              on ? "bg-surface-elevated" : "bg-surface"
            )}
          >
            <button
              type="button"
              aria-pressed={on}
              onClick={() => setLit(on ? null : i)}
              className={cn(
                "keycap flex h-12 w-12 shrink-0 items-center justify-center rounded-button text-sm font-bold",
                on ? "keycap-down text-canvas" : "text-accent-pink"
              )}
            >
              0{i + 1}
            </button>
            <span
              className={cn(
                "text-[1.0625rem] leading-relaxed transition-colors duration-150",
                on ? "text-ink" : "text-ink/85"
              )}
            >
              {p}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
