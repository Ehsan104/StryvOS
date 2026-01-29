import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/app"];
const publicRoutes = ["/", "/signin", "/signout", "/privacy", "/terms"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle /admin routes (protected, admin only)
  if (pathname.startsWith("/admin")) {
    // Redirect /admin/login to /signin (unified sign-in page)
    if (pathname === "/admin/login") {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("redirect", "/admin");
      return NextResponse.redirect(signInUrl);
    }

    // Get session token from cookie
    const sessionToken = request.cookies.get("firebase-session")?.value;

    if (!sessionToken) {
      // No session, redirect to sign-in (unified page)
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Session exists, allow access
    // Actual admin verification happens in the page/API route (server-side)
    // This is because middleware runs in Edge runtime and can't use Firebase Admin SDK
    return NextResponse.next();
  }

  // Handle /app routes (protected, gym owners)
  if (pathname.startsWith("/app")) {
    // Get session token from cookie
    const sessionToken = request.cookies.get("firebase-session")?.value;

    if (!sessionToken) {
      // No session, redirect to sign in
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Session exists, allow access
    // Actual token verification happens in the page/API route (server-side)
    // This is because middleware runs in Edge runtime and can't use Firebase Admin SDK
    return NextResponse.next();
  }

  // For signin/signout, just allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match /app routes, /admin routes, and signin/signout
     * Exclude root and other public routes to avoid Edge runtime issues
     */
    "/app/:path*",
    "/admin/:path*",
    "/signin",
    "/signout",
  ],
};

