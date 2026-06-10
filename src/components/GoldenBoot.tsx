import { getTeam } from '../data/teams'
import { surname } from '../lib/format'
import type { ScorerTally } from '../lib/engine'

// Top scorers leaderboard (Golden Boot race).
export function GoldenBoot({
  scorers,
  userTeamId,
  title = 'Golden Boot',
}: {
  scorers: ScorerTally[]
  userTeamId?: string
  title?: string
}) {
  if (!scorers.length) return null
  const max = scorers[0].goals
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 bg-ink-850/60 px-3 py-2">
        <h3 className="font-display text-sm font-bold text-white">⚽ {title}</h3>
        <span className="text-[10px] text-slate-500">Tournament goals</span>
      </div>
      <ul className="divide-y divide-white/5">
        {scorers.map((s, i) => {
          const team = getTeam(s.teamId)
          const isUser = s.teamId === userTeamId
          return (
            <li
              key={`${s.name}-${s.teamId}`}
              className={`flex items-center gap-2 px-3 py-2 text-sm ${isUser ? 'bg-pitch/10' : ''}`}
            >
              <span className="w-5 text-center font-mono text-xs text-slate-500">{i + 1}</span>
              {i === 0 ? <span>🥇</span> : <span>{team?.flag}</span>}
              <span className={`min-w-0 flex-1 truncate ${isUser ? 'font-bold text-pitch' : 'text-slate-100'}`}>
                {surname(s.name)}
                {i === 0 && <span className="ml-1.5 text-[10px] text-volt">{team?.flag}</span>}
              </span>
              <span className="hidden w-20 truncate text-right text-[10px] text-slate-500 sm:block">
                {team?.name}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="hidden h-1.5 w-12 overflow-hidden rounded-full bg-ink-700 sm:block">
                  <span
                    className="block h-full bg-volt"
                    style={{ width: `${(s.goals / max) * 100}%` }}
                  />
                </span>
                <span className="w-5 text-right font-mono font-bold text-white">{s.goals}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
