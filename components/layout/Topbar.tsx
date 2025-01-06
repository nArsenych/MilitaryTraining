"use client"

import Link from "next/link"
import Image from 'next/image';
import { Search } from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const Topbar = () => {
    const { isSignedIn } = useAuth();

    const topRoutes = [
        { label: "Instructor", path: "/instructor/courses" },
        { label: "Learning", path: "/learning" },
    ];

    return (
        <>
            <div
                className="relative w-full h-screen bg-cover bg-center"
                style={{
                    backgroundImage: `url('/logo1.jpg')`,
                }}
            >
                <div className="relative flex justify-between items-center p-4">

                    <div className="max-md:hidden w-[400px] rounded-full flex">
                        <input
                            className="flex-grow bg-[#FFF8EB] rounded-l-full border-none outline-none text-sm pl-4 py-3"
                            placeholder="Search for courses"
                        />
                        <button
                            className="bg-[#EBAC66] rounded-r-full border-none outline-none cursor-pointer px-4 py-3 hover:bg-[#EBAC66]/80">
                            <Search className="h-4 w-4" />
                        </button>

                        <div className="flex gap-6 items-center">
                            <div className="max-sm:hidden flex gap-6">
                                {topRoutes.map((route) => (
                                    <Link
                                        href={route.path}
                                        key={route.path}
                                        className="text-sm font-medium hover:text-[#FDAB04]"
                                    >
                                        {route.label}
                                    </Link>
                                ))}
                            </div>

                            {isSignedIn ? (
                                <UserButton afterSignOutUrl="/sign-in" />
                            ) : (
                                <Link href="/sign-in"><Button>Sign In</Button></Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Topbar;