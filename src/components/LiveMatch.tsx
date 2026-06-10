import { useEffect, useMemo, useRef, useState } from 'react'
import { getTeam } from '../data/teams'
import { surname } from '../lib/format'
import {
  aiSide,
  computeMatchStats,
  nextMatchId,
  penaltyShootout,
  pickPotm,
  type SimSide,
  simulateSegment,
  userSide,
} from '../lib/sim'
import { useTournament } from '../state/TournamentProvider'
import type { FormationName, MatchEvent, MatchResult } from '../types'
import { HalftimePanel } from './HalftimePanel'
import { Jersey } from './Jersey'
import { MatchStatsView } from './MatchStatsView'
import { PitchMatch, type GoalSignal } from './PitchMatch'

type Stage = 'firstHalf' | 'halftime' | 'secondHalf' | 'extraTime' | 'fulltime'

interface LiveMatchProps {
  homeId: string
  awayId: string
  matchStage: string
  knockout: boolean
  userTeamId: string
  title: string
  subLimit?: number
  onComplete: (result: MatchResult) => void
  continueText?: (r: MatchResult) => string
}

// Game-minutes simulated per real second at 1× speed → a 45' half lasts 90s.
const MIN_PER_SEC = 0.5
const SPEEDS = { Slow: 0.5, Normal: 1, Fast: 3 } as const
type SpeedName = keyof typeof SPEEDS

const byMinute = (a: MatchEvent, b: MatchEvent) => a.minute - b.minute
const isGoal = (e: MatchEvent) => e.kind === 'goal' || !e.kind
const goalsFor = (events: MatchEvent[], teamId: string) =>
  events.filter((e) => e.team === teamId && isGoal(e))

