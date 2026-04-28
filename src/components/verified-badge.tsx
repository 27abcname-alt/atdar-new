import { BadgeCheck } from "lucide-react";

import { cn } from "@/lib/utils";

export function VerifiedByAtdarBadge({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-primary shadow-sm",
        compact && "px-2 py-1 text-xs",
        className
      )}
    >
      <BadgeCheck className={cn("shrink-0", compact ? "h-3.5 w-3.5" : "h-5 w-5")} />
      <span className={cn("font-semibold leading-tight", compact && "text-[11px]")}>
        Verified by Atdar
      </span>
    </div>
  );
}
