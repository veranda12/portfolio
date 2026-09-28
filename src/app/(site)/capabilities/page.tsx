import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { Sparkles } from "@/components/motion/Sparkles";
import { getPublishedProjects } from "@/lib/queries";
import {
  CAPABILITY_GROUPS,
  TECHNIQUES,
  EXPERIENCE,
  EDUCATION,
  TECH_INDEX,
} from "@/data/capabilities";

export const metadata: Metadata = {
  title: "Kapabilitas",
  description:
    "Yang saya kerjakan, yang sudah saya bangun, dan bagaimana saya mendekati software backend, database, dan integrasi sistem bisnis.",
};

// Bento rhythms (repeat if the data grows). Order is never changed.
const GROUP_SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-6", "lg:col-span-6", "lg:col-span-7", "lg:col-span-5"];
const INDEX_SPANS = ["lg:col-span-8", "lg:col-span-4", "lg:col-span-6", "lg:col-span-6", "lg:col-span-8", "lg:col-span-4"];

function RelatedLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="ui-link group text-[0.9375rem]">
      <span className="link-underline">{children}</span>
      <ArrowRight className="nudge-x h-4 w-4" strokeWidth={2.25} aria-hidden />
    </Link>
  );
}

export default async function CapabilitiesPage() {
  const projects = await getPublishedProjects();
  const titleBySlug = new Map(projects.map((p) => [p.slug, p.title]));

  let n = 0;
  const next = () => String(++n).padStart(2, "0");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-surface/60" aria-hidden />
        <div className="shell relative pb-12 pt-6 md:pb-20 md:pt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="label-signal">Kapabilitas</span>
            <span className="label">Profil teknis</span>
          </div>

          <div className="grid grid-cols-1 gap-10 pt-12 md:pt-16 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h1 className="text-hero-sm text-ink md:text-[3.25rem] lg:text-hero">
                Yang saya kerjakan,
                <br />
                yang sudah saya <span className="text-accent-pink">
                  <Sparkles>bangun</Sparkles>
                </span>.
              </h1>
              <p className="mt-6 max-w-xl text-body text-ink-muted md:text-[1.25rem] md:leading-[1.6]">
                Halaman ini bukan resume versi lain. Isinya hal-hal yang memang pernah saya kerjakan
                di proyek nyata, termasuk bagaimana saya pakai teknologinya untuk menyelesaikan
                masalah, bukan sekadar daftar skill full-stack yang panjang.
              </p>
            </div>
            <div className="lg:col-span-4 lg:self-end">
              <dl className="w-full divide-y divide-line rounded-card bg-surface px-5 shadow-card">
                <div className="flex items-baseline justify-between gap-4 py-3.5">
                  <dt className="label">Peran saat ini</dt>
                  <dd className="text-right text-[0.9375rem] font-semibold text-ink">Fullstack Developer</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3.5">
                  <dt className="label">Sejak</dt>
                  <dd className="text-right text-[0.9375rem] font-semibold text-ink">2021</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3.5">
                  <dt className="label">Basis</dt>
                  <dd className="text-right text-[0.9375rem] font-semibold text-ink">Jakarta Barat</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Technical capabilities */}
      <Section>
        <SectionHeader index={next()} title="Kemampuan Teknis" note="Dikelompokkan per area" />

        <div className="mt-10 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {CAPABILITY_GROUPS.map((g, i) => {
            const related = (g.relatedSlugs ?? []).filter((s) => titleBySlug.has(s));
            return (
              <ScrollReveal
                key={g.title}
                className={cn("ui-card flex flex-col rounded-card bg-surface p-6 shadow-card md:p-7", GROUP_SPANS[i % GROUP_SPANS.length])}
                delay={(i % 2) * 70}
              >
                <span className="text-[0.8125rem] font-semibold text-accent-pink">{g.number}</span>
                <h3 className="mt-2 text-[1.375rem] font-bold leading-snug text-ink">{g.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">{g.description}</p>

                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {g.skills.map((s) => (
                    <li key={s}>
                      <Tag className="text-ink">{s}</Tag>
                    </li>
                  ))}
                </ul>

                {related.length > 0 ? (
                  <div className="mt-auto space-y-1.5 pt-6">
                    <p className="label">Dipakai di</p>
                    {related.map((slug) => (
                      <div key={slug}>
                        <RelatedLink href={`/work/${slug}`}>{titleBySlug.get(slug)}</RelatedLink>
                      </div>
                    ))}
                  </div>
                ) : null}
              </ScrollReveal>
            );
          })}
        </div>
      </Section>

      {/* How I build */}
      <Section tone="surface">
        <SectionHeader index={next()} title="Bagaimana Saya Membangun" note="Pendekatan engineering" />

        <div className="mt-10 grid grid-cols-1 gap-8 md:mt-12 lg:grid-cols-12 lg:gap-12">
          <ScrollReveal className="lg:col-span-4">
            <p className="max-w-xs text-body text-ink-muted lg:sticky lg:top-24">
              Bukan teori dari buku. Ini cara kerja yang terbentuk dari menangani sistem finance
              dan POS yang beneran dipakai orang tiap hari.
            </p>
          </ScrollReveal>
          <ol className="relative flex flex-col gap-3 lg:col-span-8">
            {TECHNIQUES.map((t) => (
              <ScrollReveal key={t.number} as="li" className="ui-card flex gap-5 rounded-card bg-canvas/60 p-6 hover:bg-canvas md:p-7">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-[0.8125rem] font-semibold text-accent-pink">
                  {t.number}
                </span>
                <div>
                  <h3 className="text-[1.125rem] font-bold leading-snug text-ink md:text-[1.25rem]">{t.title}</h3>
                  <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-muted md:text-body">{t.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* Experience */}
      <Section>
        <SectionHeader index={next()} title="Pengalaman" note="Riwayat kerja" />

        <div className="mt-10 flex flex-col gap-5 md:mt-12">
          {EXPERIENCE.map((e) => {
            const related = (e.relatedSlugs ?? []).filter((s) => titleBySlug.has(s));
            return (
              <ScrollReveal
                key={e.company}
                className="grid grid-cols-1 gap-8 rounded-panel bg-surface p-6 shadow-card md:p-10 lg:grid-cols-12"
              >
                <div className="lg:col-span-4">
                  <div className="lg:sticky lg:top-24">
                    <p className="text-[0.8125rem] font-semibold text-accent-blue">{e.period}</p>
                    <h3 className="mt-2 text-[1.75rem] font-bold leading-tight text-ink md:text-[2rem]">{e.company}</h3>
                    <p className="mt-1.5 text-[0.9375rem] text-ink-muted">
                      {e.role} · {e.setting}
                    </p>
                    {e.context ? <p className="mt-1 text-[0.8125rem] text-ink-muted">{e.context}</p> : null}
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {e.areas.map((a) => (
                        <Tag key={a}>{a}</Tag>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <p className="max-w-2xl text-body text-ink">{e.summary}</p>
                  <ul className="mt-6 space-y-3 rounded-card bg-canvas/50 p-5 md:p-6">
                    {e.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-pink" aria-hidden />
                        <span className="text-[0.9375rem] leading-relaxed text-ink-muted">{h}</span>
                      </li>
                    ))}
                  </ul>

                  {related.length > 0 ? (
                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                      <span className="label">Terhubung ke</span>
                      {related.map((slug) => (
                        <RelatedLink key={slug} href={`/work/${slug}`}>
                          {titleBySlug.get(slug)}
                        </RelatedLink>
                      ))}
                    </div>
                  ) : null}
                </div>
              </ScrollReveal>
            );
          })}

          <ScrollReveal className="flex flex-wrap items-center justify-between gap-4 rounded-panel bg-surface-elevated p-6 shadow-card md:p-8">
            <div>
              <p className="label">Pendidikan</p>
              <p className="mt-2 text-[1.25rem] font-bold text-ink">{EDUCATION.institution}</p>
              <p className="mt-1 text-[0.9375rem] text-ink-muted">
                {EDUCATION.degree} · {EDUCATION.gpa}
              </p>
            </div>
            <span className="text-[0.8125rem] font-semibold text-accent-blue">{EDUCATION.period}</span>
          </ScrollReveal>
        </div>
      </Section>

      {/* Tech index */}
      <Section id="tech-index" tone="surface">
        <SectionHeader index={next()} title="Indeks Teknis" note="Ringkas" />

        <div className="mt-10 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {TECH_INDEX.map((g, i) => (
            <ScrollReveal
              key={g.label}
              className={cn("rounded-card bg-canvas/60 p-6", INDEX_SPANS[i % INDEX_SPANS.length])}
              delay={(i % 2) * 70}
            >
              <p className="label-signal">{g.label}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {g.items.map((item) => (
                  <li key={item}>
                    <Tag className="text-ink">{item}</Tag>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Closing CTA */}
      <section className="scroll-mt-16">
        <div className="shell section-y">
          <ScrollReveal className="flex flex-col items-start justify-between gap-6 rounded-panel bg-panel p-6 shadow-lift md:flex-row md:items-center md:p-10">
            <h2 className="max-w-xl text-[1.75rem] font-bold leading-tight tracking-[-0.01em] text-ink md:text-[2.25rem]">
              Punya sistem yang cocok dengan kapabilitas ini?
            </h2>
            <Link href="/#contact" className="ui-btn ui-btn-primary group shrink-0">
              Mulai Proyek
              <ArrowRight className="nudge-x h-4 w-4" strokeWidth={2.25} aria-hidden />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
