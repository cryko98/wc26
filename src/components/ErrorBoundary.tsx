import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

// Last-resort error boundary so a rendering bug shows a friendly recovery
// screen instead of a blank page. "Restart" reloads the app (state is
// in-memory only, so a reload is a clean reset by design).
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('WC26 crashed:', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="grid min-h-full place-items-center px-4 py-16">
        <div className="panel max-w-md p-8 text-center">
          <span className="text-4xl">🟥</span>
          <h1 className="mt-3 font-display text-2xl font-extrabold text-white">
            Straight red card
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Something went wrong while rendering the game. Restart the tournament to get back on
            the pitch.
          </p>
          <p className="mt-3 rounded-lg bg-ink-850 px-3 py-2 font-mono text-[11px] text-flare-400">
            {this.state.error.message}
          </p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-5 px-6 py-2.5">
            ↻ Restart
          </button>
        </div>
      </div>
    )
  }
}
