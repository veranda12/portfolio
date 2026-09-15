import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { SystemsShowcase } from "@/components/sections/SystemsShowcase";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { TechStack } from "@/components/sections/TechStack";
import { Contact } from "@/components/sections/Contact";
import {
  getPublishedProjects,
  getServices,
  getTechnologiesByCategory,
} from "@/lib/queries";
import { getSettings } from "@/lib/content";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  const [projects, services, techGroups, settings] = await Promise.all([
    getPublishedProjects(),
    getServices(),
    getTechnologiesByCategory(),
    getSettings(),
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

  const years =
    projects.length > 0
      ? `${Math.min(...projects.map((p) => p.year))}–${Math.max(...projects.map((p) => p.year))}`
      : "";

  return (
    <>
      <Hero settings={settings} stats={{ projects: projects.length, years }} />
      <SelectedWork projects={projects} />
      {flagship?.architectureText ? (
        <SystemsShowcase
          architectureText={flagship.architectureText}
          slug={flagship.slug}
          title={flagship.title}
        />
      ) : null}
      <Services services={services} />
      <About settings={settings} />
      <TechStack groups={techGroups} />
      <Contact settings={settings} />
    </>
  );
}
