import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { full_name, phone_number } = await req.json()

    const profile = await db.profile.upsert({
      where: {
        user_id: userId, 
      },
      create: {
        full_name,
        phone_number,
        user_id: userId
      },
      update: {
        full_name,
        phone_number,
      }
    })

    return NextResponse.json(profile, {status: 200 })
  } catch (err) {
    console.log("[courses_POST]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}