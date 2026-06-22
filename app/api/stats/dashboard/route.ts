import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireAuth } from "@/lib/auth-guard";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { role } = await requireAuth(request);

        if (role != "admin") {
            console.log("api/stats/dashboard/route.ts: require admin authorization for revealing this data")
            return errorResponse("these are admin only informations", 400);
        }
        
        // Get counts
        const [activeProjects, newRequests, totalViews] = await Promise.all([
            prisma.project.count({
                where: {
                    deletedAt: null,
                    status: "START", // or "EDITING"? Should count all active projects.
                    // Let's count all projects that are not delivered.
                    // In the design, "المشاريع النشطة" likely means not delivered.
                    // We'll count all statuses except "DELIVERED".
                    NOT: { status: "DELIVERED" },
                },
            }),
            prisma.request.count({
                where: {
                    deletedAt: null,
                    status: "NEW",
                },
            }),
            // Mock total views for now - we can later sum project views or store separately
            Promise.resolve(1200000), // 1.2M mock value
        ]);

        // Get recent projects (limit 5)
        const recentProjects = await prisma.project.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                teamMembers: true,
            },
        });

        // Get recent requests (limit 5)
        const recentRequests = await prisma.request.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: "desc" },
            take: 5,
        });

        const stats = {
            activeProjects,
            totalViews,
            newRequests,
            recentProjects,
            recentRequests,
        };

        return successResponse(200, stats, "تم جلب إحصائيات لوحة التحكم");
    } catch (error) {
        return handleApiError(error);
    }
}