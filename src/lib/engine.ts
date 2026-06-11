import { getTeam, GROUPS, teamsByGroup } from '../data/teams'
import type { BracketSlot, GroupTable, KnockoutRoundName, MatchResult, Tactics } from '../types'
import { slotById, slotsForRound } from './bracket'
import { aiSide, type SimSide, simulateMatch, userSide, winnerOf } from './sim'
import { computeTable, groupFixtures } from './standings'

// ─────────────────────────────────────────────────────────────────────────────
//  Orchestration layer — wires the data, sim, standings and bracket together.
// ─────────────────────────────────────────────────────────────────────────────

function sideFor(teamId: string, userTeamId: string, tactics: Tactics): SimSide {
  const team = getTeam(teamId)!
  return teamId === userTeamId ? userSide(team, tactics) : aiSide(team)
}

// Build both SimSides for a fixture (used by the live, half-by-half match flow).
export function buildSides(
  homeId: string,
  awayId: string,
  userTeamId: string,
  tactics: Tactics,
): { home: SimSide; away: SimSide } {
  return {
    home: sideFor(homeId, userTeamId, tactics),
    away: sideFor(awayId, userTeamId, tactics),
  }
}

// Simulate a single group match between two team ids.
export function simGroupMatch(
  homeId: string,
  awayId: string,
  group: string,
  userTeamId: string,
  tactics: Tactics,
): MatchResult {
  const home = sideFor(homeId, userTeamId, tactics)
  const away = sideFor(awayId, userTeamId, tactics)
  return simulateMatch(home, away, { stage: `Group ${group}` })
}

// Simulate every group match EXCEPT the three involving the user's team.
// The user plays those three interactively.
export function simulateBackgroundGroups(userTeamId: string, tactics: Tactics): MatchResult[] {
  const results: MatchResult[] = []
  for (const g of GROUPS) {
    const ids = teamsByGroup(g).map((t) => t.id)
    for (const fx of groupFixtures(ids)) {
      if (fx.home === userTeamId || fx.away === userTeamId) continue
      results.push(simGroupMatch(fx.home, fx.away, g, userTeamId, tactics))
    }
  }
  return results
}

// The user's three group fixtures, in matchday order.
export function userGroupFixtures(userTeamId: string) {
  const team = getTeam(userTeamId)!
  const ids = teamsByGroup(team.group).map((t) => t.id)
  return groupFixtures(ids).filter((fx) => fx.home === userTeamId || fx.away === userTeamId)
}

export function computeAllTables(results: MatchResult[]): GroupTable[] {
  return GROUPS.map((g) => {
    const ids = teamsByGroup(g).map((t) => t.id)
    return computeTable(g, ids, results)
  })
}

// Where did the user finish in their group, and did they advance?
export interface GroupOutcome {
  position: number // 1..4
  advanced: boolean
  asBestThird: boolean
}

export function userGroupOutcome(
  userTeamId: string,
  tables: GroupTable[],
  qualifiedThirdIds: string[],
): GroupOutcome {
  const team = getTeam(userTeamId)!
  const table = tables.find((t) => t.group === team.group)!
  const position = table.rows.findIndex((r) => r.teamId === userTeamId) + 1
  const asBestThird = position === 3 && qualifiedThirdIds.includes(userTeamId)
  const advanced = position <= 2 || asBestThird
  return { position, advanced, asBestThird }
}

// ── Knockout ─────────────────────────────────────────────────────────────────

export interface RoundOutcome {
  bracket: BracketSlot[]
  userResult: MatchResult
  userWon: boolean
  isFinal: boolean
}

function propagateWinner(bracket: BracketSlot[], slot: BracketSlot) {
  if (!slot.winner || !slot.nextSlot) return
  const next = slotById(bracket, slot.nextSlot)
  if (!next) return
  if (slot.nextIsHome) next.home = slot.winner
  else next.away = slot.winner
}

