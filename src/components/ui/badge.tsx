import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#0F172A]/5 text-[#0F172A]",
        teal: "border-transparent bg-blue-50 text-blue-700",
        amber: "border-transparent bg-[#FBBF24]/20 text-[#0F172A]",
        success: "border-transparent bg-[#22C55E]/15 text-[#0F172A]",
        warning: "border-transparent bg-[#F97316]/15 text-[#0F172A]",
        error: "border-transparent bg-[#EF4444]/15 text-[#0F172A]",
        outline: "border-[#E5E7EB] text-[#0F172A]",
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
