import { getTeam, GROUPS, teamsByGroup } from '../data/teams'
import type { BracketSlot, GroupTable, KnockoutRoundName, MatchResult, Tactics } from '../types'
import { slotById, slotsForRound } from './bracket'
import { aiSide, simulateMatch, userSide, winnerOf } from './sim'
import { computeTable, groupFixtures } from './standings'

// ─────────────────────────────────────────────────────────────────────────────
//  Orchestration layer — wires the data, sim, standings and bracket together.
// ─────────────────────────────────────────────────────────────────────────────

function sideFor(teamId: string, userTeamId: string, tactics: Tactics) {
  const team = getTeam(teamId)!
  return teamId === userTeamId ? userSide(team, tactics) : aiSide(team)
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
