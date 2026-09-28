"use client";

import { useRef } from "react";
import { m, useReducedMotion } from "motion/react";

const TAGS = { div: m.div, li: m.li, section: m.section };

// Short, subtle scroll reveal: fade + 12px rise on a spring, once. `delay`
// (ms) staggers siblings — keep it in the 60–80ms range. Reduced motion:
// content is shown immediately with no movement.
export function ScrollReveal({
  children,
  className,
  delay = 0,
  as = "div",
  boop = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: keyof typeof TAGS;
  /** Mark this element as the hover trigger for <Boop trigger="parent"> inside. */
  boop?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const Comp = TAGS[as] as typeof m.div;
  const d = delay / 1000;

  return (
    <Comp
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      data-boop={boop || undefined}
      data-reveal
      // Same initial state on server and client (no hydration mismatch);
      // reduced motion is forced visible in CSS and animates instantly.
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={
        reduce
          ? { duration: 0 }
          : {
              y: { type: "spring", stiffness: 260, damping: 26, delay: d },
              opacity: { duration: 0.3, ease: "linear", delay: d },
            }
      }
      // Hand the element back to CSS once done, so hover transforms on cards
      // (which use the same `transform` property) keep working.
      onAnimationComplete={() => {
        if (ref.current) {
          ref.current.style.transform = "";
          ref.current.style.opacity = "";
        }
      }}
    >
      {children}
    </Comp>
  );
}
