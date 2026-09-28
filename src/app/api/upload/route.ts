import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getStorage } from "@/lib/storage";

// Vercel caps serverless request bodies at 4.5MB, so stay under it.
const MAX_BYTES = 4 * 1024 * 1024; // 4MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml"];
 
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 4MB)." }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const storage = getStorage();
  const { url } = await storage.save({
    buffer,
    filename: file.name || "upload",
    contentType: file.type,
  });

  return NextResponse.json({ url });
}
