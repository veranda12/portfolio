import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getRelatedProjects, getPublishedSlugs } from "@/lib/queries";
import { CaseStudy } from "@/components/CaseStudy";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Not found" };

  const title = project.seoTitle || project.title;
  const description = project.seoDescription || project.shortDescription;
  const image = project.ogImage || project.featuredImage || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/work/${project.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = await getRelatedProjects(slug, project.category, 2);
  const allSlugs = await getPublishedSlugs();
  const index = Math.max(1, allSlugs.indexOf(slug) + 1);

  return <CaseStudy project={project} related={related} index={index} />;
}
