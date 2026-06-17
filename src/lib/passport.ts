/**
 * Shared, pure passport domain logic — safe to import from both server and
 * client (no `fs`, no Node APIs). The server-only CSV loading lives in
 * `passport-data.ts`.
 */

export type PassportRequirement = {
  Passport: string;
  Destination: string;
  Requirement: string;
  ISO2_Code: string;
};

/** Normalised requirement categories, in order of mobility strength. */
export type Category =
  | "free"
  | "arrival"
  | "eta"
  | "evisa"
  | "required"
  | "none"
  | "home";

/** Categories that appear in the UI (everything except the home country). */
export type Cat = Exclude<Category, "home">;

export type PassportListItem = { name: string; code?: string };

export type Destination = {
  name: string;
  code?: string;
  category: Cat;
  detail: string;
};

export type PassportDetail = {
  name: string;
  code?: string;
  destinations: Destination[];
  counts: Record<Cat, number>;
  /** Destinations reachable without arranging a visa beforehand. */
  score: number;
};

export const STAT_ORDER: Cat[] = [
  "free",
  "arrival",
  "eta",
  "evisa",
  "required",
  "none",
];

/**
 * Categories reachable without arranging a visa beforehand — the same set that
 * makes up the mobility score. Used as the default filter selection.
 */
export const MOBILITY_CATS: Cat[] = ["free", "arrival", "eta"];

export const CATEGORY_META: Record<
  Cat,
  { label: string; dot: string; badge: string }
> = {
  free: {
    label: "Visa-free",
    dot: "bg-cat-free",
    badge: "bg-cat-free-bg text-cat-free",
  },
  arrival: {
    label: "Visa on arrival",
    dot: "bg-cat-arrival",
    badge: "bg-cat-arrival-bg text-cat-arrival",
  },
  eta: {
    label: "eTA",
    dot: "bg-cat-eta",
    badge: "bg-cat-eta-bg text-cat-eta",
  },
  evisa: {
    label: "e-Visa",
    dot: "bg-cat-evisa",
    badge: "bg-cat-evisa-bg text-cat-evisa",
  },
  required: {
    label: "Visa required",
    dot: "bg-cat-required",
    badge: "bg-cat-required-bg text-cat-required",
  },
  none: {
    label: "No admission",
    dot: "bg-cat-none",
    badge: "bg-cat-none-bg text-cat-none",
  },
};

/** Map a raw CSV requirement value to a normalised category + display text. */
export function classify(raw: string): { category: Category; detail: string } {
  const value = raw.trim().toLowerCase();
  if (value === "-1") return { category: "home", detail: "Home country" };

  const days = Number(value);
  if (!Number.isNaN(days) && days > 0) {
    return { category: "free", detail: `Visa-free · ${days} days` };
  }

  switch (value) {
    case "visa free":
      return { category: "free", detail: "Visa-free" };
    case "visa on arrival":
      return { category: "arrival", detail: "Visa on arrival" };
    case "eta":
      return { category: "eta", detail: "eTA required" };
    case "e-visa":
      return { category: "evisa", detail: "e-Visa" };
    case "visa required":
      return { category: "required", detail: "Visa required" };
    case "no admission":
      return { category: "none", detail: "No admission" };
    default:
      return { category: "required", detail: raw };
  }
}

export function emptyCounts(): Record<Cat, number> {
  return { free: 0, arrival: 0, eta: 0, evisa: 0, required: 0, none: 0 };
}
