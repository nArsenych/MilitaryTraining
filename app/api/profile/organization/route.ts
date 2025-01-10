// app/api/profile/organization/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { name, description } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await db.organizationProfile.create({
      data: {
        userId,
        name,
        description,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.log("[ORGANIZATION_PROFILE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}