import type { Metadata } from "next";
import { hand, sans } from "@/lib/fonts";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { RouteProgress } from "@/components/RouteProgress";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RenCodes · Full-Stack Developer",
    template: "%s · Deni Maulana Shobri",
  },
  description:
    "Full-stack developer yang membangun website, aplikasi bisnis, integrasi, dan sistem operasional untuk bisnis nyata. Java, Spring Boot, Next.js, React, TypeScript, PostgreSQL.",
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
    title: "RenCodes · Full-Stack Developer",
    description:
      "Website, aplikasi bisnis, integrasi, dan sistem operasional untuk bisnis nyata.",
    siteName: "RenCodes",
    locale: "id_ID",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme is set by the inline script before hydration.
    <html lang="id" className={`${sans.variable} ${hand.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <RouteProgress />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
