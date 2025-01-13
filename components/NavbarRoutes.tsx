// components/NavbarRoutes.tsx
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function getOrganizationStatus() {
  const { userId } = await auth();
  
  if (!userId) {
    return false;
  }

  const profile = await db.profile.findUnique({
    where: {
      id: userId
    },
    select: {
      isOrganization: true
    }
  });

  return profile?.isOrganization || false;
}