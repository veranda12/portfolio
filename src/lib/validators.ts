import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Mohon isi nama Anda").max(120),
  company: z.string().max(160).optional().default(""),
  email: z.string().email("Masukkan email yang valid"),
  projectType: z.string().max(120).optional().default(""),
  budgetRange: z.string().max(120).optional().default(""),
  message: z.string().min(10, "Ceritakan sedikit lebih detail (min. 10 karakter)").max(4000),
});

export const LAYOUTS = ["standard", "flagship", "split", "horizontal", "compact"] as const;

export const capabilitySchema = z.object({
  title: z.string().min(1),
  detail: z.string().optional().default(""),
});

export const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().optional().default(""),
  kind: z.enum(["gallery", "featured", "architecture"]).default("gallery"),
});

export const projectSchema = z.object({
  title: z.string().min(2, "Title is required").max(160),
  slug: z
    .string()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens"),
  shortDescription: z.string().min(1).max(400),
  fullDescription: z.string().default(""),
  category: z.string().min(1).max(80),
  projectType: z.string().min(1).max(80),
  year: z.coerce.number().int().min(2000).max(2100),
  clientType: z.string().min(1).max(120),
  role: z.string().max(120).default("Full-Stack Engineer"),

  businessProblem: z.string().default(""),
  solution: z.string().default(""),
  technicalChallenges: z.string().default(""),
  technicalDecisions: z.string().default(""),
  outcome: z.string().default(""),
  caseStudyContent: z.string().default(""),
  architectureText: z.string().default(""),

  featuredImage: z.string().optional().nullable(),
  architectureImage: z.string().optional().nullable(),
  demoUrl: z.string().url().optional().or(z.literal("")).nullable(),
  githubUrl: z.string().url().optional().or(z.literal("")).nullable(),

  seoTitle: z.string().max(200).optional().nullable(),
  seoDescription: z.string().max(400).optional().nullable(),
  ogImage: z.string().optional().nullable(),

  layout: z.enum(LAYOUTS).default("standard"),
  published: z.coerce.boolean().default(false),
  featured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),

  technologies: z.array(z.string()).default([]),
  capabilities: z.array(capabilitySchema).default([]),
  images: z.array(imageSchema).default([]),
});

export const serviceSchema = z.object({
  title: z.string().min(2).max(120),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().min(1),
  detail: z.string().default(""),
  deliverables: z.string().default(""),
  sortOrder: z.coerce.number().int().default(0),
  published: z.coerce.boolean().default(true),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
