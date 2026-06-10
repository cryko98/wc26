import type { FormationName, Player, Position } from '../types'
import { FORMATIONS } from './formations'

// ─────────────────────────────────────────────────────────────────────────────
//  Pure 2D match-motion model (no React, no DOM) so it can be unit-tested.
//  Possession-based: the ball travels player → player as passes, the team in
//  possession pushes up the pitch, and on a goal the ball is driven to the net.
//  Coordinates: x 0..100 (length, home attacks +x), y 0..100 (width).
// ─────────────────────────────────────────────────────────────────────────────

export interface PitchTeam {
  players: Player[]
  formation: FormationName
}

export interface PitchNode {
  id: string
  team: 'home' | 'away'
  number: number
  name: string
  isGK: boolean
  attack: number // +1 home, -1 away
  push: number
  drop: number
  bx: number
  by: number
  x: number
  y: number
  freq: number
  phase: number
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
  rng: () => number
}

const PUSH: Record<Position, number> = { GK: 0.05, DEF: 0.5, MID: 0.85, FWD: 1.15 }
const DROP: Record<Position, number> = { GK: 0.05, DEF: 0.3, MID: 0.8, FWD: 1.15 }
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

export function createPitchState(home: PitchTeam, away: PitchTeam, rng: () => number = Math.random): PitchState {
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
    rng,
  }
}

// Rebuild node positions (e.g. after a substitution) while keeping the run state.
export function rebuildPitchNodes(state: PitchState, home: PitchTeam, away: PitchTeam) {
  state.nodes = [...buildPitchNodes(home, 'home'), ...buildPitchNodes(away, 'away')]
  state.carrier = firstMid(state.nodes, state.poss)
  if (state.mode !== 'goal') state.mode = 'carry'
}

// Drive the ball from the scoring team's nearest striker into the net.
export function triggerGoal(state: PitchState, team: 'home' | 'away') {
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

function nearestOpponent(state: PitchState): number {
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
  return best
}

// Advance the simulation by `dt` seconds (t = absolute time for wander phase).
export function stepPitch(state: PitchState, dt: number, t: number) {
  const { nodes, ball, rng } = state

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
      if (rng() < 0.18) {
        const opp = nearestOpponent(state)
        if (opp >= 0) {
          state.poss = nodes[opp].team
          state.carrier = opp
        }
        state.dwell = 0.5 + rng() * 0.4
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
