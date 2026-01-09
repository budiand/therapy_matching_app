import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const userId = req.cookies.get("tm_uid")?.value;
  const therapistId = req.cookies.get("tm_tid")?.value;

  /*
    ======================
    PUBLIC ROUTES
    ======================
  */
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/therapist/sign-in") ||
    pathname.startsWith("/therapist/sign-up") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  /*
    ======================
    THERAPIST PROTECTED
    ======================
  */
  if (pathname.startsWith("/therapist")) {
    if (!therapistId) {
      const url = req.nextUrl.clone();
      url.pathname = "/therapist/sign-in";
      return NextResponse.redirect(url);
    }
  }

  /*
    ======================
    USER PROTECTED
    ======================
  */
  const userProtected = [
    "/dashboard",
    "/onboarding",
    "/matching",
  ];

  if (userProtected.some((r) => pathname.startsWith(r))) {
    if (!userId) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/sign-in";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
