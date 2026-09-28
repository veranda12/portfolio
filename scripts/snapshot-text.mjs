// Redesign QA: capture every visible text node, headings, and SEO meta for each
// public page, so the post-redesign output can be diffed against the baseline.
//
// Usage (dev/prod server must be running):
//   node scripts/snapshot-text.mjs <outDir> [baseUrl]
//   node scripts/snapshot-text.mjs .redesign/before
//   node scripts/snapshot-text.mjs .redesign/after
//   git diff --no-index .redesign/before .redesign/after
import puppeteer from "puppeteer-core";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = process.argv[2] || ".redesign/before";
const base = (process.argv[3] || "http://localhost:3000").replace(/\/$/, "");
const chrome =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

async function load(url) {
  await page.goto(url, { waitUntil: "networkidle0" });
  // Open every <details> so collapsed FAQ answers are captured too.
  await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
}

// Discover case-study slugs from the sitemap so every project page is covered.
await page.goto(`${base}/sitemap.xml`);
const sitemap = await page.content();
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
routes.push("/this-page-does-not-exist");

await mkdir(outDir, { recursive: true });

for (const route of routes) {
  await load(base + route);
  const data = await page.evaluate(() => {
    const meta = {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content ?? null,
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
      og: [...document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]')].map(
        (m) => `${m.getAttribute("property") || m.getAttribute("name")}=${m.content}`
      ),
      jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent),
    };
    const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(
      (h) => `${h.tagName.toLowerCase()}: ${h.textContent.replace(/\s+/g, " ").trim()}`
    );
    // Visible text, one normalised run per line, excluding script/style.
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const el = n.parentElement;
        if (!el || el.closest("script,style,noscript,template")) return NodeFilter.FILTER_REJECT;
        return n.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    const text = [];
    while (walker.nextNode()) text.push(walker.currentNode.textContent.replace(/\s+/g, " ").trim());
    const alts = [...document.querySelectorAll("img[alt]")].map((i) => i.alt);
    const links = [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));
    const aria = [...document.querySelectorAll("[aria-label]")].map((e) => e.getAttribute("aria-label"));
    return { meta, headings, text, alts, links, aria };
  });

  const name = route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "__");
  const body = [
    `# ${route}`,
    "",
    "## meta",
    JSON.stringify(data.meta, null, 2),
    "",
    "## headings",
    ...data.headings,
    "",
    "## text (sorted, unique — layout-order independent)",
    ...[...new Set(data.text)].sort(),
    "",
    "## img alt",
    ...[...new Set(data.alts)].sort(),
    "",
    "## aria-label",
    ...[...new Set(data.aria)].sort(),
    "",
    "## links",
    ...[...new Set(data.links)].sort(),
    "",
  ].join("\n");
  await writeFile(path.join(outDir, `${name}.txt`), body, "utf8");
  console.log(`✓ ${route} (${data.text.length} text runs, ${data.headings.length} headings)`);
}

await browser.close();
