
import CalendarCourses from "@/components/courses/CalendarCourse";
import ThreeIcon from "@/components/layout/ThreeIcon";
import { db } from "@/lib/db";

async function getOrganizationName(organizationId: string) {
  try {
    const response = await fetch(`https://api.clerk.dev/v1/users/${organizationId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`
      }
    });
    
    const instructor = await response.json();
    return formatFullName(instructor.first_name, instructor.last_name);
  } catch (error) {
    console.error("Error fetching organization name:", error);
    return "Unknown Organization";
  }
}

const formatFullName = (firstName?: string | null, lastName?: string | null): string => {
  if (!firstName && !lastName) return "Unknown User";
  if (!firstName) return lastName || "Unknown User";
  if (!lastName) return firstName;
  return `${firstName} ${lastName}`;
};

export default async function Home() {
  const courses = await db.course.findMany({
    where: {
      isPublished: true
    },
    include: {
      category: {
        select: {
          name: true
        }
      }
    }
  });

  const coursesWithOrganization = await Promise.all(
    courses.map(async (course) => ({
      ...course,
      organizationName: await getOrganizationName(course.organizationId)
    }))
  );

  return (
    <div className="min-h-screen w-full bg-[#302E2B]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mt-12 px-8">
          <ThreeIcon />
        </div>
        <div className="mt-9">
          <CalendarCourses courses={coursesWithOrganization} />
        </div>
      </div>
    </div>
  );
  
}