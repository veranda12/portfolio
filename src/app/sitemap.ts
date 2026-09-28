import type { MetadataRoute } from "next";
import { getPublishedSlugs } from "@/lib/queries";
import { siteUrl as base } from "@/lib/site-url";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

// Every page is listed in both languages, each entry pointing at its
// counterpart via hreflang alternates (Indonesian at /, English at /en).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPublishedSlugs();

  const pages: { path: string; changeFrequency: Freq; priority: number }[] = [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    { path: "/work", changeFrequency: "weekly", priority: 0.8 },
    { path: "/capabilities", changeFrequency: "monthly", priority: 0.7 },
    ...slugs.map((slug) => ({ path: `/work/${slug}`, changeFrequency: "monthly" as Freq, priority: 0.7 })),
  ];

  const url = (lang: "id" | "en", path: string) =>
    lang === "id" ? `${base}${path}` : `${base}/en${path === "/" ? "" : path}`;

  return pages.flatMap(({ path, changeFrequency, priority }) => {
    const languages = { id: url("id", path), en: url("en", path) };
    return (["id", "en"] as const).map((lang) => ({
      url: url(lang, path),
      changeFrequency,
      priority: lang === "id" ? priority : Math.max(0.1, priority - 0.1),
      alternates: { languages },
    }));
  });
}
