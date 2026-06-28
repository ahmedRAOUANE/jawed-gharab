import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { AdminProjectDisplayOverviewSchema, PaginationSchema, projectCreateSchema } from "@/lib/validation";
import type { Prisma } from "@prisma/client";
import { ProjectStatus, ProjectType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { getYoutubeThumbnail } from "@/lib/thumbnail";
import { zodShapeToPrismaSelect } from "@/lib/prisma-select-builder";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const { page, limit, search, status, type } = PaginationSchema.parse({
            page: searchParams.get("page") ?? undefined,
            limit: searchParams.get("limit") ?? undefined,
            search: searchParams.get("search") ?? undefined,
            status: searchParams.get("status") ?? undefined,
            type: searchParams.get("type") ?? undefined,
        });

        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.ProjectWhereInput = {
            deletedAt: null, // exclude soft-deleted
        };

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { client: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
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
            }),
            prisma.project.count({ where }),
        ]);

        console.log("projects: ", projects);
        const validatedProjects = AdminProjectDisplayOverviewSchema.array().parse(projects);

        return successResponse(
            200,
            validatedProjects,
            "تم جلب المشاريع بنجاح",
            {
                page,
                limit,
                total,
            }
        );
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const {role, userId} = await requireAuth(request);
        if (role != "ADMIN") {
            return errorResponse("only admin can create new projects", 400);
        }
        
        const body = await request.json();

        const withThumbnail = { ...body, thumbnailUrl: body.thumbnailUrl ?? getYoutubeThumbnail(body.projectLink) }

        console.log("with thumbnail: ", withThumbnail);
        // Validate with CreateProjectSchema 
        const validatedData = projectCreateSchema.parse(withThumbnail);

        const project = await prisma.project.create({
            data: {
                title: validatedData.title,
                client: validatedData.client,
                description: validatedData.description,
                status: validatedData.status,
                projectType: validatedData.projectType,
                stage: validatedData.stage,
                progress: validatedData.progress,
                budget: validatedData.budget,
                deadline: validatedData.deadline,
                thumbnailUrl: validatedData.thumbnailUrl,
                projectLink: validatedData.projectLink,
                userId: userId,
            },
            select: zodShapeToPrismaSelect(projectCreateSchema.shape)
        });

        const validatedProject = projectCreateSchema.parse(project);

        return successResponse(201, validatedProject, "تم إنشاء المشروع بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}