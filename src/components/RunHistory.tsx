import { getTeam } from '../data/teams'
import type { MatchResult } from '../types'

// Compact list of the user's matches through the tournament.
export function RunHistory({ matches, userTeamId }: { matches: MatchResult[]; userTeamId: string }) {
  if (!matches.length) return null
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-white/5 bg-ink-850/60 px-3 py-2">
        <h3 className="font-display text-sm font-bold text-white">Your run</h3>
      </div>
      <ul className="divide-y divide-white/5">
        {matches.map((m, i) => {
          const homeUser = m.home === userTeamId
          const opp = getTeam(homeUser ? m.away : m.home)!
          const us = homeUser ? m.homeScore : m.awayScore
          const them = homeUser ? m.awayScore : m.homeScore
          const won = m.penalties
            ? (m.penalties.home > m.penalties.away ? m.home : m.away) === userTeamId
            : us > them
          const draw = !m.penalties && us === them
          return (
            <li key={i} className="flex items-center gap-2 px-3 py-2 text-sm">
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded text-[10px] font-bold ${
                  draw
                    ? 'bg-slate-600 text-white'
                    : won
                      ? 'bg-pitch text-ink-950'
                      : 'bg-flare text-white'
                }`}
              >
                {draw ? 'D' : won ? 'W' : 'L'}
              </span>
              <span className="w-24 shrink-0 truncate text-[11px] text-slate-500">{m.stage}</span>
              <span className="flex flex-1 items-center gap-1.5">
                <span>{opp.flag}</span>
                <span className="truncate text-slate-200">{opp.name}</span>
              </span>
              <span className="font-mono text-sm font-bold text-white">
                {us}<span className="mx-0.5 text-slate-600">–</span>{them}
              </span>
              {m.penalties && (
                <span className="font-mono text-[10px] text-flare-400">
                  ({m.penalties.home}-{m.penalties.away}p)
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
