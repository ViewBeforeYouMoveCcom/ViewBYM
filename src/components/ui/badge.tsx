import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gray-900/5 text-gray-900",
        teal: "border-transparent bg-blue-50 text-blue-700",
        blue: "border-transparent bg-blue-50 text-blue-700",
        amber: "border-transparent bg-[#FBBF24]/20 text-gray-900",
        success: "border-transparent bg-[#22C55E]/15 text-gray-900",
        warning: "border-transparent bg-[#F97316]/15 text-gray-900",
        error: "border-transparent bg-[#EF4444]/15 text-gray-900",
        outline: "border-gray-200 text-gray-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
