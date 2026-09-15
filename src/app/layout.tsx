import type { Metadata } from "next";
import { display, body, mono } from "@/lib/fonts";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Full-Stack Developer — Software untuk bisnis nyata",
    template: "%s — Full-Stack Developer",
  },
  description:
    "Full-Stack Developer yang membangun website, aplikasi bisnis, integrasi, dan sistem operasional untuk bisnis nyata. Java, Spring Boot, Next.js, React, TypeScript, PostgreSQL.",
  keywords: [
    "full stack developer Indonesia",
    "jasa pembuatan aplikasi bisnis",
    "jasa pembuatan website perusahaan",
    "developer aplikasi custom",
    "jasa integrasi payment gateway",
    "developer POS",
    "Java developer Indonesia",
    "Next.js developer Indonesia",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Full-Stack Developer — Software untuk bisnis nyata",
    description:
      "Website, aplikasi bisnis, integrasi, dan sistem operasional untuk bisnis nyata.",
    siteName: "Studio",
    locale: "id_ID",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${body.variable} ${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
