import { NextRequest } from "next/server";
import { compare, hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { ChangePasswordSchema } from "@/lib/validation";
import { requireAuth } from "@/lib/auth-guard";
import { compareToken } from "@/lib/token-generator";

export async function POST(request: NextRequest) {
    try {
        const { email } = await requireAuth(request);
        const body = await request.json();
        const { data, error, success } = ChangePasswordSchema.safeParse(body);
        if (!success) return errorResponse(`${error.message}`, 400, "تاكد من صحة البيانات المدخلة")

        const { currentPassword, newPassword, verificationCode } = data;

        if (newPassword == currentPassword)
            return errorResponse("new password must be diffirent from the current password", 400, "كلمة المرور يجب ان تكون مختلفة")

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                password: true,
                passwordChangeVerification: {
                    select: {
                        expiresAt: true,
                        token: true,
                        used: true,
                    }
                }
            }
        });

        if (!user) 
            return errorResponse("unable to find the user", 404, "المستخدم غير موجود");

        // Verify current password
        const isValid = await compare(currentPassword, user.password);
        if (!isValid) 
            return errorResponse("invalid password", 401, "كلمة المرور الحالية غير صحيحة");

        if (user.passwordChangeVerification?.used) 
            return errorResponse("the change password code code already used", 400, "الكود الذي ارسلته مستخدم بالفعل")

        if (user.passwordChangeVerification?.expiresAt && Date.now() > user.passwordChangeVerification.expiresAt.getTime()) 
            return errorResponse("expired verification code", 400, "الرمز منتهي الصلاحية");

        if (user.passwordChangeVerification?.token && !compareToken(verificationCode, user.passwordChangeVerification.token)) 
            return errorResponse("invalid token", 401, "رمز غير صالح");

        // Hash new password
        const hashedPassword = await hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: { 
                password: hashedPassword, 
                passwordChangeVerification: {
                    delete: true
                }
            },
        });

        return successResponse(200, null, "تم تغيير كلمة المرور بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}