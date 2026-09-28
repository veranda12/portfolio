import { NextResponse, type NextRequest } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/jwt";

// 1. /admin/*  — auth gate (unchanged). The login page stays open.
// 2. Public site — i18n routing. Pages live under app/(site)/[lang]:
//      /en, /en/...   → served as-is (English)
//      /id, /id/...   → 308 to the unprefixed URL (Indonesian is canonical there)
//      everything else → rewritten internally to /id/... (URL stays the same)
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return adminGate(request, pathname);
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  if (pathname === "/id" || pathname.startsWith("/id/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/id${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

async function adminGate(request: NextRequest, pathname: string) {
  const isLogin = pathname === "/admin/login";
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (session && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except API routes, Next internals and files with an extension
  // (sitemap.xml, robots.txt, icons, images, fonts, …).
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
