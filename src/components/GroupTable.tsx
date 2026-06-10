import { getTeam } from '../data/teams'
import type { GroupTable } from '../types'

interface GroupTableViewProps {
  table: GroupTable
  userTeamId?: string
  qualifiedThirdIds?: string[] // if provided, marks whether the 3rd placed team advanced
  compact?: boolean
}

// Renders a single group's standings with qualification highlighting.
export function GroupTableView({
  table,
  userTeamId,
  qualifiedThirdIds,
  compact,
}: GroupTableViewProps) {
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 bg-ink-850/60 px-3 py-2">
        <h3 className="font-display text-sm font-bold text-white">Group {table.group}</h3>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-pitch" /> Advance
          </span>
          {qualifiedThirdIds && (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm bg-volt" /> Best 3rd
            </span>
          )}
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-wider text-slate-500">
            <th className="py-1.5 pl-3 text-left font-semibold">#</th>
            <th className="py-1.5 text-left font-semibold">Team</th>
            <th className="py-1.5 text-center font-semibold">P</th>
            {!compact && <th className="py-1.5 text-center font-semibold">W</th>}
            {!compact && <th className="py-1.5 text-center font-semibold">D</th>}
            {!compact && <th className="py-1.5 text-center font-semibold">L</th>}
            <th className="py-1.5 text-center font-semibold">GD</th>
            <th className="py-1.5 pr-3 text-center font-semibold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => {
            const team = getTeam(row.teamId)!
            const isUser = row.teamId === userTeamId
            const top2 = i < 2
            const isThird = i === 2
            const thirdAdvanced = isThird && qualifiedThirdIds?.includes(row.teamId)
            const accent = top2
              ? 'border-l-pitch'
              : thirdAdvanced
                ? 'border-l-volt'
                : 'border-l-transparent'
            return (
              <tr
                key={row.teamId}
                className={`border-l-2 ${accent} ${
                  isUser ? 'bg-pitch/10' : i % 2 ? 'bg-white/[0.015]' : ''
                }`}
              >
                <td className="py-1.5 pl-3 text-left font-mono text-xs text-slate-500">{i + 1}</td>
                <td className="py-1.5">
                  <span className="flex items-center gap-1.5">
                    <span>{team.flag}</span>
                    <span className={`truncate ${isUser ? 'font-bold text-pitch' : 'text-slate-100'}`}>
                      {team.name}
                    </span>
                  </span>
                </td>
                <td className="py-1.5 text-center text-slate-400">{row.played}</td>
                {!compact && <td className="py-1.5 text-center text-slate-400">{row.won}</td>}
                {!compact && <td className="py-1.5 text-center text-slate-400">{row.drawn}</td>}
                {!compact && <td className="py-1.5 text-center text-slate-400">{row.lost}</td>}
                <td className="py-1.5 text-center text-slate-300">
                  {row.goalDiff > 0 ? '+' : ''}
                  {row.goalDiff}
                </td>
                <td className="py-1.5 pr-3 text-center font-bold text-white">{row.points}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
