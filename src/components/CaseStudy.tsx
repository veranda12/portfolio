import Image from "next/image";
import Link from "next/link";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { ProjectPlate } from "@/components/ProjectPlate";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { FullProject, ProjectListItem } from "@/lib/queries";

function Prose({ text }: { text: string }) {
  const paras = text.split("\n").filter((p) => p.trim());
  return (
    <div className="space-y-4">
      {paras.map((p, i) => (
        <p key={i} className="text-base leading-relaxed text-ink-soft md:text-lg">
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
      <section className="grid grid-cols-1 gap-6 border-t border-rule py-12 md:grid-cols-12 md:py-16">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-24">
            <span className="label-signal">[ {index} ]</span>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight md:text-3xl">{title}</h2>
          </div>
        </div>
        <div className="md:col-span-8">{children}</div>
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
      <header className="border-b border-rule">
        <div className="shell pb-10 pt-10 md:pt-14">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-5">
            <Link href="/work" className="label link-underline">
              ← Indeks
            </Link>
            <span className="label-signal">PRJ-{String(index).padStart(2, "0")}</span>
          </div>

          <div className="grid grid-cols-1 gap-8 pt-10 md:grid-cols-12">
            <div className="md:col-span-8">
              <p className="label-signal">{project.category}</p>
              <h1 className="mt-4 font-display text-[clamp(2.25rem,6vw,5rem)] font-bold leading-[0.96] tracking-[-0.02em]">
                {project.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
                {project.fullDescription || project.shortDescription}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 bg-ink px-5 py-3 font-mono text-xs uppercase tracking-label text-paper transition-colors hover:bg-signal"
                  >
                    Lihat Live →
                  </a>
                ) : null}
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 border border-ink px-5 py-3 font-mono text-xs uppercase tracking-label transition-colors hover:bg-ink hover:text-paper"
                  >
                    Source →
                  </a>
                ) : null}
              </div>
            </div>

            {/* Spec rail */}
            <aside className="md:col-span-4">
              <dl className="divide-y divide-rule border-y border-rule">
                {[
                  ["Tipe", project.projectType],
                  ["Tahun", String(project.year)],
                  ["Klien", project.clientType],
                  ["Peran", project.role],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="label">{k}</dt>
                    <dd className="text-right font-mono text-sm text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>

        {/* Cover */}
        <div className="shell pb-12">
          <ProjectPlate
            title={project.title}
            index={index}
            category={project.category}
            tech={tech}
            image={project.featuredImage}
            priority
            className="aspect-[16/9] w-full md:aspect-[21/9]"
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
            <ul className="grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-2">
              {project.capabilities.map((c) => (
                <li key={c.id} className="bg-paper p-5">
                  <h3 className="font-display text-lg font-semibold leading-snug">{c.title}</h3>
                  {c.detail ? (
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.detail}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Block>
        ) : null}

        {project.architectureText || project.architectureImage ? (
          <Block index={next()} title="Architecture">
            {project.architectureText ? (
              <ArchitectureDiagram text={project.architectureText} />
            ) : null}
            {project.architectureImage ? (
              <div className="relative mt-6 aspect-video w-full overflow-hidden border border-rule bg-paper-dim">
                <Image
                  src={project.architectureImage}
                  alt={`${project.title} architecture`}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-contain"
                />
              </div>
            ) : null}
          </Block>
        ) : null}

        <Block index={next()} title="Technology &amp; Tools">
          <div className="flex flex-wrap gap-2">
            {tech.map((t) => (
              <span key={t} className="border border-rule-strong px-3 py-1.5 font-mono text-xs text-ink-soft">
                {t}
              </span>
            ))}
          </div>
        </Block>

        {gallery.length > 0 ? (
          <Block index={next()} title="Tampilan">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {gallery.map((img) => (
                <div key={img.id} className="relative aspect-[4/3] overflow-hidden border border-rule bg-paper-dim">
                  <Image
                    src={img.url}
                    alt={img.alt || project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
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
            <div className="border-l-2 border-signal pl-6">
              <Prose text={project.outcome} />
            </div>
          </Block>
        ) : null}
      </div>

      {/* Related + CTA */}
      <div className="mt-8 border-t border-rule bg-ink text-paper">
        <div className="shell py-16 md:py-20">
          {related.length > 0 ? (
            <>
              <p className="font-mono text-[0.68rem] uppercase tracking-label text-paper/50">Karya Terkait</p>
              <div className="mt-6 grid grid-cols-1 gap-px border border-console-line bg-console-line md:grid-cols-2">
                {related.map((r, i) => (
                  <Link
                    key={r.id}
                    href={`/work/${r.slug}`}
                    className="group flex items-center justify-between gap-4 bg-ink p-6 transition-colors hover:bg-console-2"
                  >
                    <div>
                      <span className="font-mono text-xs text-signal">
                        {r.projectType} · {r.year}
                      </span>
                      <h3 className="mt-1 font-display text-xl font-semibold">{r.title}</h3>
                    </div>
                    <span className="font-mono text-signal transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                ))}
              </div>
            </>
          ) : null}

          <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-paper/20 pt-10 md:flex-row md:items-center">
            <h2 className="max-w-xl font-display text-2xl font-semibold leading-tight md:text-4xl">
              Punya sistem seperti ini yang perlu dibangun?
            </h2>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-3 bg-signal px-6 py-4 font-mono text-xs uppercase tracking-label text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              Mulai Proyek →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
