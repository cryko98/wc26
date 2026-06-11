import { ErrorBoundary } from './components/ErrorBoundary'
import { Header } from './components/Header'
import { Champion, Eliminated } from './components/EndScreen'
import { GroupResult } from './components/GroupResult'
import { GroupStage } from './components/GroupStage'
import { Knockout } from './components/Knockout'
import { TacticsBoard } from './components/TacticsBoard'
import { TeamSelect } from './components/TeamSelect'
import { TournamentProvider, useTournament } from './state/TournamentProvider'

function Screen() {
  const { state } = useTournament()
  switch (state.phase) {
    case 'select':
      return <TeamSelect />
    case 'tactics':
      return <TacticsBoard />
    case 'group':
      return <GroupStage />
    case 'group-result':
      return <GroupResult />
    case 'knockout':
      return <Knockout />
    case 'eliminated':
      return <Eliminated />
    case 'champion':
      return <Champion />
    default:
      return <TeamSelect />
  }
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 py-6 text-center text-[11px] text-slate-600">
      <p>
        <span className="font-mono font-bold text-slate-500">$WC26</span> · WC26 World Cup Manager —
        an unofficial fan simulation. Not affiliated with FIFA or any official body.
      </p>
      <p className="mt-1">For entertainment only. Not financial advice. No wallets, no trading — just football.</p>
    </footer>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <TournamentProvider>
        <div className="flex min-h-full flex-col grain">
          <Header />
          <main className="flex-1">
            <ErrorBoundary>
              <Screen />
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
      </TournamentProvider>
    </ErrorBoundary>
  )
}
