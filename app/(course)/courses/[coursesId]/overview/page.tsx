import Image from "next/image";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import ReadText from "@/components/custom/ReadTwxt";
//import ReadText from "@/components/custom/ReadText";

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

  // Fetch instructor data using API endpoint
  const instructorResponse = await fetch(`/api/organizations/${course.organizationId}`, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  const instructor = await instructorResponse.json();

  let level;

  if (course.levelId) {
    level = await db.level.findUnique({
      where: {
        id: course.levelId,
      },
    });
  }

  const instructorName = instructor.firstName && instructor.lastName 
    ? `${instructor.firstName} ${instructor.lastName}`
    : "Unknown Instructor";

  const instructorImage = instructor.imageUrl || "/avatar_placeholder.jpg";

  return (
    <div className="px-6 py-4 flex flex-col gap-5 text-sm">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">{course.title}</h1>
      </div>


      <div className="flex gap-2 items-center">
        <Image
          src={instructorImage}
          alt={`${instructorName}'s photo`}
          width={30}
          height={30}
          className="rounded-full"
        />
        <p className="font-bold">Instructor:</p>
        <p>{instructorName}</p>
      </div>

      <div className="flex gap-2">
        <p className="font-bold">Price:</p>
        <p>${course.price}</p>
      </div>

      <div className="flex gap-2">
        <p className="font-bold">Level:</p>
        <p>{level?.name}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-bold">Description:</p>
        <ReadText value={course.description!} />
      </div>
    </div>
  );
};

export default CourseOverview;