// Public-site languages. Indonesian is the default and keeps the original,
// unprefixed URLs (/work/...); English lives under /en (/en/work/...).
// The admin panel is Indonesian-only and is not localized.

export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/**
 * Localized path for an internal link. Accepts "/", "/work", "/#contact",
 * "/work/slug#x". Indonesian paths are returned unchanged.
 */
export function lp(lang: Locale, path: string): string {
  if (lang === defaultLocale) return path;
  if (path === "/") return "/en";
  if (path.startsWith("/#")) return `/en${path.slice(1)}`;
  return `/en${path}`;
}

/**
 * Strip a leading locale segment from a pathname (for the language switcher
 * and active-link checks). Handles /id too: during server rendering
 * usePathname() can return the middleware's internal rewrite (/id/...).
 */
export function stripLocale(pathname: string): string {
  for (const l of locales) {
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname;
}

export const ogLocale: Record<Locale, string> = { id: "id_ID", en: "en_US" };
