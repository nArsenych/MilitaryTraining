import { ReactNode } from "react"
import Topbar from "@/components/layout/Topbar"
import { getOrganizationStatus } from "@/components/NavbarRoutes";

const HomeLayout = async ({ children }: { children: ReactNode }) => {
  const isOrganization = await getOrganizationStatus();
    return (
      <div className="flex flex-col">
        <Topbar />
        <main className="min-h-screen bg-[#302E2B] pb-[14vh]">{children}</main>
      </div>
    );
  };

export default HomeLayout