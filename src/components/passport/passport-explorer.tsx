"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { List, Map } from "lucide-react";
import { loadPassportDetail } from "@/app/actions";
import { cn } from "@/lib/utils";
import {
  MOBILITY_CATS,
  STAT_ORDER,
  type Cat,
  type PassportDetail,
  type PassportListItem,
} from "@/lib/passport";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PassportCombobox } from "./passport-combobox";
import { ScoreSummary } from "./score-summary";
import { StatGrid } from "./stat-grid";
import { DestinationList } from "./destination-list";
import { ResultSkeleton } from "./result-skeleton";

// The map pulls in d3-geo + the bundled TopoJSON; keep it out of the initial
// bundle and load it only once a passport is selected.
const WorldMap = dynamic(
  () => import("./world-map").then((m) => m.WorldMap),
  {
    ssr: false,
    loading: () => (
      <div className="bg-card ring-foreground/10 mt-1 aspect-[800/412] w-full animate-pulse rounded-xl ring-1" />
    ),
  },
);

type ViewMode = "map" | "list";

export function PassportExplorer({
  passports,
}: {
  passports: PassportListItem[];
}) {
  const [selected, setSelected] = useState<PassportListItem | undefined>();
  const [detail, setDetail] = useState<PassportDetail | null>(null);
  // Only shown for genuinely slow loads — fast loads (the common case) swap
  // straight to content so the skeleton never flickers.
  const [showSkeleton, setShowSkeleton] = useState(false);
  // Which visa categories are visible. Multi-select; defaults to the mobility
  // categories (entry without a prior visa). Shared by the map and the list.
  const [filter, setFilter] = useState<Set<Cat>>(() => new Set(MOBILITY_CATS));
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  // When true, re-reveal the landing hero so the user can pick a new passport.
  const [picking, setPicking] = useState(false);
  const pickerInputRef = useRef<HTMLInputElement>(null);

  // Focus the search field when the picker is re-opened from the score card.
  useEffect(() => {
    if (picking) pickerInputRef.current?.focus();
  }, [picking]);

  const toggleCat = (cat: Cat) =>
    setFilter((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  const selectAll = () => setFilter(new Set(STAT_ORDER));
  const setCats = (cats: Cat[]) => setFilter(new Set(cats));
  // Guards against an earlier (slower) request overwriting a newer selection.
  const requestId = useRef(0);
  // Read in handleSelect without making it a dependency / going stale.
  const detailRef = useRef(detail);
  detailRef.current = detail;

  async function handleSelect(passport: PassportListItem) {
    setSelected(passport);
    setPicking(false);
    setFilter(new Set(MOBILITY_CATS));
    const id = ++requestId.current;

    // Show the skeleton only if we have nothing on screen yet AND the load
    // is slow. Otherwise the previous passport stays visible until the new
    // data arrives, then swaps in place — no blank, no flash.
    let skeletonTimer: ReturnType<typeof setTimeout> | undefined;
    if (!detailRef.current) {
      skeletonTimer = setTimeout(() => {
        if (id === requestId.current) setShowSkeleton(true);
      }, 200);
    }

    const result = await loadPassportDetail(passport.name);
    clearTimeout(skeletonTimer);
    if (id !== requestId.current) return; // a newer selection won
    setDetail(result);
    setShowSkeleton(false);
  }

  const showHero = !selected || picking;

  return (
    <div>
      {/* Landing / picker hero — collapses away once a passport is chosen */}
      <div
        aria-hidden={!showHero}
        className={cn(
          "grid transition-all duration-500 ease-out motion-reduce:transition-none",
          showHero
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] -translate-y-4 opacity-0",
        )}
      >
        {/* Clip only while collapsing; expanded must overflow so the
            combobox dropdown isn't cut off. */}
        <div className={showHero ? "overflow-visible" : "overflow-hidden"}>
          <header className="px-1 pt-4 pb-2 text-center">
            <span className="bg-accent text-accent-foreground mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold">
              ✦ {passports.length} passports · {passports.length} destinations
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
              How powerful is your{" "}
              <span className="from-brand to-brand-2 bg-gradient-to-r bg-clip-text text-transparent">
                passport
              </span>
              ?
            </h1>
            <p className="text-muted-foreground mx-auto mt-3.5 max-w-xl text-base text-pretty sm:text-lg">
              Pick your passport to see where you can travel visa-free, where
              you need a visa, and your global mobility score.
            </p>

            <div className="mx-auto mt-7 max-w-md">
              <PassportCombobox
                passports={passports}
                selected={selected}
                onSelect={handleSelect}
                inputRef={pickerInputRef}
              />
            </div>
          </header>
        </div>
      </div>

      {/* Result */}
      {!selected ? null : showSkeleton ? (
        <ResultSkeleton />
      ) : detail ? (
        <section className="animate-in fade-in slide-in-from-bottom-2 mt-6 duration-500 motion-reduce:animate-none">
          <ScoreSummary detail={detail} onChange={() => setPicking((p) => !p)} />
          <StatGrid
            counts={detail.counts}
            selected={filter}
            onToggle={toggleCat}
          />

          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
            className="mt-5"
          >
            <TabsList className="self-end">
              <TabsTrigger value="map">
                <Map className="size-4" />
                Map
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="size-4" />
                List
              </TabsTrigger>
            </TabsList>
            <TabsContent value="map" className="mt-4">
              <WorldMap
                destinations={detail.destinations}
                selected={filter}
                homeCode={detail.code}
                homeName={detail.name}
              />
            </TabsContent>
            <TabsContent value="list">
              <DestinationList
                destinations={detail.destinations}
                selected={filter}
                onValueChange={setCats}
                onSelectAll={selectAll}
              />
            </TabsContent>
          </Tabs>
        </section>
      ) : null}
    </div>
  );
}
