import { cn } from "@/lib/utils";
import React from "react";

export function DashboardShell({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid items-start gap-8 p-8", className)} {...props}>
      {children}
    </div>
  );
} 