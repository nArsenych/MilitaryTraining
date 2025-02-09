import Image from "next/image";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ReadText from "@/components/custom/ReadTwxt";
import Link from "next/link";

const CourseOverview = async ({ params }: { params: { courseId: string } }) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      isPublished: true,
    },
  });

  if (!course) {
    return redirect("/");
  }

  const userProfile = await db.profile.findUnique({
    where: {
      user_id: course.organizationId,
    }
  });

  const response = await fetch(`https://api.clerk.dev/v1/users/${course.organizationId}`, {
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

  let level;
  if (course.levelId) {
    level = await db.level.findUnique({
      where: {
        id: course.levelId,
      },
    });
  }

  let city;
  if (course.cityId) {
    city = await db.city.findUnique({
      where: {
        id: course.cityId,
      },
    });
  }

  return (
    <div className="px-6 py-4 flex flex-col gap-5 text-sm">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-[#ebac66]">{course.title}</h1>
      </div>

      <div className="flex gap-2 items-center">
        <Image
          src={instructor.image_url || "/avatar_placeholder.jpg"}
          alt={formatFullName(instructor.first_name, instructor.last_name) || "Instructor photo"}
          width={30}
          height={30}
          className="rounded-full"
        />
        {userProfile && (
          <Link
            href={`/profile/${userProfile.id}/overview`}
            className="border rounded-lg cursor-pointer p-2"
          >
            <p className="text-[#ebac66] font-bold">Організація:</p>
            <p>{userProfile.full_name || "Невідома організація"}</p>
          </Link>
        )}
      </div>

      <div className="flex gap-2">
        <p className="text-[#ebac66] font-bold">Ціна:</p>
        <p>{course.price}</p>
      </div>

      <div className="flex gap-2">
        <p className=" text-[#ebac66] font-bold">Для кого розрахований курс:</p>
        <p>{level?.name}</p>
      </div>

      <div className="flex gap-2">
        <p className=" text-[#ebac66] font-bold">Де буде проходити:</p>
        <p>{city?.name}</p>
      </div>

      <div className="flex gap-4">
        <div className="flex gap-2">
          <p className=" text-[#ebac66] font-bold">Дата початку:</p>
          <p>{course.startDate?.toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <p className="text-[#ebac66] font-bold">Дата закінчення:</p>
          <p>{course.endDate?.toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex gap-2">
          <p className=" text-[#ebac66] font-bold">Від якого віку:</p>
          <p>{course.startAge}</p>
        </div>
        <div className="flex gap-2">
          <p className="text-[#ebac66] font-bold">До якого віку:</p>
          <p>{course.endAge}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[#ebac66] font-bold">Опис:</p>
        <ReadText value={course.description!} />
      </div>
    </div>
  );
};

export default CourseOverview;