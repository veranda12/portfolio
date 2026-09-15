import { prisma } from "@/lib/db";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { defaultEditorState } from "@/lib/adminProject";

export default async function NewProjectPage() {
  const [techs, agg] = await Promise.all([
    prisma.technology.findMany({ orderBy: { name: "asc" }, select: { name: true } }),
    prisma.project.aggregate({ _max: { sortOrder: true } }),
  ]);
  const nextSort = (agg._max.sortOrder ?? -1) + 1;

  return (
    <ProjectEditor
      projectId={null}
      initial={defaultEditorState(nextSort)}
      allTechnologies={techs.map((t) => t.name)}
    />
  );
}
