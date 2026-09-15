import { prisma } from "./db";
import type { Prisma } from "@prisma/client";

const projectListSelect = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  category: true,
  projectType: true,
  year: true,
  clientType: true,
  featuredImage: true,
  layout: true,
  featured: true,
  sortOrder: true,
  technologies: {
    select: { technology: { select: { name: true } } },
    orderBy: { sortOrder: "asc" },
  },
} satisfies Prisma.ProjectSelect;

export type ProjectListItem = Prisma.ProjectGetPayload<{ select: typeof projectListSelect }>;

export async function getPublishedProjects(): Promise<ProjectListItem[]> {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
    select: projectListSelect,
  });
}

export async function getFeaturedProjects(): Promise<ProjectListItem[]> {
  return prisma.project.findMany({
    where: { published: true, featured: true },
    orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
    select: projectListSelect,
  });
}

export async function getProjectBySlug(slug: string, includeUnpublished = false) {
  return prisma.project.findFirst({
    where: { slug, ...(includeUnpublished ? {} : { published: true }) },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      capabilities: { orderBy: { sortOrder: "asc" } },
      technologies: {
        include: { technology: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export type FullProject = NonNullable<Awaited<ReturnType<typeof getProjectBySlug>>>;

export async function getRelatedProjects(
  slug: string,
  category: string,
  limit = 2
): Promise<ProjectListItem[]> {
  return prisma.project.findMany({
    where: { published: true, slug: { not: slug }, category },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    take: limit,
    select: projectListSelect,
  });
}

export async function getPublishedSlugs(): Promise<string[]> {
  const rows = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function getServices() {
  return prisma.service.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getTechnologiesByCategory() {
  const techs = await prisma.technology.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
  const order = ["Application", "Data", "Integration", "Infrastructure"];
  const grouped = new Map<string, string[]>();
  for (const t of techs) {
    if (!grouped.has(t.category)) grouped.set(t.category, []);
    grouped.get(t.category)!.push(t.name);
  }
  return order
    .filter((c) => grouped.has(c))
    .map((c) => ({ category: c, items: grouped.get(c)! }))
    .concat(
      [...grouped.keys()]
        .filter((c) => !order.includes(c))
        .map((c) => ({ category: c, items: grouped.get(c)! }))
    );
}

export async function getSocialLinks() {
  return prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } });
}
