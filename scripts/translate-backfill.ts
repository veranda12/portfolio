/**
 * Translate all existing admin content to English (DeepL) in one go.
 * Afterwards, every admin save translates new/edited text automatically.
 *
 *   $env:DATABASE_URL  = "<Neon DATABASE_URL_UNPOOLED>"   # or unset → local .env
 *   $env:DEEPL_API_KEY = "<your DeepL key>"
 *   npm run i18n:backfill
 *
 * Safe to re-run: already-translated text is skipped (no quota used).
 */
import { PrismaClient } from "@prisma/client";
import { SETTING_DEFAULTS } from "../src/lib/content";
import { TRANSLATABLE_SETTINGS, ensureTranslations } from "../src/lib/translations";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DEEPL_API_KEY) throw new Error("DEEPL_API_KEY is not set.");

  // Say which database is being filled — the usual mistake is running this
  // against the local DB (from .env) instead of production.
  let host = "(from .env)";
  try {
    if (process.env.DATABASE_URL) host = new URL(process.env.DATABASE_URL).host;
  } catch {}
  const local = host === "(from .env)" || /^(localhost|127\.0\.0\.1)(:|$)/.test(host);
  console.log(`Database: ${host}${local ? "  ← LOCAL database (set $env:DATABASE_URL for production)" : ""}`);

  const [projects, capabilities, images, services, settings] = await Promise.all([
    prisma.project.findMany(),
    prisma.projectCapability.findMany(),
    prisma.projectImage.findMany(),
    prisma.service.findMany(),
    prisma.siteSetting.findMany(),
  ]);

  const settingMap: Record<string, string> = { ...SETTING_DEFAULTS };
  for (const s of settings) settingMap[s.key] = s.value;

  const texts = [
    ...projects.flatMap((p) => [
      p.title, p.shortDescription, p.fullDescription, p.category, p.projectType, p.clientType, p.role,
      p.businessProblem, p.solution, p.technicalChallenges, p.technicalDecisions, p.outcome,
      p.caseStudyContent, p.seoTitle, p.seoDescription,
    ]),
    ...capabilities.flatMap((c) => [c.title, c.detail]),
    ...images.map((i) => i.alt),
    ...services.flatMap((s) => [s.title, s.summary, s.deliverables]),
    ...TRANSLATABLE_SETTINGS.map((k) => settingMap[k]),
  ];

  const chars = texts.reduce((n, t) => n + (t?.length ?? 0), 0);
  console.log(`Projects ${projects.length}, services ${services.length} — ${texts.filter(Boolean).length} texts, ~${chars.toLocaleString()} chars`);

  const result = await ensureTranslations(texts);
  if (result.skipped) throw new Error(result.skipped);
  console.log(`Done: ${result.translated} new translation(s); the rest were already translated.`);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
