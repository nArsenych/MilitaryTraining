"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Library, Users, MapPin } from 'lucide-react';

const ThreeIcon = () => {
  const pathname = usePathname();

  const ThreeIconRoutes = [
    {
      icon: <Library />,
      label: "Категорії",
      path: "/categories"
    },
    {
      icon: <Users />,
      label: "Організації",
      path: "/organizations",
    },
    {
      icon: <MapPin />,
      label: "Міста",
      path: "/cities",
    },
  ];

  return (
    <div className="">
      {ThreeIconRoutes.map((route) => (
        <Link
          href={route.path}
          key={route.path}
          className={`flex items-center gap-4 p-3 rounded-lg hover:bg-[#FFF8EB]
                ${pathname.startsWith(route.path) && "bg-[#FDAB04] hover:bg-[#FDAB04]/80"}
                `}
        >
          {route.icon} {route.label}
        </Link>
      ))}
    </div>
  );
}

export default ThreeIcon;