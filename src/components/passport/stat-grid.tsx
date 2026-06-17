"use client";

import { cn } from "@/lib/utils";
import { CATEGORY_META, STAT_ORDER, type Cat } from "@/lib/passport";

export function StatGrid({
  counts,
  selected,
  onToggle,
}: {
  counts: Record<Cat, number>;
  selected: Set<Cat>;
  onToggle: (cat: Cat) => void;
}) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {STAT_ORDER.map((cat) => {
        const meta = CATEGORY_META[cat];
        const isActive = selected.has(cat);
        return (
          <button
            key={cat}
            onClick={() => onToggle(cat)}
            aria-pressed={isActive}
            className={cn(
              "bg-card flex flex-col gap-0.5 rounded-xl border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5",
              isActive && "border-primary ring-primary/30 ring-3",
            )}
          >
            <span className="text-2xl font-bold">{counts[cat]}</span>
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <span className={cn("size-2.5 rounded-full", meta.dot)} />
              {meta.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
