// Server-side only (uses Prisma + the DeepL key). Not marked `server-only` so
// scripts/translate-backfill.ts can run it from the command line.
import crypto from "crypto";
import { prisma } from "./db";
import type { Locale } from "@/i18n/config";

// Machine translation of admin-authored Indonesian content via DeepL, stored as
// a translation memory: one row per distinct source text, keyed by its hash.
// - Unchanged text is never re-translated (no wasted quota).
// - Edited text gets a new hash → translated on the next save.
// - Rows re-created by the admin (e.g. project capabilities) reuse translations.
// If DEEPL_API_KEY is missing or DeepL fails, pages simply fall back to Indonesian.

const ENTITY = "tm";
const FIELD = "text";
const TARGET: Record<Exclude<Locale, "id">, string> = { en: "EN-US" };

const hash = (text: string) => crypto.createHash("sha256").update(text).digest("hex");
const usable = (t: unknown): t is string => typeof t === "string" && t.trim().length > 0;

function deeplEndpoint(key: string) {
  // Free-plan keys end with ":fx" and use a different host.
  return key.endsWith(":fx") ? "https://api-free.deepl.com/v2/translate" : "https://api.deepl.com/v2/translate";
}

async function deeplTranslate(texts: string[], locale: Exclude<Locale, "id">): Promise<string[]> {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error("DEEPL_API_KEY is not set");
  const res = await fetch(deeplEndpoint(key), {
    method: "POST",
    headers: { Authorization: `DeepL-Auth-Key ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      text: texts,
      source_lang: "ID",
      target_lang: TARGET[locale],
      // Keep paragraph / list line breaks exactly as written in the admin.
      split_sentences: "nonewlines",
      preserve_formatting: true,
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`DeepL ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = (await res.json()) as { translations: { text: string }[] };
  return json.translations.map((t) => t.text);
}

/**
 * Make sure every given Indonesian text has a stored translation. Called after
 * admin saves and by the backfill script. Never throws — returns a summary.
 */
export async function ensureTranslations(
  texts: Array<string | null | undefined>,
  locale: Exclude<Locale, "id"> = "en"
): Promise<{ translated: number; skipped: string | null }> {
  const unique = [...new Set(texts.filter(usable))];
  if (unique.length === 0) return { translated: 0, skipped: null };
  if (!process.env.DEEPL_API_KEY) return { translated: 0, skipped: "DEEPL_API_KEY not set" };

  try {
    const byHash = new Map(unique.map((t) => [hash(t), t]));
    const existing = await prisma.translation.findMany({
      where: { entity: ENTITY, field: FIELD, locale, entityId: { in: [...byHash.keys()] } },
      select: { entityId: true },
    });
    for (const row of existing) byHash.delete(row.entityId);
    const missing = [...byHash.entries()];
    if (missing.length === 0) return { translated: 0, skipped: null };

    // DeepL accepts up to 50 texts per request.
    let translated = 0;
    for (let i = 0; i < missing.length; i += 50) {
      const chunk = missing.slice(i, i + 50);
      const out = await deeplTranslate(chunk.map(([, t]) => t), locale);
      await prisma.$transaction(
        chunk.map(([h], j) =>
          prisma.translation.upsert({
            where: { entity_entityId_field_locale: { entity: ENTITY, entityId: h, field: FIELD, locale } },
            update: { value: out[j], sourceHash: h },
            create: { entity: ENTITY, entityId: h, field: FIELD, locale, value: out[j], sourceHash: h },
          })
        )
      );
      translated += chunk.length;
    }
    return { translated, skipped: null };
  } catch (e) {
    console.error("[translations]", e);
    return { translated: 0, skipped: e instanceof Error ? e.message : "translation failed" };
  }
}

/** Look up stored translations for a set of Indonesian texts. */
export async function translationMap(
  texts: Array<string | null | undefined>,
  locale: Locale
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (locale === "id") return map;
  const unique = [...new Set(texts.filter(usable))];
  if (unique.length === 0) return map;
  const byHash = new Map(unique.map((t) => [hash(t), t]));
  const rows = await prisma.translation.findMany({
    where: { entity: ENTITY, field: FIELD, locale, entityId: { in: [...byHash.keys()] } },
    select: { entityId: true, value: true },
  });
  for (const r of rows) {
    const source = byHash.get(r.entityId);
    if (source) map.set(source, r.value);
  }
  return map;
}

/**
 * Return copies of `rows` with the given string fields replaced by their
 * translation (falling back to the original when none exists).
 */
export async function localizeRows<T extends Record<string, unknown>, K extends keyof T>(
  rows: T[],
  fields: readonly K[],
  locale: Locale
): Promise<T[]> {
  if (locale === "id" || rows.length === 0) return rows;
  const texts = rows.flatMap((r) => fields.map((f) => r[f] as unknown as string | null | undefined));
  const map = await translationMap(texts, locale);
  return rows.map((r) => {
    const copy = { ...r };
    for (const f of fields) {
      const v = r[f];
      if (usable(v) && map.has(v)) (copy as Record<K, unknown>)[f] = map.get(v);
    }
    return copy;
  });
}

// Which admin-authored fields get translated.
export const PROJECT_TEXT_FIELDS = [
  "title",
  "shortDescription",
  "fullDescription",
  "category",
  "projectType",
  "clientType",
  "role",
  "businessProblem",
  "solution",
  "technicalChallenges",
  "technicalDecisions",
  "outcome",
  "caseStudyContent",
  "seoTitle",
  "seoDescription",
] as const;
export const CAPABILITY_TEXT_FIELDS = ["title", "detail"] as const;
export const IMAGE_TEXT_FIELDS = ["alt"] as const;
export const SERVICE_TEXT_FIELDS = ["title", "summary", "deliverables"] as const;

// Site settings that are prose (emails, numbers, names are left as-is).
export const TRANSLATABLE_SETTINGS = [
  "hero.kicker",
  "hero.line1",
  "hero.line2",
  "hero.statement",
  "hero.availability",
  "about.heading",
  "about.body",
  "about.principle1",
  "about.principle2",
  "about.principle3",
  "contact.heading",
  "contact.body",
  "contact.location",
  "contact.consultation",
  "contact.whatsappText",
  "site.role",
  "footer.note",
] as const;
