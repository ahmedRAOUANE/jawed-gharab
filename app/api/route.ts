import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
    const data = await prisma.user.findFirst();
    return NextResponse.json({
        success: true,
        data
    }, {status: 200});
}