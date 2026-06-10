import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import { getTeam } from '../data/teams'
import { buildBracket, deriveQualifiers, ROUND_ORDER } from '../lib/bracket'
import {
  computeAllTables,
  resolveRoundWithUserResult,
  simulateBackgroundGroups,
  userGroupOutcome,
  userSlotInRound,
  type GroupOutcome,
} from '../lib/engine'
import { FORMATIONS } from '../lib/formations'
import { rankThirds } from '../lib/standings'
import type {
  BracketSlot,
  FormationName,
  GamePhase,
  GroupTable,
  KnockoutRoundName,
  MatchResult,
  Player,
  Tactics,
} from '../types'

// ─────────────────────────────────────────────────────────────────────────────
//  Default tactics + auto-picked XI
// ─────────────────────────────────────────────────────────────────────────────

export function buildXIForFormation(
  players: Player[],
  formation: FormationName,
  prefer: string[] = [],
): string[] {
  const preferred = new Set(prefer)
  const used = new Set<string>()
  const byPos = (pos: Player['position']) =>
    players
      .filter((p) => p.position === pos && !used.has(p.id))
      .sort((a, b) => {
        // Keep currently-selected players when switching formations.
        const pa = preferred.has(a.id) ? 1 : 0
        const pb = preferred.has(b.id) ? 1 : 0
        if (pa !== pb) return pb - pa
        return b.rating - a.rating
      })

  const anyBest = () =>
    players
      .filter((p) => !used.has(p.id))
      .sort((a, b) => b.rating - a.rating)[0]

  const xi: string[] = []
  for (const slot of FORMATIONS[formation]) {
    const candidate = byPos(slot.pos)[0] ?? anyBest()
    if (candidate) {
      used.add(candidate.id)
      xi.push(candidate.id)
    }
  }
  return xi
}

