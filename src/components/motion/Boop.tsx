"use client";

import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

// "Boop": on hover the child springs to a transform, then lets go by itself
// after `timing` ms even if the pointer stays — the low damping makes it wobble
// back. With `trigger="parent"` the boop fires when the closest `[data-boop]`
// ancestor (e.g. the whole card) is hovered or focused.
export function Boop({
  children,
  rotation = 0,
  x = 0,
  y = 0,
  scale = 1,
  timing = 150,
  trigger = "self",
  className,
}: {
  children: React.ReactNode;
  rotation?: number;
  x?: number;
  y?: number;
  scale?: number;
  timing?: number;
  trigger?: "self" | "parent";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!on) return;
    const t = window.setTimeout(() => setOn(false), timing);
    return () => window.clearTimeout(t);
  }, [on, timing]);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const target: HTMLElement = (trigger === "parent" && el.parentElement?.closest<HTMLElement>("[data-boop]")) || el;
    const fire = () => setOn(true);
    target.addEventListener("pointerenter", fire);
    target.addEventListener("focusin", fire);
    return () => {
      target.removeEventListener("pointerenter", fire);
      target.removeEventListener("focusin", fire);
    };
  }, [trigger, reduce]);

  return (
    <m.span
      ref={ref}
      aria-hidden
      className={cn("inline-flex", className)}
      animate={on ? { rotate: rotation, x, y, scale } : { rotate: 0, x: 0, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      {children}
    </m.span>
  );
}
