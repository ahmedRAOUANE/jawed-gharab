import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { SignupSchema } from "@/lib/validation";
import { generateVerificationToken } from "@/lib/token-generator";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = SignupSchema.parse(body);

        const userCount = await prisma.user.count();
        if (userCount > 0) {
            return errorResponse("تم إنشاء الحساب الأول بالفعل", 403);
        }

        // Hash password
        const hashedPassword = await hash(validatedData.password, 10);

        // Generate email verification token
        const { hashedToken, expiresAt } = generateVerificationToken();

        // Create user
        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
                emailVerificationToken: hashedToken,
                emailVerificationExpires: expiresAt,
                emailVerified: false,
                role: "ADMIN", 
                accountStatus: 'INACTIVE',
                profileProgress: 0,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatarUrl: true,
                accountStatus: true,
                profileProgress: true,
                emailVerified: true,
                createdAt: true,
            },
        });

        return successResponse(201, user, "تم إنشاء الحساب بنجاح. يرجى تأكيد بريدك الإلكتروني.");
    } catch (error) {
        return handleApiError(error);
    }
}