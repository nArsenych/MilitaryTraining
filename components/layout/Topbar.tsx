"use client"

import Link from "next/link"
import Image from 'next/image';
import { Search } from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import router from "next/router";
import { useRouter } from "next/navigation";

const Topbar = () => {
    const { isSignedIn } = useAuth();
    const router = useRouter();

    const topRoutes = [
        { label: "Створення курсів", path: "/instructor/courses" },
    ];

    const [searchInput, setSearchInput] = useState("");

    const handleSearch = () => {
        if (searchInput.trim() !== "") {
            router.push(`/search?query=${searchInput}`);
        }
        setSearchInput("");
    };

    return (
        <>
            <div
                className="relative w-full h-screen bg-cover bg-center"
                style={{
                    backgroundImage: `url('/logo1.jpg')`,
                }}
            >
                <div className="relative flex justify-between items-center p-4">

                    <div className="max-md:hidden w-full flex justify-between items-center gap-4">
                        <div className="max-md:hidden w-[400px] rounded-full flex">
                            <input
                                className="flex-grow bg-[#FFF8EB] rounded-l-full border-none outline-none text-sm pl-4 py-3"
                                placeholder="Search for courses"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <button
                                className="bg-[#FDAB04] rounded-r-full border-none outline-none cursor-pointer px-4 py-3 hover:bg-[#FDAB04]/80"
                                disabled={searchInput.trim() === ""}
                                onClick={handleSearch}
                            >
                                <Search className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-6 ml-auto">
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
                <div className="mt-[17vh] ml-[5vh]">
                    <p
                        className="text-6xl text-[#EBAC66] font-sans leading-relaxed tracking-wider"
                        style={{ fontFamily: "KyivType Sans", wordSpacing: "0.5rem", whiteSpace: "pre-wrap" }}
                    >
                        КУРСИ ПО <br />
                        ВІЙСЬКОВІЙ ПІДГОТОВЦІ
                    </p>
                </div>

            </div>
        </>
    );
};

export default Topbar;