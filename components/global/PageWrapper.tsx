import { cn } from "@/lib/utils";
import React from "react";

const PageWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
