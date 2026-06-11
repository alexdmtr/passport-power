"use client";

import { useRef, useState } from "react";
import { Globe, Loader2 } from "lucide-react";
import { loadPassportDetail } from "@/app/actions";
import type {
  Cat,
  PassportDetail,
  PassportListItem,
} from "@/lib/passport";
import { PassportCombobox } from "./passport-combobox";
import { ScoreSummary } from "./score-summary";
import { StatGrid } from "./stat-grid";
import { DestinationList } from "./destination-list";

export function PassportExplorer({
  passports,
}: {
  passports: PassportListItem[];
}) {
  const [selected, setSelected] = useState<PassportListItem | undefined>();
  const [detail, setDetail] = useState<PassportDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Cat | "all">("all");
  // Guards against an earlier (slower) request overwriting a newer selection.
  const requestId = useRef(0);

  async function handleSelect(passport: PassportListItem) {
    setSelected(passport);
    setFilter("all");
    setLoading(true);
    const id = ++requestId.current;
    const result = await loadPassportDetail(passport.name);
    if (id !== requestId.current) return; // a newer selection won
    setDetail(result);
    setLoading(false);
  }

  return (
    <div>
      {/* Hero */}
      <header className="text-center">
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
          Pick your passport to see where you can travel visa-free, where you
          need a visa, and your global mobility score.
        </p>

        <div className="mx-auto mt-7 max-w-md">
          <PassportCombobox
            passports={passports}
            selected={selected}
            onSelect={handleSelect}
          />
        </div>
      </header>

      {/* Result */}
      {!selected ? (
        <div className="text-muted-foreground mt-16 text-center">
          <Globe className="text-muted-foreground/60 mx-auto mb-3 size-14" />
          <p>Choose a passport above to reveal its travel power.</p>
        </div>
      ) : loading || !detail ? (
        <div className="text-muted-foreground mt-16 flex items-center justify-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" />
          Loading {selected.name}…
        </div>
      ) : (
        <section className="mt-10">
          <ScoreSummary detail={detail} />
          <StatGrid
            counts={detail.counts}
            active={filter}
            onToggle={(cat) => setFilter((f) => (f === cat ? "all" : cat))}
          />
          <DestinationList
            destinations={detail.destinations}
            filter={filter}
            onFilter={setFilter}
          />
        </section>
      )}
    </div>
  );
}
