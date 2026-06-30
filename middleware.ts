// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const isAuth = !!token;
    const isAuthPage = path.startsWith("/auth");
    const isSetupPage = path.startsWith("/auth/setup");
    const isDashboardPage = path.startsWith("/dashboard");
    const isApiRoute = path.startsWith("/api");

    // Allow API routes
    if (isApiRoute) {
      return NextResponse.next();
    }

    // If authenticated and trying to access auth pages
    if (isAuth && isAuthPage) {
      if (token.companyId) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/auth/setup", req.url));
      }
    }

    // If not authenticated and trying to access protected pages
    if (!isAuth && !isAuthPage) {
      // ✅ Redirect to /auth instead of /signin
      const from = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(
        new URL(`/auth?mode=signin&from=${from}`, req.url)
      );
    }

    // If authenticated and on root page, redirect to dashboard
    if (isAuth && path === "/") {
      if (token.companyId) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/auth/setup", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Always return true for middleware to handle all cases
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/dashboard/:path*",
    "/api/:path*",
  ],
};