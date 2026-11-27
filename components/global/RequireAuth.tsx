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
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  // Only redirect when auth state is resolved (not loading)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathName)}`);
    }
  }, [isLoading, isAuthenticated, router, pathName]);

  // Show loading only during initial auth check, not on navigation
  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-paper"
        role="status"
        aria-live="polite"
      >
        <div className="w-full max-w-xs px-6">
          <p className="eyebrow eyebrow-quiet">Quizergo</p>
          <p className="mt-3 text-sm text-ink-soft">
            Checking your session…
          </p>
          <div className="mt-5 h-px w-full bg-rule">
            <div className="h-px w-1/3 bg-marker" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <div className={className}>{children}</div>;
};

export default RequireAuth;
