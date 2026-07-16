import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-guard";
import { decrypt } from "@/lib/cripto";
import { MailConfig, sendChangePasswordVerificationEmail } from "@/lib/email-service";
import prisma from "@/lib/prisma";
import { generateSixDigitCode, hashToken } from "@/lib/token-generator";
import { NextRequest } from "next/server";
import nodemailer from "nodemailer"

export const POST = async (request: NextRequest) => {
    try {
        const { email } = await requireAuth(request);

        if (!email) 
            return errorResponse("api/auth/change-password/send-code: unAuthorized login is required for this operation", 401, "تسجيل الدخول مطلوب لاجراء هذه العملية")
            
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            select: {
                name: true,
                email: true,

                passwordChangeVerification: {
                    select: {
                        updatedAt: true
                    }
                },

                config:{
                    select: {
                        siteName: true,
                        emailSettings: {
                            select: {
                                smtpUser: true,
                                smtpPasswordEncrypted: true,
                            }
                        }
                    }
                },
            }
        });
        if (!user) 
            return errorResponse("user can not be found", 404, "تاكد من صلاحية تسجيلك");

        // rate limiting
        if (user.passwordChangeVerification && user.passwordChangeVerification.updatedAt) 
            if ((Date.now() - user.passwordChangeVerification.updatedAt.getTime()) < 60 * 1000) return errorResponse(
                "Please wait before requesting another code.",
                429,
                "يرجى الانتظار 60 ثانية قبل طلب رمز جديد."
            ); 

        if (!user.config || !user.config.emailSettings || !user.config.emailSettings.smtpPasswordEncrypted)
            return errorResponse("email settings does not apear to be exist or correct", 404, "يبدو ان ان موقعك غير معد بشكل صحيح")

        const vervCode = generateSixDigitCode();

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: user.config?.emailSettings?.smtpUser,
                pass: decrypt(user.config!.emailSettings!.smtpPasswordEncrypted), 
            },
        })

        const config: MailConfig = {
            name: user.name,
            email: user.email,
            appName: user.config.siteName,
            transporter
        }

        // in case any failure it throws the error without saving the changes to the db
        await sendChangePasswordVerificationEmail(config, vervCode);

        const hashedCode = hashToken(vervCode);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        const updatepasswordChangeVerification = await prisma.user.update({
            where: {
                email
            }, 
            data: {
                passwordChangeVerification: {
                    upsert: {
                        create: {
                            token: hashedCode,
                            expiresAt,
                        },
                        update: {
                            token: hashedCode,
                            expiresAt,
                            used: false,
                        },
                    },
                }
            }
        });
        if (!updatepasswordChangeVerification)
            return errorResponse("filed to update the updatepasswordChangeVerification database table");

        return successResponse(200, null, "تم ارسال رمز التحقق, تفقد الايميل الخاص بك")
    } catch (error) {
        console.log("api/auth/change-password/send-code: ", error);
        return errorResponse("api/auth/change-password/send-code: failed to send the verification code", 500, "يبدو انه لا يمكن ارسال رمز التحقق حاليا, الرجاء اعادة المحاولة لاحقا")
    }
}