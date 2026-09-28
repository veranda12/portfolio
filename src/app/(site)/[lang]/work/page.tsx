import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedProjects } from "@/lib/queries";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Tag } from "@/components/ui/Card";
import { getDictionary, lp, type Locale } from "@/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang).meta;
  return {
    title: t.workTitle,
    description: t.workDescription,
    alternates: { canonical: lp(lang, "/work"), languages: { id: "/work", en: "/en/work" } },
  };
}

export const dynamic = "force-dynamic";

export default async function WorkIndexPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const t = getDictionary(lang);
  const projects = await getPublishedProjects(lang);

  return (
    <div className="shell pb-section-sm pt-8 md:pb-section md:pt-14">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex rounded-button bg-surface-elevated px-2.5 py-1 text-[0.8125rem] font-semibold uppercase text-accent-pink">
            {t.work.indexChip}
          </span>
          <h1 className="mt-4 text-hero-sm text-ink md:text-hero">{t.work.indexTitle}</h1>
        </div>
        <span className="label">{String(projects.length).padStart(2, "0")} {t.common.projectsCount}</span>
      </div>

      <div className="mt-10 flex flex-col gap-3 md:mt-14">
        {projects.map((p, i) => (
          <ScrollReveal key={p.id} delay={Math.min(i, 4) * 60}>
            <Link
              href={lp(lang, `/work/${p.slug}`)}
              className="ui-card ui-card-interactive group grid grid-cols-1 gap-3 rounded-card bg-surface p-6 shadow-card md:grid-cols-12 md:items-center md:gap-6 md:p-7"
            >
              <span className="text-[0.8125rem] font-semibold text-accent-pink md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="md:col-span-5">
                <h2 className="text-[1.5rem] font-bold leading-tight text-ink md:text-[1.75rem]">{p.title}</h2>
                <p className="mt-2 text-[0.8125rem] text-ink-muted">
                  {p.projectType}, {p.year}, {p.clientType}
                </p>
              </div>
              <p className="text-[0.9375rem] leading-relaxed text-ink-muted md:col-span-4">{p.shortDescription}</p>
              <div className="flex items-center justify-between gap-3 md:col-span-2 md:justify-end">
                <span className="hidden lg:inline-flex">
                  <Tag>{p.technologies.slice(0, 2).map((t) => t.technology.name).join(" · ")}</Tag>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-accent-pink">
                  <ArrowRight className="nudge-x h-4 w-4" strokeWidth={2.25} aria-hidden />
                </span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
        {projects.length === 0 ? (
          <p className="py-16 text-center text-[0.9375rem] text-ink-muted">{t.work.empty}</p>
        ) : null}
      </div>
    </div>
  );
}
