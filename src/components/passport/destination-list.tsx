"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CATEGORY_META,
  STAT_ORDER,
  type Cat,
  type Destination,
} from "@/lib/passport";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Flag } from "./flag";

export function DestinationList({
  destinations,
  filter,
  onFilter,
}: {
  destinations: Destination[];
  filter: Cat | "all";
  onFilter: (next: Cat | "all") => void;
}) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return destinations.filter((d) => {
      if (filter !== "all" && d.category !== filter) return false;
      if (q && !d.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [destinations, filter, query]);

  return (
    <>
      {/* Toolbar */}
      <div className="mt-9 mb-4 flex flex-wrap items-center justify-between gap-3.5">
        <h2 className="text-xl font-bold tracking-tight">
          Destinations
          <span className="text-muted-foreground ml-2 text-base font-medium">
            {visible.length}
          </span>
        </h2>
        <div className="relative w-full sm:w-56">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
          <Input
            placeholder="Filter destinations…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Filter pills */}
      <div className="mb-5 flex flex-wrap gap-2">
        <FilterPill active={filter === "all"} onClick={() => onFilter("all")}>
          All
        </FilterPill>
        {STAT_ORDER.map((cat) => {
          const meta = CATEGORY_META[cat];
          return (
            <FilterPill
              key={cat}
              active={filter === cat}
              onClick={() => onFilter(filter === cat ? "all" : cat)}
            >
              <span className={cn("size-2 rounded-full", meta.dot)} />
              {meta.label}
            </FilterPill>
          );
        })}
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          No destinations match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((d) => {
            const meta = CATEGORY_META[d.category];
            return (
              <Card
                key={d.name}
                className="flex-row items-center gap-3 p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <Flag code={d.code} label={d.name} className="h-6 w-9 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold" title={d.name}>
                    {d.name}
                  </div>
                  <span
                    className={cn(
                      "mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-semibold",
                      meta.badge,
                    )}
                  >
                    <span className={cn("size-2 rounded-full", meta.dot)} />
                    {d.detail}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-foreground text-background border-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
