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

        const course = await db.course.update({
            where: { id: courseId, organizationId: userId },
            data: { ...values },
          });
      
        return NextResponse.json(course, { status: 200 });

    } catch (err) {
    console.error(["courseId_PATCH", err]);
    console.error("Prisma Error:", err);

    return new NextResponse("Internal Server Error", { status: 500 }); }
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

    const course = await db.course.findUnique({
      where: { id: courseId, organizationId: userId},
      // include: {
      //   sections: {
      //     include: {
      //       muxData: true,
      //     }
      //   }
      // }
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // for (const section of course.sections) {
    //   if (section.muxData?.assetId) {
    //     await video.assets.delete(section.muxData.assetId);
    //   }
    // }

    await db.course.delete({
      where: { id: courseId, organizationId: userId },
    });

    return new NextResponse("Course Deleted", { status: 200 });
  } catch (err) {
    console.error(["courseId_DELETE", err]);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};