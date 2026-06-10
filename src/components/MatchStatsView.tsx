import type { MatchStats } from '../types'

function StatBar({ label, home, away }: { label: string; home: number; away: number }) {
  const total = home + away || 1
  const homePct = Math.round((home / total) * 100)
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono font-bold text-slate-200">{home}</span>
        <span className="text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
        <span className="font-mono font-bold text-slate-200">{away}</span>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-ink-700">
        <span className="bg-pitch" style={{ width: `${homePct}%` }} />
        <span className="bg-flare" style={{ width: `${100 - homePct}%` }} />
      </div>
    </div>
  )
}

export function MatchStatsView({ stats }: { stats: MatchStats }) {
  return (
    <div className="flex flex-col gap-2.5">
      <StatBar label="Possession %" home={stats.homePossession} away={100 - stats.homePossession} />
      <StatBar label="Shots" home={stats.homeShots} away={stats.awayShots} />
      <StatBar label="On target" home={stats.homeOnTarget} away={stats.awayOnTarget} />
      <StatBar label="Corners" home={stats.homeCorners} away={stats.awayCorners} />
    </div>
  )
}
