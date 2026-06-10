import { useEffect, useMemo, useRef, useState } from 'react'
import { getTeam } from '../data/teams'
import { surname } from '../lib/format'
import type { MatchResult } from '../types'
import { Jersey } from './Jersey'

interface MatchSimProps {
  result: MatchResult
  userTeamId: string
  title: string
  onContinue: () => void
  continueLabel?: string
}

const FULL_TIME = 90

export function MatchSim({ result, userTeamId, title, onContinue, continueLabel }: MatchSimProps) {
  const home = getTeam(result.home)!
  const away = getTeam(result.away)!
  const maxMinute = result.extraTime ? 120 : FULL_TIME

  const [clock, setClock] = useState(0)
  const [done, setDone] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const sortedEvents = useMemo(
    () => [...result.events].sort((a, b) => a.minute - b.minute),
    [result.events],
  )

  useEffect(() => {
    setClock(0)
    setDone(false)
    // Advance ~ the whole match in roughly 2.5s.
    const step = Math.max(1, Math.round(maxMinute / 45))
    intervalRef.current = window.setInterval(() => {
      setClock((c) => {
        const next = c + step
        if (next >= maxMinute) {
          if (intervalRef.current) window.clearInterval(intervalRef.current)
          setDone(true)
          return maxMinute
        }
        return next
      })
    }, 55)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [result.id, maxMinute])

  function skip() {
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    setClock(maxMinute)
    setDone(true)
  }

  const shown = sortedEvents.filter((e) => e.minute <= clock)
  const homeGoals = shown.filter((e) => e.team === result.home).length
  const awayGoals = shown.filter((e) => e.team === result.away).length

  const userWon = done
    ? (result.penalties
        ? result.penalties.home > result.penalties.away
          ? result.home
          : result.away
        : result.homeScore >= result.awayScore
          ? result.home
          : result.away) === userTeamId
    : false

  const isDraw = done && !result.penalties && result.homeScore === result.awayScore

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="panel overflow-hidden p-0 animate-pop-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 bg-ink-850/60 px-5 py-3">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-pitch">{title}</span>
          <span className="font-mono text-sm text-slate-300">
            {done ? (
              <span className="text-slate-400">{result.extraTime ? 'AET' : 'FT'}</span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-flare" />
                {clock}&apos;
              </span>
            )}
          </span>
        </div>

        {/* Scoreboard */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <Jersey colors={home.colors} size={56} />
            <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-100">
              <span className="text-base">{home.flag}</span>
              <span className="truncate">{home.name}</span>
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="font-display text-5xl font-extrabold tabular-nums text-white">
              {homeGoals}<span className="mx-1 text-slate-600">:</span>{awayGoals}
            </div>
            {done && result.penalties && (
              <span className="mt-1 rounded-full bg-flare/15 px-2 py-0.5 text-xs font-bold text-flare-400">
                Pens {result.penalties.home}–{result.penalties.away}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <Jersey colors={away.colors} size={56} />
            <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-100">
              <span className="text-base">{away.flag}</span>
              <span className="truncate">{away.name}</span>
            </span>
          </div>
        </div>

        {/* Feed */}
        <div className="min-h-[120px] border-t border-white/5 px-5 py-4">
          {shown.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              {done ? 'No goals.' : 'Kick-off…'}
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {shown.map((e, i) => {
                const isHome = e.team === result.home
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

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-white/5 bg-ink-850/60 px-5 py-4">
          {!done ? (
            <button onClick={skip} className="btn-ghost">
              Skip to result
            </button>
          ) : (
            <span
              className={`text-sm font-bold ${
                isDraw ? 'text-slate-300' : userWon ? 'text-pitch' : 'text-flare-400'
              }`}
            >
              {isDraw ? '🤝 Draw' : userWon ? '✅ You won!' : '❌ You lost'}
            </span>
          )}
          <button onClick={onContinue} disabled={!done} className="btn-primary">
            {continueLabel ?? 'Continue'} →
          </button>
        </div>
      </div>
    </div>
  )
}
