import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ProjectPlate } from "@/components/ProjectPlate";
import type { ProjectListItem } from "@/lib/queries";

function techNames(p: ProjectListItem): string[] {
  return p.technologies.map((t) => t.technology.name);
}

// Each project renders with a different visual weight based on its layout field.
export function SelectedWork({ projects }: { projects: ProjectListItem[] }) {
  return (
    <section id="work" className="scroll-mt-16 border-b border-rule">
      <div className="shell py-16 md:py-24">
        <SectionHeader index="002" title="Karya Pilihan" note="Proyek tercatat" />

        <div className="mt-12 flex flex-col gap-16 md:gap-28">
          {projects.map((p, i) => {
            const n = i + 1;
            switch (p.layout) {
              case "flagship":
                return <FlagshipCard key={p.id} p={p} n={n} />;
              case "split":
                return <SplitCard key={p.id} p={p} n={n} />;
              case "horizontal":
                return <HorizontalCard key={p.id} p={p} n={n} />;
              case "compact":
                return <CompactCard key={p.id} p={p} n={n} />;
              default:
                return <StandardCard key={p.id} p={p} n={n} />;
            }
          })}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/work"
            className="group inline-flex items-center gap-3 border border-ink px-6 py-4 font-mono text-xs uppercase tracking-label transition-colors hover:bg-ink hover:text-paper"
          >
            Lihat Semua Karya
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({ index, title, note }: { index: string; title: string; note?: string }) {
  return (
    <div className="flex flex-col gap-4 border-t border-ink pt-5 md:flex-row md:items-end md:justify-between">
      <div className="flex items-baseline gap-5">
        <span className="label-signal">[ {index} ]</span>
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
      </div>
      {note ? <span className="label">{note}</span> : null}
    </div>
  );
}

function Meta({ p }: { p: ProjectListItem }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
      <span className="label">{p.projectType}</span>
      <span className="label">·</span>
      <span className="label">{p.year}</span>
      <span className="label">·</span>
      <span className="label">{p.clientType}</span>
    </div>
  );
}

function TechRow({ p }: { p: ProjectListItem }) {
  return (
    <div className="flex flex-wrap gap-2">
      {techNames(p).slice(0, 7).map((t) => (
        <span key={t} className="border border-rule-strong px-2.5 py-1 font-mono text-[0.66rem] text-ink-soft">
          {t}
        </span>
      ))}
    </div>
  );
}

function CaseLink({ slug, label = "Baca Case Study" }: { slug: string; label?: string }) {
  return (
    <Link
      href={`/work/${slug}`}
      className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-label text-signal"
    >
      <span className="link-underline">{label}</span>
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </Link>
  );
}

/* ---- Layout variants ---------------------------------------------------- */

function FlagshipCard({ p, n }: { p: ProjectListItem; n: number }) {
  return (
    <ScrollReveal className="group">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-display text-6xl font-semibold text-rule-strong md:text-8xl">
          {String(n).padStart(2, "0")}
        </span>
        <span className="label-signal">Unggulan</span>
      </div>
      <Link href={`/work/${p.slug}`} className="block">
        <ProjectPlate
          title={p.title}
          index={n}
          category={p.category}
          tech={techNames(p)}
          image={p.featuredImage}
          priority
          className="aspect-[16/9] w-full transition-transform duration-700 group-hover:scale-[1.005] md:aspect-[21/9]"
        />
      </Link>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-7">
          <Meta p={p} />
          <h3 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">
            <Link href={`/work/${p.slug}`} className="link-underline">{p.title}</Link>
          </h3>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">{p.shortDescription}</p>
        </div>
        <div className="flex flex-col justify-between gap-6 md:col-span-5 md:items-end">
          <TechRow p={p} />
          <CaseLink slug={p.slug} label="Baca Case Study Lengkap" />
        </div>
      </div>
    </ScrollReveal>
  );
}

function SplitCard({ p, n }: { p: ProjectListItem; n: number }) {
  return (
    <ScrollReveal className="group grid grid-cols-1 items-center gap-8 md:grid-cols-12">
      <div className="order-2 md:order-1 md:col-span-5">
        <div className="flex items-center gap-4">
          <span className="font-display text-4xl font-semibold text-rule-strong">{String(n).padStart(2, "0")}</span>
          <Meta p={p} />
        </div>
        <h3 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-4xl">
          <Link href={`/work/${p.slug}`} className="link-underline">{p.title}</Link>
        </h3>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">{p.shortDescription}</p>
        <div className="mt-6"><TechRow p={p} /></div>
        <div className="mt-6"><CaseLink slug={p.slug} /></div>
      </div>
      <Link href={`/work/${p.slug}`} className="order-1 md:order-2 md:col-span-7">
        <ProjectPlate
          title={p.title}
          index={n}
          category={p.category}
          tech={techNames(p)}
          image={p.featuredImage}
          className="aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-[1.01]"
        />
      </Link>
    </ScrollReveal>
  );
}

function HorizontalCard({ p, n }: { p: ProjectListItem; n: number }) {
  return (
    <ScrollReveal className="group">
      <Link href={`/work/${p.slug}`} className="block border-y border-rule py-8 transition-colors hover:border-ink">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
          <div className="md:col-span-1">
            <span className="font-display text-4xl font-semibold text-rule-strong group-hover:text-signal">
              {String(n).padStart(2, "0")}
            </span>
          </div>
          <div className="md:col-span-5">
            <Meta p={p} />
            <h3 className="mt-2 font-display text-2xl font-semibold leading-tight md:text-3xl">{p.title}</h3>
          </div>
          <div className="md:col-span-4">
            <p className="text-sm leading-relaxed text-ink-soft">{p.shortDescription}</p>
          </div>
          <div className="flex items-center justify-between md:col-span-2 md:justify-end">
            <TechRowMini p={p} />
            <span className="ml-4 font-mono text-signal transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}

function CompactCard({ p, n }: { p: ProjectListItem; n: number }) {
  return (
    <ScrollReveal className="group grid grid-cols-1 gap-6 md:grid-cols-12">
      <Link href={`/work/${p.slug}`} className="md:col-span-4">
        <ProjectPlate
          title={p.title}
          index={n}
          category={p.category}
          tech={techNames(p)}
          image={p.featuredImage}
          dark
          className="aspect-[3/2] w-full"
        />
      </Link>
      <div className="flex flex-col justify-center md:col-span-8">
        <div className="flex items-center gap-4">
          <span className="font-display text-3xl font-semibold text-rule-strong">{String(n).padStart(2, "0")}</span>
          <Meta p={p} />
        </div>
        <h3 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
          <Link href={`/work/${p.slug}`} className="link-underline">{p.title}</Link>
        </h3>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">{p.shortDescription}</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <TechRow p={p} />
          <CaseLink slug={p.slug} label="Case Study" />
        </div>
      </div>
    </ScrollReveal>
  );
}

function StandardCard({ p, n }: { p: ProjectListItem; n: number }) {
  return (
    <ScrollReveal className="group">
      <Link href={`/work/${p.slug}`} className="block">
        <ProjectPlate
          title={p.title}
          index={n}
          category={p.category}
          tech={techNames(p)}
          image={p.featuredImage}
          className="aspect-[16/10] w-full transition-transform duration-700 group-hover:scale-[1.01]"
        />
      </Link>
      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-4">
            <span className="font-display text-2xl font-semibold text-rule-strong">{String(n).padStart(2, "0")}</span>
            <Meta p={p} />
          </div>
          <h3 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
            <Link href={`/work/${p.slug}`} className="link-underline">{p.title}</Link>
          </h3>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">{p.shortDescription}</p>
        </div>
        <div className="flex flex-col items-start gap-4 md:items-end">
          <TechRow p={p} />
          <CaseLink slug={p.slug} />
        </div>
      </div>
    </ScrollReveal>
  );
}

function TechRowMini({ p }: { p: ProjectListItem }) {
  return (
    <div className="hidden flex-wrap gap-1.5 lg:flex">
      {techNames(p).slice(0, 2).map((t) => (
        <span key={t} className="font-mono text-[0.62rem] text-ink-faint">{t}</span>
      ))}
    </div>
  );
}
