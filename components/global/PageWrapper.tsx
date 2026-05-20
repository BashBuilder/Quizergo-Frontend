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
      className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6", className)}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
