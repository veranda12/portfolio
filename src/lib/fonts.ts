import { Caveat, Plus_Jakarta_Sans } from "next/font/google";

// Body + headings across the whole interface (site and admin).
export const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Playful handwritten accent — use sparingly (max 1–2 per page).
export const hand = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  weight: ["500", "700"],
  display: "swap",
});
