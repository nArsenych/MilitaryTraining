"use client";

import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  
  return (
    <SignUp
      afterSignUpUrl="/select-type"
    />
  );
}