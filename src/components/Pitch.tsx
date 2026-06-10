import { FORMATIONS } from '../lib/formations'
import { surname } from '../lib/format'
import type { FormationName, Player } from '../types'

interface PitchProps {
  formation: FormationName
  startingXI: string[] // player ids, ordered to match FORMATIONS[formation] slots
  playerById: Map<string, Player>
  colors: [string, string]
  selectedId?: string
  onSlotClick?: (playerId: string, slotIndex: number) => void
}

export function Pitch({
  formation,
  startingXI,
  playerById,
  colors,
  selectedId,
  onSlotClick,
}: PitchProps) {
  const slots = FORMATIONS[formation]

  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-md select-none overflow-hidden rounded-2xl border border-pitch/20 bg-gradient-to-b from-pitch-700/30 via-ink-900 to-pitch-700/20 shadow-panel">
      {/* Mowed-stripe texture */}
      <div className="absolute inset-0 bg-pitch-stripes opacity-60" />
      {/* Pitch markings */}
      <svg viewBox="0 0 100 133" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <g fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.4">
          <rect x="4" y="4" width="92" height="125" rx="1" />
          <line x1="4" y1="66.5" x2="96" y2="66.5" />
          <circle cx="50" cy="66.5" r="11" />
          <circle cx="50" cy="66.5" r="0.8" fill="rgba(255,255,255,0.4)" />
          {/* Top box (attacking) */}
          <rect x="28" y="4" width="44" height="16" />
          <rect x="40" y="4" width="20" height="6" />
          {/* Bottom box (own) */}
          <rect x="28" y="113" width="44" height="16" />
          <rect x="40" y="123" width="20" height="6" />
        </g>
      </svg>

      {/* Players */}
      {slots.map((slot, i) => {
        const pid = startingXI[i]
        const player = pid ? playerById.get(pid) : undefined
        const selected = !!pid && pid === selectedId
        // y is 0 (own goal, bottom) → 100 (attacking, top). CSS top is inverted.
        const top = 100 - slot.y
        return (
          <button
            key={i}
            onClick={() => player && onSlotClick?.(player.id, i)}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 focus:outline-none"
            style={{ left: `${slot.x}%`, top: `${top}%` }}
          >
            <span
              className={`grid h-9 w-9 place-items-center rounded-full border text-xs font-extrabold shadow-md transition-all ${
                selected
                  ? 'scale-110 border-volt ring-2 ring-volt'
                  : 'border-black/40 hover:scale-105 hover:border-white/60'
              }`}
              style={{ background: colors[0], color: colors[1] }}
            >
              {player?.number ?? '–'}
            </span>
            <span className="rounded bg-ink-950/80 px-1.5 py-px text-[9px] font-semibold leading-tight text-slate-100 shadow-sm">
              {player ? surname(player.name) : slot.label}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-wide text-pitch-400/90">
              {slot.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
