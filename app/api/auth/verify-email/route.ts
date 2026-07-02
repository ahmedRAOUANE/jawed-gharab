import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { VerifyEmailSchema } from "@/lib/validation";
import { hashToken, isTokenExpired } from "@/lib/token-generator";
import { sendWelcomeEmail } from "@/lib/email-service";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token } = VerifyEmailSchema.parse(body);

        // Find user with this verification token
        const hashedToken = hashToken(token);
        const user = await prisma.user.findUnique({
            where: {
                emailVerificationToken: hashedToken,
            },
        });

        if (!user || !user.emailVerificationToken || !user.emailVerificationExpires) {
            return errorResponse("رمز التحقق غير صالح", 400);
        }

        // Check expiration
        if (isTokenExpired(user.emailVerificationExpires)) {
            return errorResponse("رمز التحقق منتهي الصلاحية. يرجى طلب رمز جديد.", 410);
        }

        if (user.emailVerified) {
            return errorResponse(
                "User already verified",
                409,
                "تم تأكيد البريد الإلكتروني مسبقًا"
            );
        }

        // check the config existence
        const configExisting = await prisma.config.findUnique({
            where: {
                uid: user.id
            }
        });
        if (!configExisting) {
            return errorResponse(
                "Setup configuration not found",
                404,
                "لم يتم العثور على بيانات إعداد التطبيق"
            );
        }

        // Update user
        const [updatedUser] = await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: true,
                    emailVerificationToken: null,
                    emailVerificationExpires: null,
                    accountStatus: "ACTIVE",
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
                },
            }),

            prisma.config.update({
                where: {
                    id: configExisting.id
                },
                data: {
                    isSetup: true,
                }
            })
        ]);

        // Send welcome email
        try {
            await sendWelcomeEmail({ name: updatedUser.name, email: updatedUser.email });
        } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
        }

        return successResponse(200, updatedUser, "تم تأكيد البريد الإلكتروني بنجاح");
    } catch (error) {
        return handleApiError(error);
    }
}