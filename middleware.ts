import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protège /arbre (et ses sous-pages)
  if (pathname.startsWith("/arbre")) {
    const ok = req.cookies.get("famille_access")?.value === "ok";
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/acces";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/arbre/:path*"],
};
