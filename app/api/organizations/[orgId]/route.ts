// app/api/organizations/[orgId]/route.ts
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { orgId: string } }
) {
  try {
    console.log("Fetching user with ID:", params.orgId);
    
    const response = await fetch(`https://api.clerk.dev/v1/users/${params.orgId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`
      }
    });

    if (!response.ok) {
      console.log("Clerk API response not OK:", response.status);
      return new NextResponse("Organization not found", { status: 404 });
    }

    const userData = await response.json();
    console.log("Raw Clerk user data:", userData);

    // Перевіримо структуру даних
    const userResponse = {
      firstName: userData.first_name, // Можливо проблема в різних форматах імен
      lastName: userData.last_name
    };
    
    console.log("Formatted user response:", userResponse);
    return NextResponse.json(userResponse);

  } catch (error) {
    console.log("[ORGANIZATION_GET] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}