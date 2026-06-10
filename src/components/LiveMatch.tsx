import { useEffect, useMemo, useRef, useState } from 'react'
import { getTeam } from '../data/teams'
import { surname } from '../lib/format'
import type { LiveStats, PitchStrength } from '../lib/pitchSim'
import { aiSide, nextMatchId, penaltyShootout, pickPotm, type SimSide, userSide } from '../lib/sim'
import { venueFor } from '../lib/venues'
import { useTournament } from '../state/TournamentProvider'
import type { FormationName, MatchEvent, MatchResult, MatchStats } from '../types'
import { HalftimePanel } from './HalftimePanel'
import { Jersey } from './Jersey'
import { MatchStatsView } from './MatchStatsView'
import { PitchMatch } from './PitchMatch'

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

const SPEEDS = { Slow: 0.5, Normal: 1, Fast: 3 } as const
type SpeedName = keyof typeof SPEEDS

const SEG_END: Record<Stage, number> = {
  firstHalf: 45,
  halftime: 45,
  secondHalf: 90,
  extraTime: 120,
  fulltime: 120,
}

function statsFromLive(s: LiveStats): MatchStats {
  const totalPoss = s.homePoss + s.awayPoss || 1
  return {
    homePossession: Math.round((s.homePoss / totalPoss) * 100),
    homeShots: s.homeShots,
    awayShots: s.awayShots,
    homeOnTarget: s.homeOnTarget,
    awayOnTarget: s.awayOnTarget,
    homeCorners: s.homeCorners,
    awayCorners: s.awayCorners,
  }
}

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
  const [live, setLive] = useState<LiveStats | null>(null)
  const [penalties, setPenalties] = useState<{ home: number; away: number } | undefined>()
  const [speed, setSpeed] = useState<SpeedName>('Normal')
  const [skipKey, setSkipKey] = useState(0)
  const [sides, setSides] = useState<{ home: SimSide; away: SimSide } | null>(null)

  const oppSideRef = useRef<SimSide | null>(null)
  const kickoffXIRef = useRef<string[]>([])
  const usedEtRef = useRef(false)
  const guards = useRef<Set<string>>(new Set())
  const once = (k: string) => {
    if (guards.current.has(k)) return false
    guards.current.add(k)
    return true
  }

  function buildSides(tactics = state.tactics): { home: SimSide; away: SimSide } {
    const u = userSide(getTeam(userTeamId)!, tactics)
    const o = oppSideRef.current!
    return userIsHome ? { home: u, away: o } : { home: o, away: u }
  }

  useEffect(() => {
    if (!once('init')) return
    oppSideRef.current = aiSide(getTeam(opponentId)!)
    kickoffXIRef.current = [...state.tactics.startingXI]
    setSides(buildSides())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const homeScore = useMemo(() => events.filter((e) => e.team === homeId).length, [events, homeId])
  const awayScore = useMemo(() => events.filter((e) => e.team === awayId).length, [events, awayId])

  function handleGoal(g: { team: 'home' | 'away'; scorer: string; minute: number }) {
    const teamId = g.team === 'home' ? homeId : awayId
    setEvents((ev) => [...ev, { minute: g.minute, team: teamId, scorer: g.scorer, kind: 'goal' }])
  }

  function handleSegmentEnd() {
    setStage((s) => {
      if (s === 'firstHalf') return 'halftime'
      if (s === 'secondHalf') {
        if (knockout && homeScoreRef.current === awayScoreRef.current) {
          usedEtRef.current = true
          return 'extraTime'
        }
        return 'fulltime'
      }
      if (s === 'extraTime') {
        if (homeScoreRef.current === awayScoreRef.current && sides) {
          setPenalties(penaltyShootout(sides.home, sides.away))
        }
        return 'fulltime'
      }
      return s
    })
  }

  // Mirror scores into refs so the segment-end handler sees fresh values.
  const homeScoreRef = useRef(0)
  const awayScoreRef = useRef(0)
  homeScoreRef.current = homeScore
  awayScoreRef.current = awayScore

  function resumeSecondHalf() {
    if (!once('resume')) return
    setSides(buildSides())
    setStage('secondHalf')
  }

  function buildResult(): MatchResult {
    const all = [...events].sort((a, b) => a.minute - b.minute)
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
      stats: live ? statsFromLive(live) : undefined,
      potm: sides ? pickPotm(sides.home, sides.away, all, homeScore, awayScore) : undefined,
    }
  }

  const isFinished = stage === 'fulltime'
  const running = stage === 'firstHalf' || stage === 'secondHalf' || stage === 'extraTime'

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

  const recentGoals = useMemo(
    () => [...events].sort((a, b) => b.minute - a.minute).slice(0, 4),
    [events],
  )

  const homeFormation: FormationName = userIsHome ? state.tactics.formation : '4-3-3'
  const awayFormation: FormationName = userIsHome ? '4-3-3' : state.tactics.formation
  const strength: PitchStrength | null = sides
    ? {
        homeStrength: sides.home.strength,
        awayStrength: sides.away.strength,
        homeGk: sides.home.gk,
        awayGk: sides.away.gk,
      }
    : null
  const liveDisplay = live ? statsFromLive(live) : null
  const { venue, attendance } = useMemo(
    () => venueFor(`${matchStage}-${homeId}-${awayId}`),
    [matchStage, homeId, awayId],
  )

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="panel overflow-hidden p-0 animate-pop-in">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-white/5 bg-ink-850/60 px-5 py-3">
          <div className="min-w-0">
            <span className="block truncate text-xs font-bold uppercase tracking-[0.12em] text-pitch">
              {title}
            </span>
            <span className="block truncate text-[10px] text-slate-500">
              📍 {venue.stadium}, {venue.city} · 👥 {attendance.toLocaleString('en-US')}
            </span>
          </div>
          <span className="shrink-0 font-mono text-sm text-slate-300">
            {running ? (
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
          <div className="flex min-w-0 items-center justify-end gap-2 text-right">
            <span className="truncate text-sm font-semibold text-slate-100">
              {home.flag} {home.name}
            </span>
            <Jersey colors={home.colors} size={34} />
          </div>
          <div className="flex flex-col items-center">
            <div className="font-display text-4xl font-extrabold tabular-nums text-white">
              {homeScore}<span className="mx-1 text-slate-600">:</span>{awayScore}
            </div>
            {penalties && (
              <span className="mt-1 rounded-full bg-flare/15 px-2 py-0.5 text-xs font-bold text-flare-400">
                Pens {penalties.home}–{penalties.away}
              </span>
            )}
          </div>
          <div className="flex min-w-0 items-center gap-2">
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
            {sides && strength ? (
              <PitchMatch
                home={{ players: sides.home.xi, formation: homeFormation, colors: home.colors }}
                away={{ players: sides.away.xi, formation: awayFormation, colors: away.colors }}
                strength={strength}
                running={running}
                speed={SPEEDS[speed]}
                segEnd={SEG_END[stage]}
                skipKey={skipKey}
                onClock={setClock}
                onGoal={handleGoal}
                onStats={setLive}
                onSegmentEnd={handleSegmentEnd}
              />
            ) : (
              <div className="grid aspect-[8/5] w-full place-items-center text-sm text-slate-500">
                Walking out…
              </div>
            )}

            {/* Live possession + shots */}
            {liveDisplay && (
              <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                <span className="font-mono text-pitch">{liveDisplay.homePossession}%</span>
                <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-ink-700">
                  <span className="bg-pitch" style={{ width: `${liveDisplay.homePossession}%` }} />
                  <span className="bg-flare" style={{ width: `${100 - liveDisplay.homePossession}%` }} />
                </div>
                <span className="font-mono text-flare-400">{100 - liveDisplay.homePossession}%</span>
                <span className="ml-1 whitespace-nowrap text-slate-500">
                  Shots {liveDisplay.homeShots}–{liveDisplay.awayShots}
                </span>
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

        {/* Footer */}
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
                <button onClick={() => setSkipKey((k) => k + 1)} className="btn-ghost px-3 py-1.5 text-xs">
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
