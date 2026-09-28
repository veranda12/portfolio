import "server-only";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { del, put } from "@vercel/blob";

// Pluggable storage. The rest of the app only depends on this interface, so
// swapping LOCAL for S3 / R2 / MinIO later means writing one new driver — no
// feature code changes. Metadata (the returned URL) is what gets persisted.

export interface StorageDriver {
  save(file: { buffer: Buffer; filename: string; contentType: string }): Promise<{ url: string }>;
  delete(url: string): Promise<void>;
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const PUBLIC_PREFIX = "/uploads";

function safeExt(filename: string): string {
  const ext = path.extname(filename).toLowerCase().replace(/[^.a-z0-9]/g, "");
  return ext && ext.length <= 6 ? ext : "";
}

const localDriver: StorageDriver = {
  async save({ buffer, filename }) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const id = crypto.randomBytes(10).toString("hex");
    const name = `${Date.now()}-${id}${safeExt(filename)}`;
    await fs.writeFile(path.join(UPLOAD_DIR, name), buffer);
    return { url: `${PUBLIC_PREFIX}/${name}` };
  },
  async delete(url) {
    if (!url.startsWith(PUBLIC_PREFIX)) return;
    const name = url.slice(PUBLIC_PREFIX.length + 1);
    if (!name || name.includes("..")) return;
    await fs.rm(path.join(UPLOAD_DIR, name), { force: true });
  },
};

// Vercel Blob — used in production, where the filesystem is read-only.
// Needs BLOB_READ_WRITE_TOKEN (set automatically when a Blob store is
// connected to the Vercel project). Returns absolute public URLs.
const blobDriver: StorageDriver = {
  async save({ buffer, filename, contentType }) {
    const id = crypto.randomBytes(10).toString("hex");
    const name = `uploads/${Date.now()}-${id}${safeExt(filename)}`;
    const blob = await put(name, buffer, { access: "public", contentType });
    return { url: blob.url };
  },
  async delete(url) {
    // Only touch Vercel Blob URLs; legacy /uploads/... paths are ignored.
    if (!/^https:\/\/[^/]+\.blob\.vercel-storage\.com\//.test(url)) return;
    await del(url);
  },
};

export function getStorage(): StorageDriver {
  switch (process.env.STORAGE_DRIVER) {
    case "blob":
      return blobDriver;
    case "local":
    default:
      return localDriver;
  }
}
