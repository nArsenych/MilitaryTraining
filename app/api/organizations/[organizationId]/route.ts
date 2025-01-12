// app/api/organizations/[orgId]/route.ts
import { NextResponse } from "next/server";
import { headers } from 'next/headers';

export async function GET(
  req: Request,
  { params }: { params: { organizationId: string } }
) {
  try {
    // Get the host from headers
    const headersList = headers();
    const host = headersList.get('host') || '';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    // When calling external API (Clerk)
    const clerkResponse = await fetch(`https://api.clerk.dev/v1/users/${params.organizationId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`
      }
    });

    if (!clerkResponse.ok) {
      console.log("Clerk API response not OK:", clerkResponse.status);
      return new NextResponse("Organization not found", { status: 404 });
    }

    const userData = await clerkResponse.json();
    console.log("Raw Clerk user data:", userData);

    const userResponse = {
      firstName: userData.first_name, 
      lastName: userData.last_name
    };
    
    console.log("Formatted user response:", userResponse);
    return NextResponse.json(userResponse);

  } catch (error) {
    console.log("[ORGANIZATION_GET] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}