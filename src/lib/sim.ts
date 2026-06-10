import type { SquadTeam } from '../data/teams'
import type { MatchEvent, MatchResult, MatchStats, Player, Tactics } from '../types'
import { FORMATIONS } from './formations'

// ─────────────────────────────────────────────────────────────────────────────
//  Match simulation
//  Team strength = average overall of the starting XI, plus tactic/formation
//  modifiers and a small mentality effect. Goals are sampled from a Poisson
//  model driven by the strength differential between the two sides.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_XG = 1.42 // league-average expected goals per team per match

export interface SimSide {
  team: SquadTeam
  xi: Player[] // the 11 on the pitch (drives scorer selection + strength)
  strength: number // average overall of the XI
  gk: number // GK rating (used for the shootout weighting)
  attMod: number // multiplier on this side's own expected goals
  defMod: number // multiplier applied to the OPPONENT's expected goals (>1 = leakier)
}

// ── RNG helpers ──────────────────────────────────────────────────────────────

function poisson(lambda: number): number {
  // Knuth's algorithm
  const L = Math.exp(-lambda)
  let k = 0
  let p = 1
  do {
    k++
    p *= Math.random()
  } while (p > L)
  return k - 1
}

// ── Strength / tactics ───────────────────────────────────────────────────────

function bestXI(team: SquadTeam): Player[] {
  // Default XI for AI teams: 1 GK + the 10 highest-rated outfielders.
  const gks = team.players.filter((p) => p.position === 'GK').sort((a, b) => b.rating - a.rating)
  const out = team.players.filter((p) => p.position !== 'GK').sort((a, b) => b.rating - a.rating)
  return [...(gks.length ? [gks[0]] : []), ...out.slice(0, 10)]
}

function avgRating(players: Player[]): number {
  if (!players.length) return 60
  return players.reduce((s, p) => s + p.rating, 0) / players.length
}

// Build a SimSide for an AI-controlled team using its strongest XI.
export function aiSide(team: SquadTeam): SimSide {
  const xi = bestXI(team)
  const gk = xi.find((p) => p.position === 'GK')?.rating ?? 70
  // Tiny seeding nudge so the ranking baseline matters a touch beyond raw ratings.
  const seedBonus = Math.max(0, (49 - team.ranking) * 0.05)
  return { team, xi, strength: avgRating(xi) + seedBonus, gk, attMod: 1, defMod: 1 }
}

// Build a SimSide for the human team from its chosen tactics + starting XI.
export function userSide(team: SquadTeam, tactics: Tactics): SimSide {
  const byId = new Map(team.players.map((p) => [p.id, p]))
  const xi = tactics.startingXI.map((id) => byId.get(id)).filter(Boolean) as Player[]
  const safeXI = xi.length === 11 ? xi : bestXI(team)
  const gk = safeXI.find((p) => p.position === 'GK')?.rating ?? 70

  let attMod = 1
  let defMod = 1 // applied to opponent xG (>1 = we concede more)

  // Mentality
  if (tactics.mentality === 'Attacking') {
    attMod *= 1.18
    defMod *= 1.12
  } else if (tactics.mentality === 'Defensive') {
    attMod *= 0.85
    defMod *= 0.88
  }

  // Tempo
  if (tactics.tempo === 'High') {
    attMod *= 1.06
    defMod *= 1.04
  } else if (tactics.tempo === 'Slow') {
    attMod *= 0.96
    defMod *= 0.97
  }

  // Width
  if (tactics.width === 'Wide') {
    attMod *= 1.05
  } else if (tactics.width === 'Narrow') {
    attMod *= 0.98
    defMod *= 0.97
  }

  // Formation tilt
  switch (tactics.formation) {
    case '4-3-3':
      attMod *= 1.05
      break
    case '4-2-3-1':
      attMod *= 1.02
      break
    case '3-5-2':
      attMod *= 1.03
      defMod *= 1.05
      break
    case '5-2-3':
      attMod *= 1.0
      defMod *= 0.92
      break
    // 4-4-2 is the neutral baseline
  }

  const seedBonus = Math.max(0, (49 - team.ranking) * 0.05)
  return { team, xi: safeXI, strength: avgRating(safeXI) + seedBonus, gk, attMod, defMod }
}

// Expected goals for `a` against `b`.
export function expectedGoals(a: SimSide, b: SimSide): number {
  const diff = a.strength - b.strength
  const xg = BASE_XG * Math.exp(diff * 0.038) * a.attMod * b.defMod
  return Math.max(0.18, Math.min(xg, 4.2))
}

