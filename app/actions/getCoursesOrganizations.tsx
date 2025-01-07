import { db } from "@/lib/db"
import { Course } from "@prisma/client"

const getCoursesByOrganization = async (organizationId: string | null): Promise<Course[]> => {
  const whereClause: any = {
    isPublished: true,
    ...(organizationId ? { organizationId } : {}),
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

export default getCoursesByOrganization