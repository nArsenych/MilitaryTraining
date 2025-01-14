import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import ReadText from "@/components/custom/ReadTwxt";

const CourseOverview = async ({ params }: { params: { profileId: string } }) => {
    const { userId } = await auth();
    
    if (!userId) {
      return redirect("/sign-in");
    }

const profile = await db.profile.findUnique({
  where: {
    user_id: userId
  },
});

  if (!profile) {
    return redirect("/");
  }

  const response = await fetch(`https://api.clerk.dev/v1/users/${profile.user_id}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`
    }
  });
  
  const instructor = await response.json();

  const formatFullName = (firstName?: string | null, lastName?: string | null): string => {
    if (!firstName && !lastName) return "Unknown User";
    if (!firstName) return lastName || "Unknown User";
    if (!lastName) return firstName;
    return `${firstName} ${lastName}`;
  };

  return (
    <div className="px-6 py-4 flex flex-col gap-5 text-sm">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-[#ebac66]">{profile.full_name}</h1>
      </div>

      <div className="flex gap-2 items-center">
        <Image
          src={instructor.image_url || "/avatar_placeholder.jpg"}
          alt={formatFullName(instructor.first_name, instructor.last_name) || "Instructor photo"}
          width={30}
          height={30}
          className="rounded-full"
        />
      </div>

      <div className="flex gap-2">
        <p className="text-[#ebac66] font-bold">Вік:</p>
        <p>{profile.age}</p>
      </div>

      <div className="flex gap-2">
        <p className=" text-[#ebac66] font-bold">Номер телефону:</p>
        <p>{profile.phone_number}</p>
      </div>

      <div className="flex gap-4">
        <div className="flex gap-2">
          <p className=" text-[#ebac66] font-bold">Instagram:</p>
          <p>{profile.instagram}</p>
        </div>
        <div className="flex gap-2">
          <p className=" text-[#ebac66] font-bold">Telegram:</p>
          <p>{profile.telegram}</p>
        </div>
        <div className="flex gap-2">
          <p className="text-[#ebac66] font-bold">Facebook:</p>
          <p>{profile.facebook}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[#ebac66] font-bold">Опис:</p>
        <ReadText value={profile.description!} />
      </div>
    </div>
  );
};

export default CourseOverview;