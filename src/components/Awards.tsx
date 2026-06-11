import { getTeam } from '../data/teams'
import type { GloveTally, TournamentTotals } from '../lib/engine'
import { surname } from '../lib/format'

// Golden Glove panel — clean-sheet leaders (first-choice GK per team).
export function GoldenGlove({
  keepers,
  userTeamId,
}: {
  keepers: GloveTally[]
  userTeamId?: string
}) {
  if (!keepers.length) return null
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 bg-ink-850/60 px-3 py-2">
        <h3 className="font-display text-sm font-bold text-white">🧤 Golden Glove</h3>
        <span className="text-[10px] text-slate-500">Clean sheets</span>
      </div>
      <ul className="divide-y divide-white/5">
        {keepers.map((k, i) => {
          const team = getTeam(k.teamId)
          const isUser = k.teamId === userTeamId
          return (
            <li
              key={k.teamId}
              className={`flex items-center gap-2 px-3 py-2 text-sm ${isUser ? 'bg-pitch/10' : ''}`}
            >
              <span className="w-5 text-center font-mono text-xs text-slate-500">{i + 1}</span>
              <span>{i === 0 ? '🧤' : team?.flag}</span>
              <span className={`min-w-0 flex-1 truncate ${isUser ? 'font-bold text-pitch' : 'text-slate-100'}`}>
                {surname(k.name)}
                {i === 0 && <span className="ml-1.5 text-[10px] text-volt">{team?.flag}</span>}
              </span>
              <span className="hidden w-20 truncate text-right text-[10px] text-slate-500 sm:block">
                {team?.name}
              </span>
              <span className="w-5 text-right font-mono font-bold text-white">{k.cleanSheets}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// Tournament-wide totals strip for the end screens.
export function TournamentStats({ totals }: { totals: TournamentTotals }) {
  const items = [
    { label: 'Matches played', value: totals.matches.toString(), icon: '🏟️' },
    { label: 'Goals scored', value: totals.goals.toString(), icon: '⚽' },
    { label: 'Goals / match', value: totals.avgGoals.toFixed(2), icon: '📈' },
  ]
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((it) => (
        <div key={it.label} className="panel flex flex-col items-center gap-0.5 px-2 py-3 text-center">
          <span className="text-lg">{it.icon}</span>
          <span className="font-display text-xl font-extrabold text-white">{it.value}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500">{it.label}</span>
        </div>
      ))}
    </div>
  )
}
