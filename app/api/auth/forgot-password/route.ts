import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { ForgotPasswordSchema } from "@/lib/validation";
import { generatePasswordResetToken } from "@/lib/token-generator";
import { sendPasswordResetEmail } from "@/lib/email-service";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = ForgotPasswordSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Don't reveal if user exists
            return successResponse(200, null, "إذا كان البريد مسجلاً، سيتم إرسال رابط إعادة التعيين");
        }

        // Check if email is verified
        if (!user.emailVerified) {
            return errorResponse("يرجى تأكيد البريد الإلكتروني أولاً", 403);
        }

        // Generate reset token
        const { plainToken, hashedToken, expiresAt } = generatePasswordResetToken();

        // Store token (we'll use the model)
        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token: hashedToken,
                expiresAt: expiresAt,
            },
        });

        // Send email
        try {
            await sendPasswordResetEmail(
                { name: user.name, email: user.email },
                plainToken
            );
        } catch (emailError) {
            console.error("Failed to send password reset email:", emailError);
            return errorResponse("حدث خطأ أثناء إرسال البريد. يرجى المحاولة مرة أخرى.", 500);
        }

        return successResponse(200, null, "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
    } catch (error) {
        return handleApiError(error);
    }
}