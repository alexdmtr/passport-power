import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { STAT_ORDER } from "@/lib/passport";

export function ResultSkeleton() {
  return (
    <section className="mt-10" aria-busy="true" aria-label="Loading passport details">
      {/* Score summary */}
      <Card className="flex-row items-center gap-5 p-6">
        <Skeleton className="h-14 w-[84px] rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="mt-3 h-9 w-64" />
        </div>
      </Card>

      {/* Stat grid */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STAT_ORDER.map((cat) => (
          <div
            key={cat}
            className="bg-card flex flex-col gap-2 rounded-xl border p-4 shadow-sm"
          >
            <Skeleton className="h-7 w-10" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mt-9 mb-4 flex flex-wrap items-center justify-between gap-3.5">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-9 w-full sm:w-56" />
      </div>

      {/* Filter pills */}
      <div className="mb-5 flex flex-wrap gap-2">
        {Array.from({ length: STAT_ORDER.length + 1 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>

      {/* Destination grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Card key={i} className="flex-row items-center gap-3 p-3.5 shadow-sm">
            <Skeleton className="h-6 w-9 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
