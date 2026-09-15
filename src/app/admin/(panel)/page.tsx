import Link from "next/link";
import { prisma } from "@/lib/db";

async function getStats() {
  const [total, published, draft, featured, unread, recent] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.project.count({ where: { published: false } }),
    prisma.project.count({ where: { featured: true } }),
    prisma.contactMessage.count({ where: { status: "unread" } }),
    prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, published: true, updatedAt: true, projectType: true },
    }),
  ]);
  return { total, published, draft, featured, unread, recent };
}

export default async function DashboardPage() {
  const s = await getStats();

  const stats = [
    { label: "Total projects", value: s.total, href: "/admin/projects" },
    { label: "Published", value: s.published, href: "/admin/projects" },
    { label: "Drafts", value: s.draft, href: "/admin/projects" },
    { label: "Featured", value: s.featured, href: "/admin/projects" },
  ];

  return (
    <div>
      <div className="flex flex-col gap-2 border-b border-console-line pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[0.66rem] uppercase tracking-label text-signal">Overview</p>
          <h1 className="mt-2 font-display text-3xl font-bold">Dashboard</h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 self-start bg-signal px-5 py-3 font-mono text-xs uppercase tracking-label text-paper transition-opacity hover:opacity-90 md:self-auto"
        >
          + New project
        </Link>
      </div>

      {/* Stat tiles */}
      <div className="mt-6 grid grid-cols-2 gap-px border border-console-line bg-console-line lg:grid-cols-4">
        {stats.map((st) => (
          <Link key={st.label} href={st.href} className="group bg-console p-5 transition-colors hover:bg-console-2">
            <p className="font-mono text-[0.62rem] uppercase tracking-label text-paper/50">{st.label}</p>
            <p className="mt-3 font-display text-4xl font-bold text-paper group-hover:text-signal">{st.value}</p>
          </Link>
        ))}
      </div>

      {/* Unread messages callout */}
      <Link
        href="/admin/messages"
        className="mt-6 flex items-center justify-between border border-console-line bg-console p-5 transition-colors hover:border-signal"
      >
        <div className="flex items-center gap-3">
          {s.unread > 0 ? <span className="h-2 w-2 rounded-full bg-signal" aria-hidden /> : null}
          <span className="font-mono text-sm text-paper/80">
            {s.unread > 0 ? `${s.unread} unread message${s.unread > 1 ? "s" : ""}` : "No unread messages"}
          </span>
        </div>
        <span className="font-mono text-xs text-signal">Open inbox →</span>
      </Link>

      {/* Quick actions */}
      <div className="mt-8">
        <p className="font-mono text-[0.66rem] uppercase tracking-label text-paper/50">Quick actions</p>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["New project", "/admin/projects/new"],
            ["Manage projects", "/admin/projects"],
            ["Manage services", "/admin/services"],
            ["Site content", "/admin/content"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="border border-console-line bg-console p-4 font-mono text-xs uppercase tracking-label text-paper/70 transition-colors hover:border-signal hover:text-paper"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent projects */}
      <div className="mt-8">
        <p className="font-mono text-[0.66rem] uppercase tracking-label text-paper/50">Recently updated</p>
        <div className="mt-4 divide-y divide-console-line border border-console-line">
          {s.recent.map((p) => (
            <Link
              key={p.id}
              href={`/admin/projects/${p.id}`}
              className="flex items-center justify-between gap-4 bg-console px-4 py-3 transition-colors hover:bg-console-2"
            >
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold text-paper">{p.title}</p>
                <p className="font-mono text-[0.62rem] text-paper/40">{p.projectType}</p>
              </div>
              <span
                className={`shrink-0 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-label ${
                  p.published ? "bg-signal/15 text-signal" : "bg-console-2 text-paper/40"
                }`}
              >
                {p.published ? "Live" : "Draft"}
              </span>
            </Link>
          ))}
          {s.recent.length === 0 ? (
            <p className="bg-console px-4 py-6 text-center font-mono text-xs text-paper/40">
              No projects yet.{" "}
              <Link href="/admin/projects/new" className="text-signal">
                Create one →
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
