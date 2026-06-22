import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(request: NextRequest) {
    try {
        // Extract userId from JWT
        const { userId } = await requireAuth(request);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatarUrl: true,
                accountStatus: true,
                profileProgress: true,
                lastLogin: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return errorResponse("User not found", 404);
        }

        return successResponse(200, user, "تم جلب الملف الشخصي بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}