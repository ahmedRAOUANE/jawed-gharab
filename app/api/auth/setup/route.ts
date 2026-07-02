import { errorResponse, successResponse } from "@/lib/api-response";
import { encrypt } from "@/lib/cripto";
import { sendVerificationEmail } from "@/lib/email-service";
import prisma from "@/lib/prisma";
import { ConfigInput, EmailSettingsInput, SetupSchema } from "@/lib/validation";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();

        const {success, data, error} = SetupSchema.safeParse({...body, uid: parseInt(body.id)});
        if (!success) {
            return errorResponse(error.message, 400, "البيانات غير صحيحة");
        }

        const configExisting = await prisma.config.findUnique({
            where: {
                uid: data.uid
            }
        });
        if (configExisting) {
            return errorResponse("setup already exists", 409, "هذا الحساب معد مسبقا");
        }

        const tokenData = await prisma.user.findUnique({
            where: {id: data.uid},
            select: {
                emailVerificationToken: true,
                emailVerified: true,
                emailVerificationExpires: true,
            }
        })

        if (!tokenData) {
            return errorResponse("unable to find the user", 404, "المستخدم لا يمكن العثور عليه")
        }
        
        if (!tokenData.emailVerificationToken) {
            return errorResponse(
                "emailVerificationToken didn't setup correctly", 
                409,
                "رمز التحقق غير صالح"
            )
        }

        if (tokenData.emailVerified) {
            return errorResponse(
                "user already verified", 
                409,
                "تم تأكيد البريد الإلكتروني مسبقًا"
            );
        }

        const appConfig: ConfigInput = {
            uid: data.uid,
            name: data.name,
            email: data.email,
            siteName: data.siteName,
            siteDescription: data.siteDescription,
        }

        const emailSettings: EmailSettingsInput = {
            smtpUser: data.smtpUser,
            smtpPasswordEncrypted: encrypt(data.smtpPasswordEncrypted)
        }

        const config = await prisma.config.create({
            data: {
                ...appConfig,
                emailSettings: {
                    create: emailSettings
                }
            }
        })

        try {
            await sendVerificationEmail({ name: data.name, email: data.email }, tokenData.emailVerificationToken);
        } catch (error) {
            console.error(error);

            return errorResponse(
                "Unable to send verification email",
                500,
                "تعذر إرسال رسالة التحقق. يرجى المحاولة مرة أخرى."
            );
        }

        return successResponse(200, config, "تم تحضير التطبيق بنجاح");
    } catch (error) {
        console.log("/api/setup > error creating the new data: ", error);
        return errorResponse("غير قادر على تفعيل التطبيق حاليا", 500);
    }
}