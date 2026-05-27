import { BadgeCheck, Star, Clock } from "lucide-react";

import { cn } from "@/lib/utils";

export function VerifiedByAtdarBadge({
  className,
  compact,
  moderatorName,
  isPending,
}: {
  className?: string;
  compact?: boolean;
  moderatorName?: string | null;
  isPending?: boolean;
}) {
  if (isPending) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700 shadow-sm",
          compact && "px-2 py-1 text-[10px]",
          className
        )}
      >
        <Clock className={cn("shrink-0", compact ? "h-3 w-3" : "h-4.4 w-4")} />
        <span className={cn("font-bold uppercase tracking-wider", compact && "text-[9px]")}>
          Pending Verification
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700 shadow-sm",
        compact && "px-2 py-1 text-xs",
        className
      )}
    >
      <div className="flex items-center gap-1">
        <BadgeCheck className={cn("shrink-0", compact ? "h-3.5 w-3.5" : "h-5 w-5")} />
        <Star className={cn("shrink-0 fill-emerald-500 text-emerald-500", compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5")} />
      </div>
      <span className={cn("font-bold leading-tight", compact && "text-[11px]")}>
        Verified by {moderatorName || "Atdar"}
      </span>
    </div>
  );
}
