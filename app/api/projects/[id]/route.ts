import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { ProjectUpdateSchema } from "@/lib/validation";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseInt((await params).id);
        if (isNaN(id)) {
            return errorResponse("Invalid project ID", 400);
        }

        const project = await prisma.project.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                teamMembers: true,
            },
        });

        if (!project) {
            return errorResponse("Project not found", 404);
        }

        return successResponse(200, project, "تم جلب المشروع بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { role } = await requireAuth(request);

        if (role != "admin") {
            console.log("api/projects/id/route.ts: require admin authorization for updating a project")
            return errorResponse("require admin authorization for this operation", 400);
        }

        const id = parseInt((await params).id);
        if (isNaN(id)) {
            return errorResponse("Invalid project ID", 400);
        }

        const body = await request.json();
        const validatedData = ProjectUpdateSchema.parse(body);

        // Check if project exists and not deleted
        const existing = await prisma.project.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) {
            return errorResponse("Project not found", 404);
        }

        // Prepare update data
        const updateData = { ...validatedData };

        // Convert deadline if provided
        if (validatedData.deadline) {
            updateData.deadline = new Date(validatedData.deadline);
        }

        const project = await prisma.project.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                teamMembers: true,
            },
        });

        return successResponse(200, project, "تم تحديث المشروع بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { role } = await requireAuth(request);

        if (role != "admin") {
            console.log("api/projects/id/route.ts: require admin authorization for deleting a project")
            return errorResponse("require admin authorization for this operation", 400);
        }

        const id = parseInt((await params).id);
        if (isNaN(id)) {
            return errorResponse("Invalid project ID", 400);
        }

        // Soft delete - set deletedAt
        const project = await prisma.project.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        if (!project) {
            return errorResponse("Project not found", 404);
        }

        return successResponse(200, null, "تم حذف المشروع بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}