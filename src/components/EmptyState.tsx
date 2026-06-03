import Link from "next/link";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E7EB] bg-[#F9FAFB] px-6 py-12 text-center",
        className
      )}
    >
      <h3 className="font-heading text-lg font-semibold text-gray-900">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-[#6B7280]">{description}</p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-5 inline-flex items-center rounded-lg bg-[#08519A] px-5 py-2.5 text-[14px] font-semibold !text-white transition-colors hover:bg-[#063d75]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
