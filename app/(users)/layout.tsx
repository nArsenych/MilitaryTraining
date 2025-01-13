import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";

const Instructorlayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = await auth(); 

  if (!userId) {
    redirect("/sign-in"); 
  }

  return (
    <div className="h-full flex flex-col">
    
      <div className="flex-1 flex h-full">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Instructorlayout;

