// Refreshes src/data/passport-index-tidy.csv from the upstream
// ilyankou/passport-index-dataset. The app's CSV is the upstream "tidy" file
// (Passport, Destination, Requirement — by country name) with one extra column:
// ISO2_Code, the passport's ISO-2 code. Upstream doesn't ship that combined
// shape, so we rebuild it by joining the names file with the ISO-2 file
// row-by-row (both are generated in the same order, identical row counts).
//
// Run: node scripts/sync-passport-data.mjs   (Node 18+, uses global fetch)

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const BRANCH = "master";
const BASE = `https://raw.githubusercontent.com/ilyankou/passport-index-dataset/${BRANCH}`;
const NAMES_URL = `${BASE}/passport-index-tidy.csv`;
const ISO2_URL = `${BASE}/passport-index-tidy-iso2.csv`;

const OUT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "data",
  "passport-index-tidy.csv",
);

async function fetchLines(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status} ${res.statusText}`);
  const text = await res.text();
  // Split on \n and drop a single trailing empty line if present.
  const lines = text.split("\n");
  if (lines.at(-1) === "") lines.pop();
  return lines;
}

const EXPECTED_HEADER = "Passport,Destination,Requirement";

async function main() {
  const [names, iso2] = await Promise.all([
    fetchLines(NAMES_URL),
    fetchLines(ISO2_URL),
  ]);

  if (names.length !== iso2.length) {
    throw new Error(
      `Row count mismatch: names=${names.length} iso2=${iso2.length}. ` +
        `Upstream files are out of sync — aborting to avoid misaligned join.`,
    );
  }
  if (names[0] !== EXPECTED_HEADER || iso2[0] !== EXPECTED_HEADER) {
    throw new Error(
      `Unexpected upstream header. Expected "${EXPECTED_HEADER}", got ` +
        `names="${names[0]}" iso2="${iso2[0]}".`,
    );
  }

  const out = new Array(names.length);
  out[0] = `${names[0]},ISO2_Code`;
  for (let i = 1; i < names.length; i++) {
    // The passport's ISO-2 code is the first field of the iso2 row; it's a
    // bare 2-letter code, so a plain split is safe (no quoting in this dataset).
    const code = iso2[i].slice(0, iso2[i].indexOf(","));
    if (!/^[A-Z]{2}$/.test(code)) {
      throw new Error(`Row ${i}: unexpected ISO-2 code "${code}" in "${iso2[i]}".`);
    }
    out[i] = `${names[i]},${code}`;
  }

  writeFileSync(OUT, out.join("\n") + "\n");
  console.log(`Wrote ${out.length} lines (${out.length - 1} rows) to ${OUT}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
