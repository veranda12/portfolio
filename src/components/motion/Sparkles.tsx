"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// Highlight wrapper: 3–5 small stars pop in at random spots around the text
// (scale 0→1→0 while spinning), each living ~700ms, continuously replaced.
// Purely decorative — no text is added and nothing renders on the server or
// for people who prefer reduced motion. Use on 1–2 phrases per page at most.

const COLORS = ["var(--sparkle-a)", "var(--sparkle-b)", "var(--sparkle-c)"];
const LIFESPAN = 700;

type Sparkle = { id: string; createdAt: number; color: string; size: number; top: string; left: string };

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

function makeSparkle(): Sparkle {
  return {
    id: Math.random().toString(36).slice(2),
    createdAt: Date.now(),
    color: COLORS[random(0, COLORS.length)],
    size: random(10, 22),
    top: `${random(-10, 90)}%`,
    left: `${random(-4, 100)}%`,
  };
}

export function Sparkles({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (reduce) {
      setSparkles([]);
      return;
    }
    let timer: number;
    const tick = () => {
      const now = Date.now();
      setSparkles((cur) => [...cur.filter((s) => now - s.createdAt < LIFESPAN), makeSparkle()].slice(-5));
      timer = window.setTimeout(tick, random(140, 420));
    };
    setSparkles([makeSparkle(), makeSparkle(), makeSparkle()]);
    timer = window.setTimeout(tick, 200);
    return () => window.clearTimeout(timer);
  }, [reduce]);

  return (
    <span className="relative inline-block">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle pointer-events-none absolute z-[2] block"
          style={{ top: s.top, left: s.left }}
          aria-hidden
        >
          <svg width={s.size} height={s.size} viewBox="0 0 68 68" fill="none" className="sparkle-star block">
            <path
              d="M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z"
              style={{ fill: s.color }}
            />
          </svg>
        </span>
      ))}
      <span className="relative z-[1]">{children}</span>
    </span>
  );
}
