import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const protectedRoutes = [
  "/dashboard",
  "/study",
  "/setup",
  "/quiz",
  "/result",
  "/qbot",
];

// Public routes that should allow access even with token
const publicRoutes = [
  "/login",
  "/register",
  "/confirm",
  "/forgot-password",
  "/privacy",
  "/terms",
  "/cookies",
  "/",
  "/subjects",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to public routes
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "?"))) {
    return NextResponse.next();
  }

  // Check for access token in cookies
  const hasToken = request.cookies.get("quizergo_token");

  // If no token, redirect to login for protected routes
  if (!hasToken && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the original URL for redirect after login
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - robots.txt
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};