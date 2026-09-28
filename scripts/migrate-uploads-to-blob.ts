/**
 * One-off: move images referenced by the database from /public/uploads to
 * Vercel Blob, then rewrite those database URLs to the Blob URLs.
 *
 * Run it against the PRODUCTION database (Neon), from this machine, where the
 * original files live:
 *
 *   $env:DATABASE_URL = "<Neon DATABASE_URL_UNPOOLED>"
 *   $env:BLOB_READ_WRITE_TOKEN = "<token from Vercel>"
 *   npm run blob:migrate -- --dry     # show the plan, change nothing
 *   npm run blob:migrate              # upload + rewrite
 *
 * Safe to re-run: rows already pointing at Blob are left alone, and uploads
 * overwrite the same pathname instead of creating duplicates.
 */
import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";

const DRY = process.argv.includes("--dry");
const ALLOW_LOCAL = process.argv.includes("--allow-local");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const PREFIX = "/uploads/";

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".jfif": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

const isLocal = (u: string | null | undefined): u is string => !!u && u.startsWith(PREFIX);

async function main() {
  const dbUrl = process.env.DATABASE_URL ?? "";
  const host = (() => {
    try {
      return new URL(dbUrl).host;
    } catch {
      return "";
    }
  })();
  if (!host) throw new Error("DATABASE_URL is not set.");
  if (/^(localhost|127\.0\.0\.1)(:|$)/.test(host) && !ALLOW_LOCAL) {
    throw new Error(`DATABASE_URL points at ${host}. Set it to the production (Neon) URL, or pass --allow-local.`);
  }
  if (!DRY && !process.env.BLOB_READ_WRITE_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN is not set.");

  console.log(`${DRY ? "[dry run] " : ""}Database: ${host}`);
  const prisma = new PrismaClient();

  try {
    const projects = await prisma.project.findMany({
      select: { id: true, featuredImage: true, architectureImage: true, ogImage: true },
    });
    const images = await prisma.projectImage.findMany({ select: { id: true, url: true } });
    const settings = await prisma.siteSetting.findMany();

    const urls = new Set<string>();
    for (const p of projects) [p.featuredImage, p.architectureImage, p.ogImage].filter(isLocal).forEach((u) => urls.add(u));
    for (const i of images) if (isLocal(i.url)) urls.add(i.url);
    for (const s of settings) if (isLocal(s.value)) urls.add(s.value);

    console.log(`Found ${urls.size} local image URL(s) in the database.`);
    if (urls.size === 0) return;

    // 1) Upload each referenced file once.
    const map = new Map<string, string>();
    for (const url of urls) {
      const name = url.slice(PREFIX.length);
      const file = path.join(UPLOAD_DIR, name);
      if (name.includes("..")) continue;
      let buffer: Buffer;
      try {
        buffer = await fs.readFile(file);
      } catch {
        console.warn(`  ! missing on disk, skipped: ${url}`);
        continue;
      }
      if (DRY) {
        console.log(`  would upload ${url} (${(buffer.length / 1024).toFixed(0)} KB)`);
        continue;
      }
      const blob = await put(`uploads/${name}`, buffer, {
        access: "public",
        contentType: CONTENT_TYPES[path.extname(name).toLowerCase()] ?? "application/octet-stream",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      map.set(url, blob.url);
      console.log(`  uploaded ${url} -> ${blob.url}`);
    }
    if (DRY) return;

    // 2) Rewrite database references.
    let updated = 0;
    for (const p of projects) {
      const data: Record<string, string> = {};
      for (const key of ["featuredImage", "architectureImage", "ogImage"] as const) {
        const v = p[key];
        if (isLocal(v) && map.has(v)) data[key] = map.get(v)!;
      }
      if (Object.keys(data).length) {
        await prisma.project.update({ where: { id: p.id }, data });
        updated++;
      }
    }
    for (const i of images) {
      if (isLocal(i.url) && map.has(i.url)) {
        await prisma.projectImage.update({ where: { id: i.id }, data: { url: map.get(i.url)! } });
        updated++;
      }
    }
    for (const s of settings) {
      if (isLocal(s.value) && map.has(s.value)) {
        await prisma.siteSetting.update({ where: { key: s.key }, data: { value: map.get(s.value)! } });
        updated++;
      }
    }
    console.log(`Done: ${map.size} file(s) uploaded, ${updated} row(s) updated.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
