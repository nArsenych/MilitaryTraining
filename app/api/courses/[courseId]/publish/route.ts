import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = await auth();
    const { courseId } = params;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId, organizationId: userId },
    });

    if (!course) {
      return new Response("Course not found", { status: 404 });
    }



    if (
      !course.title ||
      !course.categoryId ||
      !course.levelId ||
      !course.startDate ||
      !course.endDate ||
      !course.startAge ||
      !course.cityId
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const pusblishedCourse = await db.course.update({
      where: { id: courseId, organizationId: userId },
      data: { isPublished: true },
    });

    return NextResponse.json(pusblishedCourse, { status: 200 });
  } catch (err) {
    console.log("[courseId_publish_POST]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};