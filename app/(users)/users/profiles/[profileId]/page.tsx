import { getOrganizationStatus } from "@/components/NavbarRoutes";
import EditProfileForm from "@/components/profiles/EditProfileForm";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface PageProps {
  params: { profileId: string };
}

const ProfileBasics = async ({ params }: PageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const [profile] = await Promise.all([
    db.profile.findUnique({
      where: {
        id: params.profileId,
        user_id: userId,
      },
    })
  ]);

  if (!profile) {
    return redirect("/instructor/courses");
  }

  const isOrganization = await getOrganizationStatus();
  return (
    <div className="px-10">
      <EditProfileForm 
        profile={profile} 
        isOrganization={isOrganization} 
      />
    </div>
  );
};

export default ProfileBasics;