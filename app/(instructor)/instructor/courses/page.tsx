import Link from 'next/link'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button'
import { db } from '@/lib/db';
import { DataTable } from '@/components/custom/DataTable';
import { columns } from '@/components/courses/Columns';


const CoursesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const courses = await db.course.findMany({
    where: {
      organizationId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="px-6 py-4">
      <Link href="/instructor/create-course">
        <Button>Create New Course</Button>
      </Link>
      
      <div className="mt-[5vh]">
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  );
};


export default CoursesPage