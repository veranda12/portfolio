// Absolute site origin for metadataBase, canonical/OG links, sitemap and robots.
//
// NEXT_PUBLIC_SITE_URL should be a full URL ("https://example.com"). A bare
// host ("example.com") gets https:// added. Anything that isn't a usable host
// (e.g. just "ren-codes") falls back to Vercel's production domain, then to
// localhost — so a typo in the env var can never break the build.
function normalize(raw: string | undefined): string | null {
  const value = raw?.trim().replace(/\/+$/, "");
  if (!value) return null;
  const withProto = /^https?:\/\//i.test(value)
    ? value
    : `${value.startsWith("localhost") ? "http" : "https"}://${value}`;
  try {
    const url = new URL(withProto);
    // Require a real domain (has a dot) unless it's localhost.
    if (url.hostname !== "localhost" && !url.hostname.includes(".")) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export const siteUrl: string =
  normalize(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalize(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  "http://localhost:3000";
