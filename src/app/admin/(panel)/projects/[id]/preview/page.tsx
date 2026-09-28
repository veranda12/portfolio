import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getRelatedProjects } from "@/lib/queries";
import { CaseStudy } from "@/components/CaseStudy";

// Preview renders the case study for an unpublished draft, inside the admin.
export const dynamic = "force-dynamic";

export default async function ProjectPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      capabilities: { orderBy: { sortOrder: "asc" } },
      technologies: { include: { technology: true }, orderBy: { sortOrder: "asc" } },
    },
  });
  if (!project) notFound();

  const related = await getRelatedProjects(project.slug, project.category, 2);

  return (
    <div className="bg-paper text-ink">
      <div className="sticky top-0 z-50 flex items-center justify-between bg-signal px-5 py-2 text-white">
        <span className="font-mono text-[0.66rem] uppercase tracking-label">
          Preview — {project.published ? "published" : "draft (not public)"}
        </span>
        <Link href={`/admin/projects/${project.id}`} className="font-mono text-[0.66rem] uppercase tracking-label underline">
          ← Back to editor
        </Link>
      </div>
      <div className="theme-site">
        <CaseStudy project={project} related={related} index={1} />
      </div>
    </div>
  );
}
