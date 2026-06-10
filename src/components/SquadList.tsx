import { useMemo } from 'react'
import { positionColor, surname } from '../lib/format'
import type { Player, Position } from '../types'
import { StarRating } from './StarRating'

const POS_ORDER: Record<Position, number> = { GK: 0, DEF: 1, MID: 2, FWD: 3 }

// Stable per-player pseudo values for condition + morale (no real data field).
function hash(id: string): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function conditionDot(id: string): { color: string; label: string } {
  const v = hash(id) % 100
  if (v > 82) return { color: 'bg-amber-400', label: 'Tired' }
  if (v > 68) return { color: 'bg-lime-400', label: 'Good' }
  return { color: 'bg-pitch', label: 'Fresh' }
}

function moraleDot(id: string): { color: string; label: string } {
  const v = (hash(id) >> 7) % 100
  if (v > 80) return { color: 'bg-flare-400', label: 'Low morale' }
  if (v > 55) return { color: 'bg-amber-300', label: 'Okay morale' }
  return { color: 'bg-pitch-400', label: 'High morale' }
}

interface SquadListProps {
  players: Player[]
  startingXI: string[]
  selectedId?: string
  onPlayerClick?: (player: Player) => void
}

function Row({
  player,
  starter,
  selected,
  onClick,
}: {
  player: Player
  starter: boolean
  selected: boolean
  onClick?: () => void
}) {
  const cond = conditionDot(player.id)
  const mor = moraleDot(player.id)
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition ${
        selected
          ? 'bg-volt/15 ring-1 ring-volt/50'
          : starter
            ? 'bg-ink-800/60 hover:bg-ink-700/60'
            : 'opacity-70 hover:bg-ink-800/40 hover:opacity-100'
      }`}
    >
      <span className="grid h-6 w-7 shrink-0 place-items-center rounded bg-ink-950 font-mono text-xs text-slate-300">
        {player.number}
      </span>
      <span className={`w-9 shrink-0 text-[10px] font-bold ${positionColor(player.position)}`}>
        {player.position}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm text-slate-100">
        {surname(player.name)}
      </span>
      <span className="hidden sm:block">
        <StarRating rating={player.rating} size={11} />
      </span>
      <span className="flex shrink-0 items-center gap-1" title={`${cond.label} · ${mor.label}`}>
        <span className={`h-2 w-2 rounded-full ${cond.color}`} />
        <span className={`h-2 w-2 rounded-full ${mor.color}`} />
      </span>
    </button>
  )
}

export function SquadList({ players, startingXI, selectedId, onPlayerClick }: SquadListProps) {
  const xiSet = useMemo(() => new Set(startingXI), [startingXI])
  const sorted = useMemo(
    () => [...players].sort((a, b) => POS_ORDER[a.position] - POS_ORDER[b.position] || b.rating - a.rating),
    [players],
  )
  const starters = sorted.filter((p) => xiSet.has(p.id))
  const bench = sorted.filter((p) => !xiSet.has(p.id))

  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="mb-1.5 flex items-center justify-between px-1">
          <h3 className="label">Starting XI</h3>
          <span className="text-[11px] text-slate-500">{starters.length}/11</span>
        </div>
        <div className="flex flex-col gap-1">
          {starters.map((p) => (
            <Row
              key={p.id}
              player={p}
              starter
              selected={p.id === selectedId}
              onClick={() => onPlayerClick?.(p)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="label mb-1.5 px-1">Substitutes</h3>
        <div className="flex flex-col gap-1">
          {bench.map((p) => (
            <Row
              key={p.id}
              player={p}
              starter={false}
              selected={p.id === selectedId}
              onClick={() => onPlayerClick?.(p)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 px-1 pt-1 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-pitch" /> Condition
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-pitch-400" /> Morale
        </span>
      </div>
    </div>
  )
}
