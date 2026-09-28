// Runs first in `vercel-build`. Reports which required env vars are present
// (never their values) and fails fast with a clear message if any is empty,
// instead of a cryptic Prisma/Next error halfway through the build.
const required = ["DATABASE_URL", "DATABASE_URL_UNPOOLED", "AUTH_SECRET", "STORAGE_DRIVER", "BLOB_READ_WRITE_TOKEN"];
const optional = ["NEXT_PUBLIC_SITE_URL"];

const env = process.env.VERCEL_ENV || "local";
const branch = process.env.VERCEL_GIT_COMMIT_REF || "-";
console.log(`[check-env] Vercel environment: ${env} (branch: ${branch})`);

const describe = (k) => {
  const v = process.env[k];
  if (v === undefined) return "NOT SET";
  if (v.trim() === "") return "EMPTY";
  return `ok (${v.length} chars)`;
};

let missing = [];
for (const k of required) {
  const d = describe(k);
  console.log(`[check-env]   ${k.padEnd(24)} ${d}`);
  if (!d.startsWith("ok")) missing.push(k);
}
for (const k of optional) console.log(`[check-env]   ${k.padEnd(24)} ${describe(k)} (optional)`);

// Not secret, so it's safe to echo. Must be a full URL like https://example.com.
const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
if (site && !/^https?:\/\/[^/\s]+\.[^/\s]+/i.test(site) && !/^https?:\/\/localhost/i.test(site)) {
  console.warn(
    `[check-env] WARNING: NEXT_PUBLIC_SITE_URL="${site}" is not a full URL (e.g. https://your-site.vercel.app).\n` +
      `[check-env]          Falling back to the Vercel production domain for canonical/OG/sitemap links.`
  );
}

if (missing.length) {
  console.error(
    `\n[check-env] Missing for the "${env}" environment: ${missing.join(", ")}.\n` +
      `[check-env] Vercel → Settings → Environment Variables: make sure each one exists,\n` +
      `[check-env] has a value, and has "${env === "local" ? "Production" : env}" ticked. Then redeploy.\n`
  );
  process.exit(1);
}
