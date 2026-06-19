import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return errorResponse("Invalid request ID", 400);
        }

        // Check if request exists and not deleted
        const existing = await prisma.request.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) {
            return errorResponse("Request not found", 404);
        }

        const requestData = await prisma.request.update({
            where: { id },
            data: {
                replied: true,
                repliedAt: new Date(),
                // Optionally auto-change status to CONTACTED
                status: "CONTACTED",
            },
        });

        return successResponse(200, requestData, "تم تسجيل الرد على الطلب بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}