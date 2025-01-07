import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";
import CourseCard from "@/components/courses/CourseCard";
import Organizations from "@/components/custom/Organizations"; 
import getCoursesByOrganization from "../../actions/getCoursesOrganizations"; 

export default async function OrganizationsPage() {
  const allCourses = await db.course.findMany({
    where: {
      isPublished: true
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const courses = await getCoursesByOrganization(null);

  return (
    <div className="md:mt-5 md:px-10 xl:px-16 pb-16">
      <Organizations courses={allCourses} selectedOrganization={null} />
      <div className="flex flex-wrap gap-7 justify-center">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}