// Weighted scorer selection — forwards more likely than midfielders than defenders.
function weightForScorer(p: Player): number {
  const posW = p.position === 'FWD' ? 5 : p.position === 'MID' ? 3 : p.position === 'DEF' ? 1 : 0.05
  return posW * (p.rating / 70)
}

function pickScorer(side: SimSide): string {
  const candidates = side.xi.filter((p) => p.position !== 'GK')
  const pool = candidates.length ? candidates : side.xi
  const total = pool.reduce((s, p) => s + weightForScorer(p), 0)
  let r = Math.random() * total
  for (const p of pool) {
    r -= weightForScorer(p)
    if (r <= 0) return p.name
  }
  return pool[pool.length - 1].name
}

function genMinutes(count: number, from: number, to: number): number[] {
  const mins = new Set<number>()
  while (mins.size < count) {
    mins.add(from + Math.floor(Math.random() * (to - from)))
  }
  return [...mins].sort((x, y) => x - y)
}

function buildEvents(
  home: SimSide,
  away: SimSide,
  homeGoals: number,
  awayGoals: number,
  from: number,
  to: number,
): MatchEvent[] {
  const events: MatchEvent[] = []
  const hMins = genMinutes(homeGoals, from, to)
  const aMins = genMinutes(awayGoals, from, to)
  for (const m of hMins) events.push({ minute: m, team: home.team.id, scorer: pickScorer(home), kind: 'goal' })
  for (const m of aMins) events.push({ minute: m, team: away.team.id, scorer: pickScorer(away), kind: 'goal' })
  return events.sort((a, b) => a.minute - b.minute)
}

// ── Penalty shootout (RNG weighted slightly by GK rating) ────────────────────

function shootoutConversion(shooterTeam: SimSide, keeperTeam: SimSide): number {
  const shooterSkill = shooterTeam.strength
  const keeper = keeperTeam.gk
  // ~76% baseline, nudged by shooter quality and (negatively) by the keeper.
  const p = 0.76 + (shooterSkill - 78) * 0.004 - (keeper - 78) * 0.004
  return Math.max(0.55, Math.min(p, 0.92))
}

function penaltyShootout(home: SimSide, away: SimSide): { home: number; away: number } {
  const pHome = shootoutConversion(home, away)
  const pAway = shootoutConversion(away, home)
  let h = 0
  let a = 0

  // Best of 5
  for (let i = 0; i < 5; i++) {
    if (Math.random() < pHome) h++
    if (Math.random() < pAway) a++
    // (We tally all 5 for simplicity; sudden death below breaks genuine ties.)
  }
  // Sudden death
  let guard = 0
  while (h === a && guard < 50) {
    const hs = Math.random() < pHome
    const as = Math.random() < pAway
    if (hs) h++
    if (as) a++
    guard++
  }
  if (h === a) h++ // absolute fallback — shootouts must produce a winner
  return { home: h, away: a }
}

// ── Segment simulation (for live, half-by-half matches) ──────────────────────

export interface SegmentResult {
  events: MatchEvent[]
  homeGoals: number
  awayGoals: number
}

// Simulate a slice of a match over [fromMin, toMin), with expected goals scaled
// by `fraction` (e.g. 0.5 for a half, ~0.34 for the 30 minutes of extra time).
// Each side's SimSide can carry different tactics than the other half — that's
// how halftime adjustments take effect.
export function simulateSegment(
  home: SimSide,
  away: SimSide,
  fromMin: number,
  toMin: number,
  fraction: number,
): SegmentResult {
  const xgHome = expectedGoals(home, away) * fraction
  const xgAway = expectedGoals(away, home) * fraction
  const homeGoals = poisson(xgHome)
  const awayGoals = poisson(xgAway)
  const events = buildEvents(home, away, homeGoals, awayGoals, fromMin, toMin)
  return { events, homeGoals, awayGoals }
}

export { penaltyShootout }

// ── Match stats + player of the match ────────────────────────────────────────

