import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { AdminProjectDisplayOverviewSchema, PaginationSchema } from "@/lib/validation";
import { Prisma, ProjectStatus, ProjectType } from "@prisma/client";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = parseInt((await params).id);
        if (isNaN(userId)) {
            return errorResponse("Invalid user ID", 400);
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return errorResponse("User not found", 404);
        }

        const searchParams = request.nextUrl.searchParams;
        const { page, limit, status, type, search } = PaginationSchema.parse({
            page: searchParams.get("page") ?? undefined,
            limit: searchParams.get("limit") ?? undefined,
            search: searchParams.get("search") ?? undefined,
            status: searchParams.get("status") ?? undefined,
            type: searchParams.get("type") ?? undefined,
        });

        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.ProjectWhereInput = {
            userId,
            deletedAt: null,
        };

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { client: { contains: search, mode: "insensitive" } },
            ];
        }

        if (status) {
            where.status = status as ProjectStatus;
        }

        if (type) {
            where.projectType = type as ProjectType;
        }

        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    progress: true,
                    thumbnailUrl: true,
                    projectLink: true,
                }
            }),
            prisma.project.count({ where }),
        ]);

        const validatedProjects = AdminProjectDisplayOverviewSchema.array().safeParse(projects);

        return successResponse(
            200,
            validatedProjects.data,
            "تم جلب مشاريع المستخدم",
            { page, limit, total }
        );
    } catch (error) {
        return handleApiError(error);
    }
}