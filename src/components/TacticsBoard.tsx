import { useMemo } from 'react'
import { useTournament } from '../state/TournamentProvider'
import type { Player } from '../types'
import { Jersey } from './Jersey'
import { StarRating } from './StarRating'
import { TacticsEditor } from './TacticsEditor'

export function TacticsBoard() {
  const { state, userTeam, kickOff, backToSelect } = useTournament()
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
            <p className="text-sm text-slate-500">Group {team.group} · Squad &amp; Tactics</p>
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

      <TacticsEditor />
    </div>
  )
}
