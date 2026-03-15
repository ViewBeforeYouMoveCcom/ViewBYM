import { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  id: string;
  label: string;
  helper?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

export default function FormField({
  id,
  label,
  helper,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {helper && !error ? (
        <p className="text-xs text-[#6B7280]">{helper}</p>
      ) : null}
      {error ? (
        <p className="text-xs text-[#EF4444]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
