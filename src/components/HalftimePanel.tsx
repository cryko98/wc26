import { useMemo, useState } from 'react'
import { positionColor, surname } from '../lib/format'
import { useTournament } from '../state/TournamentProvider'
import type { Mentality, Player, Tempo, Width } from '../types'
import { Segmented } from './Segmented'
import { StarRating } from './StarRating'

const MENTALITIES: Mentality[] = ['Defensive', 'Balanced', 'Attacking']
const TEMPOS: Tempo[] = ['Slow', 'Standard', 'High']
const WIDTHS: Width[] = ['Narrow', 'Standard', 'Wide']

interface HalftimePanelProps {
  kickoffXI: string[] // the XI that started the match (to count substitutions)
  subLimit: number
  onResume: () => void
}

// Halftime team talk — change the strategy and bring on fresh legs (max `subLimit`).
export function HalftimePanel({ kickoffXI, subLimit, onResume }: HalftimePanelProps) {
  const { state, userTeam, setTactic, setXI } = useTournament()
  const team = userTeam!
  const tactics = state.tactics
  const [selectedOnId, setSelectedOnId] = useState<string | undefined>()

  const playerById = useMemo(() => new Map(team.players.map((p) => [p.id, p])), [team.players])
  const kickoffSet = useMemo(() => new Set(kickoffXI), [kickoffXI])

  const xiSet = new Set(tactics.startingXI)
  const onPitch = tactics.startingXI
    .map((id) => playerById.get(id))
    .filter(Boolean) as Player[]
  const bench = team.players
    .filter((p) => !xiSet.has(p.id))
    .sort((a, b) => b.rating - a.rating)

  // Subs used = players currently on the pitch who did NOT start the match.
  const subsUsed = tactics.startingXI.filter((id) => !kickoffSet.has(id)).length
  const subsLeft = subLimit - subsUsed

  function bringOn(benchId: string) {
    if (!selectedOnId) return
    const comingFresh = !kickoffSet.has(benchId) // a player not in the kickoff XI counts as a sub
    const replacingFresh = !kickoffSet.has(selectedOnId)
    // Block if it would exceed the sub limit (swapping a previously-subbed player
    // back doesn't add a new sub).
    if (comingFresh && !replacingFresh && subsLeft <= 0) {
      setSelectedOnId(undefined)
      return
    }
    const xi = [...tactics.startingXI]
    const idx = xi.indexOf(selectedOnId)
    if (idx >= 0) {
      xi[idx] = benchId
      setXI(xi)
    }
    setSelectedOnId(undefined)
  }

  return (
    <div className="panel p-4 animate-fade-up">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-white">Halftime team talk</h3>
        <span className="chip border-volt/30 bg-volt/10 text-volt">
          Subs left: {Math.max(0, subsLeft)}/{subLimit}
        </span>
      </div>

      {/* Strategy */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Segmented
          label="Mentality"
          value={tactics.mentality}
          options={MENTALITIES}
          onChange={(v) => setTactic('mentality', v)}
          size="sm"
        />
        <Segmented
          label="Tempo"
          value={tactics.tempo}
          options={TEMPOS}
          onChange={(v) => setTactic('tempo', v)}
          size="sm"
        />
        <Segmented
          label="Width"
          value={tactics.width}
          options={WIDTHS}
          onChange={(v) => setTactic('width', v)}
          size="sm"
        />
      </div>

      {/* Substitutions */}
      <p className="label mb-1.5">
        Substitutions {selectedOnId ? '· pick a player to bring on' : '· tap a player to take off'}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* On pitch */}
        <div>
          <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            On pitch
          </p>
          <div className="flex max-h-56 flex-col gap-1 overflow-y-auto pr-1">
            {onPitch.map((p) => {
              const fresh = !kickoffSet.has(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedOnId((cur) => (cur === p.id ? undefined : p.id))}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition ${
                    selectedOnId === p.id
                      ? 'bg-flare/20 ring-1 ring-flare/60'
                      : 'bg-ink-800/60 hover:bg-ink-700/60'
                  }`}
                >
                  <span className="grid h-5 w-6 shrink-0 place-items-center rounded bg-ink-950 font-mono text-[11px] text-slate-300">
                    {p.number}
                  </span>
                  <span className={`w-8 shrink-0 text-[10px] font-bold ${positionColor(p.position)}`}>
                    {p.position}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-100">
                    {surname(p.name)}
                  </span>
                  {fresh && <span className="text-[9px] font-bold text-pitch">SUB</span>}
                  <StarRating rating={p.rating} size={10} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Bench */}
        <div>
          <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Bench
          </p>
          <div className="flex max-h-56 flex-col gap-1 overflow-y-auto pr-1">
            {bench.map((p) => (
              <button
                key={p.id}
                onClick={() => bringOn(p.id)}
                disabled={!selectedOnId}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition disabled:opacity-40 ${
                  selectedOnId ? 'bg-ink-800/60 hover:bg-pitch/15' : 'bg-ink-800/40'
                }`}
              >
                <span className="grid h-5 w-6 shrink-0 place-items-center rounded bg-ink-950 font-mono text-[11px] text-slate-300">
                  {p.number}
                </span>
                <span className={`w-8 shrink-0 text-[10px] font-bold ${positionColor(p.position)}`}>
                  {p.position}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-slate-100">
                  {surname(p.name)}
                </span>
                <StarRating rating={p.rating} size={10} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={onResume} className="btn-primary px-6 py-2.5">
          Resume second half →
        </button>
      </div>
    </div>
  )
}
