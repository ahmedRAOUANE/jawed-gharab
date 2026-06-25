import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { RequestSchema } from "@/lib/validation";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseInt((await params).id);
        if (isNaN(id)) {
            return errorResponse("Invalid request ID", 400);
        }

        const body = await request.json();
        const { status } = RequestSchema.pick({status: true}).parse(body);

        // Check if request exists and not deleted
        const existing = await prisma.request.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) {
            return errorResponse("Request not found", 404);
        }

        // If marking as "CONTACTED" and previously not, set repliedAt
        const updateData: typeof existing = { 
            ...existing,
            status
        };
        if (status === "CONTACTED" && !existing.replied) {
            updateData.replied = true;
            updateData.repliedAt = new Date();
        }

        const requestData = await prisma.request.update({
            where: { id },
            // Cast to any to satisfy Prisma generated types for nullable/date fields
            data: updateData,
        });

        return successResponse(200, requestData, "تم تحديث حالة الطلب بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}