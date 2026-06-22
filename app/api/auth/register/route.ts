import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { SignupSchema } from "@/lib/validation";
import { generateVerificationToken } from "@/lib/token-generator";
import { sendVerificationEmail } from "@/lib/email-service";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = SignupSchema.parse(body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });
        if (existingUser) {
            return errorResponse("البريد الإلكتروني مسجل بالفعل", 409);
        }

        // Hash password
        const hashedPassword = await hash(validatedData.password, 10);

        // Generate email verification token
        const { plainToken, hashedToken, expiresAt } = generateVerificationToken();

        // Create user
        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
                emailVerificationToken: hashedToken,
                emailVerificationExpires: expiresAt,
                emailVerified: false,
                role: "EDITOR", // Default role
                accountStatus: "نشط",
                profileProgress: 0,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatarUrl: true,
                accountStatus: true,
                profileProgress: true,
                emailVerified: true,
                createdAt: true,
            },
        });

        // Send verification email
        try {
            await sendVerificationEmail(
                { name: user.name, email: user.email },
                plainToken
            );
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            // We still return success but notify the user to resend later
            // Could add a flag or message
        }

        return successResponse(201, user, "تم إنشاء الحساب بنجاح. يرجى تأكيد بريدك الإلكتروني.");
    } catch (error) {
        return handleApiError(error);
    }
}