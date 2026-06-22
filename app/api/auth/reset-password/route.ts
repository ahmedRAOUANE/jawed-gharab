import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { ResetPasswordSchema } from "@/lib/validation";
import { isTokenExpired } from "@/lib/token-generator";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token, password } = ResetPasswordSchema.parse(body);

        // Hash the token to compare with stored hash
        const hashedToken = createHash("sha256")
            .update(token)
            .digest("hex");

        // Find the token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token: hashedToken },
            include: { user: true },
        });

        if (!resetToken) {
            return errorResponse("رمز إعادة التعيين غير صالح", 400);
        }

        if (resetToken.used) {
            return errorResponse("رمز إعادة التعيين مستخدم بالفعل", 400);
        }

        if (isTokenExpired(resetToken.expiresAt)) {
            return errorResponse("رمز إعادة التعيين منتهي الصلاحية. يرجى طلب رمز جديد.", 410);
        }

        // Hash new password
        const hashedPassword = await hash(password, 10);

        // Update user password
        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: {
                    password: hashedPassword,
                    loginAttempts: 0,
                    lockUntil: null,
                },
            }),
            prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { used: true },
            }),
        ]);

        return successResponse(200, null, "تم تغيير كلمة المرور بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}