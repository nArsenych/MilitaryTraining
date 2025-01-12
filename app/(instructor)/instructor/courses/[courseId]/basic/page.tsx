import EditCourseForm from "@/components/courses/EditCourseForm";
import AlertBanner from "@/components/custom/AlertBaner";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface PageProps {
  params: { courseId: string };
}

const CourseBasics = async ({ params }: PageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const [course, categories, level, city] = await Promise.all([
    db.course.findUnique({
      where: {
        id: params.courseId,
        organizationId: userId,
      },
    }),
    db.category.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    db.level.findMany(),
    db.city.findMany()
  ]);

  if (!course) {
    return redirect("/instructor/courses");
  }

  const requiredFields = [
    course.title,
    course.categoryId,
    course.cityId,
    course.levelId,
    course.startAge,
    course.startDate,
    course.endDate,
  ];
  const requiredFieldsCount = requiredFields.length;
  const missingFields = requiredFields.filter((field) => !Boolean(field));
  const missingFieldsCount = missingFields.length;
  const isCompleted = requiredFields.every(Boolean);

  return (
    <div className="px-10">
      <AlertBanner
        isCompleted={isCompleted}
        missingFieldsCount={missingFieldsCount}
        requiredFieldsCount={requiredFieldsCount}
      />
      <EditCourseForm 
        course={course} 
        categories={categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
        levels={level.map((level) => ({
          label: level.name,
          value: level.id,
        }))}
        cities={city.map((city) => ({
          label: city.name,
          value: city.id,
        }))}
        isCompleted={isCompleted} 
      />
    </div>
  );
};

export default CourseBasics;