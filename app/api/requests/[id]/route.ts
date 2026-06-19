import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { RequestUpdateSchema } from "@/lib/validation";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseInt((await params).id);
        if (isNaN(id)) {
            return errorResponse("Invalid request ID", 400);
        }

        const requestData = await prisma.request.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });

        if (!requestData) {
            return errorResponse("Request not found", 404);
        }

        return successResponse(200, requestData, "تم جلب الطلب بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseInt((await params).id);
        if (isNaN(id)) {
            return errorResponse("Invalid request ID", 400);
        }

        const body = await request.json();
        const validatedData = RequestUpdateSchema.parse(body);

        // Check if request exists and not deleted
        const existing = await prisma.request.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) {
            return errorResponse("Request not found", 404);
        }

        const requestData = await prisma.request.update({
            where: { id },
            data: validatedData,
        });

        return successResponse(200, requestData, "تم تحديث الطلب بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseInt((await params).id);
        if (isNaN(id)) {
            return errorResponse("Invalid request ID", 400);
        }

        // Soft delete - set deletedAt
        const requestData = await prisma.request.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        if (!requestData) {
            return errorResponse("Request not found", 404);
        }

        return successResponse(200, null, "تم حذف الطلب بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}