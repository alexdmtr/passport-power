import "server-only";

import fs from "fs";
import path from "path";
import Papa from "papaparse";
import {
  classify,
  emptyCounts,
  type Destination,
  type PassportDetail,
  type PassportListItem,
  type PassportRequirement,
} from "./passport";

/**
 * Server-only CSV access. The full ~40k-row dataset is parsed once here and
 * never crosses to the client — components receive only the small passport
 * list up front, and a single passport's detail on demand.
 */

const rows = Papa.parse<PassportRequirement>(
  fs.readFileSync(
    path.join(process.cwd(), "src", "data", "passport-index-tidy.csv"),
    "utf8",
  ),
  { header: true, skipEmptyLines: true },
).data;

/** Country name → ISO2 code (the CSV's code column is the passport's code). */
const codeByName = new Map<string, string>();
for (const r of rows) {
  if (r.Passport && r.ISO2_Code) {
    codeByName.set(r.Passport, r.ISO2_Code.toUpperCase());
  }
}

/** Rows grouped by passport, so a single lookup is O(1) per request. */
const rowsByPassport = new Map<string, PassportRequirement[]>();
for (const r of rows) {
  if (!r.Passport) continue;
  const list = rowsByPassport.get(r.Passport);
  if (list) list.push(r);
  else rowsByPassport.set(r.Passport, [r]);
}

/** Lightweight list shipped to the client for the picker (~6 KB). */
export const passportList: PassportListItem[] = [...rowsByPassport.keys()]
  .sort((a, b) => a.localeCompare(b))
  .map((name) => ({ name, code: codeByName.get(name) }));

/** Build the full detail for one passport (called on demand). */
export function getPassportDetail(name: string): PassportDetail | null {
  const passportRows = rowsByPassport.get(name);
  if (!passportRows) return null;

  const counts = emptyCounts();
  const destinations = passportRows
    .map((r): Destination | null => {
      const { category, detail } = classify(r.Requirement);
      if (category === "home") return null; // narrows category to Cat
      return {
        name: r.Destination,
        code: codeByName.get(r.Destination),
        category,
        detail,
      };
    })
    .filter((d): d is Destination => d !== null)
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const d of destinations) counts[d.category]++;

  return {
    name,
    code: codeByName.get(name),
    destinations,
    counts,
    score: counts.free + counts.arrival + counts.eta,
  };
}
