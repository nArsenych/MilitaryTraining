import { db } from "@/lib/db";
import { Course } from "@prisma/client";
import Link from "next/link";

interface CourseSideBarProps {
  course: Course;
  studentId: string;
}

const CourseSideBar = async ({ course, studentId }: CourseSideBarProps) => {
  

  return (
    <div className="hidden md:flex flex-col w-64 border-r shadow-md px-3 text-sm font-medium bg-[#4E4C4B] pt-4">
      <h1 className="text-lg font-bold text-center mb-4 text-[#ebac66]">{course.title}</h1>
       
      <Link
        href={`/`}
        className={`p-3 rounded-lg hover:bg-[#ebac66] mt-4`}
      >
        Home
      </Link>
      <Link
        href={`/courses/${course.id}/overview`}
        className={`p-3 rounded-lg hover:bg-[#ebac66] mt-4`}
      >
        Інформація про курс
      </Link>
      <Link
        href={`/courses/${course.id}/overview`}
        className={`p-3 rounded-lg hover:bg-[#ebac66] mt-4`}
      >
        Організація
      </Link>
     
    </div>
  );
};

export default CourseSideBar;