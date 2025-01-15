// api/courses/[courseId]/enroll/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user profile
    const userProfile = await db.profile.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!userProfile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    // Check if user is NOT an organization
    if (userProfile.isOrganization) {
      return new NextResponse("Organizations cannot enroll in courses", { status: 403 });
    }

    // Get course with organization info
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      select: {
        id: true,
        organizationId: true,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check if purchase already exists
    const existingPurchase = await db.purchase.findUnique({
      where: {
        customerId_courseId: {
          customerId: userProfile.id,
          courseId: params.courseId,
        },
      },
    });

    if (existingPurchase) {
      return new NextResponse("Already enrolled", { status: 400 });
    }

    // Create purchase record
    const purchase = await db.purchase.create({
      data: {
        courseId: course.id,
        customerId: userProfile.id,
        organizationId: course.organizationId, // Обов'язково додаємо organizationId
      },
    });

    return NextResponse.json(purchase);
  } catch (error) {
    console.log("[COURSE_ENROLL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}