import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { toEditorState } from "@/lib/adminProject";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, techs] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        capabilities: { orderBy: { sortOrder: "asc" } },
        technologies: { include: { technology: true }, orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.technology.findMany({ orderBy: { name: "asc" }, select: { name: true } }),
  ]);

  if (!project) notFound();

  return (
    <ProjectEditor
      projectId={project.id}
      initial={toEditorState(project)}
      allTechnologies={techs.map((t) => t.name)}
    />
  );
}
