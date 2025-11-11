"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Optional: show loading until session is checked
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen text-blue-600 font-semibold">
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}
