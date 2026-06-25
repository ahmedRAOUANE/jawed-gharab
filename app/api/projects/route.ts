import { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { AdminProjectDisplayOverviewSchema, PaginationSchema, projectCreateSchema } from "@/lib/validation";
import type { Prisma } from "@prisma/client";
import { ProjectStatus, ProjectType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

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

        const validatedProjects = AdminProjectDisplayOverviewSchema.array().safeParse(projects);

        return successResponse(
            200,
            validatedProjects.data,
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
        const body = await request.json();

        // Validate with CreateProjectSchema (userId optional, but we'll set a default for now)
        const validatedData = projectCreateSchema.parse(body);

        // extract the user id
        const {userId} = await requireAuth(request);

        // Convert deadline to Date object
        const deadline = new Date(validatedData.deadline);

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
                deadline: deadline,
                thumbnailUrl: validatedData.thumbnailUrl,
                projectLink: validatedData.projectLink,
                userId: userId,
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                teamMembers: true,
            },
        });

        return successResponse(201, project, "تم إنشاء المشروع بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}