import { useState } from 'react'
import { useTournament } from '../state/TournamentProvider'

// Replace this placeholder with the real contract address. Leave the format as
// `CA: ...` — the Copy button copies exactly the CONTRACT_ADDRESS value below.
const CONTRACT_ADDRESS = 'xxxxxxxxxxxxxxxxxxxxx'

function CopyCA() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS)
    } catch {
      // Fallback for browsers without clipboard API access.
      const ta = document.createElement('textarea')
      ta.value = CONTRACT_ADDRESS
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } catch {
        /* no-op */
      }
      document.body.removeChild(ta)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-ink-850/80 px-2.5 py-1.5">
      <span className="font-mono text-[11px] text-slate-400">
        CA: <span className="text-slate-200">{CONTRACT_ADDRESS}</span>
      </span>
      <button
        onClick={copy}
        className="rounded-md bg-volt px-2 py-0.5 text-[11px] font-bold text-ink-950 transition hover:bg-volt-400 active:scale-95"
        aria-label="Copy contract address"
      >
        {copied ? '✓ Copied' : 'Copy CA'}
      </button>
    </div>
  )
}

export function Header() {
  const { state, restart } = useTournament()

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <button
          onClick={() => {
            if (state.phase !== 'select') {
              if (confirm('Return to the start and restart the tournament?')) restart()
            }
          }}
          className="group flex items-center gap-2.5"
          aria-label="WC26 home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-pitch text-ink-950 shadow-glow">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v18M3 12h18" opacity="0.4" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-extrabold tracking-tight text-white">
              WC<span className="text-pitch">26</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
              World Cup Manager
            </span>
          </span>
        </button>

        <span className="hidden rounded-full border border-volt/30 bg-volt/10 px-2.5 py-1 font-mono text-xs font-bold text-volt sm:inline-flex">
          $WC26
        </span>

        <div className="ml-auto flex items-center gap-3">
          <CopyCA />
        </div>
      </div>
    </header>
  )
}
