import { SignJWT, jwtVerify } from "jose";

// Edge-safe JWT helpers — uses `jose` only (no next/headers, no node crypto),
// so this module can be imported from middleware as well as server code.

export const SESSION_COOKIE = "portfolio_session";
export const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
};

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET is missing or too short (need >= 32 chars). See .env.example.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
