import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { VerifyEmailSchema } from "@/lib/validation";
import { compareToken, isTokenExpired } from "@/lib/token-generator";
import { sendWelcomeEmail } from "@/lib/email-service";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token } = VerifyEmailSchema.parse(body);

        // Find user with this verification token
        const user = await prisma.user.findFirst({
            where: {
                emailVerificationToken: { not: null },
                emailVerified: false,
            },
        });

        if (!user || !user.emailVerificationToken || !user.emailVerificationExpires) {
            return errorResponse("رمز التحقق غير صالح", 400);
        }

        // Compare token
        const isValid = compareToken(token, user.emailVerificationToken);
        if (!isValid) {
            return errorResponse("رمز التحقق غير صالح", 400);
        }

        // Check expiration
        if (isTokenExpired(user.emailVerificationExpires)) {
            return errorResponse("رمز التحقق منتهي الصلاحية. يرجى طلب رمز جديد.", 410);
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                emailVerificationToken: null,
                emailVerificationExpires: null,
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
            },
        });

        // Send welcome email
        try {
            await sendWelcomeEmail({ name: updatedUser.name, email: updatedUser.email });
        } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
        }

        return successResponse(200, updatedUser, "تم تأكيد البريد الإلكتروني بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}