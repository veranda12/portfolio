import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { CapabilityDemo } from "@/components/CapabilityDemo";
import { ProjectPlate } from "@/components/ProjectPlate";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Tag } from "@/components/ui/Card";
import type { FullProject, ProjectListItem } from "@/lib/queries";

function Prose({ text }: { text: string }) {
  const paras = text.split("\n").filter((p) => p.trim());
  return (
    <div className="space-y-4">
      {paras.map((p, i) => (
        <p key={i} className="text-body text-ink-muted">
          {p}
        </p>
      ))}
    </div>
  );
}

function Block({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <ScrollReveal>
      <section className="grid grid-cols-1 gap-5 py-10 md:py-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <span className="inline-flex rounded-button bg-surface-elevated px-2.5 py-1 text-[0.8125rem] font-semibold text-accent-pink">
              {index}
            </span>
            <h2 className="mt-3 text-[1.75rem] font-bold leading-tight tracking-[-0.01em] text-ink md:text-[2rem]">{title}</h2>
          </div>
        </div>
        <div className="lg:col-span-8">{children}</div>
      </section>
    </ScrollReveal>
  );
}

export function CaseStudy({
  project,
  related,
  index,
}: {
  project: FullProject;
  related: ProjectListItem[];
  index: number;
}) {
  const tech = project.technologies.map((t) => t.technology.name);
  const gallery = project.images.filter((img) => img.kind === "gallery");

  let blockNo = 0;
  const next = () => String(++blockNo).padStart(2, "0");

  return (
    <article>
      {/* Header */}
      <header>
        <div className="shell pb-10 pt-6 md:pt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/work"
              className="group inline-flex items-center gap-1.5 rounded-button py-1 text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-ink-muted transition-colors duration-150 hover:text-ink"
            >
              <ArrowLeft className="nudge-back h-4 w-4" aria-hidden />
              Indeks
            </Link>
            <span className="label-signal">PRJ-{String(index).padStart(2, "0")}</span>
          </div>

          <div className="grid grid-cols-1 gap-10 pt-10 md:pt-14 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="label-signal">{project.category}</p>
              <h1 className="mt-4 text-hero-sm text-ink md:text-[3.25rem] lg:text-hero">{project.title}</h1>
              <p className="mt-6 max-w-2xl text-body text-ink-muted md:text-[1.25rem] md:leading-[1.6]">
                {project.fullDescription || project.shortDescription}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {project.demoUrl ? (
                  <a href={project.demoUrl} target="_blank" rel="noreferrer noopener" className="ui-btn ui-btn-primary group">
                    Lihat Live
                    <ArrowUpRight className="nudge-xy h-4 w-4" strokeWidth={2.25} aria-hidden />
                  </a>
                ) : null}
                {project.githubUrl ? (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer noopener" className="ui-btn ui-btn-secondary group">
                    Source
                    <ArrowUpRight className="nudge-xy h-4 w-4" strokeWidth={2.25} aria-hidden />
                  </a>
                ) : null}
              </div>
            </div>

            {/* Spec rail */}
            <aside className="lg:col-span-4 lg:pt-10">
              <dl className="divide-y divide-line rounded-card bg-surface px-5 shadow-card">
                {[
                  ["Tipe", project.projectType],
                  ["Tahun", String(project.year)],
                  ["Klien", project.clientType],
                  ["Peran", project.role],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-3.5">
                    <dt className="label">{k}</dt>
                    <dd className="text-right text-[0.9375rem] font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>

        {/* Cover */}
        <div className="shell pb-6">
          <ProjectPlate
            title={project.title}
            index={index}
            category={project.category}
            tech={tech}
            image={project.featuredImage}
            priority
            overlay={false}
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="aspect-[16/10] w-full rounded-panel shadow-lift md:aspect-[21/9]"
          />
        </div>
      </header>

      {/* Body blocks */}
      <div className="shell">
        {project.businessProblem ? (
          <Block index={next()} title="Masalah Bisnis">
            <Prose text={project.businessProblem} />
          </Block>
        ) : null}

        {project.solution ? (
          <Block index={next()} title="Solusi">
            <Prose text={project.solution} />
          </Block>
        ) : null}

        {project.capabilities.length > 0 ? (
          <Block index={next()} title="Yang Bisa Dilakukan">
            <CapabilityDemo items={project.capabilities} />
          </Block>
        ) : null}

        {project.architectureText || project.architectureImage ? (
          <Block index={next()} title="Architecture">
            {project.architectureText ? <ArchitectureDiagram text={project.architectureText} /> : null}
            {project.architectureImage ? (
              <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-panel bg-surface-elevated shadow-card">
                <Image
                  src={project.architectureImage}
                  alt={`${project.title} architecture`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-contain"
                />
              </div>
            ) : null}
          </Block>
        ) : null}

        <Block index={next()} title="Technology &amp; Tools">
          <div className="flex flex-wrap gap-2">
            {tech.map((t) => (
              <Tag key={t} className="px-3 py-1.5 text-[0.8125rem] text-ink">
                {t}
              </Tag>
            ))}
          </div>
        </Block>

        {gallery.length > 0 ? (
          <Block index={next()} title="Tampilan">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {gallery.map((img) => (
                <div key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface-elevated shadow-card">
                  <Image
                    src={img.url}
                    alt={img.alt || project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Block>
        ) : null}

        {project.technicalChallenges ? (
          <Block index={next()} title="Tantangan Teknis">
            <Prose text={project.technicalChallenges} />
          </Block>
        ) : null}

        {project.technicalDecisions ? (
          <Block index={next()} title="Keputusan Teknis">
            <Prose text={project.technicalDecisions} />
          </Block>
        ) : null}

        {project.caseStudyContent ? (
          <Block index={next()} title="Catatan">
            <Prose text={project.caseStudyContent} />
          </Block>
        ) : null}

        {project.outcome ? (
          <Block index={next()} title="Hasil">
            <div className="relative overflow-hidden rounded-panel bg-surface p-6 pl-8 shadow-card md:p-8 md:pl-10">
              <span className="absolute inset-y-0 left-0 w-1.5 bg-accent-pink" aria-hidden />
              <Prose text={project.outcome} />
            </div>
          </Block>
        ) : null}
      </div>

      {/* Related + CTA */}
      <div className="mt-10 bg-surface">
        <div className="shell section-y">
          {related.length > 0 ? (
            <>
              <p className="label">Karya Terkait</p>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/work/${r.slug}`}
                    className="ui-card ui-card-interactive group flex items-center justify-between gap-4 rounded-card bg-canvas/60 p-6 hover:bg-canvas"
                  >
                    <div>
                      <span className="text-[0.8125rem] font-semibold text-accent-pink">
                        {r.projectType} · {r.year}
                      </span>
                      <h3 className="mt-1.5 text-[1.25rem] font-bold text-ink">{r.title}</h3>
                    </div>
                    <ArrowRight className="nudge-x h-5 w-5 shrink-0 text-accent-pink" aria-hidden />
                  </Link>
                ))}
              </div>
            </>
          ) : null}

          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-panel bg-panel p-6 shadow-lift md:flex-row md:items-center md:p-10">
            <h2 className="max-w-xl text-[1.75rem] font-bold leading-tight tracking-[-0.01em] text-ink md:text-[2.25rem]">
              Punya sistem seperti ini yang perlu dibangun?
            </h2>
            <Link href="/#contact" className="ui-btn ui-btn-primary group shrink-0">
              Mulai Proyek
              <ArrowRight className="nudge-x h-4 w-4" strokeWidth={2.25} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
