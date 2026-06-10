import type { FormationName, Player, Position } from '../types'
import { FORMATIONS } from './formations'

// ─────────────────────────────────────────────────────────────────────────────
//  Pure 2D match engine (no React/DOM) so it can be unit-tested.
//
//  Possession model: the ball travels player → player as passes; the team in
//  possession pushes up the pitch while the other drops; turnovers swap the ball
//  to the nearest opponent. CRUCIALLY, a goal can only be scored by the team
//  currently in possession — chances are generated when the possessing team
//  works the ball into the attacking third, and conversion scales with the two
//  teams' strengths (so Portugal beats DR Congo far more easily than Spain).
//
//  Coordinates: x 0..100 (length, home attacks +x), y 0..100 (width).
// ─────────────────────────────────────────────────────────────────────────────

export interface PitchTeam {
  players: Player[]
  formation: FormationName
}

export interface PitchStrength {
  homeStrength: number
  awayStrength: number
  homeGk: number
  awayGk: number
}

export interface PitchNode {
  id: string
  team: 'home' | 'away'
  number: number
  name: string
  rating: number
  pos: Position
  isGK: boolean
  attack: number
  push: number
  drop: number
  bx: number
  by: number
  x: number
  y: number
  freq: number
  phase: number
}

export interface LiveStats {
  homePoss: number // accumulated game-minutes in possession
  awayPoss: number
  homeShots: number
  awayShots: number
  homeOnTarget: number
  awayOnTarget: number
}

export interface PitchGoal {
  team: 'home' | 'away'
  scorer: string
  minute: number
}

export interface PitchState {
  nodes: PitchNode[]
  ball: { x: number; y: number }
  mode: 'carry' | 'pass' | 'goal'
  poss: 'home' | 'away'
  carrier: number
  dwell: number
  pass: { fromX: number; fromY: number; to: number; t: number; dur: number }
  goal: { team: 'home' | 'away'; t: number } | null
  str: PitchStrength
  gameMin: number
  segEnd: number
  segDone: boolean
  stats: LiveStats
  newGoals: PitchGoal[] // drained by the renderer
  rng: () => number
}

const PUSH: Record<Position, number> = { GK: 0.05, DEF: 0.5, MID: 0.85, FWD: 1.15 }
const DROP: Record<Position, number> = { GK: 0.05, DEF: 0.3, MID: 0.8, FWD: 1.15 }
const SCORER_W: Record<Position, number> = { GK: 0.02, DEF: 1, MID: 3, FWD: 5.5 }

// Tuned so a full 90' yields realistic, strength-sensitive scorelines.
const SHOT_RATE = 0.9 // shots per attacking-third game-minute (per team)

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const dist = (ax: number, ay: number, bx: number, by: number) => Math.hypot(ax - bx, ay - by)

export function buildPitchNodes(team: PitchTeam, side: 'home' | 'away'): PitchNode[] {
  const slots = FORMATIONS[team.formation]
  const used = new Set<string>()
  const take = (pos: Position) => team.players.find((p) => p.position === pos && !used.has(p.id))
  const anyLeft = () => team.players.find((p) => !used.has(p.id))

  return slots.map((slot, i) => {
    const p = take(slot.pos) ?? anyLeft() ?? team.players[i % team.players.length]
    used.add(p.id)
    const bx = side === 'home' ? 5 + slot.y * 0.42 : 95 - slot.y * 0.42
    const by = side === 'home' ? slot.x : 100 - slot.x
    return {
      id: `${side}-${p.id}-${i}`,
      team: side,
      number: p.number,
      name: p.name,
      rating: p.rating,
      pos: slot.pos,
      isGK: slot.pos === 'GK',
      attack: side === 'home' ? 1 : -1,
      push: PUSH[slot.pos],
      drop: DROP[slot.pos],
      bx,
      by,
      x: bx,
      y: by,
      freq: 0.5 + (i % 5) * 0.16,
      phase: ((i * 53) % 628) / 100,
    }
  })
}

function firstMid(nodes: PitchNode[], team: 'home' | 'away'): number {
  const i = nodes.findIndex((n) => n.team === team && !n.isGK)
  return i < 0 ? 0 : i
}

