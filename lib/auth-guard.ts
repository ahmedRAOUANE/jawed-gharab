import { NextRequest } from "next/server";
import { extractTokenFromRequest, verifyToken, JwtPayload } from "./jwt";

/**
 * Authentication error class for API routes
 */
export class AuthError extends Error {
    status: number;
    constructor(message: string, status: number = 401) {
        super(message);
        this.name = "AuthError";
        this.status = status;
    }
}

/**
 * Require authentication for API routes
 * Extracts JWT from request, verifies it, and returns userId
 * @throws {AuthError} If token is missing or invalid
 */
export async function requireAuth(request: NextRequest): Promise<{ userId: number; email: string; role: string }> {
    const token = extractTokenFromRequest(request);
    if (!token) {
        throw new AuthError("Unauthorized: No token provided", 401);
    }

    try {
        const payload = verifyToken(token) as JwtPayload;
        return {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
        };
    } catch (error) {
        console.log("error verifying token: ", error);
        throw new AuthError("Unauthorized: Invalid or expired token", 401);
    }
}

/**
 * Optional authentication for API routes
 * Returns user data if token exists and is valid, otherwise null
 */
export async function optionalAuth(request: NextRequest): Promise<{ userId: number; email: string; role: string } | null> {
    try {
        return await requireAuth(request);
    } catch {
        return null;
    }
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string, requiredRole: string | string[]): boolean {
    if (!requiredRole) return true;
    if (Array.isArray(requiredRole)) {
        return requiredRole.includes(userRole);
    }
    return userRole === requiredRole;
}

/**
 * Middleware helper to check if route is public
 */
export function isPublicRoute(pathname: string): boolean {
    const publicRoutes = [
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
        "/api/auth",
        "/api/users/me", // will be protected eventually
    ];
    return publicRoutes.some((route) => pathname.startsWith(route));
}