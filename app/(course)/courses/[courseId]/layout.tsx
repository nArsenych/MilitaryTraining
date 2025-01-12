import CourseSideBar from "@/components/layout/CourseSideBar";
import Topbar from "@/components/layout/Topbar";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CourseDetailsLayout = async ({children, params,}: {children: React.ReactNode; params: { courseId: string };}) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
  });

  if (!course) {
    return redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#302E2B]">
      <div className="flex-1 flex">
        <CourseSideBar course={course} studentId={userId} />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
  
};

export default CourseDetailsLayout;