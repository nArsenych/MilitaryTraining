// app/api/profile/client/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { firstName, lastName, age, phone } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await db.clientProfile.create({
      data: {
        userId,
        firstName,
        lastName,
        age: parseInt(age),
        phone,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.log("[CLIENT_PROFILE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}