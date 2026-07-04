import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { ResendVerificationSchema } from "@/lib/validation";
import { generateVerificationToken } from "@/lib/token-generator";
import { MailConfig, sendVerificationEmail } from "@/lib/email-service";
import nodemailer from "nodemailer"
import { decrypt } from "@/lib/cripto";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = ResendVerificationSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Don't reveal if user exists
            return successResponse(200, null, "إذا كان البريد مسجلاً، سيتم إرسال رابط التحقق");
        }

        // check the email verification
        if (user.emailVerified) {
            return errorResponse("البريد الإلكتروني مؤكد بالفعل", 400);
        }

        // check config existence
        const configData = await prisma.config.findUnique({
            where: {
                uid: user.id,
            },
            select: {
                name: true,
                email: true,
                siteName: true,
                emailSettings: {
                    select: {
                        smtpUser: true,
                        smtpPasswordEncrypted: true,
                    }
                }
            }
        });

        if (!configData || !configData.emailSettings) {
            return errorResponse("config data are empty", 500)
        }

        // Generate new token
        const { plainToken, hashedToken, expiresAt } = generateVerificationToken();

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerificationToken: hashedToken,
                emailVerificationExpires: expiresAt,
            },
        });

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: configData.emailSettings.smtpUser,
                pass: decrypt(configData.emailSettings.smtpPasswordEncrypted),
            },
        })

        const config: MailConfig = {
            name: configData.name,
            email: configData.email,
            appName: configData.siteName,
            transporter
        }

        // Send email
        try {
            await sendVerificationEmail(
                config,
                plainToken
            );
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            return errorResponse("حدث خطأ أثناء إرسال البريد. يرجى المحاولة مرة أخرى.", 500);
        }

        return successResponse(200, null, "تم إرسال رابط التحقق إلى بريدك الإلكتروني");
    } catch (error) {
        return handleApiError(error);
    }
}