import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { TeamMemberSchema } from "@/lib/validation";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const projectId = parseInt((await params).id);
        if (isNaN(projectId)) {
            return errorResponse("Invalid project ID", 400);
        }

        // Check if project exists
        const project = await prisma.project.findFirst({
            where: { id: projectId, deletedAt: null },
        });
        if (!project) {
            return errorResponse("Project not found", 404);
        }

        const body = await request.json();
        // Validate with TeamMemberSchema (it expects projectId, but we take from URL)
        // We'll omit projectId from body and use the URL param
        const { projectId: _, ...memberData } = body;
        const validatedData = TeamMemberSchema.omit({ projectId: true }).parse(memberData);

        const teamMember = await prisma.teamMember.create({
            data: {
                ...validatedData,
                projectId: projectId,
            },
        });

        return successResponse(201, teamMember, "تم إضافة عضو الفريق بنجاح", undefined);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const projectId = parseInt((await params).id);
        if (isNaN(projectId)) {
            return errorResponse("Invalid project ID", 400);
        }

        // We need memberId from query parameter
        const url = new URL(request.url);
        const memberId = url.searchParams.get("memberId");
        if (!memberId) {
            return errorResponse("memberId query parameter is required", 400);
        }

        const teamMemberId = parseInt(memberId);
        if (isNaN(teamMemberId)) {
            return errorResponse("Invalid member ID", 400);
        }

        // Verify the member belongs to the project
        const teamMember = await prisma.teamMember.findFirst({
            where: {
                id: teamMemberId,
                projectId: projectId,
            },
        });

        if (!teamMember) {
            return errorResponse("Team member not found in this project", 404);
        }

        await prisma.teamMember.delete({
            where: { id: teamMemberId },
        });

        return successResponse(204, null, "تم حذف عضو الفريق بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}