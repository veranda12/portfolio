import { Hero } from "@/components/sections/Hero";
import { Audiences } from "@/components/sections/Audiences";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { SystemsShowcase } from "@/components/sections/SystemsShowcase";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Trust } from "@/components/sections/Trust";
import { About } from "@/components/sections/About";
import { TechStack } from "@/components/sections/TechStack";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import {
  getPublishedProjects,
  getServices,
  getTechnologiesByCategory,
} from "@/lib/queries";
import { getSettings } from "@/lib/content";
import { translationMap } from "@/lib/translations";
import { prisma } from "@/lib/db";
import type { Locale } from "@/i18n";

export default async function HomePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const [projects, services, techGroups, settings] = await Promise.all([
    getPublishedProjects(lang),
    getServices(lang),
    getTechnologiesByCategory(),
    getSettings(lang),
  ]);

  const flagship =
    (await prisma.project.findFirst({
      where: { published: true, layout: "flagship" },
      select: { slug: true, title: true, architectureText: true },
    })) ??
    (await prisma.project.findFirst({
      where: { published: true, architectureText: { not: "" } },
      select: { slug: true, title: true, architectureText: true },
    }));
  const flagshipTitle = flagship
    ? (await translationMap([flagship.title], lang)).get(flagship.title) ?? flagship.title
    : "";

  const years =
    projects.length > 0
      ? `${Math.min(...projects.map((p) => p.year))}–${Math.max(...projects.map((p) => p.year))}`
      : "";

  return (
    <>
      <Hero settings={settings} stats={{ projects: projects.length, years }} lang={lang} />
      <Audiences lang={lang} />
      <SelectedWork projects={projects} lang={lang} />
      {flagship?.architectureText ? (
        <SystemsShowcase
          architectureText={flagship.architectureText}
          slug={flagship.slug}
          title={flagshipTitle}
          lang={lang}
        />
      ) : null}
      <Services services={services} lang={lang} />
      <Process lang={lang} />
      <Trust lang={lang} />
      <About settings={settings} lang={lang} />
      <TechStack groups={techGroups} lang={lang} />
      <Faq lang={lang} />
      <Contact settings={settings} lang={lang} />
    </>
  );
}
