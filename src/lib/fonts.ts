import localFont from "next/font/local";

// Fonts are self-hosted from the Fontsource packages instead of next/font/google,
// so the build never has to reach Google Fonts (the 15.1 Google loader crashes
// when Google serves font URLs without a file extension). Same families,
// same CSS variables, Latin subset only — as before.

// Body + headings across the whole interface (site and admin). Variable 200–800.
export const sans = localFont({
  src: "../../node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2",
  weight: "200 800",
  style: "normal",
  variable: "--font-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

// Playful handwritten accent — use sparingly (max 1–2 per page). Variable 400–700.
export const hand = localFont({
  src: "../../node_modules/@fontsource-variable/caveat/files/caveat-latin-wght-normal.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-hand",
  display: "swap",
  fallback: ["cursive"],
});
