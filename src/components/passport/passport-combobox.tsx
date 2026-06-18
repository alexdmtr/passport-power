"use client";

import { useDeferredValue, useState } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PassportListItem } from "@/lib/passport";
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Flag } from "./flag";

export function PassportCombobox({
  passports,
  selected,
  onSelect,
}: {
  passports: PassportListItem[];
  selected?: PassportListItem;
  onSelect: (passport: PassportListItem) => void;
}) {
  const [query, setQuery] = useState(selected?.name ?? "");
  const [open, setOpen] = useState(false);

  // Show the dropdown only once the user is actively typing, so the default
  // state is a clean, focused input inviting them to type. Deferring the query
  // here keeps the keystroke painting immediately while the (large) list
  // mounts/filters in a lower-priority render.
  const deferredQuery = useDeferredValue(query);
  const showList = open && deferredQuery.trim().length > 0;
  const showFlag = selected && query === selected.name;

  return (
    <CommandPrimitive className="relative overflow-visible bg-transparent">
      <div
        className={cn(
          "border-input bg-background flex h-12 items-center gap-2.5 rounded-xl border px-3.5 transition-colors",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-3",
        )}
      >
        {showFlag ? (
          <Flag
            code={selected.code}
            label={selected.name}
            className="h-[18px] w-[26px] shrink-0"
          />
        ) : (
          <Search className="text-muted-foreground size-4 shrink-0" />
        )}
        <CommandPrimitive.Input
          autoFocus
          value={query}
          onValueChange={(value) => {
            setQuery(value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder="Type a country…"
          aria-label="Search your passport country"
          className="placeholder:text-muted-foreground flex-1 bg-transparent text-base outline-none"
        />
      </div>

      {showList && (
        <div
          // Keep focus on the input so a click on an item registers before
          // the input's blur would close the list.
          onMouseDown={(e) => e.preventDefault()}
          className="bg-popover text-popover-foreground absolute z-50 mt-2 w-full rounded-xl border p-1 shadow-md"
        >
          <CommandList>
            <CommandEmpty>No matching country.</CommandEmpty>
            <CommandGroup>
              {passports.map((passport) => (
                <CommandItem
                  key={passport.name}
                  value={passport.name}
                  onSelect={() => {
                    onSelect(passport);
                    setQuery(passport.name);
                    setOpen(false);
                  }}
                  className="gap-2.5"
                >
                  <Flag
                    code={passport.code}
                    label={passport.name}
                    className="h-[18px] w-[26px]"
                  />
                  <span className="flex-1">{passport.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </div>
      )}
    </CommandPrimitive>
  );
}
