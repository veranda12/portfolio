import type { Config } from "tailwindcss";

// Every color is a CSS variable holding RGB channels, so opacity modifiers
// (`bg-ink/10`) keep working. Values live in globals.css:
//   :root         → light admin palette (unchanged look for the CMS)
//   .theme-site   → dark public-site palette from REDESIGN_BRIEF.md
const v = (name: string) => `rgb(var(--${name}-rgb) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design-system tokens (brief §3).
        canvas: v("canvas"),
        surface: v("surface"),
        "surface-elevated": v("surface-elevated"),
        // Large raised containers (demo panels, form, CTA): dark grey / white.
        panel: v("panel"),
        ink: v("ink"),
        "ink-muted": v("ink-muted"),
        "accent-pink": v("accent-pink"),
        "accent-yellow": v("accent-yellow"),
        "accent-blue": v("accent-blue"),
        line: v("border"),

        // Legacy tokens still used by the admin panel and not-yet-restyled
        // site components. On the site they alias onto the tokens above.
        paper: v("paper"),
        "paper-dim": v("paper-dim"),
        "ink-soft": v("ink-soft"),
        "ink-faint": v("ink-faint"),
        rule: v("rule"),
        "rule-strong": v("rule-strong"),
        signal: v("signal"),
        "signal-dim": v("signal-dim"),
        "signal-light": v("signal-light"),
        "blue-light": v("blue-light"),
        "primary-soft": v("primary-soft"),
        "surface-blue": v("surface-blue"),
        coral: v("coral"),
        "surface-2": v("surface-2"),
        console: v("console"),
        "console-2": v("console-2"),
        "console-line": v("console-line"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "sans-serif"],
        display: ["var(--font-sans)", "ui-sans-serif", "sans-serif"],
        // No monospace/terminal face anywhere — `font-mono` resolves to the sans.
        mono: ["var(--font-sans)", "ui-sans-serif", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"],
      },
      fontSize: {
        // Brief §3 type scale.
        hero: ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "hero-sm": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        section: ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "700" }],
        "section-sm": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        body: ["1.125rem", { lineHeight: "1.6" }],
        "label-sm": ["0.875rem", { lineHeight: "1.4", fontWeight: "600" }],
      },
      spacing: {
        section: "6rem",
        "section-sm": "3rem",
      },
      borderRadius: {
        card: "0.75rem",
        panel: "1rem",
        button: "0.5rem",
      },
      maxWidth: {
        shell: "1200px",
      },
      letterSpacing: {
        label: "0.06em",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        // Layered, warm-tinted elevation for the dark site.
        lift: "var(--shadow-lift)",
        press: "0 1px 1px rgb(0 0 0 / 0.3)",
      },
      keyframes: {
        "reveal-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "line-grow": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        "reveal-up": "reveal-up var(--spring-snappy-duration) var(--spring-snappy) both",
        "line-grow": "line-grow 0.9s cubic-bezier(0.22,1,0.36,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
