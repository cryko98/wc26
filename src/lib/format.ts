// Small formatting helpers shared across components.

export function surname(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  return parts.length > 1 ? parts.slice(1).join(' ') : parts[0]
}

// Map a 1–99 rating to a 0–5 star value (in half-star steps).
export function ratingToStars(rating: number): number {
  // 60 → ~2 stars, 99 → 5 stars. Tuned so elite players read as 4.5–5.
  const stars = (rating - 48) / 10.2
  return Math.max(0.5, Math.min(5, Math.round(stars * 2) / 2))
}

export function positionColor(pos: string): string {
  switch (pos) {
    case 'GK':
      return 'text-amber-300'
    case 'DEF':
      return 'text-sky-300'
    case 'MID':
      return 'text-pitch-400'
    case 'FWD':
      return 'text-flare-400'
    default:
      return 'text-slate-300'
  }
}
