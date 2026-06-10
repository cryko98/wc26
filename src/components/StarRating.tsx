import { ratingToStars } from '../lib/format'

interface StarRatingProps {
  rating: number // 1–99 overall
  size?: number
  showValue?: boolean
}

function Star({ fill, size }: { fill: 'full' | 'half' | 'empty'; size: number }) {
  const gradId = `half-${Math.random().toString(36).slice(2, 8)}`
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {fill === 'half' && (
        <defs>
          <linearGradient id={gradId}>
            <stop offset="50%" stopColor="#d6ff3d" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.14)" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M12 2l2.95 6.18 6.8.78-5.05 4.6 1.36 6.7L12 17.6 5.94 20.06l1.36-6.7L2.25 8.96l6.8-.78z"
        fill={
          fill === 'full' ? '#d6ff3d' : fill === 'half' ? `url(#${gradId})` : 'rgba(255,255,255,0.14)'
        }
      />
    </svg>
  )
}

// Ability indicator — 1–5 stars (half-steps) derived from the overall rating.
export function StarRating({ rating, size = 13, showValue = false }: StarRatingProps) {
  const stars = ratingToStars(rating)
  return (
    <span className="inline-flex items-center gap-0.5" title={`${rating} OVR`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = stars >= i + 1 ? 'full' : stars >= i + 0.5 ? 'half' : 'empty'
        return <Star key={i} fill={fill} size={size} />
      })}
      {showValue && <span className="ml-1 font-mono text-[11px] text-slate-400">{rating}</span>}
    </span>
  )
}
