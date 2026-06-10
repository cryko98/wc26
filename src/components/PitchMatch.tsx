import { useEffect, useMemo, useRef, useState } from 'react'
import { surname } from '../lib/format'
import {
  advanceGame,
  createPitchState,
  type LiveStats,
  type PitchGoal,
  type PitchState,
  type PitchStrength,
  rebuildPitchNodes,
  startSegment,
  stepMotion,
} from '../lib/pitchSim'
import type { FormationName, Player } from '../types'

export const MIN_PER_SEC = 0.5 // game-minutes per real second at 1× → 90s per half

interface TeamView {
  players: Player[]
  formation: FormationName
  colors: [string, string]
}

interface PitchMatchProps {
  home: TeamView
  away: TeamView
  strength: PitchStrength
  running: boolean
  speed: number
  segEnd: number
  skipKey: number
  onClock: (min: number) => void
  onGoal: (g: PitchGoal) => void
  onStats: (s: LiveStats) => void
  onSegmentEnd: () => void
}

// Renders the live 2D match and drives the (pure) engine in lib/pitchSim.
export function PitchMatch({
  home,
  away,
  strength,
  running,
  speed,
  segEnd,
  skipKey,
  onClock,
  onGoal,
  onStats,
  onSegmentEnd,
}: PitchMatchProps) {
  const stateRef = useRef<PitchState | null>(null)
  if (!stateRef.current) {
    stateRef.current = createPitchState(
      { players: home.players, formation: home.formation },
      { players: away.players, formation: away.formation },
      strength,
      { segEnd },
    )
  }

  // Keep latest props in refs so the rAF loop stays stable.
  const runRef = useRef(running)
  const speedRef = useRef(speed)
  const cbRef = useRef({ onClock, onGoal, onStats, onSegmentEnd })
  runRef.current = running
  speedRef.current = speed
  cbRef.current = { onClock, onGoal, onStats, onSegmentEnd }
  stateRef.current.str = strength

  const endedRef = useRef(false)
  const statAccRef = useRef(0)
  const lastRef = useRef(0)
  const accRef = useRef(0)
  const rafRef = useRef(0)
  const [, setTick] = useState(0)
  const [banner, setBanner] = useState<{ team: 'home' | 'away'; scorer: string } | null>(null)

  // New segment (second half / ET): extend the end minute, allow ending again.
  useEffect(() => {
    if (stateRef.current) startSegment(stateRef.current, segEnd)
    endedRef.current = false
  }, [segEnd])

  // Rebuild positions when the lineups change (halftime subs).
  const lineupKey = useMemo(
    () => home.players.map((p) => p.id).join() + '|' + away.players.map((p) => p.id).join(),
    [home.players, away.players],
  )
  useEffect(() => {
    if (stateRef.current) {
      rebuildPitchNodes(
        stateRef.current,
        { players: home.players, formation: home.formation },
        { players: away.players, formation: away.formation },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineupKey])

  function drain(st: PitchState) {
    if (st.newGoals.length) {
      const gs = st.newGoals.splice(0)
      for (const g of gs) {
        cbRef.current.onGoal(g)
        setBanner({ team: g.team, scorer: g.scorer })
        window.setTimeout(() => setBanner(null), 1900)
      }
    }
  }

  // Fast-forward the rest of the current segment.
  useEffect(() => {
    if (skipKey === 0) return
    const st = stateRef.current!
    let guard = 0
    while (!st.segDone && guard < 4000) {
      stepMotion(st, 0.05, st.gameMin)
      advanceGame(st, 0.3)
      guard++
    }
    drain(st)
    cbRef.current.onClock(st.gameMin)
    cbRef.current.onStats({ ...st.stats })
    if (st.segDone && !endedRef.current) {
      endedRef.current = true
      cbRef.current.onSegmentEnd()
    }
    setTick((t) => t + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipKey])

  useEffect(() => {
    function frame(now: number) {
      rafRef.current = requestAnimationFrame(frame)
      if (!lastRef.current) lastRef.current = now
      let dt = (now - lastRef.current) / 1000
      lastRef.current = now
      if (dt > 0.1) dt = 0.1
      const st = stateRef.current!

      if (runRef.current && !st.segDone) {
        stepMotion(st, dt, now / 1000)
        let gd = dt * MIN_PER_SEC * speedRef.current
        while (gd > 0) {
          const c = Math.min(gd, 0.3)
          advanceGame(st, c)
          gd -= c
        }
        drain(st)
        cbRef.current.onClock(st.gameMin)
        statAccRef.current += dt
        if (statAccRef.current > 0.25) {
          statAccRef.current = 0
          cbRef.current.onStats({ ...st.stats })
        }
        if (st.segDone && !endedRef.current) {
          endedRef.current = true
          cbRef.current.onSegmentEnd()
        }
      } else if (st.mode === 'goal') {
        stepMotion(st, dt, now / 1000)
      }

      accRef.current += dt
      if (accRef.current >= 0.033) {
        accRef.current = 0
        setTick((t) => (t + 1) % 1_000_000)
      }
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const state = stateRef.current!
  const nodes = state.nodes
  const ball = state.ball

  return (
    <div className="relative mx-auto aspect-[8/5] w-full overflow-hidden rounded-xl border border-pitch/20 bg-gradient-to-r from-pitch-700/30 via-ink-900 to-pitch-700/30">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 8%, transparent 8% 16%)',
        }}
      />
      <svg viewBox="0 0 100 62" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <g fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.3">
          <rect x="2" y="2" width="96" height="58" />
          <line x1="50" y1="2" x2="50" y2="60" />
          <circle cx="50" cy="31" r="8" />
          <circle cx="50" cy="31" r="0.6" fill="rgba(255,255,255,0.4)" />
          <rect x="2" y="17" width="12" height="28" />
          <rect x="86" y="17" width="12" height="28" />
          <rect x="2" y="24" width="5" height="14" />
          <rect x="93" y="24" width="5" height="14" />
        </g>
      </svg>

      {nodes.map((n) => {
        const colors = n.team === 'home' ? home.colors : away.colors
        return (
          <div
            key={n.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center will-change-transform"
            style={{ left: `${n.x}%`, top: `${n.y}%`, transition: 'left 70ms linear, top 70ms linear' }}
          >
            <span
              className="grid place-items-center rounded-full border border-black/40 text-[9px] font-extrabold leading-none shadow"
              style={{ width: 18, height: 18, background: colors[0], color: colors[1] }}
            >
              {n.number}
            </span>
            <span className="mt-0.5 max-w-[52px] truncate rounded bg-ink-950/70 px-1 text-[7px] font-semibold leading-tight text-slate-100">
              {surname(n.name)}
            </span>
          </div>
        )
      })}

      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{ left: `${ball.x}%`, top: `${ball.y}%`, transition: 'left 60ms linear, top 60ms linear' }}
      >
        <span
          className="block rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)] ring-1 ring-black/40"
          style={{ width: 9, height: 9 }}
        />
      </div>

      {banner && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="absolute inset-0 animate-pop-in"
            style={{
              background: `radial-gradient(circle at center, ${(banner.team === 'home' ? home.colors : away.colors)[0]}55, transparent 60%)`,
            }}
          />
          <div className="relative flex animate-pop-in flex-col items-center">
            <span className="font-display text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-5xl">
              GOAL!
            </span>
            <span className="mt-1 rounded-full bg-ink-950/80 px-3 py-1 text-sm font-bold text-volt">
              ⚽ {surname(banner.scorer)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
