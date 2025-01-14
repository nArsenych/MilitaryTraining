import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const { userId } = await auth();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const profile = await db.profile.findFirst({
        where: {
          user_id: userId,
        },
        select: {
          id: true,
          isOrganization: true
        }
      });
  
      return NextResponse.json(profile);
    } catch (error) {
      console.log("[PROFILE_GET]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }