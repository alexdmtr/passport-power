# CLAUDE.md

Guidance for working in this repo. Keep it current when architecture changes.

## What this is

**Passport Power** — a Next.js (App Router) app that shows, for a chosen
passport, the visa requirement for every destination plus a global "mobility
score". Single page, no database; data comes from a static CSV.

## Commands

```bash
npm run dev     # Turbopack dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint (next lint)
```

## Node version — important

Use **Node 24 LTS** (pinned in `.nvmrc`). Do **not** use Node 25+: it exposes a
global `localStorage` stub that crashes `next dev` during SSR
(`localStorage.getItem is not a function`). If `nvm`/`fnm` is installed,
`nvm use` picks up `.nvmrc`.

## Data source — don't hand-edit the CSV

`src/data/passport-index-tidy.csv` is **generated**, not hand-maintained. It's
rebuilt from the upstream `ilyankou/passport-index-dataset` by
`scripts/sync-passport-data.mjs`, which joins the upstream names file
(`passport-index-tidy.csv`) with the ISO-2 file (`passport-index-tidy-iso2.csv`)
row-by-row to add the `ISO2_Code` column. The `.github/workflows/sync-data.yml`
action runs this weekly and commits any change (which triggers a Vercel deploy).
To refresh manually: run the script, or trigger the workflow via `workflow_dispatch`.
Edit the upstream dataset, not this file.

## Architecture & data flow (the important part)

The CSV is ~40k rows (`src/data/passport-index-tidy.csv`). **It must never be
shipped to the client** — doing so previously produced a 4.1 MB page payload.
The current design keeps it server-side:

- `src/lib/passport-data.ts` — `import "server-only"`. Parses the CSV once,
  exposes `passportList` (lightweight, ~6 KB) and `getPassportDetail(name)`.
  **Never import this from a client component.**
- `src/app/page.tsx` — server component. Passes only `passportList` to the UI.
- `src/app/actions.ts` — server action `loadPassportDetail(name)`. The client
  fetches a single passport's destinations **on demand** when one is selected.
- `src/lib/passport.ts` — pure, shared logic (types, `classify`,
  `CATEGORY_META`, scoring). No Node APIs; safe on both server and client.

When changing data handling, keep the rule: **send the passport list up front,
load one passport's detail on demand.** Don't pass the full dataset as a prop.

### Components

- `src/components/passport/*` — feature UI. `passport-explorer.tsx` is the
  client orchestrator (selection, loading, shared category filter); the rest
  (`passport-combobox`, `score-summary`, `stat-grid`, `destination-list`,
  `flag`) are focused presentational pieces.
- `src/components/ui/*` — shadcn/ui primitives (generated; owned by us).

## Data semantics (non-obvious)

- `Requirement` values: a **number** = visa-free for that many days; plus
  `visa free`, `visa on arrival`, `eta`, `e-visa`, `visa required`,
  `no admission`; and `-1` = the passport's **own** country (filtered out of the
  UI). All of this is normalised in `classify()`.
- `ISO2_Code` is the **passport's** code, not the destination's. Destination
  flags are resolved via a name→code map built from all passport rows
  (`codeByName` in `passport-data.ts`).
- **Mobility score** = visa-free + visa-on-arrival + eTA (entry without
  arranging a visa beforehand). e-Visa is intentionally excluded.

## Styling & theming

- **Tailwind v4** (CSS-first; config lives in `src/app/globals.css`) +
  **shadcn/ui** (new-york, Radix). Add components with
  `npx shadcn@latest add <name>`.
- Theme tokens are CSS variables in `globals.css`. App-specific colors:
  `--brand`/`--brand-2` (gradient) and the six `--cat-*` category colors,
  exposed to Tailwind via `@theme inline` (e.g. `bg-cat-free-bg text-cat-free`).
  **Don't hardcode hex in components — use tokens** so light/dark both work.
- Dark mode via **next-themes** (`attribute="class"`, default `system`). The
  dark palette is a single `.dark` block. The toggle is `src/app/ThemeToggle.tsx`.
- **Geist font gotcha:** the font is applied in the `@layer base` body rule via
  `--font-geist-sans` (set by `next/font` on `<html>`). If you re-run
  `shadcn init`, it may reintroduce a circular `--font-sans: var(--font-sans)` —
  remove it.
