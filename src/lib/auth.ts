import "server-only";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { getSession, createSession, destroySession, type SessionPayload } from "./session";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// Authenticate credentials and open a session. Returns null on failure.
export async function login(email: string, password: string): Promise<SessionPayload | null> {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) {
    // Constant-ish time: still run a hash comparison to reduce user enumeration.
    await bcrypt.compare(password, "$2a$12$0000000000000000000000000000000000000000000000000000");
    return null;
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;

  const payload: SessionPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
  await createSession(payload);
  return payload;
}

export async function logout(): Promise<void> {
  await destroySession();
}

// Guard for admin server components / actions. Redirects when unauthenticated.
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export { getSession };
