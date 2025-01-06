import { ReactNode } from "react"
import Topbar from "@/components/layout/Topbar"

const HomeLayout = ({ children }: { children: ReactNode }) => {
    return (
      <div className="flex flex-col">
        <Topbar />
        <main className="min-h-screen bg-white">{children}</main>
      </div>
    );
  };

export default HomeLayout