import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validators";
 
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { error: "Periksa kembali kolom yang ditandai.", fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;
  await prisma.contactMessage.create({
    data: {
      name: data.name,
      company: data.company ?? "",
      email: data.email,
      projectType: data.projectType ?? "",
      budgetRange: data.budgetRange ?? "",
      message: data.message,
    },
  });

  return NextResponse.json({ ok: true });
}
