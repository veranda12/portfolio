import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ProjectPlate } from "@/components/ProjectPlate";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { ProjectListItem } from "@/lib/queries";

// Re-exported for pages that still import it from here.
export { SectionHeader };

function techNames(p: ProjectListItem): string[] {
  return p.technologies.map((t) => t.technology.name);
}

/* ---- Bento packing ------------------------------------------------------
   Visual weight comes from each project's `layout` field. Items are packed
   row by row in their original order (no reordering): a flagship — or an
   item left alone at the end — takes a full row; everything else pairs up,
   with the heavier card getting the wider column. */

type Weight = "xl" | "md" | "sm";
type Span = "full" | "7" | "5" | "6";

const WEIGHT: Record<string, Weight> = {
  flagship: "xl",
  split: "md",
  standard: "md",
  horizontal: "sm",
  compact: "sm",
};

const SPAN_CLASS: Record<Span, string> = {
  full: "md:col-span-2 lg:col-span-12",
  "7": "lg:col-span-7",
  "5": "lg:col-span-5",
  "6": "lg:col-span-6",
};

function pack(projects: ProjectListItem[]): Span[] {
  // Only the first flagship gets a full-width hero card; any later ones are
  // treated as medium so the grid keeps its bento rhythm.
  const firstFlagship = projects.findIndex((p) => p.layout === "flagship");
  const weights = projects.map((p, i) =>
    p.layout === "flagship" && i !== firstFlagship ? "md" : (WEIGHT[p.layout] ?? "md")
  );
  const w = (p: ProjectListItem) => weights[projects.indexOf(p)];
  const spans: Span[] = [];
  let i = 0;
  while (i < projects.length) {
    const a = projects[i];
    const b = projects[i + 1];
    if (w(a) === "xl" || !b || w(b) === "xl") {
      spans.push("full");
      i += 1;
      continue;
    }
    const [wa, wb] = [w(a), w(b)];
    if (wa === "md" && wb === "sm") spans.push("7", "5");
    else if (wa === "sm" && wb === "md") spans.push("5", "7");
    else spans.push("6", "6");
    i += 2;
  }
  return spans;
}

// Per-layout link copy, unchanged from the original variants.
const CASE_LABEL: Record<string, string | null> = {
  flagship: "Baca Case Study Lengkap",
  split: "Baca Case Study",
  standard: "Baca Case Study",
  compact: "Case Study",
  horizontal: null,
};

export function SelectedWork({ projects }: { projects: ProjectListItem[] }) {
  const spans = pack(projects);

  return (
    <Section id="work">
      <SectionHeader index="003" title="Karya Pilihan" note="Proyek" />

      <div className="mt-10 grid grid-cols-1 gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
        {projects.map((p, i) => (
          <ScrollReveal key={p.id} className={cn("flex", SPAN_CLASS[spans[i]])} delay={(i % 2) * 70}>
            <BentoCard p={p} n={i + 1} wide={spans[i] === "full"} />
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link href="/work" className="ui-btn ui-btn-secondary group">
          Lihat Semua Karya
          <ArrowRight className="nudge-x h-4 w-4" strokeWidth={2.25} aria-hidden />
        </Link>
      </div>
    </Section>
  );
}

function BentoCard({ p, n, wide }: { p: ProjectListItem; n: number; wide: boolean }) {
  const layout = p.layout in CASE_LABEL ? p.layout : "standard";
  const flagship = layout === "flagship";
  const caseLabel = CASE_LABEL[layout];
  const tech = techNames(p);

  return (
    <article
      className={cn(
        "ui-card ui-card-interactive group relative flex w-full flex-col gap-6 rounded-card bg-surface p-3 shadow-card md:p-4",
        wide && "lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-8"
      )}
    >
      <ProjectPlate
        title={p.title}
        index={n}
        category={p.category}
        tech={tech}
        image={p.featuredImage}
        priority={flagship}
        dark={layout === "compact"}
        sizes={wide ? "(max-width: 1024px) 100vw, 700px" : "(max-width: 768px) 100vw, 600px"}
        className={cn(
          "w-full",
          wide ? "aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[22rem]" : "aspect-[16/10]"
        )}
      />

      <div className={cn("flex flex-1 flex-col px-2 pb-3 md:px-3", wide && "lg:col-span-5 lg:justify-center lg:py-4 lg:pr-4")}>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[0.8125rem] font-semibold text-ink-muted">{String(n).padStart(2, "0")}</span>
          {flagship ? <span className="label-signal">Unggulan</span> : null}
        </div>
        <p className="label mt-3">
          {p.projectType}, {p.year}, {p.clientType}
        </p>
        <h3 className={cn("mt-2 font-bold leading-tight tracking-[-0.01em] text-ink", wide ? "text-[1.75rem] md:text-[2rem]" : "text-[1.5rem]")}>
          <Link href={`/work/${p.slug}`} className="stretched-link focus-visible:outline-none">
            {p.title}
          </Link>
        </h3>
        <p className="mt-3 text-body text-ink-muted">{p.shortDescription}</p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
          {layout === "horizontal" ? (
            <div className="hidden flex-wrap gap-1.5 lg:flex">
              {tech.slice(0, 2).map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {tech.slice(0, 7).map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          )}
          {caseLabel ? (
            <Link href={`/work/${p.slug}`} className="ui-link relative z-10 text-[0.9375rem]">
              <span className="link-underline">{caseLabel}</span>
              <ArrowRight className="nudge-x h-4 w-4" strokeWidth={2.25} aria-hidden />
            </Link>
          ) : (
            <ArrowRight className="nudge-x ml-auto h-5 w-5 text-accent-pink" strokeWidth={2.25} aria-hidden />
          )}
        </div>
      </div>
    </article>
  );
}
