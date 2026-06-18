"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
] as const;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: theme is only known on the client.
  useEffect(() => setMounted(true), []);

  return (
    <ToggleGroup
      type="single"
      // Always a string so the group stays controlled (avoids the
      // uncontrolled→controlled warning); empty until the theme is known.
      value={mounted && theme ? theme : ""}
      onValueChange={(value) => value && setTheme(value)}
      aria-label="Color theme"
      className="bg-card fixed top-4 right-4 z-50 gap-0.5 rounded-full border p-0.5 shadow-sm"
    >
      {OPTIONS.map(({ value, label, Icon }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          aria-label={label}
          title={label}
          className="text-muted-foreground size-8 rounded-full data-[state=on]:bg-secondary data-[state=on]:text-foreground data-[state=on]:shadow-xs data-[state=on]:ring-1 data-[state=on]:ring-border"
        >
          <Icon className="size-4" />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
