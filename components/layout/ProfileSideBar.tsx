"use client";

import { UserButton } from "@clerk/nextjs";
import { Profile } from "@prisma/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface CourseSideBarProps {
    profile: Profile;
}

const ProfileSidebar = ({ profile }: CourseSideBarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    
    useEffect(() => {
        if (pathname === '/') {
            router.push('/users/profiles');
        }
    }, [pathname, router]);
    
    return (
        <div className="hidden md:flex flex-col w-64 border-r shadow-md px-3 text-sm font-medium bg-[#4E4C4B] pt-4">
            <h1 className="text-lg font-bold text-center mb-4 text-[#ebac66]">{profile.full_name}</h1>
            <UserButton />
            <Link
                href={`/`}
                className={`p-3 rounded-lg hover:bg-[#ebac66] mt-4`}
            >
                Home
            </Link>
            <Link
                href={`/users/profiles`}
                className={`p-3 rounded-lg hover:bg-[#ebac66] mt-4`}
            >
                Вигляд профілю
            </Link>
            <Link
                href={`/users/profiles/${profile.id}`}
                className={`p-3 rounded-lg hover:bg-[#ebac66] mt-4`}
            >
                Редагування профілю
            </Link>
        </div>
    );
};

export default ProfileSidebar;