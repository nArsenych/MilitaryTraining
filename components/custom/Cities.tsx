"use client"

import { City } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CategoriesProps {
  cities: City[];
  selectedCity: string | null;
}

const Cities = ({ cities, selectedCity }: CategoriesProps) => {
  const router = useRouter();

  const onClick = (cityId: string | null) => {
    router.push(cityId ? `/cities/${cityId}` : "/");
  };

  return (
    <div className="flex flex-wrap px-4 gap-7 justify-center my-10">
      <Button
        variant={selectedCity === null ? "default" : "outline"}
        onClick={() => onClick(null)}
      >
        All Categories
      </Button>
      {cities.map((city) => (
        <Button
          key={city.id}
          variant={selectedCity === city.id ? "default" : "outline"}
          onClick={() => onClick(city.id)}
        >
          {city.name}
        </Button>
      ))}
    </div>
  );
};

export default Cities;