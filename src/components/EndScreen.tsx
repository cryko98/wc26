import { useMemo } from 'react'
import { useTournament } from '../state/TournamentProvider'
import { BracketView } from './Bracket'
import { Jersey } from './Jersey'
import { RunHistory } from './RunHistory'

function Confetti({ colors }: { colors: string[] }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        left: (i * 137) % 100,
        delay: ((i * 53) % 30) / 10,
        dur: 2.5 + ((i * 29) % 25) / 10,
        color: colors[i % colors.length],
        size: 6 + (i % 3) * 3,
      })),
    [colors],
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 animate-confetti rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  )
}

export function Champion() {
  const { state, userTeam, restart } = useTournament()
  const team = userTeam!

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-10">
      <Confetti colors={[team.colors[0], team.colors[1], '#d6ff3d', '#13d97a', '#ff5d3b']} />
      <div className="relative z-10">
        <div className="panel relative mb-6 overflow-hidden p-8 text-center animate-pop-in">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
          <div className="pointer-events-none absolute inset-0 bg-pitch-stripes opacity-30" />
          <div className="relative">
            <span className="text-6xl drop-shadow-lg">🏆</span>
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.25em] text-volt">
              World Cup 2026 Champions
            </p>
            <div className="my-4 flex items-center justify-center gap-3">
              <Jersey colors={team.colors} size={64} />
              <h1 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
                {team.flag} {team.name}
              </h1>
            </div>
            <p className="mx-auto max-w-md text-slate-400">
              Champions of the world. Seven straight knockout wins, the whole nation behind you, and
              the trophy is yours. Diamond hands, gold medal. 💎🥇
            </p>
            <button onClick={restart} className="btn-volt mt-6 px-6 py-3 text-base">
              ↻ Run it back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div>
            <h2 className="mb-3 font-display text-lg font-bold text-white">Final bracket</h2>
            <BracketView bracket={state.bracket} userTeamId={team.id} />
          </div>
          <RunHistory matches={state.userHistory} userTeamId={team.id} />
        </div>
      </div>
    </div>
  )
}

export function Eliminated() {
  const { state, userTeam, restart } = useTournament()
  const team = userTeam!
  const round = state.eliminatedRound ?? 'the knockouts'

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="panel mb-6 overflow-hidden border-flare/30 p-8 text-center animate-pop-in">
        <span className="text-5xl">😔</span>
        <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-flare-400">
          Eliminated · {round}
        </p>
        <div className="my-4 flex items-center justify-center gap-3">
          <Jersey colors={team.colors} size={56} />
          <h1 className="font-display text-3xl font-extrabold text-white">
            {team.flag} {team.name}
          </h1>
        </div>
        <p className="mx-auto max-w-md text-slate-400">
          The run ends at the <span className="font-semibold text-slate-200">{round}</span>. Heads
          high — there&apos;s always next time. Tweak the tactics and go again.
        </p>
        <button onClick={restart} className="btn-primary mt-6 px-6 py-3 text-base">
          ↻ Restart tournament
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <h2 className="mb-3 font-display text-lg font-bold text-white">How the bracket played out</h2>
          <BracketView bracket={state.bracket} userTeamId={team.id} />
        </div>
        <RunHistory matches={state.userHistory} userTeamId={team.id} />
      </div>
    </div>
  )
}
