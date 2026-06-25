import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { PaginationSchema, RequestCreateSchema } from "@/lib/validation";
import type { Prisma } from "@prisma/client";
import { RequestStatus } from "@prisma/client";

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
        const where: Prisma.RequestWhereInput = {
            deletedAt: null, // exclude soft-deleted
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { type: { contains: search, mode: "insensitive" } },
                { details: { contains: search, mode: "insensitive" } },
            ];
        }

        if (status) {
            where.status = status as RequestStatus;
        }

        if (type) {
            where.type = { contains: type, mode: "insensitive" };
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
            data: {
                ...validatedData,
                deadline: validatedData.deadline,
                status: RequestStatus.NEW, // default
                // icon is already in validatedData, default "person"
            },
        });

        return successResponse(201, requestData, "تم إنشاء الطلب بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}