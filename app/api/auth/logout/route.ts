import { successResponse } from "@/lib/api-response";

export async function POST() {
    const response = successResponse(200, null, "تم تسجيل الخروج بنجاح");

    // Clear the auth token cookie
    response.cookies.set("authToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
    });

    return response;
}