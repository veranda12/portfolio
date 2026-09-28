import { hand, sans } from "@/lib/fonts";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { RouteProgress } from "@/components/RouteProgress";
import { themeInitScript } from "@/lib/theme";
import "@/app/globals.css";

// Shared <html>/<body> shell. The app has two root layouts — the public site
// (/[lang], so <html lang> matches the page language) and the admin panel —
// and both render through this component.
export function RootDocument({ lang, children }: { lang: string; children: React.ReactNode }) {
  return (
    // data-theme is set by the inline script before hydration.
    <html lang={lang} className={`${sans.variable} ${hand.variable}`} suppressHydrationWarning>
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
