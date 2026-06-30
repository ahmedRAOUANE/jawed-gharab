import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { PaginationSchema, RequestCreateSchema } from "@/lib/validation";
import type { Prisma } from "@prisma/client";
import { ProjectType } from "@prisma/client";
import { requireAuth } from "@/lib/auth-guard";
import { sendRequestConfirmationEmail, sendRequestEmail } from "@/lib/email-service";
import { zodShapeToPrismaSelect } from "@/lib/prisma-select-builder";

export async function GET(request: NextRequest) {
    try {
        const {role} = await requireAuth(request);
        if (role != "ADMIN") {
            return errorResponse("unauthorized: only admin can request these data", 403);
        }

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
        const where: Prisma.RequestWhereInput = {
            deletedAt: null, // exclude soft-deleted
        };

        const projectType = Object.values(ProjectType).find(
            (t) => t.toLowerCase() === search?.toLowerCase()
        );

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { details: { contains: search, mode: "insensitive" } },
                ...(projectType ? [{ type: projectType }] : []),
            ];
        }

        if (status) {
            where.status = status;
        }

        if (type) {
            where.type = type;
        }

        const [requests, total] = await Promise.all([
            prisma.request.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.request.count({ where }),
        ]);

        return successResponse(
            200,
            requests,
            "تم جلب الطلبات بنجاح",
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

        // Validate with CreateRequestSchema
        const validatedData = RequestCreateSchema.parse(body);

        const requestData = await prisma.request.create({
            data: validatedData,
            select: zodShapeToPrismaSelect(RequestCreateSchema.shape)
        });

        // email the admin using node mailer
        const admin = await prisma.user.findFirstOrThrow({
            where: {
                role: "ADMIN"
            },
            select: {
                email: true,
            }
        })
        //! for the current version, the user email is from the admin's profile directly
        //! the plane is not to expose the admin's profile in a public route like this one
        //! but get it from a public table 'config' contains the app's configuration data including the adimn's email

        await sendRequestEmail(admin.email, validatedData);
        await sendRequestConfirmationEmail({name: validatedData.name, email: validatedData.email})

        return successResponse(201, requestData, "تم إنشاء الطلب بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}