import { useMemo, useState } from 'react'
import { FORMATION_NAMES } from '../lib/formations'
import { useTournament } from '../state/TournamentProvider'
import type { Mentality, Player, Tempo, Width } from '../types'
import { Pitch } from './Pitch'
import { Segmented } from './Segmented'
import { SquadList } from './SquadList'

const MENTALITIES: Mentality[] = ['Defensive', 'Balanced', 'Attacking']
const TEMPOS: Tempo[] = ['Slow', 'Standard', 'High']
const WIDTHS: Width[] = ['Narrow', 'Standard', 'Wide']

// The shared 3-panel squad & tactics editor (formation + instructions, pitch,
// squad list with click-to-swap). Reads/writes the active tactics via context,
// so it's reused by the initial setup screen and the pre-match prep screen.
export function TacticsEditor() {
  const { state, userTeam, setFormation, setTactic, setXI } = useTournament()
  const [selectedId, setSelectedId] = useState<string | undefined>()

  const team = userTeam!
  const tactics = state.tactics
  const playerById = useMemo(() => new Map(team.players.map((p) => [p.id, p])), [team.players])

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
      xi[idxA] = playerId
      setXI(xi)
    } else if (idxB >= 0) {
      xi[idxB] = selectedId
      setXI(xi)
    }
    setSelectedId(undefined)
  }

  return (
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

        <Segmented
          label="Mentality"
          value={tactics.mentality}
          options={MENTALITIES}
          onChange={(v) => setTactic('mentality', v)}
        />
        <Segmented
          label="Tempo"
          value={tactics.tempo}
          options={TEMPOS}
          onChange={(v) => setTactic('tempo', v)}
        />
        <Segmented
          label="Width"
          value={tactics.width}
          options={WIDTHS}
          onChange={(v) => setTactic('width', v)}
        />

        <div className="rounded-lg border border-white/5 bg-ink-850/60 p-3 text-xs leading-relaxed text-slate-400">
          <span className="font-semibold text-slate-300">Tip:</span> tap a player on the pitch or in
          the squad list, then tap another to swap them. You can change all of this again before
          every match and at halftime.
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
          onPlayerClick={(p: Player) => handleSelect(p.id)}
        />
      </aside>
    </div>
  )
}