export function LiveMatch({
  homeId,
  awayId,
  matchStage,
  knockout,
  userTeamId,
  title,
  subLimit = 5,
  onComplete,
  continueText,
}: LiveMatchProps) {
  const { state } = useTournament()
  const home = getTeam(homeId)!
  const away = getTeam(awayId)!
  const userIsHome = homeId === userTeamId
  const opponentId = userIsHome ? awayId : homeId

  const [stage, setStage] = useState<Stage>('firstHalf')
  const [clock, setClock] = useState(0)
  const [events, setEvents] = useState<MatchEvent[]>([])
  const [penalties, setPenalties] = useState<{ home: number; away: number } | undefined>()
  const [speed, setSpeed] = useState<SpeedName>('Normal')
  const [ready, setReady] = useState(false)
  const [goal, setGoal] = useState<GoalSignal | null>(null)

  const oppSideRef = useRef<SimSide | null>(null)
  const sidesRef = useRef<{ home: SimSide; away: SimSide } | null>(null)
  const kickoffXIRef = useRef<string[]>([])
  const usedEtRef = useRef(false)
  const firedRef = useRef(0)
  const goalKeyRef = useRef(0)
  const guards = useRef<Set<string>>(new Set())
  const once = (key: string) => {
    if (guards.current.has(key)) return false
    guards.current.add(key)
    return true
  }

  function assemble(u: SimSide) {
    return userIsHome
      ? { home: u, away: oppSideRef.current! }
      : { home: oppSideRef.current!, away: u }
  }

  // Kick-off: build sides + simulate the first half.
  useEffect(() => {
    if (!once('init')) return
    oppSideRef.current = aiSide(getTeam(opponentId)!)
    kickoffXIRef.current = [...state.tactics.startingXI]
    const u = userSide(getTeam(userTeamId)!, state.tactics)
    const sides = assemble(u)
    sidesRef.current = sides
    const fh = simulateSegment(sides.home, sides.away, 1, 46, 0.5)
    setEvents(fh.events.sort(byMinute))
    setReady(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Advance the match clock (float game-minutes) while a half is in progress.
  useEffect(() => {
    const animating = stage === 'firstHalf' || stage === 'secondHalf' || stage === 'extraTime'
    if (!animating) return
    const target = stage === 'firstHalf' ? 45 : stage === 'secondHalf' ? 90 : 120
    const id = window.setInterval(() => {
      setClock((c) => Math.min(target, c + 0.05 * MIN_PER_SEC * SPEEDS[speed]))
    }, 50)
    return () => window.clearInterval(id)
  }, [stage, speed])

  // Fire goal effects as the clock passes each goal's minute.
  useEffect(() => {
    const goals = events.filter(isGoal).sort(byMinute)
    while (firedRef.current < goals.length && goals[firedRef.current].minute <= clock) {
      const g = goals[firedRef.current]
      firedRef.current++
      setGoal({
        key: ++goalKeyRef.current,
        team: g.team === homeId ? 'home' : 'away',
        scorer: g.scorer,
      })
    }
  }, [clock, events, homeId])

  // Stage transitions.
  useEffect(() => {
    if (stage === 'firstHalf' && clock >= 45 && once('ht')) setStage('halftime')
    else if (stage === 'secondHalf' && clock >= 90 && once('endReg')) endRegulation()
    else if (stage === 'extraTime' && clock >= 120 && once('endEt')) endExtraTime()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock, stage])

  function currentScore(all: MatchEvent[]) {
    return { home: goalsFor(all, homeId).length, away: goalsFor(all, awayId).length }
  }

  function endRegulation() {
    setEvents((all) => {
      const score = currentScore(all)
      if (knockout && score.home === score.away) {
        usedEtRef.current = true
        const sides = sidesRef.current!
        const et = simulateSegment(sides.home, sides.away, 91, 121, 0.34)
        setStage('extraTime')
        return [...all, ...et.events].sort(byMinute)
      }
      setStage('fulltime')
      return all
    })
  }

  function endExtraTime() {
    setEvents((all) => {
      const score = currentScore(all)
      if (score.home === score.away) {
        const sides = sidesRef.current!
        setPenalties(penaltyShootout(sides.home, sides.away))
      }
      setStage('fulltime')
      return all
    })
  }

  function resumeSecondHalf() {
    if (!once('resume')) return
    const u = userSide(getTeam(userTeamId)!, state.tactics)
    const sides = assemble(u)
    sidesRef.current = sides
    const sh = simulateSegment(sides.home, sides.away, 46, 91, 0.5)
    setEvents((all) => [...all, ...sh.events].sort(byMinute))
    setStage('secondHalf')
  }

  function skipSegment() {
    const target = stage === 'firstHalf' ? 45 : stage === 'secondHalf' ? 90 : 120
    setClock(target)
  }

  function buildResult(): MatchResult {
    const all = [...events].sort(byMinute)
    const homeScore = goalsFor(all, homeId).length
    const awayScore = goalsFor(all, awayId).length
    const sides = sidesRef.current!
    return {
      id: nextMatchId(),
      home: homeId,
      away: awayId,
      homeScore,
      awayScore,
      stage: matchStage,
      extraTime: usedEtRef.current || undefined,
      penalties,
      events: all,
      stats: computeMatchStats(sides.home, sides.away, homeScore, awayScore),
      potm: pickPotm(sides.home, sides.away, all, homeScore, awayScore),
    }
  }

  // ── Derived display ──────────────────────────────────────────────────────
  const shown = useMemo(() => events.filter((e) => e.minute <= clock), [events, clock])
  const liveHome = goalsFor(shown, homeId).length
  const liveAway = goalsFor(shown, awayId).length
  const recentGoals = useMemo(
    () => [...shown.filter(isGoal)].sort((a, b) => b.minute - a.minute).slice(0, 4),
    [shown],
  )
  const isFinished = stage === 'fulltime'
  const animating = stage === 'firstHalf' || stage === 'secondHalf' || stage === 'extraTime'

  const result = isFinished ? buildResult() : null
  const winnerId = result
    ? result.penalties
      ? result.penalties.home > result.penalties.away
        ? homeId
        : awayId
      : result.homeScore > result.awayScore
        ? homeId
        : result.homeScore < result.awayScore
          ? awayId
          : null
    : null
  const userWon = winnerId === userTeamId
  const isDraw = isFinished && !result?.penalties && result?.homeScore === result?.awayScore

  const clockLabel =
    stage === 'halftime'
      ? 'HT'
      : isFinished
        ? penalties
          ? 'Pens'
          : usedEtRef.current
            ? 'AET'
            : 'FT'
        : `${Math.floor(clock)}'`

  const homeFormation: FormationName = userIsHome ? state.tactics.formation : '4-3-3'
  const awayFormation: FormationName = userIsHome ? '4-3-3' : state.tactics.formation
  const sides = sidesRef.current

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="panel overflow-hidden p-0 animate-pop-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 bg-ink-850/60 px-5 py-3">
          <span className="truncate text-xs font-bold uppercase tracking-[0.12em] text-pitch">
            {title}
          </span>
          <span className="font-mono text-sm text-slate-300">
            {animating ? (
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-flare" />
                {clockLabel}
                {stage === 'extraTime' && <span className="text-flare-400">ET</span>}
              </span>
            ) : (
              <span className="text-slate-400">{clockLabel}</span>
            )}
          </span>
        </div>

        {/* Scoreboard */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4">
          <div className="flex items-center justify-end gap-2 text-right">
            <span className="truncate text-sm font-semibold text-slate-100">
              {home.flag} {home.name}
            </span>
            <Jersey colors={home.colors} size={34} />
          </div>
          <div className="flex flex-col items-center">
            <div className="font-display text-4xl font-extrabold tabular-nums text-white">
              {liveHome}<span className="mx-1 text-slate-600">:</span>{liveAway}
            </div>
            {penalties && (
              <span className="mt-1 rounded-full bg-flare/15 px-2 py-0.5 text-xs font-bold text-flare-400">
                Pens {penalties.home}–{penalties.away}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Jersey colors={away.colors} size={34} />
            <span className="truncate text-sm font-semibold text-slate-100">
              {away.flag} {away.name}
            </span>
          </div>
        </div>

        {/* Body */}
        {stage === 'halftime' ? (
          <div className="border-t border-white/5 p-4">
            <HalftimePanel
              kickoffXI={kickoffXIRef.current}
              subLimit={subLimit}
              onResume={resumeSecondHalf}
            />
          </div>
        ) : (
          <div className="border-t border-white/5 p-3">
            {ready && sides ? (
              <PitchMatch
                home={{ players: sides.home.xi, formation: homeFormation, colors: home.colors }}
                away={{ players: sides.away.xi, formation: awayFormation, colors: away.colors }}
                playing={animating}
                goal={goal}
              />
            ) : (
              <div className="grid aspect-[8/5] w-full place-items-center text-sm text-slate-500">
                Walking out…
              </div>
            )}

            {/* Goal ticker */}
            <div className="mt-2 flex min-h-[22px] flex-wrap items-center gap-1.5">
              {recentGoals.map((e, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-ink-800 px-2 py-0.5 text-[11px] text-slate-300"
                >
                  <span className="font-mono text-slate-500">{e.minute}&apos;</span>⚽{' '}
                  <span className="font-semibold text-slate-100">{surname(e.scorer)}</span>
                  <span className="text-slate-500">{getTeam(e.team)?.flag}</span>
                </span>
              ))}
            </div>

            {/* Full-time stats + POTM */}
            {isFinished && result?.stats && (
              <div className="mt-3 border-t border-white/5 pt-3">
                <p className="label mb-2.5">Match stats</p>
                <MatchStatsView stats={result.stats} />
                {result.potm && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-volt/20 bg-volt/5 px-3 py-2">
                    <span className="text-lg">⭐</span>
                    <span className="text-xs text-slate-400">Player of the Match</span>
                    <span className="ml-auto flex items-center gap-1.5 text-sm font-bold text-white">
                      {getTeam(result.potm.teamId)?.flag} {surname(result.potm.name)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer controls */}
        {stage !== 'halftime' && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 bg-ink-850/60 px-5 py-3">
            {!isFinished ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500">Speed</span>
                  {(Object.keys(SPEEDS) as SpeedName[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                        speed === s
                          ? 'bg-pitch text-ink-950'
                          : 'bg-ink-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button onClick={skipSegment} className="btn-ghost px-3 py-1.5 text-xs">
                  Skip ahead »
                </button>
              </>
            ) : (
              <>
                <span
                  className={`text-sm font-bold ${
                    isDraw ? 'text-slate-300' : userWon ? 'text-pitch' : 'text-flare-400'
                  }`}
                >
                  {isDraw ? '🤝 Draw' : userWon ? '✅ You won!' : '❌ You lost'}
                </span>
                <button onClick={() => result && onComplete(result)} className="btn-primary">
                  {(result && continueText?.(result)) ?? 'Continue'} →
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
