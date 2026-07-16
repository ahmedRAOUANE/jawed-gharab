import crypto from "crypto";
import { createHash } from "crypto";

/**
 * Generate a cryptographically secure random token
 * @param length - Number of bytes (default: 32)
 * @returns Hex string token
 */
export function generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString("hex");
}

/**
 * Hash a token for storage in database
 * Uses SHA-256
 */
export function hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}

/**
 * Compare a plain token with a hashed token
 */
export function compareToken(plainToken: string, hashedToken: string): boolean {
    return hashToken(plainToken) === hashedToken;
}

/**
 * Generate a verification token with expiration
 */
export function generateVerificationToken(): {
    plainToken: string;
    hashedToken: string;
    expiresAt: Date;
} {
    const plainToken = generateSecureToken(32);
    const hashedToken = hashToken(plainToken);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

    return { plainToken, hashedToken, expiresAt };
}

/**
 * Generate a password reset token with expiration (1 hour)
 */
export function generatePasswordResetToken(): {
    plainToken: string;
    hashedToken: string;
    expiresAt: Date;
} {
    const plainToken = generateSecureToken(32);
    const hashedToken = hashToken(plainToken);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour

    return { plainToken, hashedToken, expiresAt };
}

/**
 * Check if a token has expired
 */
export function isTokenExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
}

/**
 * Generates a random 6‑digit code as a zero‑padded string (000000 – 999999).
 * @returns {string} - 6 characters, e.g., "003845"
 */
export function generateSixDigitCode() {
    const num = crypto.randomInt(0, 1000000);
    return num.toString().padStart(6, '0');
}