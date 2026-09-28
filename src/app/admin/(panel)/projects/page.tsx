import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProjectRowActions } from "@/components/admin/ProjectRowActions";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      projectType: true,
      year: true,
      published: true,
      featured: true,
      layout: true,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between border-b border-rule pb-6">
        <div>
          <p className="font-mono text-[0.66rem] uppercase tracking-label text-signal">Content</p>
          <h1 className="mt-2 font-display text-3xl font-bold">Projects</h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-signal px-5 py-3 font-mono text-xs uppercase tracking-label text-white hover:opacity-90"
        >
          + New
        </Link>
      </div>

      <p className="mt-4 font-mono text-[0.66rem] text-ink-faint">
        {projects.length} project{projects.length !== 1 ? "s" : ""} · order controls the public
        listing sequence
      </p>

      <div className="mt-4 divide-y divide-rule border border-rule">
        {projects.map((p, i) => (
          <div key={p.id} className="flex flex-col gap-3 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-baseline gap-3">
              <span className="font-mono text-xs text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="block truncate font-display text-base font-semibold text-ink hover:text-signal"
                >
                  {p.title}
                </Link>
                <p className="font-mono text-[0.62rem] text-ink-faint">
                  {p.projectType} · {p.year} · <span className="text-ink-faint">{p.layout}</span> ·{" "}
                  <span className="text-ink-faint">/{p.slug}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ProjectRowActions
                id={p.id}
                published={p.published}
                featured={p.featured}
                isFirst={i === 0}
                isLast={i === projects.length - 1}
              />
              <Link
                href={`/admin/projects/${p.id}`}
                className="border border-rule px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-label text-ink-soft hover:border-signal hover:text-ink"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
        {projects.length === 0 ? (
          <p className="bg-white px-4 py-10 text-center font-mono text-xs text-ink-faint">
            No projects yet.{" "}
            <Link href="/admin/projects/new" className="text-signal">
              Create the first →
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