// Derive plausible possession / shots from the two sides + the final score.
export function computeMatchStats(
  home: SimSide,
  away: SimSide,
  homeScore: number,
  awayScore: number,
): MatchStats {
  const xgH = expectedGoals(home, away)
  const xgA = expectedGoals(away, home)

  // Possession leans toward the stronger / higher-tempo side.
  const diff = home.strength - away.strength
  let homePossession = Math.round(50 + diff * 1.4)
  homePossession = Math.max(32, Math.min(68, homePossession))

  const jitter = (base: number) => Math.max(0, Math.round(base + (Math.random() * 4 - 2)))
  const homeShots = Math.max(homeScore, jitter(xgH * 3.4 + 4))
  const awayShots = Math.max(awayScore, jitter(xgA * 3.4 + 4))
  const homeOnTarget = Math.max(homeScore, Math.round(homeShots * 0.42))
  const awayOnTarget = Math.max(awayScore, Math.round(awayShots * 0.42))

  return {
    homePossession,
    homeShots,
    awayShots,
    homeOnTarget,
    awayOnTarget,
    homeCorners: jitter(xgH * 2 + 2),
    awayCorners: jitter(xgA * 2 + 2),
  }
}

// Pick a Player of the Match — favours scorers and the winning side.
export function pickPotm(
  home: SimSide,
  away: SimSide,
  events: MatchEvent[],
  homeScore: number,
  awayScore: number,
): { name: string; teamId: string } {
  const winnerId =
    homeScore === awayScore ? null : homeScore > awayScore ? home.team.id : away.team.id
  const goalsByName = new Map<string, number>()
  for (const e of events) {
    if (e.kind === 'goal') goalsByName.set(e.scorer, (goalsByName.get(e.scorer) ?? 0) + 1)
  }

  let best: { name: string; teamId: string; score: number } | null = null
  for (const side of [home, away]) {
    for (const p of side.xi) {
      const goals = goalsByName.get(p.name) ?? 0
      const onWinner = winnerId === side.team.id ? 6 : winnerId === null ? 2 : 0
      const gkBonus = p.position === 'GK' && winnerId === side.team.id ? 5 : 0
      const score = p.rating * 0.4 + goals * 18 + onWinner + gkBonus + Math.random() * 6
      if (!best || score > best.score) best = { name: p.name, teamId: side.team.id, score }
    }
  }
  return best ? { name: best.name, teamId: best.teamId } : { name: home.xi[0].name, teamId: home.team.id }
}

// ── Public API ───────────────────────────────────────────────────────────────

export interface SimOptions {
  stage: string
  knockout?: boolean // if true, the match must produce a winner (ET + penalties)
}

let _matchSeq = 0

export function nextMatchId(): string {
  return `m${_matchSeq++}`
}

export function simulateMatch(home: SimSide, away: SimSide, opts: SimOptions): MatchResult {
  const xgHome = expectedGoals(home, away)
  const xgAway = expectedGoals(away, home)

  let homeScore = poisson(xgHome)
  let awayScore = poisson(xgAway)
  const events = buildEvents(home, away, homeScore, awayScore, 1, 91)

  let extraTime = false
  let penalties: { home: number; away: number } | undefined

  if (opts.knockout && homeScore === awayScore) {
    // Extra time — reduced expected goals over 30 minutes (~1/3 of a match).
    extraTime = true
    const etHome = poisson(xgHome * 0.34)
    const etAway = poisson(xgAway * 0.34)
    if (etHome || etAway) {
      events.push(...buildEvents(home, away, etHome, etAway, 91, 121))
      events.sort((a, b) => a.minute - b.minute)
    }
    homeScore += etHome
    awayScore += etAway

    if (homeScore === awayScore) {
      penalties = penaltyShootout(home, away)
    }
  }

  return {
    id: nextMatchId(),
    home: home.team.id,
    away: away.team.id,
    homeScore,
    awayScore,
    stage: opts.stage,
    extraTime: extraTime || undefined,
    penalties,
    events,
    stats: computeMatchStats(home, away, homeScore, awayScore),
    potm: pickPotm(home, away, events, homeScore, awayScore),
  }
}

// Determine the winning team id of a (knockout) result.
export function winnerOf(r: MatchResult): string {
  if (r.penalties) return r.penalties.home > r.penalties.away ? r.home : r.away
  return r.homeScore >= r.awayScore ? r.home : r.away
}

// Validate that a starting XI matches the chosen formation's positional shape.
export function xiMatchesFormation(xi: Player[], formation: Tactics['formation']): boolean {
  if (xi.length !== 11) return false
  const need = { GK: 0, DEF: 0, MID: 0, FWD: 0 } as Record<Player['position'], number>
  for (const s of FORMATIONS[formation]) need[s.pos]++
  const have = { GK: 0, DEF: 0, MID: 0, FWD: 0 } as Record<Player['position'], number>
  for (const p of xi) have[p.position]++
  return (
    have.GK === need.GK && have.DEF === need.DEF && have.MID === need.MID && have.FWD === need.FWD
  )
}
