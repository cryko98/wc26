interface JerseyProps {
  colors: [string, string] // [primary, secondary]
  number?: number
  size?: number
  className?: string
}

// Generic jersey/kit SVG generated purely from a team's two colors.
// No real kit designs, crests, or logos — just shapes + the shirt number.
export function Jersey({ colors, number, size = 44, className }: JerseyProps) {
  const [primary, secondary] = colors
  const id = `${primary}-${secondary}`.replace(/[^a-z0-9]/gi, '')
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <defs>
        <linearGradient id={`shade-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      {/* Body */}
      <path
        d="M20 12 L26 8 Q32 12 38 8 L44 12 L54 20 L48 28 L44 24 L44 56 L20 56 L20 24 L16 28 L10 20 Z"
        fill={primary}
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="1.5"
      />
      {/* Sleeves / accent in the secondary color */}
      <path d="M20 12 L16 28 L10 20 Z" fill={secondary} opacity="0.95" />
      <path d="M44 12 L48 28 L54 20 Z" fill={secondary} opacity="0.95" />
      {/* Collar */}
      <path d="M26 8 Q32 16 38 8 L35 8 Q32 12 29 8 Z" fill={secondary} />
      {/* Shade overlay */}
      <path
        d="M20 12 L26 8 Q32 12 38 8 L44 12 L54 20 L48 28 L44 24 L44 56 L20 56 L20 24 L16 28 L10 20 Z"
        fill={`url(#shade-${id})`}
      />
      {number != null && (
        <text
          x="32"
          y="46"
          textAnchor="middle"
          fontFamily="Archivo, sans-serif"
          fontWeight="800"
          fontSize="20"
          fill={secondary}
          stroke="rgba(0,0,0,0.25)"
          strokeWidth="0.5"
        >
          {number}
        </text>
      )}
    </svg>
  )
}
