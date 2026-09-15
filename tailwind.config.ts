import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm paper foundation + near-black ink + single restrained signal.
        paper: "#F4F1EA",
        "paper-dim": "#EBE7DC",
        ink: "#16150F",
        "ink-soft": "#3A382E",
        "ink-faint": "#6B6858",
        rule: "#DAD4C6",
        "rule-strong": "#C4BDA9",
        signal: "#E5431E",
        "signal-dim": "#C43514",
        // Dark surfaces reused by the admin console.
        console: "#131210",
        "console-2": "#1C1A16",
        "console-line": "#2C2A24",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        shell: "1440px",
      },
      letterSpacing: {
        label: "0.18em",
      },
      keyframes: {
        "reveal-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "line-grow": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        "reveal-up": "reveal-up 0.7s cubic-bezier(0.22,1,0.36,1) forwards",
        "line-grow": "line-grow 0.9s cubic-bezier(0.22,1,0.36,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
