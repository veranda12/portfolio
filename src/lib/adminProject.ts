import type { EditorState } from "@/components/admin/ProjectEditor";
import type { FullProject } from "@/lib/queries";

export function defaultEditorState(nextSortOrder: number): EditorState {
  return {
    title: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    category: "Business Application",
    projectType: "",
    year: new Date().getFullYear(),
    clientType: "Confidential",
    role: "Full-Stack Engineer",
    businessProblem: "",
    solution: "",
    technicalChallenges: "",
    technicalDecisions: "",
    outcome: "",
    caseStudyContent: "",
    architectureText: "",
    featuredImage: null,
    architectureImage: null,
    demoUrl: "",
    githubUrl: "",
    seoTitle: "",
    seoDescription: "",
    ogImage: null,
    layout: "standard",
    published: false,
    featured: false,
    sortOrder: nextSortOrder,
    technologies: [],
    capabilities: [],
    images: [],
  };
}

export function toEditorState(p: FullProject): EditorState {
  return {
    title: p.title,
    slug: p.slug,
    shortDescription: p.shortDescription,
    fullDescription: p.fullDescription,
    category: p.category,
    projectType: p.projectType,
    year: p.year,
    clientType: p.clientType,
    role: p.role,
    businessProblem: p.businessProblem,
    solution: p.solution,
    technicalChallenges: p.technicalChallenges,
    technicalDecisions: p.technicalDecisions,
    outcome: p.outcome,
    caseStudyContent: p.caseStudyContent,
    architectureText: p.architectureText,
    featuredImage: p.featuredImage,
    architectureImage: p.architectureImage,
    demoUrl: p.demoUrl ?? "",
    githubUrl: p.githubUrl ?? "",
    seoTitle: p.seoTitle ?? "",
    seoDescription: p.seoDescription ?? "",
    ogImage: p.ogImage,
    layout: p.layout,
    published: p.published,
    featured: p.featured,
    sortOrder: p.sortOrder,
    technologies: p.technologies.map((t) => t.technology.name),
    capabilities: p.capabilities.map((c) => ({ title: c.title, detail: c.detail })),
    images: p.images
      .filter((im) => im.kind === "gallery")
      .map((im) => ({ url: im.url, alt: im.alt, kind: "gallery" as const })),
  };
}