export function createPitchState(
  home: PitchTeam,
  away: PitchTeam,
  str: PitchStrength,
  opts: { segEnd?: number; gameMin?: number; rng?: () => number } = {},
): PitchState {
  const nodes = [...buildPitchNodes(home, 'home'), ...buildPitchNodes(away, 'away')]
  return {
    nodes,
    ball: { x: 50, y: 50 },
    mode: 'carry',
    poss: 'home',
    carrier: firstMid(nodes, 'home'),
    dwell: 0.6,
    pass: { fromX: 50, fromY: 50, to: 0, t: 0, dur: 0.3 },
    goal: null,
    str,
    gameMin: opts.gameMin ?? 0,
    segEnd: opts.segEnd ?? 45,
    segDone: false,
    stats: { homePoss: 0, awayPoss: 0, homeShots: 0, awayShots: 0, homeOnTarget: 0, awayOnTarget: 0 },
    newGoals: [],
    rng: opts.rng ?? Math.random,
  }
}

// Continue into a new segment (second half / extra time) keeping live stats.
export function startSegment(state: PitchState, segEnd: number, str?: PitchStrength) {
  state.segEnd = segEnd
  state.segDone = false
  if (str) state.str = str
}

export function rebuildPitchNodes(state: PitchState, home: PitchTeam, away: PitchTeam) {
  state.nodes = [...buildPitchNodes(home, 'home'), ...buildPitchNodes(away, 'away')]
  state.carrier = firstMid(state.nodes, state.poss)
  if (state.mode !== 'goal') state.mode = 'carry'
}

function loseToOpponent(state: PitchState) {
  const { nodes, poss, ball } = state
  let best = -1
  let bestD = Infinity
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i]
    if (n.team === poss || n.isGK) continue
    const d = dist(ball.x, ball.y, n.x, n.y)
    if (d < bestD) {
      bestD = d
      best = i
    }
  }
  if (best >= 0) {
    state.poss = nodes[best].team
    state.carrier = best
  }
  state.mode = 'carry'
  state.dwell = 0.5 + state.rng() * 0.4
}

function pickScorer(state: PitchState, team: 'home' | 'away'): string {
  const mates = state.nodes.filter((n) => n.team === team && !n.isGK)
  const total = mates.reduce((s, n) => s + SCORER_W[n.pos] * (n.rating / 70), 0)
  let r = state.rng() * total
  for (const n of mates) {
    r -= SCORER_W[n.pos] * (n.rating / 70)
    if (r <= 0) return n.name
  }
  return mates[mates.length - 1]?.name ?? 'Unknown'
}

function startGoalCelebration(state: PitchState, team: 'home' | 'away') {
  const goalX = team === 'home' ? 99 : 1
  let shooter = -1
  let bestD = Infinity
  state.nodes.forEach((n, i) => {
    if (n.team !== team || n.isGK) return
    const d = Math.abs(n.x - goalX)
    if (d < bestD) {
      bestD = d
      shooter = i
    }
  })
  if (shooter < 0) shooter = firstMid(state.nodes, team)
  state.poss = team
  state.carrier = shooter
  state.mode = 'goal'
  state.goal = { team, t: 1.7 }
  state.ball.x = state.nodes[shooter].x
  state.ball.y = state.nodes[shooter].y
}

// Force a scripted goal (used for penalty-shootout flavour, etc.).
export function triggerGoal(state: PitchState, team: 'home' | 'away') {
  startGoalCelebration(state, team)
}

function chooseReceiver(state: PitchState): number {
  const { nodes, carrier, poss, rng } = state
  const c = nodes[carrier]
  let best = carrier
  let bestW = -1
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i]
    if (n.team !== poss || i === carrier || n.isGK) continue
    const forward = (n.x - c.x) * c.attack
    const d = dist(c.x, c.y, n.x, n.y)
    const w = (forward > 0 ? 1.6 : 0.7) * (1 / (1 + Math.abs(d - 26) / 22)) * (0.6 + rng() * 0.8)
    if (w > bestW) {
      bestW = w
      best = i
    }
  }
  return best
}

