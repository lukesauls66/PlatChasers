"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import UserManagementPage from "@/components/UserManagementPage";

export default function Users() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAdmin = session?.user.isAdmin === true;

  useEffect(() => {
    if (status === "authenticated" && !isAdmin) {
      router.push("/");
    }
  }, [status, isAdmin, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center pt-20">
        <p className="text-3xl font-bold">Loading...</p>
      </div>
    );
  }

  return <>{isAdmin ? <UserManagementPage /> : null}</>;
}
