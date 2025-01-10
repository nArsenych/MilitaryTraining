"use client"

import { Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Home } from "lucide-react";

interface OrganizationsProps {
  courses: Course[];
  selectedOrganization: string | null;
}

interface OrganizationInfo {
  id: string;
  name: string;
}

const Organizations = ({ courses, selectedOrganization }: OrganizationsProps) => {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<OrganizationInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const uniqueOrgIds = Array.from(new Set(courses.map(course => course.organizationId)));
        console.log("Unique organization IDs:", uniqueOrgIds);
        
        const orgs = await Promise.all(
          uniqueOrgIds.map(async (orgId) => {
            if (!orgId) return null;
            
            try {
              const response = await fetch(`/api/organizations/${orgId}`);
              
              if (!response.ok) {
                throw new Error(`Error fetching organization ${orgId}`);
              }

              const data = await response.json();
              console.log(`Organization data for ${orgId}:`, data);
              
              return {
                id: orgId,
                name: data.name || "Unknown Organization" // Тепер використовуємо поле name з OrganizationProfile
              };
            } catch (error) {
              console.error(`Error fetching organization ${orgId}:`, error);
              return null;
            }
          })
        );
        
        const validOrgs = orgs.filter((org): org is OrganizationInfo => org !== null);
        console.log("Final organizations data:", validOrgs);
        setOrganizations(validOrgs);
      } catch (error) {
        console.error("Error in fetchOrganizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [courses]);

  const onClick = (organizationId: string | null) => {
    router.push(organizationId ? `/organizations/${organizationId}` : "/organizations");
  };

  const onHomeClick = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-wrap px-4 gap-7 justify-center my-10">
      <Button
        variant="outline"
        onClick={onHomeClick}
        className="gap-2"
      >
        <Home size={20} />
      </Button>
      
      <Button
        variant={selectedOrganization === null ? "default" : "outline"}
        onClick={() => onClick(null)}
      >
        Всі організації
      </Button>
      {organizations.map((org) => (
        <Button
          key={org.id}
          variant={selectedOrganization === org.id ? "default" : "outline"}
          onClick={() => onClick(org.id)}
        >
          {org.name}
        </Button>
      ))}
    </div>
  );
};

export default Organizations;