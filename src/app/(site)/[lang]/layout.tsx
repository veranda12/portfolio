import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RootDocument } from "@/components/RootDocument";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";
import { getDictionary, isLocale, locales, ogLocale, type Locale } from "@/i18n";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).meta;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.title, template: t.titleTemplate },
    description: t.description,
    keywords: t.keywords,
    alternates: {
      canonical: lang === "en" ? "/en" : "/",
      languages: { id: "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      url: lang === "en" ? `${siteUrl}/en` : siteUrl,
      title: t.ogTitle,
      description: t.ogDescription,
      siteName: t.ogSiteName,
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
    },
    robots: { index: true, follow: true },
  };
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const settings = await getSettings(locale);
  const t = getDictionary(locale);

  return (
    <RootDocument lang={locale}>
      <div className="theme-site min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-paper"
        >
          {t.common.skipToContent}
        </a>
        <SiteNav siteName={settings["site.name"]} lang={locale} />
        <main id="main">{children}</main>
        <SiteFooter lang={locale} />
        <FloatingWhatsApp
          number={settings["contact.whatsapp"]}
          text={settings["contact.whatsappText"]}
          lang={locale}
        />
      </div>
    </RootDocument>
  );
}
