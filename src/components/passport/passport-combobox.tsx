"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PassportListItem } from "@/lib/passport";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-12 w-full justify-between px-3.5 text-base"
        >
          {selected ? (
            <span className="flex items-center gap-2.5">
              <Flag
                code={selected.code}
                label={selected.name}
                className="h-[18px] w-[26px]"
              />
              {selected.name}
            </span>
          ) : (
            <span className="text-muted-foreground flex items-center gap-2.5">
              <Search className="size-4" />
              Search your passport country…
            </span>
          )}
          <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command>
          <CommandInput placeholder="Type a country…" />
          <CommandList>
            <CommandEmpty>No matching country.</CommandEmpty>
            <CommandGroup>
              {passports.map((passport) => (
                <CommandItem
                  key={passport.name}
                  value={passport.name}
                  onSelect={() => {
                    onSelect(passport);
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
                  <Check
                    className={cn(
                      "size-4",
                      selected?.name === passport.name
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
