"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Node = { title: string; children: string[]; note?: string };

// The stored text is a hand-drawn ASCII tree (├── └── ▼ │ ──▶ …). Parse it
// into plain steps and render it as an interactive flow panel.
function parseArchitecture(text: string): Node[] {
  const nodes: Node[] = [];
  let current: Node | null = null;

  for (const raw of text.split("\n")) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    // Pure connector line (just │ ▼ ▲ ─ etc.) — implied by the flow itself.
    if (/^[│▼▲├└┌┐┘─▶◀·\s]+$/.test(trimmed) && trimmed.replace(/\s/g, "").length <= 2) {
      continue;
    }

    // Annotation attached to the arrow leading into the current node.
    const annotation = trimmed.match(/^│\s*(.+)$/);
    if (annotation && current) {
      current.note = annotation[1].trim();
      continue;
    }

    // Child bullet under the current node.
    const child = trimmed.match(/^[├└]─+\s*(.+)$/);
    if (child) {
      if (current) current.children.push(child[1].trim());
      continue;
    }

    // A new step/node.
    const title = trimmed
      .replace(/[▶◀┌┐┘]/g, "")
      .replace(/─{2,}/g, " → ")
      .replace(/[│├└]/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();
    if (!title) continue;

    current = { title, children: [] };
    nodes.push(current);
  }

  return nodes;
}

// Interactive demo panel. Desktop: clickable step list on the left with a
// marker that springs to the active step, detail pane on the right.
// Mobile: every step stacked as a vertical timeline (nothing hidden).
export function ArchitectureDiagram({
  text,
  className,
  label = "Alur sistem",
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const nodes = parseArchitecture(text);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const [marker, setMarker] = useState<{ top: number; height: number } | null>(null);
  const idBase = `arch${useId().replace(/:/g, "")}`;

  useLayoutEffect(() => {
    const list = listRef.current;
    const btn = list?.querySelectorAll<HTMLElement>("[data-step]")[active];
    if (!btn) return;
    const update = () => setMarker({ top: btn.offsetTop, height: btn.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(list!);
    return () => ro.disconnect();
  }, [active, nodes.length]);

  if (nodes.length === 0) return null;

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowDown" ? 1 : -1) + nodes.length) % nodes.length;
    setActive(next);
    listRef.current?.querySelectorAll<HTMLElement>("[data-step]")[next]?.focus();
  }

  return (
    <div className={cn("overflow-hidden rounded-panel bg-panel shadow-lift", className)}>
      <div className="border-b border-line px-5 py-4">
        <p className="label-signal">{label}</p>
      </div>

      <div className="md:grid md:grid-cols-12">
        {/* Step list (desktop only) */}
        <div className="hidden border-r border-line p-3 md:col-span-5 md:block">
          <ol ref={listRef} className="relative" onKeyDown={onKeyDown}>
            {/* connector + springing marker */}
            <span className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-line" aria-hidden />
            {marker ? (
              <span
                className="absolute left-0 right-0 rounded-card bg-canvas transition-[transform,height] duration-500 [transition-timing-function:var(--spring-snappy)]"
                style={{ transform: `translateY(${marker.top}px)`, height: marker.height, top: 0 }}
                aria-hidden
              />
            ) : null}
            {nodes.map((node, i) => (
              <li key={i} className="relative">
                <button
                  type="button"
                  data-step
                  aria-controls={`${idBase}-${i}`}
                  aria-pressed={active === i}
                  tabIndex={active === i ? 0 : -1}
                  onClick={() => setActive(i)}
                  className="group flex w-full items-start gap-3.5 rounded-card px-3 py-3 text-left"
                >
                  <span
                    className={cn(
                      "relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-150",
                      active === i ? "bg-accent-pink" : "bg-canvas"
                    )}
                    aria-hidden
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-colors duration-150",
                        active === i ? "bg-canvas" : "bg-ink-muted group-hover:bg-ink"
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "text-[0.9375rem] font-semibold leading-snug transition-colors duration-150",
                      active === i ? "text-ink" : "text-ink-muted group-hover:text-ink"
                    )}
                  >
                    {node.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* Detail panes: all visible as a timeline on mobile, one at a time on desktop */}
        <div className="relative p-5 md:col-span-7 md:p-7">
          <ol className="relative">
            {nodes.map((node, i) => (
              <li
                key={i}
                id={`${idBase}-${i}`}
                className={cn(
                  "relative flex gap-4 pb-8 last:pb-0 md:gap-0 md:pb-0",
                  active === i ? "md:block md:animate-reveal-up" : "md:hidden"
                )}
              >
                {/* mobile timeline rail */}
                {i < nodes.length - 1 ? (
                  <span className="absolute left-[0.5rem] top-6 h-full w-px bg-line md:hidden" aria-hidden />
                ) : null}
                <span className="relative z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-canvas md:hidden" aria-hidden>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-pink" />
                </span>

                <div className="flex-1">
                  <h4 className="text-base font-bold leading-snug text-ink md:text-[1.375rem]">{node.title}</h4>
                  {node.note ? (
                    <p className="mt-1.5 text-[0.8125rem] text-accent-blue">{node.note}</p>
                  ) : null}
                  {node.children.length > 0 ? (
                    <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:mt-6">
                      {node.children.map((c) => (
                        <li
                          key={c}
                          className="flex items-center gap-2.5 rounded-card bg-surface px-3.5 py-2.5 text-[0.875rem] font-medium text-ink shadow-card"
                        >
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-pink" aria-hidden />
                          {c}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
