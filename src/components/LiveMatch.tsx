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
import type { MatchEvent, MatchResult } from '../types'
import { HalftimePanel } from './HalftimePanel'
import { Jersey } from './Jersey'
import { MatchStatsView } from './MatchStatsView'

type Stage = 'firstHalf' | 'halftime' | 'secondHalf' | 'extraTime' | 'fulltime'

interface LiveMatchProps {
  homeId: string
  awayId: string
  matchStage: string // e.g. 'Group A' or 'Round of 32' (stored on the result)
  knockout: boolean
  userTeamId: string
  title: string
  subLimit?: number
  onComplete: (result: MatchResult) => void
  continueText?: (r: MatchResult) => string
}

const SPEEDS = { Slow: 130, Normal: 78, Fast: 28 } as const
type SpeedName = keyof typeof SPEEDS

const byMinute = (a: MatchEvent, b: MatchEvent) => a.minute - b.minute
const goalEvents = (events: MatchEvent[], teamId: string) =>
  events.filter((e) => e.team === teamId && (e.kind === 'goal' || !e.kind))

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

  // Refs that must survive re-renders / StrictMode double-invokes.
  const oppSideRef = useRef<SimSide | null>(null)
  const sidesRef = useRef<{ home: SimSide; away: SimSide } | null>(null)
  const kickoffXIRef = useRef<string[]>([])
  const usedEtRef = useRef(false)
  const guards = useRef<Set<string>>(new Set())
  const once = (key: string) => {
    if (guards.current.has(key)) return false
    guards.current.add(key)
    return true
  }

  // Assemble home/away SimSides given the user's current side object.
  function assemble(u: SimSide) {
    return userIsHome
      ? { home: u, away: oppSideRef.current! }
      : { home: oppSideRef.current!, away: u }
  }

  // Kick-off: build sides + simulate the first half (once).
  useEffect(() => {
    if (!once('init')) return
    oppSideRef.current = aiSide(getTeam(opponentId)!)
    kickoffXIRef.current = [...state.tactics.startingXI]
    const u = userSide(getTeam(userTeamId)!, state.tactics)
    const sides = assemble(u)
    sidesRef.current = sides
    const fh = simulateSegment(sides.home, sides.away, 1, 46, 0.5)
    setEvents(fh.events.sort(byMinute))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Animate the running clock during a half.
  const tickMs = SPEEDS[speed]
  useEffect(() => {
    const animating = stage === 'firstHalf' || stage === 'secondHalf' || stage === 'extraTime'
    if (!animating) return
    const target = stage === 'firstHalf' ? 45 : stage === 'secondHalf' ? 90 : 120
    const id = window.setInterval(() => {
      setClock((c) => {
        if (c + 1 >= target) {
          window.clearInterval(id)
          return target
        }
        return c + 1
      })
    }, tickMs)
    return () => window.clearInterval(id)
  }, [stage, tickMs])

  // Handle stage transitions when the clock reaches a boundary.
  useEffect(() => {
    if (stage === 'firstHalf' && clock >= 45 && once('ht')) {
      setStage('halftime')
    } else if (stage === 'secondHalf' && clock >= 90 && once('endReg')) {
      endRegulation()
    } else if (stage === 'extraTime' && clock >= 120 && once('endEt')) {
      endExtraTime()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock, stage])

  function currentScore(all: MatchEvent[]) {
    return { home: goalEvents(all, homeId).length, away: goalEvents(all, awayId).length }
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

  // Resume after halftime — rebuild the user's side from the (possibly changed)
  // tactics, then simulate the second half.
  function resumeSecondHalf() {
    if (!once('resume')) return
    const u = userSide(getTeam(userTeamId)!, state.tactics)
    const sides = assemble(u)
    sidesRef.current = sides
    const sh = simulateSegment(sides.home, sides.away, 46, 91, 0.5)
    setEvents((all) => [...all, ...sh.events].sort(byMinute))
    setStage('secondHalf')
  }

  function buildResult(): MatchResult {
    const all = [...events].sort(byMinute)
    const homeScore = goalEvents(all, homeId).length
    const awayScore = goalEvents(all, awayId).length
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

  function skipSegment() {
    const target = stage === 'firstHalf' ? 45 : stage === 'secondHalf' ? 90 : 120
    setClock(target)
  }

  // ── Derived display values ─────────────────────────────────────────────────
  const shown = useMemo(() => events.filter((e) => e.minute <= clock), [events, clock])
  const liveHome = goalEvents(shown, homeId).length
  const liveAway = goalEvents(shown, awayId).length
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
        : `${clock}'`

  // ── Render ─────────────────────────────────────────────────────────────────
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
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-5">
          <div className="flex flex-col items-center gap-2 text-center">
            <Jersey colors={home.colors} size={52} />
            <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-100">
              <span>{home.flag}</span>
              <span className="truncate">{home.name}</span>
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-display text-5xl font-extrabold tabular-nums text-white">
              {liveHome}
              <span className="mx-1 text-slate-600">:</span>
              {liveAway}
            </div>
            {penalties && (
              <span className="mt-1 rounded-full bg-flare/15 px-2 py-0.5 text-xs font-bold text-flare-400">
                Pens {penalties.home}–{penalties.away}
              </span>
            )}
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <Jersey colors={away.colors} size={52} />
            <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-100">
              <span>{away.flag}</span>
              <span className="truncate">{away.name}</span>
            </span>
          </div>
        </div>

        {/* Halftime team talk replaces the feed while paused */}
        {stage === 'halftime' ? (
          <div className="border-t border-white/5 p-4">
            <HalftimePanel
              kickoffXI={kickoffXIRef.current}
              subLimit={subLimit}
              onResume={resumeSecondHalf}
            />
          </div>
        ) : (
          <>
            {/* Feed */}
            <div className="min-h-[120px] border-t border-white/5 px-5 py-4">
              {shown.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  {isFinished ? 'No goals.' : 'Kick-off…'}
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {shown.map((e, i) => {
                    const isHome = e.team === homeId
                    return (
                      <li
                        key={i}
                        className={`flex animate-fade-up items-center gap-2 text-sm ${
                          isHome ? 'justify-start' : 'flex-row-reverse text-right'
                        }`}
                      >
                        <span className="grid h-6 w-9 shrink-0 place-items-center rounded bg-ink-800 font-mono text-xs text-slate-400">
                          {e.minute}&apos;
                        </span>
                        <span className="text-base">⚽</span>
                        <span className="text-slate-200">
                          <span className="font-semibold">{surname(e.scorer)}</span>
                          <span className="ml-1.5 text-xs text-slate-500">
                            {getTeam(e.team)?.flag}
                          </span>
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Full-time extras: stats + player of the match */}
            {isFinished && result?.stats && (
              <div className="border-t border-white/5 px-5 py-4">
                <p className="label mb-2.5">Match stats</p>
                <MatchStatsView stats={result.stats} />
                {result.potm && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-volt/20 bg-volt/5 px-3 py-2">
                    <span className="text-lg">⭐</span>
                    <span className="text-xs text-slate-400">Player of the Match</span>
                    <span className="ml-auto flex items-center gap-1.5 text-sm font-bold text-white">
                      {getTeam(result.potm.teamId)?.flag} {surname(result.potm.name)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
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
