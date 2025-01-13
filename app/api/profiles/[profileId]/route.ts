import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { profileId: string } }
) => {
  try {
    const { userId } = await auth();
    const { profileId } = params;
    const values = await req.json();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const course = await db.profile.update({
      where: { id: profileId, user_id: userId },
      data: { ...values },
    });

    return NextResponse.json(course, { status: 200 });
  } catch (err) {
    console.error(["courseId_PATCH", err]);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { profileId: string } }
) => {
  try {
    const { userId } = await auth();
    const { profileId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.profile.findUnique({
      where: { id: profileId, user_id: userId}
    });

    if (!course) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    await db.profile.delete({
      where: { id: profileId, user_id: userId },
    });

    return new NextResponse("Profile Deleted", { status: 200 });
  } catch (err) {
    console.error(["courseId_DELETE", err]);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};