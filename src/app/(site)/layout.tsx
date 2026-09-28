import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { getSettings } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <div className="theme-site min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-paper"
      >
        Skip to content
      </a>
      <SiteNav siteName={settings["site.name"]} />
      <main id="main">{children}</main>
      <SiteFooter />
      <FloatingWhatsApp
        number={settings["contact.whatsapp"]}
        text={settings["contact.whatsappText"]}
      />
    </div>
  );
}
