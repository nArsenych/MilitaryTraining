import { db } from "@/lib/db"
import { Course } from "@prisma/client"

const getCoursesByCity = async (cityId: string | null): Promise<Course[]> => {
  const whereClause: any = {
    ...(cityId ? { cityId, isPublished: true } : { isPublished: true }),
  }
  const courses = await db.course.findMany({
    where: whereClause,
    include: {
      category: true,
      level: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return courses
}

export default getCoursesByCity