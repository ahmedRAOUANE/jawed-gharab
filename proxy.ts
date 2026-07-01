import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Public routes (no authentication required)
const publicRoutes = [
    "/",
    "/request",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/setup",
];

// Auth API routes (should be accessible without auth)
const publicApiRoutes = [
    "/api/auth/register",
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/verify-email",
    "/api/auth/resend-verification",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
];

// Protected routes (require authentication)
const protectedRoutes = ["/admin", "/api/projects", "/api/requests", "/api/users", "/api/stats"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if route is public
    const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
    const isPublicApiRoute = publicApiRoutes.some((route) => pathname.startsWith(route));

    // Allow public routes
    if (isPublicRoute || isPublicApiRoute) {
        // If user is logged in and tries to access auth pages, redirect to admin
        if (pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/forgot-password")) {
            const token = request.cookies.get("authToken")?.value;
            if (token) {
                try {
                    await verifyToken(token);
                    // If token is valid, redirect to admin
                    return NextResponse.redirect(new URL("/admin", request.url));
                } catch {
                    // Token invalid, allow access to auth page
                }
            }
        }
        return NextResponse.next();
    }

    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    if (isProtectedRoute) {
        const token = request.cookies.get("authToken")?.value;
        if (!token) {
            // Redirect to login if not authenticated
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }

        try {
            await verifyToken(token);
            // Token is valid, allow access
            return NextResponse.next();
        } catch {
            // Token expired or invalid
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete("authToken");
            return response;
        }
    }

    // Default: allow access
    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        // Match all routes except static files, api routes that are not in publicApiRoutes, etc.
        // We want to run on all routes except _next/static, _next/image, favicon.ico, etc.
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};