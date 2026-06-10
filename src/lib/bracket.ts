import type { BracketSlot, GroupTable, KnockoutRoundName, TableRow } from '../types'
import { rankThirds } from './standings'

// ─────────────────────────────────────────────────────────────────────────────
//  Knockout bracket construction
//  Round of 32 → Round of 16 → Quarter-finals → Semi-finals → Final
//
//  32 qualifiers = 12 group winners + 12 runners-up + 8 best third-placed teams.
//  They are seeded (winners, then runners-up, then thirds; each tier ordered by
//  record) and placed into a standard single-elimination bracket so the bracket
//  is balanced and every winner feeds deterministically into the next round.
//  // TODO: swap in the official 2026 third-place allocation matrix if desired.
// ─────────────────────────────────────────────────────────────────────────────

const ROUND_BY_SIZE: Record<number, KnockoutRoundName> = {
  16: 'Round of 32',
  8: 'Round of 16',
  4: 'Quarter-finals',
  2: 'Semi-finals',
  1: 'Final',
}

// Classic bracket seed order (1-indexed) for a tournament of `n` slots.
function standardSeedOrder(n: number): number[] {
  let seeds = [1]
  while (seeds.length < n) {
    const round = seeds.length * 2
    const next: number[] = []
    for (const s of seeds) {
      next.push(s)
      next.push(round + 1 - s)
    }
    seeds = next
  }
  return seeds
}

function recordKey(r: TableRow): number {
  // Higher is better. Compose points / GD / GF into one sortable number.
  return r.points * 10000 + (r.goalDiff + 100) * 100 + r.goalsFor
}

export interface Qualifiers {
  ordered: string[] // 32 team ids in seed order (index 0 = top seed)
  winners: string[]
  runnersUp: string[]
  thirds: { teamId: string; group: string }[]
}

// Derive the 32 qualifiers and their seeding from the completed group tables.
export function deriveQualifiers(tables: GroupTable[]): Qualifiers {
  const sortedTables = [...tables].sort((a, b) => a.group.localeCompare(b.group))

  const winners = sortedTables
    .map((t) => t.rows[0])
    .sort((a, b) => recordKey(b) - recordKey(a))
  const runnersUp = sortedTables
    .map((t) => t.rows[1])
    .sort((a, b) => recordKey(b) - recordKey(a))

  const thirdsRanked = rankThirds(tables).slice(0, 8)

  const ordered = [
    ...winners.map((r) => r.teamId),
    ...runnersUp.map((r) => r.teamId),
    ...thirdsRanked.map((r) => r.teamId),
  ]

  return {
    ordered,
    winners: winners.map((r) => r.teamId),
    runnersUp: runnersUp.map((r) => r.teamId),
    thirds: thirdsRanked.map((r) => ({ teamId: r.teamId, group: r.group })),
  }
}

// Build the full bracket (all rounds) from 32 ordered seeds. Only the Round of
// 32 has teams assigned; later rounds fill in as results come in.
export function buildBracket(orderedTeamIds: string[]): BracketSlot[] {
  if (orderedTeamIds.length !== 32) {
    throw new Error(`Expected 32 qualifiers, got ${orderedTeamIds.length}`)
  }

  const slots: BracketSlot[] = []
  const order = standardSeedOrder(32) // 32 bracket positions → seed numbers

  // Round of 32: 16 matches.
  const r32: BracketSlot[] = []
  for (let m = 0; m < 16; m++) {
    const homeSeed = order[m * 2]
    const awaySeed = order[m * 2 + 1]
    r32.push({
      id: `R32-${m}`,
      round: 'Round of 32',
      home: orderedTeamIds[homeSeed - 1],
      away: orderedTeamIds[awaySeed - 1],
    })
  }
  slots.push(...r32)

  // Later rounds: empty slots wired to receive winners.
  let prevCount = 16
  let prevPrefix = 'R32'
  const prefixes: Record<number, string> = { 8: 'R16', 4: 'QF', 2: 'SF', 1: 'F' }

  let size = 8
  while (size >= 1) {
    const prefix = prefixes[size]
    const round = ROUND_BY_SIZE[size]
    for (let m = 0; m < size; m++) {
      slots.push({ id: `${prefix}-${m}`, round })
    }
    // Wire previous round → this round.
    for (let m = 0; m < prevCount; m++) {
      const prev = slots.find((s) => s.id === `${prevPrefix}-${m}`)!
      prev.nextSlot = `${prefix}-${Math.floor(m / 2)}`
      prev.nextIsHome = m % 2 === 0
    }
    prevCount = size
    prevPrefix = prefix
    size = size / 2
  }

  return slots
}

export function slotById(slots: BracketSlot[], id: string): BracketSlot | undefined {
  return slots.find((s) => s.id === id)
}

export function slotsForRound(slots: BracketSlot[], round: KnockoutRoundName): BracketSlot[] {
  return slots.filter((s) => s.round === round)
}

export const ROUND_ORDER: KnockoutRoundName[] = [
  'Round of 32',
  'Round of 16',
  'Quarter-finals',
  'Semi-finals',
  'Final',
]
