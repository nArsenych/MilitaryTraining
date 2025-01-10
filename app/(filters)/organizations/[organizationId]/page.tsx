// Спочатку виправимо інтерфейс у компоненті Organization:
interface OrganizationsProps {
    courses: Course[];  // замість organization
    selectedOrganization: string | null;
  }
  
  // Тепер виправимо основний компонент CoursesByOrg:
  import { db } from "@/lib/db";
  import CourseCard from "@/components/courses/CourseCard";
  import getCoursesByOrganization from "@/app/actions/getCoursesOrganizations";
  import Organization from "@/components/custom/Organizations";
import { Course } from "@prisma/client";
  
  const CoursesByOrg = async ({
    params,
  }: {
    params: { organizationId: string };
  }) => {
    // Отримуємо всі курси
    const courses = await getCoursesByOrganization(null);
    
    return (
      <div className="md:mt-5 md:px-10 xl:px-16 pb-16">
        <Organization 
          courses={courses} 
          selectedOrganization={params.organizationId} 
        />
        <div className="flex flex-wrap gap-7 justify-center">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    );
  };
  
  export default CoursesByOrg;