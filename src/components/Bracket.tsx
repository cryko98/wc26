import { getTeam } from '../data/teams'
import { ROUND_ORDER, slotsForRound } from '../lib/bracket'
import type { BracketSlot, KnockoutRoundName } from '../types'

const SHORT: Record<KnockoutRoundName, string> = {
  'Round of 32': 'R32',
  'Round of 16': 'R16',
  'Quarter-finals': 'QF',
  'Semi-finals': 'SF',
  Final: 'Final',
}

function SlotSide({
  teamId,
  isUser,
  isWinner,
  score,
}: {
  teamId?: string
  isUser: boolean
  isWinner: boolean
  score?: number
}) {
  const team = teamId ? getTeam(teamId) : undefined
  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 text-xs ${
        isWinner ? 'font-bold text-white' : 'text-slate-400'
      } ${isUser ? 'text-pitch' : ''}`}
    >
      <span className="w-4 shrink-0 text-center">{team?.flag ?? '·'}</span>
      <span className="min-w-0 flex-1 truncate">{team?.name ?? 'TBD'}</span>
      {score != null && <span className="font-mono tabular-nums">{score}</span>}
    </div>
  )
}

function MatchCard({ slot, userTeamId }: { slot: BracketSlot; userTeamId: string }) {
  const r = slot.result
  const homeUser = slot.home === userTeamId
  const awayUser = slot.away === userTeamId
  const onPath = homeUser || awayUser || slot.winner === userTeamId
  return (
    <div
      className={`overflow-hidden rounded-md border bg-ink-900/80 ${
        onPath ? 'border-pitch/40 shadow-glow' : 'border-white/5'
      }`}
    >
      <SlotSide
        teamId={slot.home}
        isUser={homeUser}
        isWinner={!!slot.winner && slot.winner === slot.home}
        score={r?.homeScore}
      />
      <div className="h-px bg-white/5" />
      <SlotSide
        teamId={slot.away}
        isUser={awayUser}
        isWinner={!!slot.winner && slot.winner === slot.away}
        score={r?.awayScore}
      />
      {r?.penalties && (
        <div className="bg-flare/10 px-2 py-0.5 text-center text-[9px] font-semibold text-flare-400">
          pens {r.penalties.home}–{r.penalties.away}
        </div>
      )}
    </div>
  )
}

export function BracketView({
  bracket,
  userTeamId,
  currentRound,
}: {
  bracket: BracketSlot[]
  userTeamId: string
  currentRound?: KnockoutRoundName
}) {
  return (
    <div className="panel overflow-x-auto p-4">
      <div className="flex min-w-max gap-4">
        {ROUND_ORDER.map((round) => {
          const slots = slotsForRound(bracket, round)
          const active = round === currentRound
          return (
            <div key={round} className="flex w-40 flex-col">
              <div
                className={`mb-2 rounded-md px-2 py-1 text-center text-[11px] font-bold uppercase tracking-wider ${
                  active ? 'bg-pitch text-ink-950' : 'bg-ink-850 text-slate-400'
                }`}
              >
                {SHORT[round]}
              </div>
              <div className="flex flex-1 flex-col justify-around gap-1.5">
                {slots.map((slot) => (
                  <MatchCard key={slot.id} slot={slot} userTeamId={userTeamId} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
