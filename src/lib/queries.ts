import { prisma } from "./db";
import type { Prisma } from "@prisma/client";
import type { Locale } from "@/i18n/config";
import {
  CAPABILITY_TEXT_FIELDS,
  IMAGE_TEXT_FIELDS,
  PROJECT_TEXT_FIELDS,
  SERVICE_TEXT_FIELDS,
  localizeRows,
} from "./translations";

// All public-site readers take an optional locale. Content is authored in
// Indonesian; for "en" the stored DeepL translations are overlaid, falling
// back to Indonesian wherever a translation doesn't exist yet.

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

const LIST_TEXT_FIELDS = ["title", "shortDescription", "category", "projectType", "clientType"] as const;

export async function getPublishedProjects(locale: Locale = "id"): Promise<ProjectListItem[]> {
  const rows = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
    select: projectListSelect,
  });
  return localizeRows(rows, LIST_TEXT_FIELDS, locale);
}

export async function getFeaturedProjects(locale: Locale = "id"): Promise<ProjectListItem[]> {
  const rows = await prisma.project.findMany({
    where: { published: true, featured: true },
    orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
    select: projectListSelect,
  });
  return localizeRows(rows, LIST_TEXT_FIELDS, locale);
}

/** Raw (Indonesian) project — used by the admin and as input to localizeProject. */
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

export async function localizeProject(project: FullProject, locale: Locale): Promise<FullProject> {
  if (locale === "id") return project;
  const [[p], capabilities, images] = await Promise.all([
    localizeRows([project], PROJECT_TEXT_FIELDS, locale),
    localizeRows(project.capabilities, CAPABILITY_TEXT_FIELDS, locale),
    localizeRows(project.images, IMAGE_TEXT_FIELDS, locale),
  ]);
  return { ...p, capabilities, images };
}

/** `category` must be the original (Indonesian) value — it's used for matching. */
export async function getRelatedProjects(
  slug: string,
  category: string,
  limit = 2,
  locale: Locale = "id"
): Promise<ProjectListItem[]> {
  const rows = await prisma.project.findMany({
    where: { published: true, slug: { not: slug }, category },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    take: limit,
    select: projectListSelect,
  });
  return localizeRows(rows, LIST_TEXT_FIELDS, locale);
}

export async function getPublishedSlugs(): Promise<string[]> {
  const rows = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function getServices(locale: Locale = "id") {
  const rows = await prisma.service.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return localizeRows(rows, SERVICE_TEXT_FIELDS, locale);
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
