import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server"
import { Course } from "@prisma/client"
import { Gem } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CourseCard = async ({ course }: { course: Course }) => {
    const response = await fetch(`https://api.clerk.dev/v1/users/${course.organizationId}`, {
        headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`
        }
    });
    const organization = await response.json();
    console.log("User data:", organization);
    let level;
    if (course.levelId) {
        level = await db.level.findUnique({
            where: {
                id: course.levelId,
            },
        });
    }
    const fullName = organization.firstName && organization.lastName
        ? `${organization.firstName} ${organization.lastName}`
        : "Unknown User";

    return (
        <Link
            href={`/courses/${course.id}/overview`}
            className="border rounded-lg cursor-pointer"
        >
            <Image
                src={course.imageUrl || "/image_placeholder.webp"}
                alt={course.title}
                width={500}
                height={300}
                className="rounded-t-xl w-[320px] h-[180px] object-cover"
            />
            <div className="px-4 py-3 flex flex-col gap-2">
                <h2 className="text-lg font-bold hover:[#FDAB04]">{course.title}</h2>
                <div className="flex justify-between text-sm font-medium">
                    {organization && (
                        <div className="flex gap-2 items-center">
                            <Image
                                src={organization.image_url || "/avatar_placeholder.jpg"}
                                alt={`${organization.first_name} ${organization.last_name}`}
                                width={30}
                                height={30}
                                className="rounded-full"
                            />
                            <p className="text-black">{`${organization.first_name} ${organization.last_name}`}</p>
                        </div>
                    )}
                    {level && (
                        <div className="flex gap-2">
                            <p>{level.name}</p>
                        </div>
                    )}
                </div>
                <p className="text-sm font-bold">$ {course.price}</p>
            </div>
        </Link>
    );
}

export default CourseCard