function defaultTactics(players: Player[]): Tactics {
  const formation: FormationName = '4-3-3'
  return {
    formation,
    mentality: 'Balanced',
    tempo: 'Standard',
    width: 'Standard',
    startingXI: buildXIForFormation(players, formation),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  State + actions
// ─────────────────────────────────────────────────────────────────────────────

interface State {
  phase: GamePhase
  userTeamId?: string
  tactics: Tactics
  groupResults: MatchResult[] // every group-stage result (user + background)
  userFixtureIndex: number // how many of the user's 3 group games are played
  tables: GroupTable[]
  qualifiedThirdIds: string[]
  groupOutcome?: GroupOutcome
  bracket: BracketSlot[]
  currentRound?: KnockoutRoundName
  lastMatch?: MatchResult // most recent finished match
  userHistory: MatchResult[] // user's own matches, in order
  eliminatedRound?: string
}

const emptyTactics: Tactics = {
  formation: '4-3-3',
  mentality: 'Balanced',
  tempo: 'Standard',
  width: 'Standard',
  startingXI: [],
}

const initialState: State = {
  phase: 'select',
  tactics: emptyTactics,
  groupResults: [],
  userFixtureIndex: 0,
  tables: [],
  qualifiedThirdIds: [],
  bracket: [],
  userHistory: [],
}

type Action =
  | { type: 'SELECT_TEAM'; teamId: string }
  | { type: 'BACK_TO_SELECT' }
  | { type: 'SET_FORMATION'; formation: FormationName }
  | { type: 'SET_TACTIC'; key: 'mentality' | 'tempo' | 'width'; value: string }
  | { type: 'SET_XI'; startingXI: string[] }
  | { type: 'KICK_OFF' } // tactics → group, sim background groups
  | { type: 'RECORD_GROUP_RESULT'; result: MatchResult } // a finished user group match
  | { type: 'FINISH_GROUP' } // group → group-result (compute advancement)
  | { type: 'START_KNOCKOUT' } // group-result → knockout (build bracket)
  | { type: 'RECORD_KNOCKOUT_RESULT'; result: MatchResult } // a finished user KO match
  | { type: 'RESTART' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SELECT_TEAM': {
      const team = getTeam(action.teamId)
      if (!team) return state
      return {
        ...initialState,
        phase: 'tactics',
        userTeamId: action.teamId,
        tactics: defaultTactics(team.players),
      }
    }

    case 'BACK_TO_SELECT':
      return initialState

    case 'SET_FORMATION': {
      const team = getTeam(state.userTeamId!)!
      return {
        ...state,
        tactics: {
          ...state.tactics,
          formation: action.formation,
          startingXI: buildXIForFormation(
            team.players,
            action.formation,
            state.tactics.startingXI,
          ),
        },
      }
    }

    case 'SET_TACTIC':
      return { ...state, tactics: { ...state.tactics, [action.key]: action.value } as Tactics }

    case 'SET_XI':
      return { ...state, tactics: { ...state.tactics, startingXI: action.startingXI } }

    case 'KICK_OFF': {
      const userId = state.userTeamId!
      const background = simulateBackgroundGroups(userId, state.tactics)
      return {
        ...state,
        phase: 'group',
        groupResults: background,
        userFixtureIndex: 0,
        userHistory: [],
        lastMatch: undefined,
      }
    }

    case 'RECORD_GROUP_RESULT': {
      // The live match component simulates the game (with halftime control) and
      // hands the finished result back here to be recorded.
      return {
        ...state,
        groupResults: [...state.groupResults, action.result],
        userFixtureIndex: state.userFixtureIndex + 1,
        lastMatch: action.result,
        userHistory: [...state.userHistory, action.result],
      }
    }

    case 'FINISH_GROUP': {
      const userId = state.userTeamId!
      const tables = computeAllTables(state.groupResults)
      const qualifiedThirds = rankThirds(tables)
        .slice(0, 8)
        .map((t) => t.teamId)
      const outcome = userGroupOutcome(userId, tables, qualifiedThirds)
      return {
        ...state,
        phase: 'group-result',
        tables,
        qualifiedThirdIds: qualifiedThirds,
        groupOutcome: outcome,
      }
    }

    case 'START_KNOCKOUT': {
      const qualifiers = deriveQualifiers(state.tables)
      const bracket = buildBracket(qualifiers.ordered)
      return {
        ...state,
        phase: 'knockout',
        bracket,
        currentRound: 'Round of 32',
        lastMatch: undefined,
      }
    }

    case 'RECORD_KNOCKOUT_RESULT': {
      // The live match already played out; apply it, simulate the rest of the
      // round, and move the user's phase based on the outcome.
      const userId = state.userTeamId!
      const round = state.currentRound!
      const outcome = resolveRoundWithUserResult(state.bracket, round, userId, action.result)
      const base: State = {
        ...state,
        bracket: outcome.bracket,
        lastMatch: outcome.userResult,
        userHistory: [...state.userHistory, outcome.userResult],
      }
      if (!outcome.userWon) {
        return { ...base, phase: 'eliminated', eliminatedRound: round }
      }
      if (outcome.isFinal) {
        return { ...base, phase: 'champion' }
      }
      const idx = ROUND_ORDER.indexOf(round)
      return { ...base, currentRound: ROUND_ORDER[idx + 1] ?? round }
    }

    case 'RESTART':
      return initialState

    default:
      return state
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Context
// ─────────────────────────────────────────────────────────────────────────────

interface TournamentContextValue {
  state: State
  selectTeam: (teamId: string) => void
  backToSelect: () => void
  setFormation: (f: FormationName) => void
  setTactic: (key: 'mentality' | 'tempo' | 'width', value: string) => void
  setXI: (ids: string[]) => void
  kickOff: () => void
  recordGroupResult: (result: MatchResult) => void
  finishGroup: () => void
  startKnockout: () => void
  recordKnockoutResult: (result: MatchResult) => void
  restart: () => void
  // derived helpers
  userTeam: ReturnType<typeof getTeam>
  userKnockoutSlot?: BracketSlot
}

const TournamentContext = createContext<TournamentContextValue | null>(null)

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const userTeam = state.userTeamId ? getTeam(state.userTeamId) : undefined
  const userKnockoutSlot =
    state.phase === 'knockout' && state.currentRound && state.userTeamId
      ? userSlotInRound(state.bracket, state.currentRound, state.userTeamId)
      : undefined

  const value = useMemo<TournamentContextValue>(
    () => ({
      state,
      userTeam,
      userKnockoutSlot,
      selectTeam: (teamId) => dispatch({ type: 'SELECT_TEAM', teamId }),
      backToSelect: () => dispatch({ type: 'BACK_TO_SELECT' }),
      setFormation: (formation) => dispatch({ type: 'SET_FORMATION', formation }),
      setTactic: (key, value) => dispatch({ type: 'SET_TACTIC', key, value }),
      setXI: (startingXI) => dispatch({ type: 'SET_XI', startingXI }),
      kickOff: () => dispatch({ type: 'KICK_OFF' }),
      recordGroupResult: (result) => dispatch({ type: 'RECORD_GROUP_RESULT', result }),
      finishGroup: () => dispatch({ type: 'FINISH_GROUP' }),
      startKnockout: () => dispatch({ type: 'START_KNOCKOUT' }),
      recordKnockoutResult: (result) => dispatch({ type: 'RECORD_KNOCKOUT_RESULT', result }),
      restart: () => dispatch({ type: 'RESTART' }),
    }),
    [state, userTeam, userKnockoutSlot],
  )

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTournament() {
  const ctx = useContext(TournamentContext)
  if (!ctx) throw new Error('useTournament must be used within a TournamentProvider')
  return ctx
}
