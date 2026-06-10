import { useEffect, useMemo, useRef, useState } from 'react'
import { FORMATIONS } from '../lib/formations'
import { surname } from '../lib/format'
import type { FormationName, Player } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
//  PitchMatch — a lightweight 2D live match visualization.
//  Both teams are drawn as little numbered circles (with the player's surname
//  underneath) that move around the pitch following the ball, plus a ball that
//  drifts with play and a GOAL! burst when a goal is scored.
//
//  Coordinate space: x 0..100 (left→right = length), y 0..100 (top→bottom).
//  Home defends the left, attacks right. Away mirrors.
// ─────────────────────────────────────────────────────────────────────────────

interface TeamView {
  players: Player[]
  formation: FormationName
  colors: [string, string]
}

export interface GoalSignal {
  key: number // increments on each goal so the effect re-fires
  team: 'home' | 'away'
  scorer: string
}

interface PitchMatchProps {
  home: TeamView
  away: TeamView
  playing: boolean // when false, motion freezes
  goal: GoalSignal | null
}

interface Node {
  id: string
  team: 'home' | 'away'
  number: number
  name: string
  isGK: boolean
  bx: number // base x
  by: number // base y
  x: number // current
  y: number
  freq: number
  phase: number
}

// Assign players to a formation's slots (by position) to get base positions.
function buildNodes(team: TeamView, side: 'home' | 'away'): Node[] {
  const slots = FORMATIONS[team.formation]
  const used = new Set<string>()
  const take = (pos: Player['position']) => {
    const p = team.players.find((pl) => pl.position === pos && !used.has(pl.id))
    return p
  }
  const anyLeft = () => team.players.find((pl) => !used.has(pl.id))

  return slots.map((slot, i) => {
    const p = take(slot.pos) ?? anyLeft() ?? team.players[i % team.players.length]
    used.add(p.id)
    const depth = slot.y // 0 = own goal, 100 = attacking
    const lateral = slot.x // 0..100
    const bx = side === 'home' ? 4 + depth * 0.44 : 96 - depth * 0.44
    const by = side === 'home' ? lateral : 100 - lateral
    return {
      id: `${side}-${p.id}-${i}`,
      team: side,
      number: p.number,
      name: surname(p.name),
      isGK: slot.pos === 'GK',
      bx,
      by,
      x: bx,
      y: by,
      freq: 0.6 + (i % 5) * 0.18,
      phase: (i * 37) % 628 / 100,
    }
  })
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

export function PitchMatch({ home, away, playing, goal }: PitchMatchProps) {
  const baseNodes = useMemo(
    () => [...buildNodes(home, 'home'), ...buildNodes(away, 'away')],
    [home, away],
  )

  // Animation values live in refs; we mirror them into state ~30fps to render.
  const nodesRef = useRef<Node[]>(baseNodes.map((n) => ({ ...n })))
  const ballRef = useRef({ x: 50, y: 50, tx: 50, ty: 50 })
  const possRef = useRef<'home' | 'away'>('home')
  const ballTimerRef = useRef(0)
  const lastRef = useRef(0)
  const accRef = useRef(0)
  const celebrateRef = useRef<{ team: 'home' | 'away'; t: number } | null>(null)
  const rafRef = useRef<number>(0)

  const [, setTick] = useState(0)
  const [goalBanner, setGoalBanner] = useState<{ team: 'home' | 'away'; scorer: string } | null>(
    null,
  )

  // Reset node identities when the lineups change (e.g. after halftime subs).
  useEffect(() => {
    nodesRef.current = baseNodes.map((n) => ({ ...n }))
  }, [baseNodes])

  // Trigger a goal celebration when the goal signal changes.
  useEffect(() => {
    if (!goal) return
    celebrateRef.current = { team: goal.team, t: 1.6 }
    const gx = goal.team === 'home' ? 96 : 4
    ballRef.current.tx = gx
    ballRef.current.ty = 50
    setGoalBanner({ team: goal.team, scorer: goal.scorer })
    const id = window.setTimeout(() => setGoalBanner(null), 1900)
    return () => window.clearTimeout(id)
  }, [goal?.key]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function frame(now: number) {
      rafRef.current = requestAnimationFrame(frame)
      if (!lastRef.current) lastRef.current = now
      let dt = (now - lastRef.current) / 1000
      lastRef.current = now
      if (dt > 0.1) dt = 0.1 // clamp after tab switches

      if (playing || celebrateRef.current) {
        step(dt, now / 1000)
      }

      // Throttle React re-render to ~30fps.
      accRef.current += dt
      if (accRef.current >= 0.033) {
        accRef.current = 0
        setTick((t) => (t + 1) % 1000000)
      }
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing])

  function step(dt: number, t: number) {
    const ball = ballRef.current
    const cel = celebrateRef.current

    // Ball retargeting
    if (cel) {
      cel.t -= dt
      if (cel.t <= 0) {
        celebrateRef.current = null
        ball.tx = 50
        ball.ty = 50
        possRef.current = cel.team === 'home' ? 'away' : 'home' // kickoff to the other team
        ballTimerRef.current = 0.6
      }
    } else {
      ballTimerRef.current -= dt
      if (ballTimerRef.current <= 0) {
        if (Math.random() < 0.34) possRef.current = possRef.current === 'home' ? 'away' : 'home'
        const dir = possRef.current === 'home' ? 1 : -1
        ball.tx = clamp(50 + dir * (12 + Math.random() * 32), 6, 94)
        ball.ty = clamp(12 + Math.random() * 76, 8, 92)
        ballTimerRef.current = 0.5 + Math.random() * 0.9
      }
    }

    const ballEase = Math.min(1, dt * (cel ? 4.5 : 2.6))
    ball.x += (ball.tx - ball.x) * ballEase
    ball.y += (ball.ty - ball.y) * ballEase

    const attackBias = (ball.x - 50) / 50 // + = play in home's attacking half

    for (const n of nodesRef.current) {
      let tx: number
      let ty: number
      if (n.isGK) {
        tx = n.bx + (attackBias * (n.team === 'home' ? 2 : 2))
        ty = 50 + (ball.y - 50) * 0.22
      } else {
        const noiseX = Math.sin(t * n.freq + n.phase) * 2.2
        const noiseY = Math.cos(t * n.freq * 1.1 + n.phase) * 2.2
        const push = attackBias * 7
        const pull = celebrateRef.current && celebrateRef.current.team === n.team ? 0.16 : 0.05
        tx = n.bx + push + (ball.x - n.bx) * pull + noiseX
        ty = n.by + (ball.y - n.by) * (pull + 0.04) + noiseY
      }
      const ease = Math.min(1, dt * 3.5)
      n.x += (clamp(tx, 2, 98) - n.x) * ease
      n.y += (clamp(ty, 4, 96) - n.y) * ease
    }
  }

  const nodes = nodesRef.current
  const ball = ballRef.current

  return (
    <div className="relative mx-auto aspect-[8/5] w-full overflow-hidden rounded-xl border border-pitch/20 bg-gradient-to-r from-pitch-700/30 via-ink-900 to-pitch-700/30">
      {/* Mowed stripes (vertical bands across the length) */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 8%, transparent 8% 16%)',
        }}
      />
      {/* Markings */}
      <svg viewBox="0 0 100 62" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <g fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.3">
          <rect x="2" y="2" width="96" height="58" />
          <line x1="50" y1="2" x2="50" y2="60" />
          <circle cx="50" cy="31" r="8" />
          <circle cx="50" cy="31" r="0.6" fill="rgba(255,255,255,0.4)" />
          {/* boxes */}
          <rect x="2" y="17" width="12" height="28" />
          <rect x="86" y="17" width="12" height="28" />
          <rect x="2" y="24" width="5" height="14" />
          <rect x="93" y="24" width="5" height="14" />
        </g>
      </svg>

      {/* Players */}
      {nodes.map((n) => {
        const colors = n.team === 'home' ? home.colors : away.colors
        return (
          <div
            key={n.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${n.x}%`, top: `${n.y}%`, transition: 'left 40ms linear, top 40ms linear' }}
          >
            <span
              className="grid place-items-center rounded-full border border-black/40 text-[9px] font-extrabold leading-none shadow"
              style={{
                width: 18,
                height: 18,
                background: colors[0],
                color: colors[1],
              }}
            >
              {n.number}
            </span>
            <span className="mt-0.5 max-w-[52px] truncate rounded bg-ink-950/70 px-1 text-[7px] font-semibold leading-tight text-slate-100">
              {n.name}
            </span>
          </div>
        )
      })}

      {/* Ball */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${ball.x}%`, top: `${ball.y}%`, transition: 'left 40ms linear, top 40ms linear' }}
      >
        <span className="block rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)] ring-1 ring-black/40" style={{ width: 9, height: 9 }} />
      </div>

      {/* GOAL! burst */}
      {goalBanner && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 animate-pop-in" style={{ background: `radial-gradient(circle at center, ${(goalBanner.team === 'home' ? home.colors : away.colors)[0]}55, transparent 60%)` }} />
          <div className="relative flex animate-pop-in flex-col items-center">
            <span className="font-display text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-5xl">
              GOAL!
            </span>
            <span className="mt-1 rounded-full bg-ink-950/80 px-3 py-1 text-sm font-bold text-volt">
              ⚽ {surname(goalBanner.scorer)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
