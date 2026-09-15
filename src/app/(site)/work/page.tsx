import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedProjects } from "@/lib/queries";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Karya",
  description:
    "Proyek pilihan: aplikasi bisnis, sistem POS & operasional, integrasi, dan platform web modern.",
};

export const dynamic = "force-dynamic";

export default async function WorkIndexPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="shell py-16 md:py-24">
      <div className="flex flex-col gap-4 border-t border-ink pt-5 md:flex-row md:items-end md:justify-between">
        <div className="flex items-baseline gap-5">
          <span className="label-signal">[ Indeks ]</span>
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">Semua Karya</h1>
        </div>
        <span className="label">{String(projects.length).padStart(2, "0")} proyek</span>
      </div>

      <div className="mt-12 border-t border-rule">
        {projects.map((p, i) => (
          <ScrollReveal key={p.id}>
            <Link
              href={`/work/${p.slug}`}
              className="group grid grid-cols-1 gap-4 border-b border-rule py-8 transition-colors hover:bg-paper-dim/50 md:grid-cols-12 md:items-baseline"
            >
              <span className="font-mono text-sm text-signal md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="md:col-span-5">
                <h2 className="font-display text-2xl font-semibold leading-tight md:text-3xl">{p.title}</h2>
                <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-label text-ink-faint">
                  {p.projectType} · {p.year} · {p.clientType}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-ink-soft md:col-span-4">{p.shortDescription}</p>
              <div className="flex items-center justify-between md:col-span-2 md:justify-end">
                <span className="hidden font-mono text-[0.66rem] text-ink-faint lg:inline">
                  {p.technologies.slice(0, 2).map((t) => t.technology.name).join(" · ")}
                </span>
                <span className="ml-4 font-mono text-signal transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
        {projects.length === 0 ? (
          <p className="py-16 text-center font-mono text-sm text-ink-faint">Belum ada proyek yang dipublikasikan.</p>
        ) : null}
      </div>
    </div>
  );
}
