"use client";

import { useAuth } from "@/hooks/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const RequireAuth = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { isLoading, isAuthenticated, refetch } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    refetch();
  }, [pathName, refetch]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // Prevent rendering protected content
  if (!isAuthenticated) {
    return null;
  }

  return <div className={className}>{children}</div>;
};

export default RequireAuth;
