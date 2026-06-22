import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { UserUpdateSchema } from "@/lib/validation";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseInt((await params).id);
        if (isNaN(id)) {
            return errorResponse("Invalid user ID", 400);
        }

        const body = await request.json();
        const validatedData = UserUpdateSchema.parse(body);

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            return errorResponse("User not found", 404);
        }

        // Prepare update data (exclude password for now)
        const updateData = { ...validatedData };

        // If email is being updated, check uniqueness
        if (validatedData.email) {
            const emailExists = await prisma.user.findFirst({
                where: {
                    email: validatedData.email,
                    id: { not: id },
                },
            });
            if (emailExists) {
                return errorResponse("Email already in use", 409);
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatarUrl: true,
                accountStatus: true,
                profileProgress: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return successResponse(200, updatedUser, "تم تحديث الملف الشخصي بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}