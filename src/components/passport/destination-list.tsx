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
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Flag } from "./flag";

// shadcn's default "on" state (bg-muted) is invisible on the light card, so
// give selected pills a solid fill that clearly reads as active.
const selectedPillClass =
  "data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background";

export function DestinationList({
  destinations,
  selected,
  onValueChange,
  onSelectAll,
}: {
  destinations: Destination[];
  selected: Set<Cat>;
  onValueChange: (cats: Cat[]) => void;
  onSelectAll: () => void;
}) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return destinations.filter((d) => {
      if (!selected.has(d.category)) return false;
      if (q && !d.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [destinations, selected, query]);

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
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Toggle
          size="sm"
          variant="outline"
          pressed={selected.size === STAT_ORDER.length}
          onPressedChange={() => onSelectAll()}
          className={selectedPillClass}
        >
          All
        </Toggle>
        <ToggleGroup
          type="multiple"
          size="sm"
          variant="outline"
          value={[...selected]}
          onValueChange={(vals) => onValueChange(vals as Cat[])}
          className="flex-wrap"
        >
          {STAT_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <ToggleGroupItem
                key={cat}
                value={cat}
                aria-label={meta.label}
                className={selectedPillClass}
              >
                <span className={cn("size-2 rounded-full", meta.dot)} />
                {meta.label}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
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
