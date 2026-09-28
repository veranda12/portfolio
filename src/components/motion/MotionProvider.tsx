"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

// Loads only the DOM animation feature set (smaller bundle, `m.*` components)
// and makes every motion component honour prefers-reduced-motion.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
