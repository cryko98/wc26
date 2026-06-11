import { useMemo, useState } from 'react'
import { GROUPS, TEAMS, type SquadTeam } from '../data/teams'
import { useTournament } from '../state/TournamentProvider'
import { Jersey } from './Jersey'
import { StarRating } from './StarRating'

function teamStrength(team: SquadTeam): number {
  const top = [...team.players].sort((a, b) => b.rating - a.rating).slice(0, 11)
  return top.reduce((s, p) => s + p.rating, 0) / top.length
}

function TeamCard({ team, onPick }: { team: SquadTeam; onPick: () => void }) {
  const strength = teamStrength(team)
  return (
    <button
      onClick={onPick}
      className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/5 bg-ink-900/70 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-pitch/40 hover:bg-ink-850 hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-pitch/60"
    >
      <span
        className="absolute inset-x-0 top-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, ${team.colors[0]}, ${team.colors[1]})`,
        }}
      />
      <Jersey colors={team.colors} size={40} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">{team.flag}</span>
          <span className="truncate font-semibold text-slate-100">{team.name}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Group {team.group}
          </span>
          <StarRating rating={strength} size={11} />
        </div>
      </div>
      <span className="shrink-0 rounded-md bg-ink-800 px-2 py-1 font-mono text-xs text-slate-400 group-hover:bg-pitch group-hover:text-ink-950">
        Pick
      </span>
    </button>
  )
}

export function TeamSelect() {
  const { selectTeam } = useTournament()
  const [query, setQuery] = useState('')
  const [groupFilter, setGroupFilter] = useState<string>('all')
  const [sort, setSort] = useState<'group' | 'strength' | 'name'>('group')

  const teams = useMemo(() => {
    let list = TEAMS.filter((t) => {
      const matchesQuery = t.name.toLowerCase().includes(query.trim().toLowerCase())
      const matchesGroup = groupFilter === 'all' || t.group === groupFilter
      return matchesQuery && matchesGroup
    })
    if (sort === 'strength') {
      list = [...list].sort((a, b) => teamStrength(b) - teamStrength(a))
    } else if (sort === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    } else {
      list = [...list].sort((a, b) => a.group.localeCompare(b.group) || teamStrength(b) - teamStrength(a))
    }
    return list
  }, [query, groupFilter, sort])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero */}
      <section className="relative mb-8 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-ink-850 to-ink-900 p-8 shadow-panel sm:p-12">
        <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
        <div className="pointer-events-none absolute inset-0 bg-pitch-stripes opacity-40" />
        <div className="relative max-w-2xl animate-fade-up">
          <span className="chip mb-4 border-volt/30 bg-volt/10 text-volt">
            ⚽ $WC26 · World Cup 2026
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl text-balance">
            Pick your nation.
            <br />
            <span className="text-pitch">Manage the dream.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-400">
            48 teams. 12 groups. One trophy. Choose a national side, set your tactics like a
            real manager, and simulate your run through the {''}
            <span className="font-semibold text-slate-200">World Cup 2026</span> — group stage to
            the final.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="chip">🏟️ 48 nations</span>
            <span className="chip">📋 5 formations</span>
            <span className="chip">🧮 Poisson match engine</span>
            <span className="chip">🏆 Knockout to glory</span>
          </div>
        </div>
      </section>

      {/* Controls */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Choose your team</h2>
          <p className="text-sm text-slate-500">{teams.length} of 48 nations shown</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nation…"
            className="field max-w-[180px]"
          />
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="field max-w-[130px]"
          >
            <option value="all">All groups</option>
            {GROUPS.map((g) => (
              <option key={g} value={g}>
                Group {g}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="field max-w-[150px]"
          >
            <option value="group">Sort: Group</option>
            <option value="strength">Sort: Strength</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} onPick={() => selectTeam(team.id)} />
        ))}
      </div>

      {teams.length === 0 && (
        <p className="py-16 text-center text-slate-500">No nations match your search.</p>
      )}

      <p className="mt-10 text-center text-[11px] leading-relaxed text-slate-600">
        WC26 is an unofficial fan-made simulation game. Not affiliated with, endorsed by, or
        connected to FIFA or any official body. No official logos, crests, or player likenesses are
        used. Player and nation names are factual data only.
        <br />
        <span className="font-mono text-slate-500">
          Groups reflect the official 2026 draw · star ratings reflect squad strength.
        </span>
      </p>
    </div>
  )
}
