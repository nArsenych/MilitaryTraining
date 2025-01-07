import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";
import getCoursesByCategory from "../../actions/getCoursesCategories";
import Categories from "@/components/custom/Categories";
import CourseCard from "@/components/courses/CourseCard";
import getCoursesByCity from "@/app/actions/getCoursesCities";
import Cities from "@/components/custom/Cities";

export default async function Citiess() {
  const cities = await db.city.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const courses = await getCoursesByCity(null);
  return (
    <div className="md:mt-5 md:px-10 xl:px-16 pb-16">
      <Cities cities={cities} selectedCity={null} />
      <div className="flex flex-wrap gap-7 justify-center">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      
    </div>
  );
}
