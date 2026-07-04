import { NextRequest } from "next/server";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { LoginSchema } from "@/lib/validation";
import { generateToken } from "@/lib/jwt";

const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5");
const LOCK_TIME = parseInt(process.env.LOCK_TIME || "15"); // minutes

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = LoginSchema.parse(body);

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            // Don't reveal if user exists
            return errorResponse("البريد الإلكتروني أو كلمة المرور غير صحيحة", 401);
        }

        // Check if account is locked
        if (user.lockUntil && new Date() < user.lockUntil) {
            const remainingMinutes = Math.ceil(
                (user.lockUntil.getTime() - Date.now()) / 60000
            );
            return errorResponse(
                `الحساب مقفل. يرجى المحاولة بعد ${remainingMinutes} دقيقة`,
                423
            );
        }

        // Check password
        const isValid = await compare(password, user.password);
        if (!isValid) {
            // Increment login attempts
            const newAttempts = user.loginAttempts + 1;
            let lockUntil: Date | null = null;

            if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
                lockUntil = new Date(Date.now() + LOCK_TIME * 60000);
            }

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    loginAttempts: newAttempts,
                    lockUntil,
                },
            });

            return errorResponse("البريد الإلكتروني أو كلمة المرور غير صحيحة", 401);
        }

        // Check if email is verified
        if (!user.emailVerified) {
            return errorResponse("يرجى تأكيد بريدك الإلكتروني أولاً", 403, "يرجى تأكيد بريدك الإلكتروني أولاً");
        }

        // Reset login attempts and update lastLogin
        await prisma.user.update({
            where: { id: user.id },
            data: {
                loginAttempts: 0,
                lockUntil: null,
                lastLogin: new Date(),
            },
        });

        // Generate JWT
        const token = generateToken(user.id, user.email, user.role);
        const data = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatarUrl: user.avatarUrl,
                    accountStatus: user.accountStatus,
                    profileProgress: user.profileProgress,
                }

        // Create response with cookie
        // const response = NextResponse.json(
        //     {
        //         success: true,
        //         data: {
        //             id: user.id,
        //             name: user.name,
        //             email: user.email,
        //             role: user.role,
        //             avatarUrl: user.avatarUrl,
        //             accountStatus: user.accountStatus,
        //             profileProgress: user.profileProgress,
        //         },
        //         message: "تم تسجيل الدخول بنجاح",
        //     },
        //     { status: 200 }
        // );
        const response = successResponse(200, data, "تم تسجيل الدخول بنجاح");

        // Set HTTP-only cookie
        response.cookies.set("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch (error) {
        return handleApiError(error);
    }
}