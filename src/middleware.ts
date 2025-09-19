import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired } from "@/lib/jwt";
import {
  AUTH_CONSTANTS,
  PUBLIC_ROUTES,
  PROTECTED_ROUTES,
} from "@/constants/auth";

// Helper function to check if a path matches any route pattern
function matchesRoute(pathname: string, routes: readonly string[]): boolean {
  return routes.some((route) => {
    // Handle wildcard routes (e.g., "/case-studies/*")
    if (route.endsWith("/*")) {
      const baseRoute = route.slice(0, -2); // Remove "/*"
      return pathname.startsWith(baseRoute);
    }
    // Handle exact matches
    return pathname === route;
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for Next.js internal routes and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/public/")
  ) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get(AUTH_CONSTANTS.AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = token && !isTokenExpired(token);

  // Handle login page access
  if (pathname === "/login") {
    if (isAuthenticated) {
      // User is authenticated but trying to access login page
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Check if the route is public (doesn't need authentication)
  if (matchesRoute(pathname, PUBLIC_ROUTES)) {
    return NextResponse.next();
  }

  // Check if the route needs protection
  if (!matchesRoute(pathname, PROTECTED_ROUTES)) {
    return NextResponse.next();
  }

  // This is a protected route - require authentication
  if (!token) {
    // No token found, redirect to login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check if token is expired (basic validation without signature verification)
  if (isTokenExpired(token)) {
    // Token expired, redirect to login
    const loginUrl = new URL("/login", request.url);

    // Clear the expired cookie
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set(AUTH_CONSTANTS.AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return response;
  }

  console.log(`✅ Allowing access to ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
