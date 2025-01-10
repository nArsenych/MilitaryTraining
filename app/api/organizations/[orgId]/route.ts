import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { orgId: string } }
) {
  try {
    const organization = await db.organizationProfile.findUnique({
      where: {
        id: params.orgId
      }
    });

    return NextResponse.json(organization);
  } catch (error) {
    console.log("[ORGANIZATION_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}