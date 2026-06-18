"use client";

import { useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { cn } from "@/lib/utils";
import {
  CATEGORY_META,
  STAT_ORDER,
  type Cat,
  type Destination,
} from "@/lib/passport";
import { Card } from "@/components/ui/card";
import { iso2ByNumeric } from "@/lib/iso-numeric";
import worldData from "world-atlas/countries-110m.json";

const WIDTH = 800;
const HEIGHT = 412;

// Decode the bundled TopoJSON to GeoJSON features once at module load — it's
// static data, identical for every render.
const topology = worldData as unknown as Topology;
const countries = feature(
  topology,
  topology.objects.countries,
) as unknown as FeatureCollection<Geometry, { name: string }>;
const features = countries.features;

// A single Natural Earth projection fitted to the viewBox; reused for every path.
const pathGen = geoPath(
  geoNaturalEarth1().fitSize([WIDTH, HEIGHT], countries),
);

function numericToIso2(id: Feature["id"]): string | undefined {
  if (id == null) return undefined;
  return iso2ByNumeric[String(id).padStart(3, "0")];
}

type Hovered = {
  name: string;
  cat?: Cat;
  detail?: string;
  x: number;
  y: number;
};

export function WorldMap({
  destinations,
  selected,
  homeCode,
  homeName,
}: {
  destinations: Destination[];
  selected: Set<Cat>;
  homeCode?: string;
  homeName?: string;
}) {
  const [hovered, setHovered] = useState<Hovered | null>(null);

  const byIso2 = useMemo(() => {
    const map = new Map<string, Destination>();
    for (const d of destinations) {
      if (d.code) map.set(d.code.toUpperCase(), d);
    }
    return map;
  }, [destinations]);

  return (
    <Card className="relative p-4 sm:p-5">
      <div
        className="relative"
        onMouseLeave={() => setHovered(null)}
      >
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label={`World map of visa requirements for the ${homeName ?? "selected"} passport`}
        >
          <g>
            {features.map((f, i) => {
              const iso2 = numericToIso2(f.id);
              const isHome = !!homeCode && iso2 === homeCode.toUpperCase();
              const dest = iso2 ? byIso2.get(iso2) : undefined;
              const cat = dest?.category;

              // Colored when this country's category is in the selected set;
              // every other country (filtered out or no data) is muted land.
              const inFilter = !!cat && selected.has(cat);
              const fill = inFilter
                ? `var(--cat-${cat}-fg)`
                : "var(--map-land)";

              return (
                <path
                  // Some features (Kosovo, N. Cyprus, Somaliland) have no id;
                  // the static index is a stable, unique key.
                  key={i}
                  d={pathGen(f) ?? undefined}
                  style={{
                    fill,
                    stroke: isHome ? "var(--primary)" : "var(--card)",
                    strokeWidth: isHome ? 1.5 : 0.5,
                  }}
                  className="transition-[fill] duration-200 hover:opacity-80"
                  onMouseMove={(e) => {
                    const box =
                      e.currentTarget.ownerSVGElement?.parentElement?.getBoundingClientRect();
                    setHovered({
                      name: dest?.name ?? f.properties?.name ?? "Unknown",
                      cat,
                      detail: dest?.detail,
                      x: box ? e.clientX - box.left : e.clientX,
                      y: box ? e.clientY - box.top : e.clientY,
                    });
                  }}
                />
              );
            })}
          </g>
        </svg>

        {hovered && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg border bg-popover px-2.5 py-1.5 text-xs shadow-md"
            style={{ left: hovered.x, top: hovered.y }}
          >
            <div className="font-semibold">{hovered.name}</div>
            <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5">
              {hovered.cat ? (
                <>
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      CATEGORY_META[hovered.cat].dot,
                    )}
                  />
                  {hovered.detail ?? CATEGORY_META[hovered.cat].label}
                </>
              ) : (
                "No data"
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {STAT_ORDER.map((cat) => {
          const meta = CATEGORY_META[cat];
          return (
            <span
              key={cat}
              className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium"
            >
              <span className={cn("size-2.5 rounded-full", meta.dot)} />
              {meta.label}
            </span>
          );
        })}
      </div>
    </Card>
  );
}
