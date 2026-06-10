import { useState } from 'react'
import { getTeam } from '../data/teams'
import { ROUND_ORDER } from '../lib/bracket'
import { useTournament } from '../state/TournamentProvider'
import { BracketView } from './Bracket'
import { Jersey } from './Jersey'
import { LiveMatch } from './LiveMatch'
import { MatchPrep } from './MatchPrep'

type Mode = 'overview' | 'prep' | 'live'

export function Knockout() {
  const { state, userTeam, userKnockoutSlot, recordKnockoutResult } = useTournament()
  const [mode, setMode] = useState<Mode>('overview')

  const team = userTeam!
  const userId = team.id
  const round = state.currentRound!

  const slot = userKnockoutSlot
  const opponentId = slot ? (slot.home === userId ? slot.away : slot.home) : undefined
  const opponent = opponentId ? getTeam(opponentId) : undefined
  const roundIndex = ROUND_ORDER.indexOf(round)
  const nextRound = ROUND_ORDER[roundIndex + 1]

  // ── Pre-match prep ──────────────────────────────────────────────────────────
  if (mode === 'prep' && opponentId) {
    return (
      <MatchPrep
        opponentId={opponentId}
        stageLabel={`${round} · Win or go home`}
        kickOffLabel={round}
        onKickOff={() => setMode('live')}
      />
    )
  }

  // ── Live match ──────────────────────────────────────────────────────────────
  if (mode === 'live' && slot && slot.home && slot.away) {
    return (
      <LiveMatch
        homeId={slot.home}
        awayId={slot.away}
        matchStage={round}
        knockout
        userTeamId={userId}
        title={`${team.flag} ${team.name} · ${round}`}
        continueText={(r) => {
          const won =
            (r.penalties
              ? r.penalties.home > r.penalties.away
                ? r.home
                : r.away
              : r.homeScore >= r.awayScore
                ? r.home
                : r.away) === userId
          if (!won) return 'See how far you got'
          if (round === 'Final') return '🏆 Lift the trophy'
          return nextRound ? `On to the ${nextRound}` : 'Continue'
        }}
        onComplete={(result) => {
          // Records result, simulates the rest of the round, advances the phase.
          recordKnockoutResult(result)
          setMode('overview')
        }}
      />
    )
  }

  // ── Overview ────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Jersey colors={team.colors} size={40} />
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Knockout Stage</h1>
            <p className="text-sm text-slate-500">
              {team.flag} {team.name} · {round}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {ROUND_ORDER.map((r, i) => (
            <span
              key={r}
              title={r}
              className={`h-2.5 w-2.5 rounded-full ${
                i < roundIndex ? 'bg-pitch' : i === roundIndex ? 'bg-volt' : 'bg-ink-600'
              }`}
            />
          ))}
        </div>
      </div>

      {opponent && (
        <div className="panel relative mb-6 overflow-hidden p-6 animate-fade-up">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-60" />
          <div className="relative">
            <p className="label mb-4 text-center">{round} · Win or go home</p>
            <div className="flex items-center justify-center gap-6 py-2">
              <div className="flex flex-col items-center gap-2">
                <Jersey colors={team.colors} size={60} />
                <span className="text-sm font-semibold text-slate-100">
                  {team.flag} {team.name}
                </span>
              </div>
              <span className="font-display text-3xl font-extrabold text-slate-600">VS</span>
              <div className="flex flex-col items-center gap-2">
                <Jersey colors={opponent.colors} size={60} />
                <span className="text-sm font-semibold text-slate-100">
                  {opponent.flag} {opponent.name}
                </span>
              </div>
            </div>
            <p className="mt-1 text-center text-xs text-slate-500">
              Level after 90&apos; → extra time, then penalties. Someone has to win.
            </p>
            <div className="mt-5 flex justify-center">
              <button onClick={() => setMode('prep')} className="btn-volt px-6 py-3 text-base">
                📋 Set up &amp; play {round}
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="mb-3 font-display text-lg font-bold text-white">Bracket</h2>
      <BracketView bracket={state.bracket} userTeamId={userId} currentRound={round} />
    </div>
  )
}
