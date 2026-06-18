"use client";

import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Flag } from "./flag";

/**
 * Mobile-only passport bar. Slides in from the top once the score card has
 * scrolled out of view (`visible`); hidden on sm+.
 */
export function MobilePassportBar({
  name,
  code,
  visible,
  onChange,
}: {
  name: string;
  code?: string;
  visible: boolean;
  onChange: () => void;
}) {
  return (
    <nav
      inert={!visible}
      className={cn(
        "bg-background/85 fixed inset-x-0 top-0 z-40 flex items-center gap-2.5 border-b px-4 py-2.5 backdrop-blur transition-transform duration-300 sm:hidden",
        visible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <Flag code={code} label={name} className="h-5 w-7 shrink-0 rounded-sm" />
      <span className="min-w-0 truncate text-sm font-semibold">{name}</span>
      {/* Right margin reserves room for the floating theme toggle. */}
      <Button
        variant="outline"
        size="sm"
        onClick={onChange}
        className="mr-28 ml-auto shrink-0"
      >
        <ChevronsUpDown className="size-3.5" />
        Change
      </Button>
    </nav>
  );
}
