interface SegmentedProps<T extends string> {
  label?: string
  value: T
  options: T[]
  onChange: (v: T) => void
  size?: 'sm' | 'md'
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  size = 'md',
}: SegmentedProps<T>) {
  return (
    <div>
      {label && <p className="label mb-1.5">{label}</p>}
      <div className="flex rounded-lg border border-white/10 bg-ink-850 p-0.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 rounded-md font-semibold transition ${
              size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-2 py-1.5 text-xs'
            } ${
              value === opt ? 'bg-pitch text-ink-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
