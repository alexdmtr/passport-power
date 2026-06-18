"use client";

import { type Cat } from "@/lib/passport";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// On mobile the six categories collapse into three single-select groups.
const GROUPS: { id: string; label: string; cats: Cat[] }[] = [
  { id: "free", label: "No prior visa", cats: ["free", "arrival", "eta"] },
  { id: "evisa", label: "e-Visa", cats: ["evisa"] },
  { id: "required", label: "Visa required", cats: ["required"] },
];

function sameSet(set: Set<Cat>, cats: Cat[]) {
  return set.size === cats.length && cats.every((c) => set.has(c));
}

export function MobileCategorySwitcher({
  selected,
  onSelectGroup,
}: {
  selected: Set<Cat>;
  onSelectGroup: (cats: Cat[]) => void;
}) {
  const active = GROUPS.find((g) => sameSet(selected, g.cats))?.id ?? "";

  return (
    <ToggleGroup
      type="single"
      value={active}
      onValueChange={(id) => {
        const group = GROUPS.find((g) => g.id === id);
        if (group) onSelectGroup(group.cats);
      }}
      className="bg-muted grid w-full grid-cols-3 gap-0.5 rounded-lg p-0.5"
    >
      {GROUPS.map((g) => (
        <ToggleGroupItem
          key={g.id}
          value={g.id}
          variant="default"
          className="text-muted-foreground rounded-md text-xs data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
        >
          {g.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
