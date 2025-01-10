"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { UserType } from "@prisma/client";

export default function SelectTypePage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onSelect = async (type: UserType) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user-type", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, type }),
      });

      if (!response.ok) {
        throw new Error("Failed to set user type");
      }

      router.push(type === "ORGANIZATION" ? "/profile/organization" : "/profile/client");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold mb-4">Оберіть тип облікового запису</h1>
      <div className="flex gap-4">
        <Button 
          onClick={() => onSelect("ORGANIZATION")} 
          disabled={isLoading}
        >
          Організація
        </Button>
        <Button 
          onClick={() => onSelect("CLIENT")} 
          disabled={isLoading}
        >
          Клієнт
        </Button>
      </div>
    </div>
  );
}