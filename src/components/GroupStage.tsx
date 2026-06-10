import { useMemo, useState } from 'react'
import { getTeam, teamsByGroup } from '../data/teams'
import { computeTable, groupFixtures } from '../lib/standings'
import { useTournament } from '../state/TournamentProvider'
import { GroupTableView } from './GroupTable'
import { Jersey } from './Jersey'
import { LiveMatch } from './LiveMatch'
import { MatchPrep } from './MatchPrep'

type Mode = 'overview' | 'prep' | 'live'

export function GroupStage() {
  const { state, userTeam, recordGroupResult, finishGroup } = useTournament()
  const [mode, setMode] = useState<Mode>('overview')

  const team = userTeam!
  const userId = team.id

  const fixtures = useMemo(() => {
    const ids = teamsByGroup(team.group).map((t) => t.id)
    return groupFixtures(ids).filter((fx) => fx.home === userId || fx.away === userId)
  }, [team.group, userId])

  const liveTable = useMemo(() => {
    const ids = teamsByGroup(team.group).map((t) => t.id)
    return computeTable(team.group, ids, state.groupResults)
  }, [team.group, state.groupResults])

  const userResults = useMemo(
    () => state.groupResults.filter((r) => r.home === userId || r.away === userId),
    [state.groupResults, userId],
  )

  const played = state.userFixtureIndex
  const nextFixture = fixtures[played]
  const opponentId = nextFixture
    ? nextFixture.home === userId
      ? nextFixture.away
      : nextFixture.home
    : undefined
  const opponent = opponentId ? getTeam(opponentId) : undefined
  const allPlayed = played >= 3

  // ── Pre-match prep ──────────────────────────────────────────────────────────
  if (mode === 'prep' && nextFixture && opponentId) {
    return (
      <MatchPrep
        opponentId={opponentId}
        stageLabel={`Group ${team.group} · Matchday ${played + 1}`}
        kickOffLabel={`vs ${opponent!.name}`}
        onKickOff={() => setMode('live')}
      />
    )
  }

  // ── Live match ──────────────────────────────────────────────────────────────
  if (mode === 'live' && nextFixture) {
    return (
      <LiveMatch
        homeId={nextFixture.home}
        awayId={nextFixture.away}
        matchStage={`Group ${team.group}`}
        knockout={false}
        userTeamId={userId}
        title={`${team.flag} ${team.name} · Group ${team.group} · Matchday ${played + 1}`}
        continueText={() => (played >= 2 ? 'Group standings' : 'Next')}
        onComplete={(result) => {
          recordGroupResult(result)
          setMode('overview')
        }}
      />
    )
  }

  // ── Overview ────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Jersey colors={team.colors} size={40} />
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Group Stage</h1>
          <p className="text-sm text-slate-500">
            {team.flag} {team.name} · Group {team.group} · {played}/3 matches played
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {!allPlayed ? (
            <div className="panel relative overflow-hidden p-5 animate-fade-up">
              <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-60" />
              <div className="relative">
                <p className="label mb-3">Matchday {played + 1} · Up next</p>
                <div className="flex items-center justify-center gap-5 py-2">
                  <div className="flex flex-col items-center gap-1.5">
                    <Jersey colors={team.colors} size={52} />
                    <span className="text-sm font-semibold text-slate-100">
                      {team.flag} {team.name}
                    </span>
                  </div>
                  <span className="font-display text-2xl font-extrabold text-slate-600">VS</span>
                  <div className="flex flex-col items-center gap-1.5">
                    <Jersey colors={opponent!.colors} size={52} />
                    <span className="text-sm font-semibold text-slate-100">
                      {opponent!.flag} {opponent!.name}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  <button onClick={() => setMode('prep')} className="btn-volt px-6 py-3 text-base">
                    📋 Set up &amp; play
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="panel flex flex-col items-center gap-3 p-6 text-center animate-fade-up">
              <span className="text-3xl">🏁</span>
              <h2 className="font-display text-xl font-bold text-white">Group matches complete</h2>
              <p className="max-w-sm text-sm text-slate-400">
                All other groups have been simulated too. See where you finished and whether you
                made it through.
              </p>
              <button onClick={finishGroup} className="btn-primary mt-1 px-6 py-3 text-base">
                Reveal group results →
              </button>
            </div>
          )}

          <div className="panel p-4">
            <h3 className="label mb-3">Your fixtures</h3>
            <ul className="flex flex-col divide-y divide-white/5">
              {fixtures.map((fx, i) => {
                const opp = getTeam(fx.home === userId ? fx.away : fx.home)!
                const res = userResults[i]
                const homeIsUser = fx.home === userId
                return (
                  <li key={i} className="flex items-center gap-3 py-2.5">
                    <span className="w-12 shrink-0 text-[10px] font-semibold uppercase text-slate-500">
                      MD {fx.matchday}
                    </span>
                    <span className="flex flex-1 items-center gap-2 text-sm">
                      <span className="text-slate-400">{homeIsUser ? 'vs' : '@'}</span>
                      <span>{opp.flag}</span>
                      <span className="text-slate-200">{opp.name}</span>
                    </span>
                    {res ? (
                      <span className="rounded-md bg-ink-800 px-2.5 py-1 font-mono text-sm font-bold text-white">
                        {homeIsUser ? res.homeScore : res.awayScore}
                        <span className="mx-1 text-slate-600">–</span>
                        {homeIsUser ? res.awayScore : res.homeScore}
                      </span>
                    ) : (
                      <span className="rounded-md bg-ink-850 px-2.5 py-1 font-mono text-xs text-slate-500">
                        – : –
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <GroupTableView table={liveTable} userTeamId={userId} />
          <p className="px-1 text-xs leading-relaxed text-slate-500">
            Top 2 of each group advance automatically. The 8 best third-placed teams across all 12
            groups also reach the Round of 32.
          </p>
        </div>
      </div>
    </div>
  )
}
