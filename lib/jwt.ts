import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "7d";

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
}

export interface JwtPayload {
    userId: number;
    email: string;
    role: string;
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(userId: number, email: string, role: string): string {
    return jwt.sign(
        { userId, email, role } as JwtPayload,
        JWT_SECRET,
        { expiresIn: Number(JWT_EXPIRATION) }
    );
}

/**
 * Verify and decode a JWT token
 * @throws {Error} If token is invalid or expired
 */
export function verifyToken(token: string): JwtPayload {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        console.log("error verifying token: ", error);
        throw new Error("Invalid or expired token");
    }
}

/**
 * Decode a JWT token without verification (for debugging or extracting payload)
 */
export function decodeToken(token: string): JwtPayload | null {
    try {
        return jwt.decode(token) as JwtPayload;
    } catch {
        return null;
    }
}

/**
 * Extract token from request cookies or Authorization header
 * Priority: Cookie > Authorization header
 */
export function extractTokenFromRequest(request: NextRequest): string | null {
    // Check cookies first
    const tokenFromCookie = request.cookies.get("authToken")?.value;
    if (tokenFromCookie) return tokenFromCookie;

    // Check Authorization header
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.substring(7);
    }

    return null;
}