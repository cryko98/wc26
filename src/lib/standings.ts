import type { GroupTable, MatchResult, TableRow } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
//  Group standings, tiebreakers, and best-third-place ranking
//
//  Tiebreaker order (per the brief):
//    points → goal difference → goals scored → head-to-head → random
// ─────────────────────────────────────────────────────────────────────────────

// Fixed round-robin for a group of 4 (each team plays the other 3 once).
// Indices refer to the group's team list. Each team plays once per matchday.
const MATCHDAYS: [number, number][][] = [
  [
    [0, 1],
    [2, 3],
  ],
  [
    [0, 2],
    [3, 1],
  ],
  [
    [0, 3],
    [1, 2],
  ],
]

export interface Fixture {
  matchday: number // 1..3
  home: string // team id
  away: string // team id
}

export function groupFixtures(teamIds: string[]): Fixture[] {
  const fixtures: Fixture[] = []
  MATCHDAYS.forEach((day, i) => {
    for (const [h, a] of day) {
      fixtures.push({ matchday: i + 1, home: teamIds[h], away: teamIds[a] })
    }
  })
  return fixtures
}

function emptyRow(teamId: string): TableRow {
  return {
    teamId,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDiff: 0,
    points: 0,
  }
}

function applyResult(row: TableRow, gf: number, ga: number) {
  row.played++
  row.goalsFor += gf
  row.goalsAgainst += ga
  row.goalDiff = row.goalsFor - row.goalsAgainst
  if (gf > ga) {
    row.won++
    row.points += 3
  } else if (gf === ga) {
    row.drawn++
    row.points += 1
  } else {
    row.lost++
  }
}

// Build raw (unsorted) rows for a set of team ids from the relevant results.
function rawRows(teamIds: string[], results: MatchResult[]): Map<string, TableRow> {
  const rows = new Map(teamIds.map((id) => [id, emptyRow(id)]))
  for (const r of results) {
    const h = rows.get(r.home)
    const a = rows.get(r.away)
    if (!h || !a) continue // result not part of this group
    // Group-stage standings ignore knockout ET/penalties (none occur in groups).
    applyResult(h, r.homeScore, r.awayScore)
    applyResult(a, r.awayScore, r.homeScore)
  }
  return rows
}

// Head-to-head mini-comparison among a tied cluster of team ids.
function headToHead(clusterIds: string[], results: MatchResult[]): Map<string, TableRow> {
  const relevant = results.filter(
    (r) => clusterIds.includes(r.home) && clusterIds.includes(r.away),
  )
  return rawRows(clusterIds, relevant)
}

// Deterministic-ish "random" final fallback: stable per pair within a render,
// using a hash of the two ids so the order doesn't flicker on re-renders.
function pseudoRandomTiebreak(a: string, b: string): number {
  const hash = (s: string) => {
    let h = 2166136261
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i)
      h = Math.imul(h, 16777619)
    }
    return h >>> 0
  }
  return hash(a) - hash(b)
}

export function computeTable(group: string, teamIds: string[], results: MatchResult[]): GroupTable {
  const rowsMap = rawRows(teamIds, results)
  const rows = [...rowsMap.values()]

  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
    return 0 // resolve remaining ties below
  })

  // Resolve clusters where points, GD and GF are all equal via head-to-head,
  // then a stable pseudo-random fallback.
  for (let i = 0; i < rows.length; ) {
    let j = i + 1
    while (
      j < rows.length &&
      rows[j].points === rows[i].points &&
      rows[j].goalDiff === rows[i].goalDiff &&
      rows[j].goalsFor === rows[i].goalsFor
    ) {
      j++
    }
    if (j - i > 1) {
      const clusterIds = rows.slice(i, j).map((r) => r.teamId)
      const h2h = headToHead(clusterIds, results)
      const cluster = rows.slice(i, j).sort((a, b) => {
        const ha = h2h.get(a.teamId)!
        const hb = h2h.get(b.teamId)!
        if (hb.points !== ha.points) return hb.points - ha.points
        if (hb.goalDiff !== ha.goalDiff) return hb.goalDiff - ha.goalDiff
        if (hb.goalsFor !== ha.goalsFor) return hb.goalsFor - ha.goalsFor
        return pseudoRandomTiebreak(a.teamId, b.teamId)
      })
      rows.splice(i, j - i, ...cluster)
    }
    i = j
  }

  return { group, rows }
}

// ── Best third-placed teams ──────────────────────────────────────────────────

export interface ThirdPlace extends TableRow {
  group: string
}

// Rank all 12 third-placed teams; the top 8 advance.
export function rankThirds(tables: GroupTable[]): ThirdPlace[] {
  const thirds: ThirdPlace[] = tables
    .filter((t) => t.rows.length >= 3)
    .map((t) => ({ ...t.rows[2], group: t.group }))

  thirds.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
    return pseudoRandomTiebreak(a.teamId, b.teamId)
  })

  return thirds
}
