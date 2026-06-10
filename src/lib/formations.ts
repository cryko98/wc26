import type { FormationName, Position } from '../types'

// A slot on the pitch. Coordinates are percentages:
//   x: 0 (left touchline) → 100 (right touchline)
//   y: 0 (own goal line, bottom) → 100 (opponent goal line, top)
// The pitch renders with the attacking direction pointing UP.
export interface Slot {
  x: number
  y: number
  pos: Position // the natural position a player here should hold
  label: string // short positional label (e.g. 'LB', 'ST', 'CM')
}

export const FORMATIONS: Record<FormationName, Slot[]> = {
  '4-4-2': [
    { x: 50, y: 7, pos: 'GK', label: 'GK' },
    { x: 16, y: 26, pos: 'DEF', label: 'LB' },
    { x: 38, y: 22, pos: 'DEF', label: 'CB' },
    { x: 62, y: 22, pos: 'DEF', label: 'CB' },
    { x: 84, y: 26, pos: 'DEF', label: 'RB' },
    { x: 16, y: 54, pos: 'MID', label: 'LM' },
    { x: 40, y: 50, pos: 'MID', label: 'CM' },
    { x: 60, y: 50, pos: 'MID', label: 'CM' },
    { x: 84, y: 54, pos: 'MID', label: 'RM' },
    { x: 38, y: 82, pos: 'FWD', label: 'ST' },
    { x: 62, y: 82, pos: 'FWD', label: 'ST' },
  ],
  '4-3-3': [
    { x: 50, y: 7, pos: 'GK', label: 'GK' },
    { x: 16, y: 26, pos: 'DEF', label: 'LB' },
    { x: 38, y: 22, pos: 'DEF', label: 'CB' },
    { x: 62, y: 22, pos: 'DEF', label: 'CB' },
    { x: 84, y: 26, pos: 'DEF', label: 'RB' },
    { x: 32, y: 50, pos: 'MID', label: 'CM' },
    { x: 50, y: 46, pos: 'MID', label: 'CM' },
    { x: 68, y: 50, pos: 'MID', label: 'CM' },
    { x: 18, y: 78, pos: 'FWD', label: 'LW' },
    { x: 50, y: 84, pos: 'FWD', label: 'ST' },
    { x: 82, y: 78, pos: 'FWD', label: 'RW' },
  ],
  '5-2-3': [
    { x: 50, y: 7, pos: 'GK', label: 'GK' },
    { x: 10, y: 30, pos: 'DEF', label: 'LWB' },
    { x: 30, y: 22, pos: 'DEF', label: 'CB' },
    { x: 50, y: 20, pos: 'DEF', label: 'CB' },
    { x: 70, y: 22, pos: 'DEF', label: 'CB' },
    { x: 90, y: 30, pos: 'DEF', label: 'RWB' },
    { x: 38, y: 52, pos: 'MID', label: 'CM' },
    { x: 62, y: 52, pos: 'MID', label: 'CM' },
    { x: 20, y: 80, pos: 'FWD', label: 'LW' },
    { x: 50, y: 84, pos: 'FWD', label: 'ST' },
    { x: 80, y: 80, pos: 'FWD', label: 'RW' },
  ],
  '3-5-2': [
    { x: 50, y: 7, pos: 'GK', label: 'GK' },
    { x: 30, y: 22, pos: 'DEF', label: 'CB' },
    { x: 50, y: 20, pos: 'DEF', label: 'CB' },
    { x: 70, y: 22, pos: 'DEF', label: 'CB' },
    { x: 12, y: 52, pos: 'MID', label: 'LWB' },
    { x: 36, y: 50, pos: 'MID', label: 'CM' },
    { x: 50, y: 56, pos: 'MID', label: 'CM' },
    { x: 64, y: 50, pos: 'MID', label: 'CM' },
    { x: 88, y: 52, pos: 'MID', label: 'RWB' },
    { x: 38, y: 82, pos: 'FWD', label: 'ST' },
    { x: 62, y: 82, pos: 'FWD', label: 'ST' },
  ],
  '4-2-3-1': [
    { x: 50, y: 7, pos: 'GK', label: 'GK' },
    { x: 16, y: 26, pos: 'DEF', label: 'LB' },
    { x: 38, y: 22, pos: 'DEF', label: 'CB' },
    { x: 62, y: 22, pos: 'DEF', label: 'CB' },
    { x: 84, y: 26, pos: 'DEF', label: 'RB' },
    { x: 38, y: 44, pos: 'MID', label: 'DM' },
    { x: 62, y: 44, pos: 'MID', label: 'DM' },
    { x: 18, y: 66, pos: 'MID', label: 'LW' },
    { x: 50, y: 64, pos: 'MID', label: 'AM' },
    { x: 82, y: 66, pos: 'MID', label: 'RW' },
    { x: 50, y: 86, pos: 'FWD', label: 'ST' },
  ],
}

export const FORMATION_NAMES = Object.keys(FORMATIONS) as FormationName[]

// How many of each position a formation wants — used to auto-pick a starting XI.
export function formationShape(name: FormationName): Record<Position, number> {
  const shape: Record<Position, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 }
  for (const slot of FORMATIONS[name]) shape[slot.pos]++
  return shape
}
