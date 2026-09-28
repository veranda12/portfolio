/**
 * Create an admin account, or reset its password if the email already exists.
 * Credentials come from environment variables — never from the repo.
 *
 *   $env:DATABASE_URL   = "<Neon DATABASE_URL_UNPOOLED>"   # or leave unset for local .env
 *   $env:ADMIN_EMAIL    = "you@example.com"
 *   $env:ADMIN_PASSWORD = "<at least 12 characters>"
 *   $env:ADMIN_NAME     = "Your Name"                     # optional
 *   npm run admin:user
 *
 * List existing accounts without changing anything:
 *   npm run admin:list
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function host(): string {
  try {
    return new URL(process.env.DATABASE_URL ?? "").host || "(from .env)";
  } catch {
    return "(from .env)";
  }
}

async function list() {
  const users = await prisma.user.findMany({
    select: { email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  console.log(`Database: ${host()} — ${users.length} admin account(s)`);
  for (const u of users) console.log(`  ${u.email}  (${u.name}, ${u.role}, since ${u.createdAt.toISOString().slice(0, 10)})`);
}

async function upsert() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  const name = process.env.ADMIN_NAME?.trim() || "Admin";
  if (!email || !email.includes("@")) throw new Error("Set ADMIN_EMAIL to a valid email.");
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  if (["admin12345", "change-me-in-production"].includes(password)) {
    throw new Error("That password is published in the repo's defaults — pick another.");
  }

  const passwordHash = await bcrypt.hash(password, 12); // same cost as src/lib/auth.ts
  const existing = await prisma.user.findUnique({ where: { email } });
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, name, passwordHash, role: "admin" },
  });
  console.log(`Database: ${host()}`);
  console.log(existing ? `Password reset for ${email}.` : `Created admin ${email}.`);
}

(process.argv.includes("--list") ? list() : upsert())
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
