import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

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