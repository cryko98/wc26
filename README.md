# WC26 — World Cup 2026 Manager ⚽

A single-page **World Cup 2026 football management simulation** game, themed around
the **$WC26** memecoin. Pick one of 48 national teams, set your tactics like a real
manager, and simulate your run from the group stage all the way to the final.

Built with **React + Vite + TypeScript + Tailwind CSS**. No backend, no wallet
connect, no web3 — just a fun, fully client-side game.

> **Unofficial fan project.** Not affiliated with, endorsed by, or connected to FIFA
> or any official body. No official logos, crests, or player likenesses are used.
> Real nation and player names are factual data only; players are shown as
> name + shirt number + a generic jersey SVG generated from team colours.

---

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

### Other scripts

```bash
npm run build     # type-check + production build → dist/
npm run preview   # preview the production build locally
npm run lint      # type-check only (tsc --noEmit)
```

The production build in `dist/` is a static bundle and deploys as-is to **Vercel**,
Netlify, GitHub Pages, or any static host.

---

## How to play

1. **Team Select** — choose one of the 48 nations (search / filter / sort to find it).
2. **Squad & Tactics** — pick a formation (4-4-2, 4-3-3, 5-2-3, 3-5-2, 4-2-3-1),
   set mentality + tempo + width, and tweak your starting XI. Tap a player on the
   pitch or in the squad list, then tap another player to swap them.
3. **Group Stage** — play your three group matches (the other 11 groups are
   simulated in the background so full standings and the best-third-place ranking
   can be computed).
4. **Result** — see your group table and whether you advanced (top 2, or one of the
   8 best third-placed teams).
5. **Knockouts** — Round of 32 → Round of 16 → Quarter-finals → Semi-finals → Final.
   Level after 90' goes to extra time, then penalties — every knockout produces a
   winner.
6. **End** — lift the trophy 🏆 or bow out, then **Restart tournament** to go again.

Tournament progress lives in in-memory React state and **resets on refresh** (by
design for v1 — no `localStorage`/`sessionStorage` is used).

---

## Editing team & player data

**`src/data/teams.ts` is the single source of truth** and is intentionally easy to
edit. Each team is one `team(...)` block; each player is a compact tuple:

```ts
// [ name, shirtNumber, position, rating ]
['Lionel Messi', 10, 'FWD', 90],
```

- `position` is one of `'GK' | 'DEF' | 'MID' | 'FWD'`.
- `rating` is a 1–99 overall — it drives the match engine **and** the 1–5 star
  ability display.
- A `team(id, name, flag, [primaryColor, secondaryColor], group, ranking, players)`
  block sets the nation's emoji flag, jersey colours, group (A–L), and seed
  `ranking` (lower = stronger baseline).

To replace a squad, just paste new tuples. To move a team to a different group,
change its `group` field (and the array it lives in). Aim for ~15 players per team
with at least one GK and enough outfielders to fill any formation.

> ⚠️ The 2026 group allocation in this file is a **plausible, editable placeholder**
> (see the `// TODO: verify/replace with the official 2026 group draw` comment).
> Swap in the official draw whenever you like.

---

## Replacing the contract address (CA)

The header shows a placeholder contract address with a **Copy CA** button.
Open **`src/components/Header.tsx`** and replace the single constant:

```ts
const CONTRACT_ADDRESS = 'xxxxxxxxxxxxxxxxxxxxx' // ← put your real CA here
```

The on-screen `CA: …` line and the Copy button both read from this one value.

---

## How the match engine works

- **Team strength** = average overall of the starting XI, plus formation / mentality
  / tempo / width modifiers (your tactical choices nudge your expected goals and how
  much you concede).
- **Goals** are sampled from a **Poisson model** driven by the strength differential
  between the two sides (each team gets an expected-goals figure, then a score is
  sampled).
- **Match feed** shows the key events — goals with minute + scorer.
- **Knockouts** add extra time and a GK-weighted **penalty shootout** when needed.
- **Group tiebreakers**: points → goal difference → goals scored → head-to-head →
  random fallback.

All of the logic lives in small, readable modules under `src/lib/`:

| File | Responsibility |
| --- | --- |
| `sim.ts` | Match simulation, xG model, extra time, penalties |
| `standings.ts` | Group fixtures, tables, tiebreakers, best-third ranking |
| `bracket.ts` | Knockout bracket construction + seeding |
| `engine.ts` | Orchestration that wires data + sim + standings + bracket |
| `formations.ts` | Formation pitch coordinates + positional shapes |
| `format.ts` | Display helpers (surnames, rating → stars, colours) |

---

## Project structure

```
src/
├─ data/teams.ts              # 48 teams + squads (edit me!)
├─ types.ts                   # core domain types
├─ lib/                       # game logic (see table above)
├─ state/TournamentProvider.tsx  # React context + useReducer game state
├─ components/
│  ├─ Header.tsx              # WC26 wordmark, $WC26 ticker, CA + copy
│  ├─ TeamSelect.tsx          # landing / team picker
│  ├─ TacticsBoard.tsx        # 3-panel squad & tactics screen
│  ├─ Pitch.tsx · SquadList.tsx · Jersey.tsx · StarRating.tsx
│  ├─ GroupStage.tsx · GroupTable.tsx · GroupResult.tsx
│  ├─ Knockout.tsx · Bracket.tsx · MatchSim.tsx
│  └─ EndScreen.tsx · RunHistory.tsx
├─ App.tsx                    # screen router by game phase
└─ main.tsx                   # entry point
```

---

## Tech & constraints

- React 18 + Vite 6 + TypeScript (strict) + Tailwind CSS 3.
- State: React Context + `useReducer`.
- No backend, no persistence, **no wallet-connect / web3 libraries**, no external
  trading links or iframes. The `$WC26` branding is purely informational.

Made for fun. Not financial advice. 💎⚽
