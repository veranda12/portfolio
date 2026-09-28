"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { login, logout, requireAdmin } from "@/lib/auth";
import { getStorage } from "@/lib/storage";
import { projectSchema, serviceSchema, type ProjectInput, type ServiceInput } from "@/lib/validators";

// ---------------------------------------------------------------- Auth -------

export type ActionResult = { ok: boolean; error?: string };

export async function loginAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const from = String(formData.get("from") || "/admin");

  if (!email || !password) return { ok: false, error: "Email and password are required." };

  const session = await login(email, password);
  if (!session) return { ok: false, error: "Invalid email or password." };

  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect("/admin/login");
}

// ------------------------------------------------------------- Projects ------

function revalidateProject(slug?: string) {
  revalidatePath("/");
  revalidatePath("/work");
  // Capabilities links to projects by title; every case study lists related work.
  revalidatePath("/capabilities");
  revalidatePath("/work/[slug]", "page");
  revalidatePath("/admin/projects");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/work/${slug}`);
}

async function upsertTechnologies(names: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  for (const raw of names) {
    const name = raw.trim();
    if (!name) continue;
    const tech = await prisma.technology.upsert({
      where: { name },
      update: {},
      create: { name, category: "Application" },
    });
    map.set(name, tech.id);
  }
  return map;
}

export async function saveProject(
  id: string | null,
  input: ProjectInput
): Promise<{ ok: boolean; error?: string; id?: string; slug?: string }> {
  await requireAdmin();

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") };
  }
  const data = parsed.data;

  // Enforce unique slug (excluding self).
  const slugClash = await prisma.project.findFirst({
    where: { slug: data.slug, ...(id ? { id: { not: id } } : {}) },
    select: { id: true },
  });
  if (slugClash) return { ok: false, error: `Slug "${data.slug}" is already in use.` };

  const techMap = await upsertTechnologies(data.technologies);

  const scalar = {
    title: data.title,
    slug: data.slug,
    shortDescription: data.shortDescription,
    fullDescription: data.fullDescription,
    category: data.category,
    projectType: data.projectType,
    year: data.year,
    clientType: data.clientType,
    role: data.role,
    businessProblem: data.businessProblem,
    solution: data.solution,
    technicalChallenges: data.technicalChallenges,
    technicalDecisions: data.technicalDecisions,
    outcome: data.outcome,
    caseStudyContent: data.caseStudyContent,
    architectureText: data.architectureText,
    featuredImage: data.featuredImage || null,
    architectureImage: data.architectureImage || null,
    demoUrl: data.demoUrl || null,
    githubUrl: data.githubUrl || null,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    ogImage: data.ogImage || null,
    layout: data.layout,
    published: data.published,
    featured: data.featured,
    sortOrder: data.sortOrder,
  };

  const project = id
    ? await prisma.project.update({ where: { id }, data: scalar })
    : await prisma.project.create({ data: scalar });

  // Replace relations (simple + predictable).
  await prisma.projectTechnology.deleteMany({ where: { projectId: project.id } });
  await prisma.projectTechnology.createMany({
    data: data.technologies
      .map((n) => n.trim())
      .filter((n) => techMap.has(n))
      .map((n, idx) => ({ projectId: project.id, technologyId: techMap.get(n)!, sortOrder: idx })),
    skipDuplicates: true,
  });

  await prisma.projectCapability.deleteMany({ where: { projectId: project.id } });
  if (data.capabilities.length > 0) {
    await prisma.projectCapability.createMany({
      data: data.capabilities
        .filter((c) => c.title.trim())
        .map((c, idx) => ({ projectId: project.id, title: c.title, detail: c.detail, sortOrder: idx })),
    });
  }

  await prisma.projectImage.deleteMany({ where: { projectId: project.id } });
  if (data.images.length > 0) {
    await prisma.projectImage.createMany({
      data: data.images
        .filter((im) => im.url.trim())
        .map((im, idx) => ({
          projectId: project.id,
          url: im.url,
          alt: im.alt,
          kind: im.kind,
          sortOrder: idx,
        })),
    });
  }

  revalidateProject(project.slug);
  return { ok: true, id: project.id, slug: project.slug };
}

export async function deleteProject(id: string): Promise<void> {
  await requireAdmin();
  const project = await prisma.project.findUnique({ where: { id }, include: { images: true } });
  if (project) {
    const storage = getStorage();
    // best-effort cleanup of stored files (local or Blob)
    const urls = [project.featuredImage, project.architectureImage, project.ogImage, ...project.images.map((i) => i.url)]
      .filter((u): u is string => Boolean(u));
    for (const url of urls) {
      try {
        await storage.delete(url);
      } catch {
        /* ignore */
      }
    }
    await prisma.project.delete({ where: { id } });
  }
  revalidateProject();
  redirect("/admin/projects");
}

export async function togglePublish(id: string, next: boolean): Promise<void> {
  await requireAdmin();
  const p = await prisma.project.update({ where: { id }, data: { published: next } });
  revalidateProject(p.slug);
}

export async function toggleFeature(id: string, next: boolean): Promise<void> {
  await requireAdmin();
  const p = await prisma.project.update({ where: { id }, data: { featured: next } });
  revalidateProject(p.slug);
}

export async function moveProject(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin();
  const all = await prisma.project.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return;
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= all.length) return;

  const a = all[idx];
  const b = all[swapIdx];
  // normalize then swap to guarantee distinct order values
  await prisma.$transaction([
    prisma.project.update({ where: { id: a.id }, data: { sortOrder: swapIdx } }),
    prisma.project.update({ where: { id: b.id }, data: { sortOrder: idx } }),
  ]);
  revalidateProject();
  revalidatePath("/admin/projects");
}

// ------------------------------------------------------------- Messages ------

export async function setMessageStatus(id: string, status: "unread" | "read" | "archived"): Promise<void> {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { status } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(id: string): Promise<void> {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

// -------------------------------------------------------------- Services -----

export async function saveService(
  id: string | null,
  input: ServiceInput
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join("; ") };
  }
  const data = parsed.data;
  const clash = await prisma.service.findFirst({
    where: { slug: data.slug, ...(id ? { id: { not: id } } : {}) },
    select: { id: true },
  });
  if (clash) return { ok: false, error: `Slug "${data.slug}" already in use.` };

  if (id) await prisma.service.update({ where: { id }, data });
  else await prisma.service.create({ data });

  revalidatePath("/");
  revalidatePath("/admin/services");
  return { ok: true };
}

export async function deleteService(id: string): Promise<void> {
  await requireAdmin();
  await prisma.service.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/services");
}

// ----------------------------------------------------------- Site content ----

export async function updateSettings(formData: FormData): Promise<void> {
  await requireAdmin();
  const entries = Array.from(formData.entries()).filter(([k]) => k.startsWith("s:"));
  for (const [k, v] of entries) {
    const key = k.slice(2);
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(v) },
      create: { key, value: String(v) },
    });
  }
  revalidatePath("/", "layout"); // nav + footer appear on every page
  revalidatePath("/admin/content");
}

export async function saveSocialLink(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const data = {
    label: String(formData.get("label") || ""),
    url: String(formData.get("url") || ""),
    handle: String(formData.get("handle") || ""),
    sortOrder: Number(formData.get("sortOrder") || 0),
  };
  if (!data.label || !data.url) return;
  if (id) await prisma.socialLink.update({ where: { id }, data });
  else await prisma.socialLink.create({ data });
  revalidatePath("/", "layout"); // nav + footer appear on every page
  revalidatePath("/admin/content");
}

export async function deleteSocialLink(id: string): Promise<void> {
  await requireAdmin();
  await prisma.socialLink.delete({ where: { id } });
  revalidatePath("/", "layout"); // nav + footer appear on every page
  revalidatePath("/admin/content");
}