// ── Visual motion (per real-time frame) ──────────────────────────────────────
export function stepMotion(state: PitchState, dt: number, t: number) {
  const { nodes, ball, rng, str } = state

  if (state.mode === 'goal' && state.goal) {
    state.goal.t -= dt
    const gx = state.goal.team === 'home' ? 99 : 1
    ball.x += (gx - ball.x) * Math.min(1, dt * 5)
    ball.y += (50 - ball.y) * Math.min(1, dt * 5)
    if (state.goal.t <= 0) {
      state.poss = state.goal.team === 'home' ? 'away' : 'home'
      state.goal = null
      state.mode = 'carry'
      ball.x = 50
      ball.y = 50
      state.carrier = firstMid(nodes, state.poss)
      state.dwell = 0.7
    }
  } else if (state.mode === 'pass') {
    state.pass.t += dt
    const target = nodes[state.pass.to]
    const k = Math.min(1, state.pass.t / state.pass.dur)
    ball.x = state.pass.fromX + (target.x - state.pass.fromX) * k
    ball.y = state.pass.fromY + (target.y - state.pass.fromY) * k
    if (k >= 1) {
      state.mode = 'carry'
      state.carrier = state.pass.to
      state.dwell = 0.45 + rng() * 0.55
    }
  } else {
    state.dwell -= dt
    const c = nodes[state.carrier]
    ball.x += (c.x + c.attack * 2 - ball.x) * Math.min(1, dt * 9)
    ball.y += (c.y - ball.y) * Math.min(1, dt * 9)
    if (state.dwell <= 0) {
      const possStr = state.poss === 'home' ? str.homeStrength : str.awayStrength
      const oppStr = state.poss === 'home' ? str.awayStrength : str.homeStrength
      const tP = clamp(0.16 + (oppStr - possStr) * 0.008, 0.05, 0.45)
      if (rng() < tP) {
        loseToOpponent(state)
      } else {
        const to = chooseReceiver(state)
        state.pass = {
          fromX: ball.x,
          fromY: ball.y,
          to,
          t: 0,
          dur: clamp(dist(ball.x, ball.y, nodes[to].x, nodes[to].y) * 0.013, 0.22, 0.5),
        }
        state.mode = 'pass'
      }
    }
  }

  const attacking = state.mode === 'goal' ? state.goal!.team : state.poss
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i]
    if (n.isGK) {
      const gx = n.attack === 1 ? 6 : 94
      n.x += (clamp(gx, 2, 98) - n.x) * Math.min(1, dt * 3)
      n.y += (clamp(50 + (ball.y - 50) * 0.32, 8, 92) - n.y) * Math.min(1, dt * 3)
      continue
    }
    const hasBall = n.team === attacking
    let shiftX: number
    if (state.mode === 'goal' && n.team === attacking) shiftX = n.attack * n.push * 30
    else if (hasBall) shiftX = n.attack * n.push * 20
    else shiftX = -n.attack * n.drop * 13

    let tx = n.bx + shiftX
    let ty = n.by + (ball.y - n.by) * 0.2
    if (i === state.carrier && state.mode === 'carry') {
      tx += n.attack * 7
      ty += (ball.y - n.by) * 0.15
    }
    if (state.mode === 'pass' && i === state.pass.to) tx += n.attack * 6
    tx += Math.sin(t * n.freq + n.phase) * 5
    ty += Math.cos(t * n.freq * 1.07 + n.phase) * 5

    const ease = Math.min(1, dt * 2.4)
    n.x += (clamp(tx, 2, 98) - n.x) * ease
    n.y += (clamp(ty, 5, 95) - n.y) * ease
  }
}

// ── Game time + scoring (per game-minute delta) ──────────────────────────────
// Only the team currently in possession can generate a chance/goal.
export function advanceGame(state: PitchState, gameDelta: number) {
  if (gameDelta <= 0) return
  state.gameMin = Math.min(state.segEnd, state.gameMin + gameDelta)
  if (state.poss === 'home') state.stats.homePoss += gameDelta
  else state.stats.awayPoss += gameDelta

  if (state.mode === 'carry') {
    const inThird =
      (state.poss === 'home' && state.ball.x > 64) || (state.poss === 'away' && state.ball.x < 36)
    if (inThird && state.rng() < SHOT_RATE * gameDelta) {
      const poss = state.poss
      const possStr = poss === 'home' ? state.str.homeStrength : state.str.awayStrength
      const oppStr = poss === 'home' ? state.str.awayStrength : state.str.homeStrength
      const oppGk = poss === 'home' ? state.str.awayGk : state.str.homeGk
      if (poss === 'home') state.stats.homeShots++
      else state.stats.awayShots++

      const onTargetP = clamp(0.42 + (possStr - 78) * 0.008, 0.25, 0.72)
      if (state.rng() < onTargetP) {
        if (poss === 'home') state.stats.homeOnTarget++
        else state.stats.awayOnTarget++
        const convP = clamp(
          0.34 + (possStr - oppStr) * 0.014 - (oppGk - 78) * 0.007,
          0.05,
          0.8,
        )
        if (state.rng() < convP) {
          state.newGoals.push({
            team: poss,
            scorer: pickScorer(state, poss),
            minute: Math.max(1, Math.floor(state.gameMin)),
          })
          startGoalCelebration(state, poss)
        } else {
          loseToOpponent(state) // saved
        }
      } else {
        loseToOpponent(state) // off target
      }
    }
  }

  if (state.gameMin >= state.segEnd) state.segDone = true
}
