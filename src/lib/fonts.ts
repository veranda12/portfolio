import { Sora, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

// Combo A — "Atelier":
//   Display : Sora            — confident, sophisticated grotesk for headlines
//   Body    : IBM Plex Sans   — neutral, engineered, understated at 14–18px
//   Mono    : IBM Plex Mono   — same family as the body, for technical metadata
// Weights kept to a controlled 400 / 500 / 600 / 700 range.

export const display = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const body = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});
