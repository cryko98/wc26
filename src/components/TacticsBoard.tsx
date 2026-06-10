import { useMemo, useState } from 'react'
import { FORMATION_NAMES } from '../lib/formations'
import { useTournament } from '../state/TournamentProvider'
import type { Mentality, Player, Tempo, Width } from '../types'
import { Jersey } from './Jersey'
import { Pitch } from './Pitch'
import { SquadList } from './SquadList'
import { StarRating } from './StarRating'

const MENTALITIES: Mentality[] = ['Defensive', 'Balanced', 'Attacking']
const TEMPOS: Tempo[] = ['Slow', 'Standard', 'High']
const WIDTHS: Width[] = ['Narrow', 'Standard', 'Wide']

function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: T[]
  onChange: (v: T) => void
}) {
  return (
    <div>
      <p className="label mb-1.5">{label}</p>
      <div className="flex rounded-lg border border-white/10 bg-ink-850 p-0.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition ${
              value === opt
                ? 'bg-pitch text-ink-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export function TacticsBoard() {
  const { state, userTeam, setFormation, setTactic, setXI, kickOff, backToSelect } = useTournament()
  const [selectedId, setSelectedId] = useState<string | undefined>()

  const team = userTeam!
  const tactics = state.tactics

  const playerById = useMemo(
    () => new Map(team.players.map((p) => [p.id, p])),
    [team.players],
  )

  const xiPlayers = tactics.startingXI
    .map((id) => playerById.get(id))
    .filter(Boolean) as Player[]
  const xiAvg = xiPlayers.length
    ? Math.round(xiPlayers.reduce((s, p) => s + p.rating, 0) / xiPlayers.length)
    : 0

  function handleSelect(playerId: string) {
    if (!selectedId) {
      setSelectedId(playerId)
      return
    }
    if (selectedId === playerId) {
      setSelectedId(undefined)
      return
    }
    const xi = [...tactics.startingXI]
    const idxA = xi.indexOf(selectedId)
    const idxB = xi.indexOf(playerId)

    if (idxA >= 0 && idxB >= 0) {
      ;[xi[idxA], xi[idxB]] = [xi[idxB], xi[idxA]]
      setXI(xi)
    } else if (idxA >= 0) {
      xi[idxA] = playerId // bench player comes onto the selected starter's slot
      setXI(xi)
    } else if (idxB >= 0) {
      xi[idxB] = selectedId
      setXI(xi)
    }
    setSelectedId(undefined)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Title bar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={backToSelect} className="btn-ghost px-3 py-2" aria-label="Change team">
            ←
          </button>
          <Jersey colors={team.colors} size={44} />
          <div>
            <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
              <span>{team.flag}</span> {team.name}
            </h1>
            <p className="text-sm text-slate-500">
              Group {team.group} · Squad &amp; Tactics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="label">XI Strength</p>
            <div className="flex items-center gap-2">
              <StarRating rating={xiAvg} size={15} />
              <span className="font-mono text-sm text-slate-300">{xiAvg}</span>
            </div>
          </div>
          <button onClick={kickOff} className="btn-volt px-5 py-3 text-base">
            Start Tournament →
          </button>
        </div>
      </div>

      {/* 3-panel layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr_320px]">
        {/* LEFT — formation + instructions */}
        <aside className="panel order-2 flex flex-col gap-5 p-4 lg:order-1">
          <div>
            <p className="label mb-1.5">Formation</p>
            <div className="grid grid-cols-3 gap-1.5">
              {FORMATION_NAMES.map((f) => (
                <button
                  key={f}
                  onClick={() => setFormation(f)}
                  className={`rounded-lg border px-1 py-2 text-xs font-bold transition ${
                    tactics.formation === f
                      ? 'border-pitch bg-pitch/15 text-pitch'
                      : 'border-white/10 bg-ink-850 text-slate-400 hover:border-white/25 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <SegmentedControl
            label="Mentality"
            value={tactics.mentality}
            options={MENTALITIES}
            onChange={(v) => setTactic('mentality', v)}
          />
          <SegmentedControl
            label="Tempo"
            value={tactics.tempo}
            options={TEMPOS}
            onChange={(v) => setTactic('tempo', v)}
          />
          <SegmentedControl
            label="Width"
            value={tactics.width}
            options={WIDTHS}
            onChange={(v) => setTactic('width', v)}
          />

          <div className="rounded-lg border border-white/5 bg-ink-850/60 p-3 text-xs leading-relaxed text-slate-400">
            <span className="font-semibold text-slate-300">Tip:</span> tap a player on the pitch or
            in the squad list, then tap another to swap them. Tactics nudge your expected goals and
            how much you concede.
          </div>
        </aside>

        {/* CENTER — pitch */}
        <div className="panel order-1 flex flex-col items-center justify-center p-4 lg:order-2">
          <Pitch
            formation={tactics.formation}
            startingXI={tactics.startingXI}
            playerById={playerById}
            colors={team.colors}
            selectedId={selectedId}
            onSlotClick={(id) => handleSelect(id)}
          />
          <p className="mt-3 text-center text-xs text-slate-500">
            {tactics.formation} · {tactics.mentality} · {tactics.tempo} tempo · {tactics.width} width
          </p>
        </div>

        {/* RIGHT — squad list */}
        <aside className="panel order-3 p-3">
          <SquadList
            players={team.players}
            startingXI={tactics.startingXI}
            selectedId={selectedId}
            onPlayerClick={(p) => handleSelect(p.id)}
          />
        </aside>
      </div>
    </div>
  )
}
