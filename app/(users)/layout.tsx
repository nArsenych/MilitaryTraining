import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileSidebar from "@/components/layout/ProfileSideBar";
import { db } from "@/lib/db";

const Instructorlayout  = async ({children,}: {children: React.ReactNode; params: { profileId: string };}) => {
    const { userId } = await auth();
  
    if (!userId) {
      return redirect("/sign-in");
    }
  
    const profile = await db.profile.findUnique({
      where: {
        user_id: userId,
      },
    });
  
    if (!profile) {
      return redirect("/");
    }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex h-full">
        <ProfileSidebar profile={profile}/>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Instructorlayout;

