import EditCourseForm from '@/components/courses/EditCourseForm'
import AlertBanner from '@/components/custom/AlertBaner';
import { db } from '@/lib/db';
import { auth, Organization } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

const CourseBasics = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      organizationId: userId
    },
  })

  if (!course) {
    return redirect('/instructor/courses')
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  const level = await db.level.findMany();

  const city = await db.city.findMany();

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
      <EditCourseForm course={course} categories={categories.map((category) => ({
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
        isCompleted={isCompleted} />
    </div>
  )
}

export default CourseBasics