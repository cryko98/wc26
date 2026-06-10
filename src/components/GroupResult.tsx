import { useMemo } from 'react'
import { getTeam } from '../data/teams'
import { rankThirds } from '../lib/standings'
import { useTournament } from '../state/TournamentProvider'
import { GroupTableView } from './GroupTable'

const ORDINAL = ['', '1st', '2nd', '3rd', '4th']

export function GroupResult() {
  const { state, userTeam, startKnockout, restart } = useTournament()
  const team = userTeam!
  const outcome = state.groupOutcome!
  const userTable = state.tables.find((t) => t.group === team.group)!

  const thirds = useMemo(() => rankThirds(state.tables), [state.tables])
  const qualifiedThirdSet = new Set(state.qualifiedThirdIds)

  const advanced = outcome.advanced

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Banner */}
      <div
        className={`panel relative mb-6 overflow-hidden p-6 text-center animate-pop-in ${
          advanced ? 'border-pitch/30' : 'border-flare/30'
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-0 ${
            advanced ? 'bg-radial-glow' : ''
          }`}
        />
        <div className="relative">
          <span className="text-4xl">{advanced ? '🎉' : '😞'}</span>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-white">
            {advanced ? 'Through to the Round of 32!' : 'Group stage exit'}
          </h1>
          <p className="mt-2 text-slate-400">
            {team.flag} <span className="font-semibold text-slate-200">{team.name}</span> finished{' '}
            <span className="font-bold text-white">{ORDINAL[outcome.position]}</span> in Group{' '}
            {team.group}
            {outcome.asBestThird && (
              <span className="text-volt"> — qualified as one of the 8 best third-placed teams</span>
            )}
            {!advanced && ' — and are eliminated.'}
          </p>

          <div className="mt-5 flex justify-center gap-3">
            {advanced ? (
              <button onClick={startKnockout} className="btn-volt px-6 py-3 text-base">
                Enter the knockouts →
              </button>
            ) : (
              <button onClick={restart} className="btn-primary px-6 py-3 text-base">
                ↻ Restart tournament
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Your group */}
        <div>
          <h2 className="mb-3 font-display text-lg font-bold text-white">Your group</h2>
          <GroupTableView
            table={userTable}
            userTeamId={team.id}
            qualifiedThirdIds={state.qualifiedThirdIds}
          />

          <h2 className="mb-3 mt-7 font-display text-lg font-bold text-white">All groups</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {state.tables
              .filter((t) => t.group !== team.group)
              .map((t) => (
                <GroupTableView
                  key={t.group}
                  table={t}
                  userTeamId={team.id}
                  qualifiedThirdIds={state.qualifiedThirdIds}
                  compact
                />
              ))}
          </div>
        </div>

        {/* Best thirds ranking */}
        <div>
          <h2 className="mb-3 font-display text-lg font-bold text-white">Best third-placed</h2>
          <div className="panel overflow-hidden">
            <div className="border-b border-white/5 bg-ink-850/60 px-3 py-2 text-[11px] text-slate-400">
              Top 8 advance · ranked by Pts → GD → GF
            </div>
            <ul className="divide-y divide-white/5">
              {thirds.map((t, i) => {
                const teamRow = getTeam(t.teamId)!
                const qualifies = qualifiedThirdSet.has(t.teamId)
                const isUser = t.teamId === team.id
                return (
                  <li
                    key={t.teamId}
                    className={`flex items-center gap-2 px-3 py-2 text-sm ${
                      isUser ? 'bg-pitch/10' : ''
                    } ${qualifies ? '' : 'opacity-45'}`}
                  >
                    <span className="w-5 text-center font-mono text-xs text-slate-500">{i + 1}</span>
                    <span>{teamRow.flag}</span>
                    <span className={`flex-1 truncate ${isUser ? 'font-bold text-pitch' : 'text-slate-100'}`}>
                      {teamRow.name}
                    </span>
                    <span className="text-[10px] text-slate-500">Grp {t.group}</span>
                    <span className="font-mono text-xs text-slate-300">{t.points}p</span>
                    {qualifies ? (
                      <span className="h-2 w-2 rounded-full bg-volt" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-slate-700" />
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
