// ─────────────────────────────────────────────────────────────────────────────
// Core domain types for WC26 — World Cup 2026 Manager
// ─────────────────────────────────────────────────────────────────────────────

export type Position = 'GK' | 'DEF' | 'MID' | 'FWD'

export interface Player {
  id: string
  name: string // real player name (text only — no photos / likeness)
  number: number
  position: Position
  rating: number // 1–99 overall, drives sim + star display
}

export interface Team {
  id: string
  name: string // real national team name
  flag: string // emoji flag
  colors: [string, string] // [primary, secondary] hex — used to generate jersey SVG
  group: string // 'A'..'L'
  ranking: number // seed/strength baseline for sim (lower = stronger)
}

export interface MatchEvent {
  minute: number
  team: string // team id
  scorer: string // player name
  kind?: 'goal' | 'penalty-so' // shootout goals are tracked separately for the feed
}

export interface MatchStats {
  homePossession: number // 0–100 (away = 100 - home)
  homeShots: number
  awayShots: number
  homeOnTarget: number
  awayOnTarget: number
  homeCorners: number
  awayCorners: number
}

export interface MatchResult {
  id: string
  home: string // team id
  away: string // team id
  homeScore: number
  awayScore: number
  stage: string // 'Group A' | 'Round of 32' | 'Final' | ...
  extraTime?: boolean
  penalties?: { home: number; away: number }
  events: MatchEvent[]
  stats?: MatchStats
  potm?: { name: string; teamId: string } // player of the match
}

// ─────────────────────────────────────────────────────────────────────────────
// Tactics
// ─────────────────────────────────────────────────────────────────────────────

export type FormationName = '4-4-2' | '4-3-3' | '5-2-3' | '3-5-2' | '4-2-3-1'
export type Mentality = 'Defensive' | 'Balanced' | 'Attacking'
export type Tempo = 'Slow' | 'Standard' | 'High'
export type Width = 'Narrow' | 'Standard' | 'Wide'

export interface Tactics {
  formation: FormationName
  mentality: Mentality
  tempo: Tempo
  width: Width
  // ordered list of player ids that make up the starting XI
  startingXI: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Tournament / standings
// ─────────────────────────────────────────────────────────────────────────────

export interface TableRow {
  teamId: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  points: number
}

export interface GroupTable {
  group: string
  rows: TableRow[] // sorted best → worst
}

export type GamePhase =
  | 'select' // landing / team select
  | 'tactics' // squad & tactics
  | 'group' // group stage
  | 'group-result' // group complete, show outcome
  | 'knockout' // playing a knockout round
  | 'eliminated' // out of the tournament
  | 'champion' // won the whole thing

export type KnockoutRoundName =
  | 'Round of 32'
  | 'Round of 16'
  | 'Quarter-finals'
  | 'Semi-finals'
  | 'Final'

export interface BracketSlot {
  id: string
  round: KnockoutRoundName
  home?: string // team id (undefined until filled)
  away?: string
  result?: MatchResult
  winner?: string // team id
  nextSlot?: string // slot id this winner feeds into
  nextIsHome?: boolean // whether winner becomes home or away in next slot
}
