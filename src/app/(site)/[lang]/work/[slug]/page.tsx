import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getRelatedProjects,
  getPublishedSlugs,
  localizeProject,
} from "@/lib/queries";
import { CaseStudy } from "@/components/CaseStudy";
import { getDictionary, lp, type Locale } from "@/i18n";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const raw = await getProjectBySlug(slug);
  if (!raw) return { title: getDictionary(lang).meta.notFoundTitle };
  const project = await localizeProject(raw, lang);

  const title = project.seoTitle || project.title;
  const description = project.seoDescription || project.shortDescription;
  const image = project.ogImage || project.featuredImage || undefined;
  const path = lp(lang, `/work/${project.slug}`);

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: { id: `/work/${project.slug}`, en: `/en/work/${project.slug}` },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: path,
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
  params: Promise<{ lang: Locale; slug: string }>;
}) {
  const { lang, slug } = await params;
  const raw = await getProjectBySlug(slug);
  if (!raw) notFound();

  // Related work is matched on the original (Indonesian) category.
  const [project, related, allSlugs] = await Promise.all([
    localizeProject(raw, lang),
    getRelatedProjects(slug, raw.category, 2, lang),
    getPublishedSlugs(),
  ]);
  const index = Math.max(1, allSlugs.indexOf(slug) + 1);

  return <CaseStudy project={project} related={related} index={index} lang={lang} />;
}
