import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest, { params }: { params: { courseId: string } }) => {
    try {
        const { userId } = await auth();
        const { courseId } = params;
        const values = await req.json();
    
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Спочатку знаходимо OrganizationProfile користувача
        const organizationProfile = await db.organizationProfile.findUnique({
            where: { userId: userId }
        });

        if (!organizationProfile) {
            return new NextResponse("Organization not found", { status: 404 });
        }

        const course = await db.course.update({
            where: { 
                id: courseId, 
                organizationId: organizationProfile.id // Використовуємо ID організації
            },
            data: { ...values },
        });
      
        return NextResponse.json(course, { status: 200 });

    } catch (err) {
        console.error(["courseId_PATCH", err]);
        console.error("Prisma Error:", err);
        return new NextResponse("Internal Server Error", { status: 500 }); 
    }
}

export const DELETE = async (
    req: NextRequest,
    { params }: { params: { courseId: string } }
) => {
    try {
        const { userId } = await auth();
        const { courseId } = params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Спочатку знаходимо OrganizationProfile користувача
        const organizationProfile = await db.organizationProfile.findUnique({
            where: { userId: userId }
        });

        if (!organizationProfile) {
            return new NextResponse("Organization not found", { status: 404 });
        }

        const course = await db.course.findUnique({
            where: { 
                id: courseId,
                organizationId: organizationProfile.id // Використовуємо ID організації
            },
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        await db.course.delete({
            where: { 
                id: courseId,
                organizationId: organizationProfile.id // Використовуємо ID організації
            },
        });

        return new NextResponse("Course Deleted", { status: 200 });
    } catch (err) {
        console.error(["courseId_DELETE", err]);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};