// Simulate an entire knockout round. The user's match is simulated with their
// tactics; all others run in the background. Winners propagate to the next round.
export function simulateKnockoutRound(
  bracket: BracketSlot[],
  round: KnockoutRoundName,
  userTeamId: string,
  tactics: Tactics,
): RoundOutcome {
  const next = bracket.map((s) => ({ ...s }))
  const roundSlots = slotsForRound(next, round)

  let userResult: MatchResult | undefined
  let userWon = false

  for (const slot of roundSlots) {
    if (!slot.home || !slot.away) continue // shouldn't happen in a well-formed bracket
    const involvesUser = slot.home === userTeamId || slot.away === userTeamId

    const home = sideFor(slot.home, userTeamId, tactics)
    const away = sideFor(slot.away, userTeamId, tactics)
    const result = simulateMatch(home, away, { stage: round, knockout: true })
    slot.result = result
    slot.winner = winnerOf(result)
    propagateWinner(next, slot)

    if (involvesUser) {
      userResult = result
      userWon = slot.winner === userTeamId
    }
  }

  return {
    bracket: next,
    userResult: userResult!,
    userWon,
    isFinal: round === 'Final',
  }
}

// Find the bracket slot the user currently occupies in a given round.
export function userSlotInRound(
  bracket: BracketSlot[],
  round: KnockoutRoundName,
  userTeamId: string,
): BracketSlot | undefined {
  return slotsForRound(bracket, round).find(
    (s) => s.home === userTeamId || s.away === userTeamId,
  )
}

// Apply a user's (already-simulated, live) knockout result to the bracket, then
// simulate every OTHER match in the round and propagate all winners forward.
export function resolveRoundWithUserResult(
  bracket: BracketSlot[],
  round: KnockoutRoundName,
  userTeamId: string,
  userResult: MatchResult,
): RoundOutcome {
  const next = bracket.map((s) => ({ ...s }))
  const roundSlots = slotsForRound(next, round)

  for (const slot of roundSlots) {
    if (!slot.home || !slot.away) continue
    const involvesUser = slot.home === userTeamId || slot.away === userTeamId
    if (involvesUser) {
      slot.result = userResult
      slot.winner = winnerOf(userResult)
    } else {
      const home = aiSide(getTeam(slot.home)!)
      const away = aiSide(getTeam(slot.away)!)
      const result = simulateMatch(home, away, { stage: round, knockout: true })
      slot.result = result
      slot.winner = winnerOf(result)
    }
    propagateWinner(next, slot)
  }

  const userWon = winnerOf(userResult) === userTeamId
  return { bracket: next, userResult, userWon, isFinal: round === 'Final' }
}

// ── Golden Boot (top scorers across the whole tournament) ────────────────────

export interface ScorerTally {
  name: string
  teamId: string
  goals: number
}

export function topScorers(results: MatchResult[], limit = 10): ScorerTally[] {
  const tally = new Map<string, ScorerTally>()
  for (const r of results) {
    for (const e of r.events) {
      if (e.kind && e.kind !== 'goal') continue
      const key = `${e.scorer}@${e.team}`
      const existing = tally.get(key)
      if (existing) existing.goals++
      else tally.set(key, { name: e.scorer, teamId: e.team, goals: 1 })
    }
  }
  return [...tally.values()]
    .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name))
    .slice(0, limit)
}

// ── Golden Glove (clean sheets, credited to each team's first-choice GK) ─────

export interface GloveTally {
  name: string
  teamId: string
  cleanSheets: number
}

export function goldenGlove(results: MatchResult[], limit = 5): GloveTally[] {
  const tally = new Map<string, GloveTally>()
  const credit = (teamId: string) => {
    const team = getTeam(teamId)
    if (!team) return
    const gk = team.players
      .filter((p) => p.position === 'GK')
      .sort((a, b) => b.rating - a.rating)[0]
    if (!gk) return
    const existing = tally.get(teamId)
    if (existing) existing.cleanSheets++
    else tally.set(teamId, { name: gk.name, teamId, cleanSheets: 1 })
  }
  for (const r of results) {
    if (r.awayScore === 0) credit(r.home)
    if (r.homeScore === 0) credit(r.away)
  }
  return [...tally.values()]
    .sort((a, b) => b.cleanSheets - a.cleanSheets || a.name.localeCompare(b.name))
    .slice(0, limit)
}

// ── Tournament-wide totals for the awards screen ─────────────────────────────

export interface TournamentTotals {
  matches: number
  goals: number
  avgGoals: number
}

export function tournamentTotals(results: MatchResult[]): TournamentTotals {
  const matches = results.length
  const goals = results.reduce((s, r) => s + r.homeScore + r.awayScore, 0)
  return { matches, goals, avgGoals: matches ? goals / matches : 0 }
}
