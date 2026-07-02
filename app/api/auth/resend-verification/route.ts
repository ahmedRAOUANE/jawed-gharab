import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { ResendVerificationSchema } from "@/lib/validation";
import { generateVerificationToken } from "@/lib/token-generator";
import { sendVerificationEmail } from "@/lib/email-service";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = ResendVerificationSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Don't reveal if user exists
            return successResponse(200, null, "إذا كان البريد مسجلاً، سيتم إرسال رابط التحقق");
        }

        // check the email verification
        if (user.emailVerified) {
            return errorResponse("البريد الإلكتروني مؤكد بالفعل", 400);
        }

        // check config existence
        const config = await prisma.config.findUnique({
            where: {
                uid: user.id,
            },
        });

        if (!config) {
            return errorResponse(
                "Setup configuration not found",
                404,
                "لم يتم العثور على بيانات إعداد التطبيق"
            );
        }

        // Generate new token
        const { plainToken, hashedToken, expiresAt } = generateVerificationToken();

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerificationToken: hashedToken,
                emailVerificationExpires: expiresAt,
            },
        });

        // Send email
        try {
            await sendVerificationEmail(
                { name: user.name, email: user.email },
                plainToken
            );
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            return errorResponse("حدث خطأ أثناء إرسال البريد. يرجى المحاولة مرة أخرى.", 500);
        }

        return successResponse(200, null, "تم إرسال رابط التحقق إلى بريدك الإلكتروني");
    } catch (error) {
        return handleApiError(error);
    }
}