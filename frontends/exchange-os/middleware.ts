import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { HOST_TO_CANONICAL_PATH } from "@/data/troptions-branded-domains";

const SESSION_COOKIE = "troptions_session";
const LOGIN_PATH = "/troptions/auth/login";

function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, "");
}

export function middleware(request: NextRequest) {
  const host = normalizeHost(request.headers.get("host") ?? "");
  const pathname = request.nextUrl.pathname;

  // Branded domain root → canonical vertical path (Option B lite)
  const canonicalPath = HOST_TO_CANONICAL_PATH[host];
  if (
    canonicalPath &&
    canonicalPath !== "/" &&
    (pathname === "/" || pathname === "")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = canonicalPath;
    return NextResponse.redirect(url);
  }

  const session = request.cookies.get(SESSION_COOKIE);
  const isGated =
    pathname.startsWith("/troptions/gated") || pathname.startsWith("/portal");

  if (isGated && !session?.value) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
  // Next.js 16 changed the default middleware runtime to Node.js.
  // Cloudflare Workers requires edge runtime. Explicit declaration required.
  runtime: "edge",
};
