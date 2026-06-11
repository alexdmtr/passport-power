import * as countryIcons from "country-flag-icons/react/3x2";
import { cn } from "@/lib/utils";

export function Flag({
  code,
  label,
  className,
}: {
  code?: string;
  label: string;
  className?: string;
}) {
  const Icon = code
    ? countryIcons[code as keyof typeof countryIcons]
    : undefined;

  if (!Icon) {
    return (
      <span
        aria-hidden
        className={cn(
          "bg-muted text-muted-foreground grid place-items-center rounded-[3px] text-[10px] font-medium",
          className,
        )}
      >
        {label.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <Icon
      title={label}
      className={cn("ring-border rounded-[3px] object-cover ring-1", className)}
    />
  );
}
