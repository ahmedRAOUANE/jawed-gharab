import { NextRequest } from "next/server";
import { compare, hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { ChangePasswordSchema } from "@/lib/validation";
import { requireAuth } from "@/lib/auth-guard";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await requireAuth(request);
        const body = await request.json();
        const { currentPassword, newPassword } = ChangePasswordSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return errorResponse("المستخدم غير موجود", 404);
        }

        // Verify current password
        const isValid = await compare(currentPassword, user.password);
        if (!isValid) {
            return errorResponse("كلمة المرور الحالية غير صحيحة", 401);
        }

        // Hash new password
        const hashedPassword = await hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return successResponse(200, null, "تم تغيير كلمة المرور بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}