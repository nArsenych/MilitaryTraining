import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { type } = await req.json();

    if (!type) {
      return new NextResponse("Type is required", { status: 400 });
    }

    const user = await db.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        type: type,
      },
      update: {
        type: type,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_TYPE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("UserId is required", { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        organizationProfile: true,
        clientProfile: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_TYPE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
