import "server-only";
import { cookies } from "next/headers";
import {
  signSession,
  verifyToken,
  SESSION_COOKIE,
  MAX_AGE_SECONDS,
  type SessionPayload,
} from "./jwt";

// Cookie-bound session helpers (server components / actions / route handlers).
// Pure JWT logic lives in ./jwt so middleware can stay edge-safe.

export type { SessionPayload };
export { SESSION_COOKIE, verifyToken };

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await signSession(payload);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
