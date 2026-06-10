import { getTeam } from '../data/teams'
import { venueFor } from '../lib/venues'
import { useTournament } from '../state/TournamentProvider'
import { Jersey } from './Jersey'
import { StarRating } from './StarRating'
import { TacticsEditor } from './TacticsEditor'

function squadStrength(teamId: string): number {
  const team = getTeam(teamId)!
  const top = [...team.players].sort((a, b) => b.rating - a.rating).slice(0, 11)
  return Math.round(top.reduce((s, p) => s + p.rating, 0) / top.length)
}

interface MatchPrepProps {
  opponentId: string
  stageLabel: string // e.g. 'Matchday 1' or 'Round of 32'
  kickOffLabel: string
  onKickOff: () => void
}

// Pre-match team talk — adjust formation, instructions and lineup before kick-off.
export function MatchPrep({ opponentId, stageLabel, kickOffLabel, onKickOff }: MatchPrepProps) {
  const { userTeam } = useTournament()
  const team = userTeam!
  const opponent = getTeam(opponentId)!
  const { venue } = venueFor(`${stageLabel}-${team.id}-${opponentId}`)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="panel relative mb-5 overflow-hidden p-5">
        <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-50" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="label mb-2">{stageLabel} · Set up your team</p>
            <div className="flex items-center gap-3">
              <Jersey colors={team.colors} size={44} />
              <span className="font-display text-xl font-bold text-white">
                {team.flag} {team.name}
              </span>
              <span className="font-display text-lg font-extrabold text-slate-600">vs</span>
              <Jersey colors={opponent.colors} size={44} />
              <span className="font-display text-xl font-bold text-white">
                {opponent.flag} {opponent.name}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                Opponent strength <StarRating rating={squadStrength(opponentId)} size={12} />
              </span>
              <span className="text-slate-500">
                📍 {venue.stadium}, {venue.city}
              </span>
            </div>
          </div>
          <button onClick={onKickOff} className="btn-volt px-6 py-3 text-base">
            ⚽ Kick Off
          </button>
        </div>
      </div>

      <TacticsEditor />

      <div className="mt-5 flex justify-center">
        <button onClick={onKickOff} className="btn-volt px-8 py-3 text-base">
          ⚽ Kick Off — {kickOffLabel}
        </button>
      </div>
    </div>
  )
}
